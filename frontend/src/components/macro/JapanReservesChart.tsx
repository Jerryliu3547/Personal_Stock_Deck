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
import { JapanReservesPoint, MacroSummary } from '@/lib/types';
import { ShieldAlert, Landmark, ArrowDownRight, DollarSign } from 'lucide-react';

interface JapanReservesChartProps {
  data: JapanReservesPoint[];
  summary: MacroSummary;
}

const CustomJapanTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d: JapanReservesPoint = payload[0].payload;
    return (
      <div className="bg-slate-950/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono space-y-1.5 min-w-[220px]">
        <div className="font-sans font-bold text-slate-200 border-b border-slate-800 pb-1 flex justify-between">
          <span>{label}</span>
          {d.isInterventionDrop && (
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] px-1.5 py-0.5 rounded font-bold">
              FX INTERVENTION
            </span>
          )}
        </div>
        <div className="flex justify-between text-indigo-300 font-bold">
          <span>Total FX Reserves:</span>
          <span>${d.reservesBillions.toFixed(2)}B USD</span>
        </div>
        {d.monthlyChange != null && (
          <div className="flex justify-between text-slate-300">
            <span>1-Month Change:</span>
            <span className={d.monthlyChange >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {d.monthlyChange >= 0 ? `+$${d.monthlyChange.toFixed(2)}B` : `-$${Math.abs(d.monthlyChange).toFixed(2)}B`}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function JapanReservesChart({ data, summary }: JapanReservesChartProps) {
  if (!data || data.length === 0) return null;

  const latestReserves = summary.japanFxReserves;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            🇯🇵 Japan Foreign Exchange (FX) Reserves &amp; Yen Intervention Monitor
          </h2>
          <p className="text-xs text-slate-400">
            FRED: TRESEGJPM194N • Continuous tracking of Bank of Japan / Ministry of Finance Foreign Reserves
          </p>
        </div>

        {/* Live Reserves Status */}
        {latestReserves && (
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs">
              <span className="text-slate-400 block text-[10px]">CURRENT RESERVES</span>
              <span className="font-bold text-indigo-300 text-sm">${latestReserves.value.toFixed(1)}B USD</span>
            </div>

            {latestReserves.hasInterventionDrop && (
              <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-semibold animate-pulse">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Active MoF Intervention Detected</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-[340px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="reservesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} minTickGap={45} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['auto', 'auto']} unit="B" />
            <Tooltip content={<CustomJapanTooltip />} />

            <Area
              type="monotone"
              dataKey="reservesBillions"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#reservesGradient)"
              name="Japan FX Reserves ($ Billions USD)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-indigo-500 inline-block"></span> Total Reserves Excl. Gold ($ Billions USD)
        </div>
        <div className="text-[11px] text-slate-500 hidden sm:block">
          💡 Sharp reserve drops (&gt; $10B/mo) indicate MoF selling USD reserves to buy Yen
        </div>
      </div>
    </div>
  );
}
