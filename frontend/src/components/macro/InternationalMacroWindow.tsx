'use client';

import React from 'react';
import { CountryMacroQuote } from '@/lib/types';
import { Globe, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface InternationalMacroWindowProps {
  countries: CountryMacroQuote[];
}

export function InternationalMacroWindow({ countries }: InternationalMacroWindowProps) {
  if (!countries || countries.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            🌍 Global Sovereign Yields &amp; Foreign Exchange (FX) Window
          </h2>
          <p className="text-xs text-slate-400">
            Compact continuous monitoring for UK, Germany, France, and Japan FX rates &amp; sovereign bond benchmarks
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold hidden sm:inline">
          4 Sovereign Markets
        </span>
      </div>

      {/* Compact Side-by-Side Country Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {countries.map((c) => {
          const isFxPositive = c.fxPercentChange >= 0;
          return (
            <div
              key={c.code + c.country}
              className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group"
            >
              {/* Header: Flag & Country */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl leading-none">{c.flag}</span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">{c.country}</h3>
                    <p className="text-[10px] text-slate-500 font-mono">{c.bondName}</p>
                  </div>
                </div>
                <span className="text-sm font-bold font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg">
                  {c.yield10y.toFixed(2)}%
                </span>
              </div>

              {/* FX Exchange Rate Details */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{c.currencyPair} Rate</span>
                  <div className="flex items-center gap-1">
                    {isFxPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span
                      className={`font-mono font-semibold ${
                        isFxPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {c.fxPercentChange >= 0 ? `+${c.fxPercentChange.toFixed(2)}%` : `${c.fxPercentChange.toFixed(2)}%`}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-slate-100">
                    {c.currencyPair.includes('JPY') ? c.fxRate.toFixed(2) : c.fxRate.toFixed(4)}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    1D Chg: {c.fxChange >= 0 ? `+${c.fxChange}` : c.fxChange}
                  </span>
                </div>

                {c.fxReservesBillions != null && (
                  <div className="pt-1.5 flex items-center justify-between text-[11px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md mt-1">
                    <span>FX Reserves:</span>
                    <span className="font-bold">${c.fxReservesBillions.toFixed(1)}B USD</span>
                  </div>
                )}
              </div>

              {/* Sparkline Visualiser (Mini Trend) */}
              {c.sparkline && c.sparkline.length > 1 && (
                <div className="pt-1">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono mb-1">
                    15-Day FX Trend
                  </div>
                  <div className="h-7 w-full flex items-end gap-1">
                    {(() => {
                      const min = Math.min(...c.sparkline);
                      const max = Math.max(...c.sparkline);
                      const range = max - min || 1;
                      return c.sparkline.map((val, idx) => {
                        const hPct = Math.max(15, ((val - min) / range) * 100);
                        return (
                          <div
                            key={idx}
                            style={{ height: `${hPct}%` }}
                            className={`flex-1 rounded-t-sm transition-all ${
                              isFxPositive ? 'bg-emerald-500/60 group-hover:bg-emerald-400' : 'bg-rose-500/60 group-hover:bg-rose-400'
                            }`}
                          />
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
