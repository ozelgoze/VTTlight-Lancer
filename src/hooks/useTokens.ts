'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type Token = {
  id: string;
  character_id: string;
  map_id: string;
  x_percent: number;
  y_percent: number;
  updated_at: string;
  character?: {
    name: string;
    hp: number;
    max_hp: number;
    heat: number;
    max_heat: number;
  };
};

export function useTokens(mapId: string | undefined) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!mapId) return;

    const fetchTokens = async () => {
      const { data, error } = await supabase
        .from('tokens')
        .select(`
          *,
          character:characters (
            name,
            hp,
            max_hp,
            heat,
            max_heat
          )
        `)
        .eq('map_id', mapId);

      if (data) setTokens(data as Token[]);
      setLoading(false);
    };

    fetchTokens();

    const channel = supabase
      .channel(`tokens_map_${mapId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tokens', filter: `map_id=eq.${mapId}` },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Re-fetch to get the joined character data
            const { data } = await supabase
              .from('tokens')
              .select(`
                *,
                character:characters (
                  name,
                  hp,
                  max_hp,
                  heat,
                  max_heat
                )
              `)
              .eq('id', payload.new.id)
              .single();
            
            if (data) setTokens((prev) => [...prev, data as Token]);
          } else if (payload.eventType === 'UPDATE') {
            setTokens((prev) =>
              prev.map((t) => (t.id === payload.new.id ? { ...t, ...payload.new } : t))
            );
          } else if (payload.eventType === 'DELETE') {
            setTokens((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mapId, supabase]);

  const updateTokenPos = async (tokenId: string, x: number, y: number) => {
    // Optimistic update
    setTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, x_percent: x, y_percent: y } : t))
    );

    const { error } = await supabase
      .from('tokens')
      .update({ x_percent: x, y_percent: y, updated_at: new Date().toISOString() })
      .eq('id', tokenId);

    if (error) {
      console.error('Tactical position sync failed:', error);
      // Rollback would be here in a more complex app
    }
  };

  const deployToken = async (characterId: string) => {
    if (!mapId) return;

    const { data, error } = await supabase
      .from('tokens')
      .insert({
        character_id: characterId,
        map_id: mapId,
        x_percent: 50,
        y_percent: 50
      })
      .select()
      .single();

    return { data, error };
  };

  return { tokens, loading, updateTokenPos, deployToken };
}
