'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type DiceRoll = {
  id: string;
  user_id: string;
  pilot_name: string;
  result_total: number;
  calculation_text: string;
  created_at: string;
};

export function useDiceRoller() {
  const [rolls, setRolls] = useState<DiceRoll[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchRolls = async () => {
      try {
        const { data } = await supabase
          .from('dice_rolls')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (data) setRolls(data);
      } catch (err) {
        console.error('Failed to sync dice log:', err);
      }
    };

    fetchRolls();

    const channel = supabase
      .channel('dice_rolls_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'dice_rolls' },
        (payload) => {
          if (payload.new) {
            setRolls((prev) => [payload.new as DiceRoll, ...prev.slice(0, 19)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const rollDice = async (acc: number, diff: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      // Lancer Math
      const d20 = Math.floor(Math.random() * 20) + 1;
      const netAcc = acc - diff;
      
      let bonus = 0;
      let bonusText = '';

      if (netAcc !== 0) {
        const absNet = Math.abs(netAcc);
        const d6s = Array.from({ length: absNet }, () => Math.floor(Math.random() * 6) + 1);
        const maxD6 = Math.max(...d6s);
        
        if (netAcc > 0) {
          bonus = maxD6;
          bonusText = `+ Acc(${maxD6})`;
        } else {
          bonus = -maxD6;
          bonusText = `- Diff(${maxD6})`;
        }
      }

      const total = d20 + bonus;
      const calculation = `${total} (1d20: ${d20}${bonusText ? ' ' + bonusText : ''})`;

      const { error } = await supabase.from('dice_rolls').insert({
        user_id: user.id,
        pilot_name: user.email?.split('@')[0] || 'Unknown Pilot',
        result_total: total,
        calculation_text: calculation,
      });

      if (error) throw error;
    } catch (err) {
      console.error('Tactical Roll Failed:', err);
      // Optional: Add UI notification here
    }
  };

  return { rolls, rollDice };
}
