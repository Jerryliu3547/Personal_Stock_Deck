'use client';

import React from 'react';
import { TrendingUp, Globe, Landmark, Zap } from 'lucide-react';

export type NavTab = 'stocks' | 'macro' | 'mega7';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  apiStatus: 'online' | 'offline' | 'loading';
  us10yVal?: number | null;
  cpiYoYVal?: number | null;
}

export function Sidebar({ activeTab, onTabChange, apiStatus, us10yVal, cpiYoYVal }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen p-4 backdrop-blur-md select-none sticky top-0 h-screen overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight leading-none">Stock Deck</h1>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Macro &amp; Technicals</p>
          </div>
        </div>

        {/* Live Ticker Pills (Quick glance) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Live Macro Quick Glance</div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">US 10Y Yield:</span>
            <span className="font-bold text-cyan-400">{us10yVal ? `${us10yVal.toFixed(2)}%` : '---'}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">CPI YoY:</span>
            <span className="font-bold text-amber-400">{cpiYoYVal ? `${cpiYoYVal.toFixed(2)}%` : '---'}</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-2">
            Analytics Views
          </div>

          {/* Tab 1: Stock Technicals */}
          <button
            onClick={() => onTabChange('stocks')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'stocks'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${activeTab === 'stocks' ? 'text-cyan-400' : 'text-slate-400'}`} />
            <div className="flex-1 text-left">
              <div className="font-semibold text-slate-200">Stock Technicals</div>
              <div className="text-[11px] text-slate-400 font-normal">MACD &amp; Bollinger Bands</div>
            </div>
          </button>

          {/* Tab 2: Global Bonds & Macro */}
          <button
            onClick={() => onTabChange('macro')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'macro'
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border border-indigo-500/40 text-indigo-300 shadow-md shadow-indigo-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Globe className={`w-4 h-4 ${activeTab === 'macro' ? 'text-indigo-400' : 'text-slate-400'}`} />
            <div className="flex-1 text-left">
              <div className="font-semibold text-slate-200">Global Bonds &amp; Macro</div>
              <div className="text-[11px] text-slate-400 font-normal">10Y/30Y Yields &amp; CPI</div>
            </div>
          </button>

          {/* Tab 3: Mega 7 Debt & Cash */}
          <button
            onClick={() => onTabChange('mega7')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'mega7'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Landmark className={`w-4 h-4 ${activeTab === 'mega7' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <div className="flex-1 text-left">
              <div className="font-semibold text-slate-200">Mega 7 Debt &amp; Cash</div>
              <div className="text-[11px] text-slate-400 font-normal">Liquidity &amp; Debt Issuance</div>
            </div>
          </button>
        </div>
      </div>

      {/* Backend API Status Footer */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">FastAPI Engine</span>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              apiStatus === 'online'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : apiStatus === 'offline'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                apiStatus === 'online'
                  ? 'bg-emerald-400 animate-pulse'
                  : apiStatus === 'offline'
                  ? 'bg-rose-400'
                  : 'bg-amber-400 animate-ping'
              }`}
            />
            {apiStatus.toUpperCase()}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">FRED &amp; YFinance Integrated</div>
      </div>
    </aside>
  );
}
