'use client';

import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { InflationHistoryPoint } from '@/lib/types';
import { Flame, TrendingUp } from 'lucide-react';

interface InflationChartProps {
  data: InflationHistoryPoint[];
}

const CustomInflationTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d: InflationHistoryPoint = payload[0].payload;
    return (
      <div className="bg-slate-950/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono space-y-1.5 min-w-[210px]">
        <div className="font-sans font-bold text-slate-200 border-b border-slate-800 pb-1 flex justify-between">
          <span>{label}</span>
          <span className="text-amber-400 font-mono">CPI Tracker</span>
        </div>

        {d.cpiYoY != null && (
          <div className="flex justify-between text-amber-300 font-bold">
            <span>Headline CPI YoY:</span>
            <span>{d.cpiYoY.toFixed(2)}%</span>
          </div>
        )}
        {d.coreCpiYoY != null && (
          <div className="flex justify-between text-rose-300 font-bold">
            <span>Core CPI YoY:</span>
            <span>{d.coreCpiYoY.toFixed(2)}%</span>
          </div>
        )}
        {d.breakeven10y != null && (
          <div className="flex justify-between text-emerald-400 pt-1 border-t border-slate-800">
            <span>10Y Market Breakeven:</span>
            <span>{d.breakeven10y.toFixed(2)}%</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function InflationChart({ data }: InflationChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            🔥 CPI &amp; Inflation Rate Analytics
          </h2>
          <p className="text-xs text-slate-400">Headline CPI YoY %, Core CPI YoY %, and 10-Year Market Inflation Expectations</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Fed Inflation Target: 2.0%</span>
        </div>
      </div>

      <div className="h-[360px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="cpiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} minTickGap={50} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 'auto']} />
            <Tooltip content={<CustomInflationTooltip />} />

            <ReferenceLine y={2.0} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Fed 2.0% Target', fill: '#10b981', fontSize: 11 }} />

            <Area
              type="monotone"
              dataKey="cpiYoY"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fill="url(#cpiGradient)"
              name="Headline CPI YoY"
            />
            <Line
              type="monotone"
              dataKey="coreCpiYoY"
              stroke="#f43f5e"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              name="Core CPI YoY"
            />
            <Line
              type="monotone"
              dataKey="breakeven10y"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="10Y Breakeven"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-amber-500 inline-block"></span> Headline CPI YoY %
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-rose-500 border-b border-dashed border-rose-500 inline-block"></span> Core CPI YoY %
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-emerald-500 inline-block"></span> 10Y Market Breakeven Rate
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-emerald-500 border-b border-dashed border-emerald-500 inline-block"></span> Fed Target (2%)
        </div>
      </div>
    </div>
  );
}
