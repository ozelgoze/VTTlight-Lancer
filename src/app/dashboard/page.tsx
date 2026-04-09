'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe, Activity, LogOut, Terminal, Cpu } from 'lucide-react';
import { signOut } from '../auth/actions';
import { DiceTerminal } from '@/components/dice/DiceTerminal';
import { UnitHUD } from '@/components/hud/UnitDiagnostic';
import { UnitPool } from '@/components/hud/UnitPool';
import { TacticalMap } from '@/components/map/TacticalMap';
import { useCharacters } from '@/hooks/useCharacters';
import { useMap } from '@/hooks/useMap';

export default function Dashboard() {
  const { characters, loading: charsLoading } = useCharacters();
  const { mapState, loading: mapLoading } = useMap();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);

  // Handle auto-selection and cleanup
  useEffect(() => {
    if (charsLoading) return;

    // 1. Auto-select first unit if none selected
    if (!selectedUnitId && characters.length > 0) {
      setSelectedUnitId(characters[0].id);
    }

    // 2. Selection Guard: If selected unit no longer exists (deleted elsewhere), re-select
    if (selectedUnitId && !characters.some(c => c.id === selectedUnitId)) {
      setSelectedUnitId(characters.length > 0 ? characters[0].id : null);
    }
  }, [characters, charsLoading, selectedUnitId]);

  // Boot sequence logic
  useEffect(() => {
    if (!charsLoading && !mapLoading) {
      // Small delay for dramatic effect
      const timer = setTimeout(() => setBooting(false), 800);
      return () => clearTimeout(timer);
    }
  }, [charsLoading, mapLoading]);

  const selectedUnit = characters.find(c => c.id === selectedUnitId);

  return (
    <div className="relative min-h-screen bg-space-black text-white selection:bg-lancer-orange/30 overflow-hidden font-sans">
      
      {/* GLOBAL HUD OVERLAYS */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <AnimatePresence>
        {booting && (
          <motion.div
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Cpu className="w-12 h-12 text-lancer-blue" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs font-mono uppercase tracking-[1em] text-lancer-blue"
            >
              INITIATING_OMNINET_LINK
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HUD BAR */}
      <header className="fixed top-0 inset-x-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-lancer-blue" />
            <h1 className="text-lg font-mono tracking-tighter uppercase font-bold">Tactical_Core</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8 border-l border-white/10 pl-8">
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{mapState?.map_name || 'ORBITAL_STATION'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-lancer-green" />
              <span className="text-[10px] font-mono text-lancer-green uppercase tracking-widest">Uplink_Stable</span>
            </div>
          </div>
        </div>

        <form action={signOut}>
          <button className="hud-button flex items-center gap-2 !px-4 !py-1 !text-[10px] !text-red-500 !border-red-500/30">
            <LogOut className="w-3 h-3" /> Terminate
          </button>
        </form>
      </header>

      {/* MAIN COCKPIT AREA */}
      <div className="pt-24 pb-8 px-8 grid grid-cols-12 gap-8 h-screen max-w-[1920px] mx-auto overflow-hidden">
        
        {/* LEFT FLANK: UNIT POOL */}
        <aside className="col-span-12 md:col-span-2 flex flex-col gap-6 overflow-hidden">
          <UnitPool 
            units={characters} 
            selectedId={selectedUnitId} 
            onSelect={setSelectedUnitId} 
            mapId={mapState?.id}
          />
        </aside>

        {/* CENTER: TACTICAL THEATER */}
        <main className="col-span-12 md:col-span-7 flex flex-col gap-6 min-h-0">
          <TacticalMap mapState={mapState} />
          
          {/* BOTTOM DATA FLOW: DICE ROLLER */}
          <div className="flex-1 flex gap-6 min-h-0">
            <div className="flex-1">
              <DiceTerminal />
            </div>
          </div>
        </main>

        {/* RIGHT FLANK: DIAGNOSTICS */}
        <aside className="col-span-12 md:col-span-3 flex flex-col gap-6 overflow-hidden">
          {selectedUnit ? (
            <UnitHUD unit={selectedUnit} />
          ) : (
            <div className="hud-panel p-12 flex items-center justify-center opacity-20 italic font-mono text-[10px] uppercase">
              No_Unit_Detected
            </div>
          )}

          {/* SYSTEM STATS */}
          <div className="hud-panel p-6 flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-3 h-3 text-lancer-orange" />
              <span className="text-[10px] font-mono uppercase text-zinc-400">System_Status</span>
            </div>
            <div className="space-y-4 font-mono text-[9px] text-zinc-600">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>MEMORY_ALLOCATION</span>
                  <span>78%</span>
                </div>
                <div className="h-0.5 bg-zinc-900 w-full"><div className="h-full bg-zinc-700 w-[78%]" /></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>SIGNAL_STRENGTH</span>
                  <span>100%</span>
                </div>
                <div className="h-0.5 bg-zinc-900 w-full"><div className="h-full bg-lancer-green w-full" /></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
