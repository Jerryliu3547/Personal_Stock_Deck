'use client';

import React from 'react';
import { MacroSummary } from '@/lib/types';
import { Activity, Percent, TrendingUp, ShieldAlert, DollarSign, Flame, Layers } from 'lucide-react';

interface YieldMonitorCardsProps {
  summary: MacroSummary;
}

export function YieldMonitorCards({ summary }: YieldMonitorCardsProps) {
  const {
    us10y,
    us30y,
    us2y,
    yieldSpread10Y2Y,
    cpiYoY,
    coreCpiYoY,
    breakeven10y,
    fedFundsRate,
    vix,
  } = summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 10-Year Treasury Yield */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-cyan-500/40 transition-all backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">US 10-Year Yield</span>
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono text-slate-100">
            {us10y?.value != null ? `${us10y.value.toFixed(2)}%` : 'N/A'}
          </span>
          {us10y?.change != null && (
            <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md ${
              us10y.change >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {us10y.change >= 0 ? `+${us10y.change}` : us10y.change}%
            </span>
          )}
        </div>
        <div className="mt-2 text-[11px] text-slate-400 font-mono">
          FRED Code: DGS10 • Updated: {us10y?.date || 'Latest'}
        </div>
      </div>

      {/* 30-Year Treasury Yield */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-indigo-500/40 transition-all backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">US 30-Year Yield</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono text-slate-100">
            {us30y?.value != null ? `${us30y.value.toFixed(2)}%` : 'N/A'}
          </span>
          {us30y?.change != null && (
            <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md ${
              us30y.change >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {us30y.change >= 0 ? `+${us30y.change}` : us30y.change}%
            </span>
          )}
        </div>
        <div className="mt-2 text-[11px] text-slate-400 font-mono">
          FRED Code: DGS30 • Long Term Benchmark
        </div>
      </div>

      {/* CPI YoY Inflation Rate */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-amber-500/40 transition-all backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">CPI YoY Inflation</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono text-amber-300">
            {cpiYoY?.value != null ? `${cpiYoY.value.toFixed(2)}%` : 'N/A'}
          </span>
          <span className="text-xs font-mono text-slate-400">
            Core: {coreCpiYoY?.value != null ? `${coreCpiYoY.value.toFixed(2)}%` : '---'}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 font-mono">
          Consumer Price Index • {cpiYoY?.date || 'Monthly'}
        </div>
      </div>

      {/* 10Y - 2Y Yield Curve Spread & Regime */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-purple-500/40 transition-all backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">10Y-2Y Yield Spread</span>
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono text-slate-100">
            {yieldSpread10Y2Y?.value != null ? `${yieldSpread10Y2Y.value.toFixed(2)}%` : 'N/A'}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              yieldSpread10Y2Y?.regime === 'Inverted'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {yieldSpread10Y2Y?.regime || 'Normal'}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 font-mono">
          2Y Yield: {us2y?.value != null ? `${us2y.value.toFixed(2)}%` : '---'} • Fed Rate: {fedFundsRate?.value != null ? `${fedFundsRate.value.toFixed(2)}%` : '---'}
        </div>
      </div>
    </div>
  );
}
