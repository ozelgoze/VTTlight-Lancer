'use client';

import { createClient } from '@/utils/supabase/client';
import { CharacterUnit } from './useCharacters';

export function useCombatActions() {
  const supabase = createClient();

  const logActionRoll = async (unit: CharacterUnit, actionName: string, total: number, calculation: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('dice_rolls').insert({
      user_id: user.id,
      pilot_name: unit.name,
      result_total: total,
      calculation_text: `[${actionName.toUpperCase()}] ${calculation}`,
    });
  };

  const standardAttack = async (unit: CharacterUnit) => {
    try {
      // 1d20 + 0 (Simplifying for base action)
      const d20 = Math.floor(Math.random() * 20) + 1;
      const total = d20;
      const calculation = `${d20} (1d20)`;

      await logActionRoll(unit, 'Attack', total, calculation);
      return { total, calculation };
    } catch (err) {
      console.error('Attack Failed:', err);
    }
  };

  const stabilize = async (unit: CharacterUnit) => {
    try {
      // Stabilize: Reset heat, Heal 1/4 HP (Min 1)
      const healAmount = Math.max(1, Math.floor(unit.max_hp / 4));
      const newHP = Math.min(unit.max_hp, unit.hp + healAmount);

      const { error } = await supabase
        .from('characters')
        .update({
          heat: 0,
          hp: newHP
        })
        .eq('id', unit.id);

      if (error) throw error;

      await logActionRoll(unit, 'Stabilize', 0, `Heat Purged. Restored ${healAmount} HP.`);
    } catch (err) {
      console.error('Stabilize Failed:', err);
    }
  };

  const overcharge = async (unit: CharacterUnit) => {
    try {
      // Overcharge: +1d6 Heat
      const heatGain = Math.floor(Math.random() * 6) + 1;
      const newHeat = unit.heat + heatGain;

      const { error } = await supabase
        .from('characters')
        .update({ heat: newHeat })
        .eq('id', unit.id);

      if (error) throw error;

      await logActionRoll(unit, 'Overcharge', heatGain, `Reactor Stress Check: +${heatGain} Heat.`);
    } catch (err) {
      console.error('Overcharge Failed:', err);
    }
  };

  return { standardAttack, stabilize, overcharge };
}
