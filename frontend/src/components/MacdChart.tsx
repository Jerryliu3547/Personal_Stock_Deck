'use client';

import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import { ChartDataPoint } from '../lib/types';

interface MacdChartProps {
  data: ChartDataPoint[];
}

const MacdCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d: ChartDataPoint = payload[0].payload;
    return (
      <div className="bg-slate-950/90 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono space-y-1 min-w-[180px]">
        <div className="font-sans font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</div>
        <div className="flex justify-between text-purple-400">
          <span>MACD Line:</span>
          <span>{d.macdLine?.toFixed(4)}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Signal Line:</span>
          <span>{d.signalLine?.toFixed(4)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Histogram:</span>
          <span className={(d.macdHist || 0) >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {d.macdHist?.toFixed(4)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const MacdChart: React.FC<MacdChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            📊 MACD Indicator & Histogram
          </h2>
          <p className="text-xs text-slate-400">Moving Average Convergence Divergence (12, 26, 9)</p>
        </div>
      </div>

      <div className="h-[250px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} minTickGap={40} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip content={<MacdCustomTooltip />} />
            <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />

            {/* Histogram Bars */}
            <Bar dataKey="macdHist" name="MACD Histogram">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={(entry.macdHist || 0) >= 0 ? '#10b981' : '#f43f5e'}
                  fillOpacity={0.7}
                />
              ))}
            </Bar>

            {/* MACD Line */}
            <Line
              type="monotone"
              dataKey="macdLine"
              stroke="#a855f7"
              strokeWidth={1.8}
              dot={false}
              name="MACD Line"
            />

            {/* Signal Line */}
            <Line
              type="monotone"
              dataKey="signalLine"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
              name="Signal Line"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-purple-500 inline-block"></span> MACD Line (12/26 EMA)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-slate-400 border-b border-dashed border-slate-400 inline-block"></span> Signal Line (9 EMA)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block"></span> Positive Hist
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm inline-block"></span> Negative Hist
        </div>
      </div>
    </div>
  );
};
