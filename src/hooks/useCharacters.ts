'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type CharacterUnit = {
  id: string;
  name: string;
  sprite_url: string;
  hp: number;
  max_hp: number;
  heat: number;
  max_heat: number;
  evasion: number;
  e_defense: number;
  movement: number;
  owner_id: string;
};

export function useCharacters() {
  const [characters, setCharacters] = useState<CharacterUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const { data, error } = await supabase
          .from('characters')
          .select('*');
        
        if (data) {
          setCharacters(data);
        }
      } catch (err) {
        console.error('Failed to fetch character diagnostics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();

    const channel = supabase
      .channel('characters_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'characters' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setCharacters((prev) => [...prev, payload.new as CharacterUnit]);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setCharacters((prev) => 
              prev.map((c) => c.id === payload.new.id ? payload.new as CharacterUnit : c)
            );
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setCharacters((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return { characters, loading };
}
