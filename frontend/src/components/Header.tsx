'use client';

import React from 'react';
import { TrendingUp, Activity, Cpu } from 'lucide-react';

interface HeaderProps {
  apiStatus: 'online' | 'offline' | 'loading';
}

export const Header: React.FC<HeaderProps> = ({ apiStatus }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Personal Stock Deck <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono font-medium border border-cyan-500/30">Next.js + FastAPI</span>
            </h1>
            <p className="text-xs text-slate-400">Technical Stock Analytics • Bollinger Bands & MACD Signal Detector</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Python Engine:</span>
            {apiStatus === 'online' && (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected
              </span>
            )}
            {apiStatus === 'offline' && (
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Offline (Check FastAPI port 8000)
              </span>
            )}
            {apiStatus === 'loading' && (
              <span className="flex items-center gap-1.5 text-amber-400">
                <Activity className="w-3 h-3 animate-spin" />
                Connecting...
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
