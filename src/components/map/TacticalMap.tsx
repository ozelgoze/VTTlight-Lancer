'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapState } from '@/hooks/useMap';
import { Map as MapIcon, Maximize2, Crosshair } from 'lucide-react';
import { TacticalToken } from './TacticalToken';
import { useTokens } from '@/hooks/useTokens';

interface TacticalMapProps {
  mapState: MapState | null;
}

export function TacticalMap({ mapState }: TacticalMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { tokens, loading, updateTokenPos } = useTokens(mapState?.id);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] bg-zinc-950 border border-zinc-900 overflow-hidden group select-none"
    >
      {/* HUD Overlays for Map */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md border border-lancer-blue/30 rounded-sm">
        <MapIcon className="w-3 h-3 text-lancer-blue" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
          {mapState?.map_name || 'INITIALIZING_STAGE...'}
        </span>
      </div>

      <div className="absolute top-4 right-4 z-30 flex gap-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-black/60 border border-white/5 rounded-sm">
          <Crosshair className="w-3 h-3 text-lancer-orange" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase">Tokens_Active: {tokens.length}</span>
        </div>
        <button className="p-2 bg-black/60 border border-white/10 text-zinc-500 hover:text-white transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-grid-pattern bg-[length:40px_40px] opacity-20" />

      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mapState?.background_url || 'loading'}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${mapState?.background_url})` }}
        />
      </AnimatePresence>

      {/* RENDER TOKENS */}
      {!loading && tokens.map((token) => (
        <TacticalToken
          key={token.id}
          token={token}
          containerRef={containerRef}
          onDragEnd={(x, y) => updateTokenPos(token.id, x, y)}
        />
      ))}

      {/* Map Scanning Effect */}
      <motion.div 
        animate={{ y: ['0%', '100%', '0%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-px bg-lancer-blue/20 z-10 pointer-events-none shadow-[0_0_20px_#00d1ff22]"
      />

      {(!mapState || loading) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-4"
          >
            <Crosshair className="w-8 h-8 text-lancer-blue animate-spin-slow" />
            <p className="text-xs font-mono uppercase tracking-[0.5em] text-lancer-blue">
              Establishing_Neural_Link...
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
