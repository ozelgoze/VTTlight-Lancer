'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Cpu, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { login, signup } from './auth/actions';
import { isUplinkStable } from '@/utils/supabase/client';

export default function TerminalAccess() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'ERROR' | 'SUCCESS'>('IDLE');
  const [message, setMessage] = useState('');
  const [uplinkState, setUplinkState] = useState<'STABLE' | 'OFFLINE'>('STABLE');

  useEffect(() => {
    if (!isUplinkStable()) {
      setUplinkState('OFFLINE');
    }
  }, []);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uplinkState === 'OFFLINE') {
      setStatus('ERROR');
      setMessage('UPLINK_OFFLINE: Missing Supabase Credentials in environment configuration.');
      return;
    }

    setStatus('LOADING');
    setMessage('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const result = (isSignUp ? await signup(formData) : await login(formData)) as { error?: string, success?: string } | undefined;

      if (result?.error) {
        setStatus('ERROR');
        setMessage(result.error);
      } else if (result?.success) {
        setStatus('SUCCESS');
        setMessage(result.success);
      } else {
        setStatus('SUCCESS');
        setMessage('Redirecting to tactical uplink...');
      }
    } catch (err) {
      setStatus('ERROR');
      setMessage('OMNINET_FETCH_FAILURE: Database connection unhealthy or offline.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-space-black">
      {/* Background Drifting Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              opacity: 0 
            }}
            animate={{
              x: [null, (Math.random() - 0.5) * 50 + 50 + "%"],
              y: [null, (Math.random() - 0.5) * 50 + 50 + "%"],
              opacity: [0, 0.1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-64 h-64 bg-lancer-blue/10 blur-[100px] rounded-full"
          />
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: [-5, 5],
          opacity: 1
        }}
        transition={{
          y: {
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          },
          opacity: { duration: 1 }
        }}
        className="w-full max-w-md hud-panel p-8 relative overflow-hidden"
      >
        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-lancer-blue/30" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-lancer-blue/30" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-lancer-blue/30" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-lancer-blue/30" />

        <div className="flex items-center gap-3 mb-8">
          <Terminal className="text-lancer-orange w-6 h-6" />
          <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-zinc-400">
            Omninet Terminal v4.2.1
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase">
            <div className={`flex items-center gap-2 ${uplinkState === 'STABLE' ? 'text-lancer-blue/60' : 'text-red-500 animate-pulse'}`}>
              <Activity className="w-3 h-3" />
              <span>Network: {uplinkState}</span>
            </div>
            <div className="flex items-center gap-2 text-lancer-blue/60">
              <Shield className="w-3 h-3" />
              <span>Enc: Delta-9</span>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/50 border border-zinc-800 font-mono text-xs space-y-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'bg-lancer-green' : 'bg-red-500'}`} />
                <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '> UPLINK_ADDR: DETECTED' : '> UPLINK_ADDR: MISSING'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full ${(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) ? 'bg-lancer-green' : 'bg-red-500'}`} />
                <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
                  {(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) ? '> ACCESS_KEY: DETECTED' : '> ACCESS_KEY: MISSING'}
                </p>
              </div>
              <p className="text-zinc-500 text-[10px] font-mono">{`> CONNECTION_MODE: SSR_ASYNC`}</p>
              <p className="text-zinc-500 text-[10px] font-mono">{`> LOCAL_IDENT: UNKNOWN`}</p>
              
              {uplinkState !== 'STABLE' && (
                <p className="text-red-500 font-bold text-[10px] font-mono animate-pulse">{`> CRITICAL_UPLINK_FAILURE`}</p>
              )}
            </div>
          </div>

          <form onSubmit={handleAction} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                  Pilot ID / Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  disabled={uplinkState === 'OFFLINE'}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pilot@omninet.net"
                  className="w-full bg-zinc-950 border-b border-lancer-blue/30 py-3 px-2 font-mono text-sm
                           focus:outline-none focus:border-lancer-blue transition-colors
                           placeholder:text-zinc-800 disabled:opacity-30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                  Access Key / Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  disabled={uplinkState === 'OFFLINE'}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border-b border-lancer-blue/30 py-3 px-2 font-mono text-sm
                           focus:outline-none focus:border-lancer-blue transition-colors
                           placeholder:text-zinc-800 disabled:opacity-30"
                />
              </div>
            </div>

            <button
              disabled={status === 'LOADING' || uplinkState === 'OFFLINE'}
              className="hud-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === 'LOADING' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Cpu className="w-4 h-4" />
                </motion.div>
              ) : (
                isSignUp ? 'Initialize Uplink' : 'Request Access'
              )}
            </button>

            <button
              type="button"
              disabled={uplinkState === 'OFFLINE'}
              onClick={() => {
                setIsSignUp(!isSignUp);
                setStatus('IDLE');
                setMessage('');
              }}
              className="w-full text-center font-mono text-[9px] text-zinc-600 hover:text-lancer-blue transition-colors uppercase tracking-[0.2em] disabled:opacity-30"
            >
              {isSignUp ? 'Existing Identity? Sign In' : 'New Identity? Register Hash'}
            </button>
          </form>

          <AnimatePresence mode="wait">
            {status === 'ERROR' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-900/50"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="font-mono text-[10px] text-red-500 uppercase leading-tight">
                  {message}
                </p>
              </motion.div>
            )}
            {status === 'SUCCESS' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2 p-3 bg-lancer-green/10 border border-lancer-green/30"
              >
                <CheckCircle2 className="w-4 h-4 text-lancer-green flex-shrink-0" />
                <p className="font-mono text-[10px] text-lancer-green uppercase leading-tight">
                  {message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Data */}
        <div className="mt-8 pt-4 border-t border-zinc-900 flex justify-between items-center text-[8px] font-mono text-zinc-600 grayscale">
          <span>SECURE CHANNEL :: TRMNL-ACCESS</span>
          <span>SYSTEM_TIME: {new Date().toLocaleTimeString()}</span>
        </div>
      </motion.div>
    </div>
  );
}
