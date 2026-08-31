'use client';

import React, { useState } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { YieldHistoryPoint } from '@/lib/types';
import { Activity, Layers } from 'lucide-react';

interface YieldTrendChartProps {
  data: YieldHistoryPoint[];
}

const CustomYieldTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d: YieldHistoryPoint = payload[0].payload;
    return (
      <div className="bg-slate-950/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono space-y-1.5 min-w-[210px]">
        <div className="font-sans font-bold text-slate-200 border-b border-slate-800 pb-1 flex justify-between">
          <span>{label}</span>
          {d.spread10y2y != null && (
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                d.spread10y2y < 0
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {d.spread10y2y < 0 ? 'INVERTED' : 'NORMAL'}
            </span>
          )}
        </div>

        {d.us10y != null && (
          <div className="flex justify-between text-cyan-400 font-bold">
            <span>US 10-Year Yield:</span>
            <span>{d.us10y.toFixed(2)}%</span>
          </div>
        )}
        {d.us30y != null && (
          <div className="flex justify-between text-indigo-400 font-bold">
            <span>US 30-Year Yield:</span>
            <span>{d.us30y.toFixed(2)}%</span>
          </div>
        )}
        {d.us2y != null && (
          <div className="flex justify-between text-amber-400">
            <span>US 2-Year Yield:</span>
            <span>{d.us2y.toFixed(2)}%</span>
          </div>
        )}
        {d.spread10y2y != null && (
          <div className="flex justify-between text-purple-400 pt-1 border-t border-slate-800">
            <span>10Y-2Y Spread:</span>
            <span>{d.spread10y2y.toFixed(2)}%</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function YieldTrendChart({ data }: YieldTrendChartProps) {
  const [viewMode, setViewMode] = useState<'yields' | 'spread'>('yields');

  if (!data || data.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            🏛️ Treasury Yield Monitoring (10Y &amp; 30Y)
          </h2>
          <p className="text-xs text-slate-400">Continuous historical monitoring of US Sovereign Benchmark Yields</p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('yields')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              viewMode === 'yields'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> 10Y vs 30Y Yields
          </button>
          <button
            onClick={() => setViewMode('spread')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              viewMode === 'spread'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> 10Y-2Y Spread
          </button>
        </div>
      </div>

      <div className="h-[380px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} minTickGap={45} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={viewMode === 'spread' ? ['auto', 'auto'] : [0, 'auto']} />
            <Tooltip content={<CustomYieldTooltip />} />

            {viewMode === 'spread' && (
              <ReferenceLine y={0} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Yield Curve Inversion (0%)', fill: '#f43f5e', fontSize: 11 }} />
            )}

            {viewMode === 'yields' ? (
              <>
                <Line
                  type="monotone"
                  dataKey="us10y"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={false}
                  name="US 10-Year Yield"
                />
                <Line
                  type="monotone"
                  dataKey="us30y"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                  name="US 30-Year Yield"
                />
                <Line
                  type="monotone"
                  dataKey="us2y"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  name="US 2-Year Yield"
                />
              </>
            ) : (
              <Line
                type="monotone"
                dataKey="spread10y2y"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={false}
                name="10Y-2Y Spread"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
        {viewMode === 'yields' ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-500 inline-block"></span> US 10-Year Yield
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-indigo-500 inline-block"></span> US 30-Year Yield
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-500 border-b border-dashed border-amber-500 inline-block"></span> US 2-Year Yield
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-purple-500 inline-block"></span> 10Y-2Y Spread (&lt;0% = Inversion Warning)
          </div>
        )}
      </div>
    </div>
  );
}
