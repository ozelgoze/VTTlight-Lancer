'use client';

import { motion } from 'framer-motion';
import { Activity, Thermometer, ShieldCheck, Zap, Crosshair } from 'lucide-react';
import { CharacterUnit } from '@/hooks/useCharacters';
import { useCombatActions } from '@/hooks/useCombatActions';

interface UnitDiagnosticProps {
  unit: CharacterUnit;
}

export function UnitHUD({ unit }: UnitDiagnosticProps) {
  const { standardAttack, stabilize, overcharge } = useCombatActions();
  const hpPercentage = (unit.hp / unit.max_hp) * 100;
  const heatPercentage = (unit.heat / unit.max_heat) * 100;

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ 
        x: [0, 4, 0],
        y: [0, -3, 0],
        opacity: 1 
      }}
      transition={{
        x: { duration: 7, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }}
      className="w-96 hud-panel p-6 relative"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-mono text-lancer-blue uppercase tracking-tighter truncate w-60">
            {unit.name}
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-lancer-green animate-ping" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Diagnostic_Active</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-mono text-zinc-600 block">UID_{unit.id.slice(0, 8)}</span>
          <span className="text-xs font-mono text-lancer-orange">PILOT_ID_00{Math.floor(Math.random() * 9)}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* HP Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-lancer-green">
              <Activity className="w-3 h-3" />
              <span className="text-[10px] uppercase font-mono tracking-widest">Hull Integrity</span>
            </div>
            <span className="font-mono text-xs">{unit.hp} / {unit.max_hp}</span>
          </div>
          <div className="h-2 bg-zinc-900 border border-zinc-800 relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${hpPercentage}%` }}
              className={`h-full transition-all duration-500 ${hpPercentage < 30 ? 'bg-red-500' : 'bg-lancer-green'}`}
              style={{ boxShadow: `0 0 10px ${hpPercentage < 30 ? '#ef4444' : '#00ff41'}` }}
            />
          </div>
        </div>

        {/* Heat Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-lancer-orange">
              <Thermometer className="w-3 h-3" />
              <span className="text-[10px] uppercase font-mono tracking-widest">Thermal Load</span>
            </div>
            <span className="font-mono text-xs">{unit.heat} / {unit.max_heat}</span>
          </div>
          <div className="h-2 bg-zinc-900 border border-zinc-800 relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${heatPercentage}%` }}
              className={`h-full transition-all duration-500 ${heatPercentage > 70 ? 'bg-lancer-orange' : 'bg-lancer-blue'}`}
              style={{ boxShadow: `0 0 10px ${heatPercentage > 70 ? '#ff6b00' : '#00d1ff'}` }}
            />
          </div>
        </div>

        {/* Tactical Readouts */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="bg-white/5 border border-white/5 p-2 text-center space-y-1">
            <ShieldCheck className="w-3 h-3 mx-auto text-lancer-blue" />
            <span className="block text-[8px] text-zinc-500 uppercase font-mono">Evasion</span>
            <span className="block font-mono text-sm">{unit.evasion}</span>
          </div>
          <div className="bg-white/5 border border-white/5 p-2 text-center space-y-1">
            <Zap className="w-3 h-3 mx-auto text-lancer-orange" />
            <span className="block text-[8px] text-zinc-500 uppercase font-mono">E-Def</span>
            <span className="block font-mono text-sm">{unit.e_defense}</span>
          </div>
          <div className="bg-white/5 border border-white/5 p-2 text-center space-y-1">
            <Crosshair className="w-3 h-3 mx-auto text-lancer-green" />
            <span className="block text-[8px] text-zinc-500 uppercase font-mono">Speed</span>
            <span className="block font-mono text-sm">{unit.movement}</span>
          </div>
        </div>

        {/* COMBAT ACTION COCKPIT */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-3 bg-lancer-orange" />
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-zinc-400">Action_Cockpit</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => standardAttack(unit)}
              className="hud-button text-[10px] py-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-lancer-blue/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Crosshair className="w-3 h-3" />
                STAND_ATTACK
              </span>
            </button>
            <button 
              onClick={() => stabilize(unit)}
              className="hud-button text-[10px] py-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-lancer-green/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Activity className="w-3 h-3" />
                STABILIZE
              </span>
            </button>
            <button 
              onClick={() => overcharge(unit)}
              className="hud-button text-[10px] py-3 col-span-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-lancer-orange/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Zap className="w-3 h-3" />
                OVERCHARGE_INIT
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative footer */}
      <div className="mt-6 flex justify-between items-center opacity-30 grayscale saturate-0">
        <div className="flex gap-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-1 h-3 bg-lancer-blue/50" />
          ))}
        </div>
        <span className="text-[8px] font-mono tracking-[0.4em] uppercase text-zinc-500">Omninet_Secure</span>
      </div>
    </motion.div>
  );
}
