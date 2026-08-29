'use client';

import React from 'react';
import { GlobalBondQuote, MacroSummary } from '@/lib/types';
import { Globe, TrendingUp, TrendingDown, DollarSign, ShieldCheck, Zap } from 'lucide-react';

interface GlobalBondMatrixProps {
  bonds: GlobalBondQuote[];
  summary: MacroSummary;
}

export function GlobalBondMatrix({ bonds, summary }: GlobalBondMatrixProps) {
  const { vix, dxy, gold, oil } = summary;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Global & Sovereign Bond ETF Matrix */}
      <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              🌐 Sovereign &amp; Fixed-Income Bond Matrix
            </h2>
            <p className="text-xs text-slate-400">Long-term Treasuries, International Sovereigns, Inflation &amp; Credit Markets</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800/80">
                <th className="pb-2 font-semibold">Asset / Ticker</th>
                <th className="pb-2 font-semibold">Category</th>
                <th className="pb-2 font-semibold text-right">Price</th>
                <th className="pb-2 font-semibold text-right">1D Change</th>
                <th className="pb-2 font-semibold text-right">1D %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {bonds.map((b) => (
                <tr key={b.symbol} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 font-bold text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-xs">{b.symbol}</span>
                      <span className="font-sans font-medium text-slate-300 hidden sm:inline">{b.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-400 font-sans">{b.category}</td>
                  <td className="py-3 text-right font-bold text-slate-100">${b.price.toFixed(2)}</td>
                  <td className={`py-3 text-right font-semibold ${b.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {b.change >= 0 ? `+$${b.change.toFixed(2)}` : `-$${Math.abs(b.change).toFixed(2)}`}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        b.percentChange >= 0
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {b.percentChange >= 0 ? `+${b.percentChange.toFixed(2)}%` : `${b.percentChange.toFixed(2)}%`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Col: Macro Risk & Commodities Side Dashboard */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            ⚡ Market Risk &amp; Commodities
          </h2>
          <p className="text-xs text-slate-400">Macro Sentiment, Currency &amp; Inflation Proxies</p>
        </div>

        <div className="space-y-3">
          {/* Volatility Index VIX */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400">VIX Volatility Index</div>
              <div className="text-2xl font-bold font-mono text-slate-100 mt-0.5">
                {vix?.value != null ? vix.value.toFixed(2) : '---'}
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                vix?.regime === 'High Fear'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-bounce'
                  : vix?.regime === 'Elevated Risk'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {vix?.regime || 'Low Volatility'}
            </span>
          </div>

          {/* US Dollar Index (DXY) */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400">US Dollar Index (DXY)</div>
              <div className="text-2xl font-bold font-mono text-cyan-300 mt-0.5">
                {dxy != null ? dxy.toFixed(2) : '---'}
              </div>
            </div>
            <div className="text-xs font-mono text-slate-400">DX-Y.NYB</div>
          </div>

          {/* Gold Futures */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400">Gold Futures (GC=F)</div>
              <div className="text-2xl font-bold font-mono text-amber-300 mt-0.5">
                {gold != null ? `$${gold.toFixed(2)}` : '---'}
              </div>
            </div>
            <div className="text-xs font-mono text-amber-400/80 font-semibold">Safe Haven Proxy</div>
          </div>

          {/* Crude Oil Futures */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400">Crude Oil (CL=F)</div>
              <div className="text-2xl font-bold font-mono text-emerald-300 mt-0.5">
                {oil != null ? `$${oil.toFixed(2)}` : '---'}
              </div>
            </div>
            <div className="text-xs font-mono text-slate-400">Energy Inflation</div>
          </div>
        </div>
      </div>
    </div>
  );
}
