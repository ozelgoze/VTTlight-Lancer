'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type MapState = {
  id: string;
  background_url: string;
  map_name: string;
  updated_at: string;
};

export function useMap() {
  const [mapState, setMapState] = useState<MapState | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchMap = async () => {
      const { data, error } = await supabase
        .from('map_state')
        .select('*')
        .single();
      
      if (data) {
        setMapState(data);
      }
      setLoading(false);
    };

    fetchMap();

    const channel = supabase
      .channel('map_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'map_state' },
        (payload) => {
          setMapState(payload.new as MapState);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return { mapState, loading };
}
