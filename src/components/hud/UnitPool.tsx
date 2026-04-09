'use client';

import { motion } from 'framer-motion';
import { Users, ChevronRight, Share2 } from 'lucide-react';
import { CharacterUnit } from '@/hooks/useCharacters';
import { useTokens } from '@/hooks/useTokens';

interface UnitPoolProps {
  units: CharacterUnit[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  mapId?: string;
}

export function UnitPool({ units, selectedId, onSelect, mapId }: UnitPoolProps) {
  const { tokens, deployToken } = useTokens(mapId);

  const isDeployed = (charId: string) => tokens.some(t => t.character_id === charId);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full hud-panel flex flex-col h-[500px]"
    >
      <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3 text-lancer-blue" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Unit_Registry</span>
        </div>
        <div className="px-2 py-0.5 border border-lancer-blue/20 bg-lancer-blue/5 rounded-full">
          <span className="text-[7px] font-mono text-lancer-blue uppercase">Active_Link</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
        {units.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-[10px] font-mono text-zinc-600 uppercase italic">No units detected...</p>
          </div>
        ) : (
          units.map((unit) => {
            const deployed = isDeployed(unit.id);
            return (
              <div key={unit.id} className="relative group">
                <button
                  onClick={() => onSelect(unit.id)}
                  className={`w-full p-3 flex items-center justify-between border transition-all duration-300
                    ${selectedId === unit.id 
                      ? 'bg-lancer-blue/10 border-lancer-blue/50 text-lancer-blue' 
                      : 'bg-transparent border-transparent text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                    }`}
                >
                  {selectedId === unit.id && (
                    <motion.div 
                      layoutId="active-highlight"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-lancer-blue shadow-[0_0_10px_#00d1ff]" 
                    />
                  )}
                  
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] font-mono uppercase truncate w-32 text-left">
                      {unit.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono opacity-50">
                        HP: {unit.hp}/{unit.max_hp}
                      </span>
                      {deployed && (
                        <span className="text-[7px] font-mono text-lancer-green border border-lancer-green/20 px-1 bg-lancer-green/5">
                          DEPLOYED
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${selectedId === unit.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                </button>

                {/* DEPLOY BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!deployed) deployToken(unit.id);
                  }}
                  disabled={deployed || !mapId}
                  className={`absolute right-10 top-1/2 -translate-y-1/2 p-2 rounded-sm border transition-all duration-500
                    ${deployed 
                      ? 'opacity-0 scale-75' 
                      : 'opacity-0 group-hover:opacity-100 hover:bg-lancer-orange hover:text-black hover:border-lancer-orange border-white/5 text-zinc-600'
                    }`}
                  title="Deploy to theater"
                >
                  <Share2 className="w-3 h-3" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Decorative elements */}
      <div className="p-2 border-t border-white/5 bg-zinc-950/30">
        <div className="flex justify-between items-center text-[7px] font-mono text-zinc-600 uppercase grayscale">
          <span>Active_Deployments: {tokens.length}</span>
          <span>S_LINK: 100%</span>
        </div>
      </div>
    </motion.div>
  );
}
