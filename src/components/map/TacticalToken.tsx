'use client';

import { motion, useMotionValue } from 'framer-motion';
import { Token } from '@/hooks/useTokens';
import { Activity, Thermometer } from 'lucide-react';

interface TacticalTokenProps {
  token: Token;
  onDragEnd: (x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function TacticalToken({ token, onDragEnd, containerRef }: TacticalTokenProps) {
  const hpPercent = token.character ? (token.character.hp / token.character.max_hp) * 100 : 0;
  const heatPercent = token.character ? (token.character.heat / token.character.max_heat) * 100 : 0;

  const handleDragEnd = (_: any, info: any) => {
    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const xPercent = (info.point.x - container.left) / container.width * 100;
    const yPercent = (info.point.y - container.top) / container.height * 100;

    // Clamp values between 0 and 100
    onDragEnd(
      Math.max(0, Math.min(100, xPercent)),
      Math.max(0, Math.min(100, yPercent))
    );
  };

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragElastic={0}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      className="absolute z-20 cursor-grab active:cursor-grabbing group"
      style={{
        left: `${token.x_percent}%`,
        top: `${token.y_percent}%`,
        translateX: '-50%',
        translateY: '-50%'
      }}
    >
      {/* GLOWING SELECTION HALO */}
      <div className="absolute inset-0 -m-8 scale-150 rounded-full bg-lancer-blue/5 border border-lancer-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

      {/* TOKEN CONTENT */}
      <div className="relative">
        <div className="w-16 h-16 bg-zinc-950/80 border-2 border-lancer-blue/40 rounded-sm overflow-hidden backdrop-blur-sm shadow-[0_0_15px_rgba(0,209,255,0.2)]">
          {/* Mock sprite / Initial */}
          <div className="w-full h-full flex items-center justify-center bg-zinc-900 font-mono text-xl font-bold text-lancer-blue/30 italic">
            {token.character?.name.slice(0, 2).toUpperCase() || '??'}
          </div>

          {/* Mini-bars */}
          <div className="absolute bottom-0 inset-x-0 h-1 flex gap-[1px]">
            <div className="flex-1 bg-zinc-950">
              <div 
                className="h-full bg-lancer-green shadow-[0_0_5px_#00ff41]" 
                style={{ width: `${hpPercent}%` }} 
              />
            </div>
            <div className="flex-1 bg-zinc-950">
              <div 
                className="h-full bg-lancer-orange shadow-[0_0_5px_#ff6b00]" 
                style={{ width: `${heatPercent}%` }} 
              />
            </div>
          </div>
        </div>

        {/* TOOLTIP ON HOVER */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/80 border border-white/10 px-2 py-1 whitespace-nowrap">
            <p className="text-[8px] font-mono text-zinc-300 uppercase tracking-widest">{token.character?.name || 'UNKNOWN_MECH'}</p>
          </div>
        </div>

        {/* SHARP HUD CORNERS */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-lancer-blue" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-lancer-blue" />
      </div>
    </motion.div>
  );
}
