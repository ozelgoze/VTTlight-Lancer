'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Plus, Minus, Send, History } from 'lucide-react';
import { useDiceRoller } from '@/hooks/useDiceRoller';

export function DiceTerminal() {
  const { rolls, rollDice } = useDiceRoller();
  const [acc, setAcc] = useState(0);
  const [diff, setDiff] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [rolls]);

  const handleRoll = () => {
    rollDice(acc, diff);
    // Optional: Reset inputs or keep them for multiple rolls
  };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ 
        x: [0, -4, 0],
        y: [0, 6, 0],
        opacity: 1 
      }}
      transition={{
        x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }}
      className="w-80 hud-panel flex flex-col h-[500px]"
    >
      {/* Header */}
      <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <History className="w-3 h-3 text-lancer-orange" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Tactical_Log</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-lancer-green animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
        </div>
      </div>

      {/* Roll Log */}
      <div 
        ref={logRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] scrollbar-hide flex flex-col-reverse"
      >
        <AnimatePresence initial={false}>
          {rolls.map((roll) => (
            <motion.div
              key={roll.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-l border-white/10 pl-2 py-1 space-y-1"
            >
              <div className="flex justify-between items-center text-zinc-500">
                <span>{roll.pilot_name.toUpperCase()}</span>
                <span>{new Date(roll.created_at).toLocaleTimeString([], { hour12: false })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lancer-blue font-bold text-sm">
                  {String(roll.result_total).padStart(2, '0')}
                </span>
                <span className="text-zinc-600 italic truncate">
                  {roll.calculation_text}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Inputs */}
      <div className="p-4 bg-black/40 border-t border-white/5 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <label className="text-[8px] uppercase text-zinc-500 font-mono flex items-center gap-1">
              <Plus className="w-2 h-2" /> Accuracy
            </label>
            <div className="flex items-center justify-between bg-zinc-950/50 border border-zinc-800 p-1">
              <button 
                onClick={() => setAcc(Math.max(0, acc - 1))}
                className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-white"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-mono text-xs">{acc}</span>
              <button 
                onClick={() => setAcc(acc + 1)}
                className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-white"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-[8px] uppercase text-zinc-500 font-mono flex items-center gap-1">
              <Minus className="w-2 h-2" /> Difficulty
            </label>
            <div className="flex items-center justify-between bg-zinc-950/50 border border-zinc-800 p-1">
              <button 
                onClick={() => setDiff(Math.max(0, diff - 1))}
                className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-white"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-mono text-xs">{diff}</span>
              <button 
                onClick={() => setDiff(diff + 1)}
                className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-white"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleRoll}
          className="hud-button w-full flex items-center justify-center gap-2 group"
        >
          <Hash className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span>Execute Roll</span>
          <Send className="w-3 h-3 ml-auto opacity-30 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </motion.div>
  );
}
