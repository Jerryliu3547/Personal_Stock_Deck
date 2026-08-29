'use client';

import React, { useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { FxHistoryPoint } from '@/lib/types';
import { TrendingUp, RefreshCw, DollarSign } from 'lucide-react';

interface FxTrendChartProps {
  data: FxHistoryPoint[];
}

type CurrencyPair = 'GBP/USD' | 'EUR/USD' | 'USD/JPY';

const CustomFxTooltip = ({ active, payload, label, selectedPair }: any) => {
  if (active && payload && payload.length) {
    const d: FxHistoryPoint = payload[0].payload;
    const val = payload[0].value;
    return (
      <div className="bg-slate-950/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono space-y-1.5 min-w-[200px]">
        <div className="font-sans font-bold text-slate-200 border-b border-slate-800 pb-1 flex justify-between">
          <span>{label}</span>
          <span className="text-cyan-400">{selectedPair}</span>
        </div>
        <div className="flex justify-between text-white font-bold">
          <span className="text-slate-400">Exchange Rate:</span>
          <span>{selectedPair === 'USD/JPY' ? val?.toFixed(2) : val?.toFixed(4)}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function FxTrendChart({ data }: FxTrendChartProps) {
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>('GBP/USD');

  if (!data || data.length === 0) return null;

  const dataKey = selectedPair === 'GBP/USD' ? 'gbpUsd' : selectedPair === 'EUR/USD' ? 'eurUsd' : 'usdJpy';
  const strokeColor = selectedPair === 'GBP/USD' ? '#10b981' : selectedPair === 'EUR/USD' ? '#3b82f6' : '#f59e0b';
  const gradientId = selectedPair === 'GBP/USD' ? 'gbpGradient' : selectedPair === 'EUR/USD' ? 'eurGradient' : 'jpyGradient';

  // Compute stats
  const validVals = data.map((d) => (d as any)[dataKey]).filter((v): v is number => v != null);
  const minVal = validVals.length ? Math.min(...validVals) : 0;
  const maxVal = validVals.length ? Math.max(...validVals) : 0;
  const latestVal = validVals.length ? validVals[validVals.length - 1] : 0;
  const firstVal = validVals.length ? validVals[0] : latestVal;
  const totalChange = latestVal - firstVal;
  const totalPctChange = firstVal ? (totalChange / firstVal) * 100 : 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            📈 Foreign Exchange (FX) Trend Research
          </h2>
          <p className="text-xs text-slate-400">3-Month Historical Exchange Rate Trend Analytics for Key Global Currencies</p>
        </div>

        {/* Currency Pair Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedPair('GBP/USD')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              selectedPair === 'GBP/USD'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇬🇧 GBP/USD
          </button>

          <button
            onClick={() => setSelectedPair('EUR/USD')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              selectedPair === 'EUR/USD'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇪🇺 EUR/USD
          </button>

          <button
            onClick={() => setSelectedPair('USD/JPY')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              selectedPair === 'USD/JPY'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇯🇵 USD/JPY
          </button>
        </div>
      </div>

      {/* FX Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs font-mono">
        <div>
          <span className="text-slate-500 block text-[10px]">CURRENT RATE</span>
          <span className="font-bold text-slate-100 text-sm">
            {selectedPair === 'USD/JPY' ? latestVal.toFixed(2) : latestVal.toFixed(4)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">3-MONTH RANGE</span>
          <span className="font-semibold text-slate-300">
            {selectedPair === 'USD/JPY' ? `${minVal.toFixed(2)} - ${maxVal.toFixed(2)}` : `${minVal.toFixed(4)} - ${maxVal.toFixed(4)}`}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">3-MONTH CHANGE</span>
          <span className={`font-semibold ${totalChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalChange >= 0 ? `+${totalChange.toFixed(4)}` : totalChange.toFixed(4)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">3-MONTH TREND %</span>
          <span className={`font-bold ${totalPctChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPctChange >= 0 ? `+${totalPctChange.toFixed(2)}%` : `${totalPctChange.toFixed(2)}%`}
          </span>
        </div>
      </div>

      {/* Recharts Chart */}
      <div className="h-[340px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gbpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="eurGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="jpyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} minTickGap={45} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip content={<CustomFxTooltip selectedPair={selectedPair} />} />

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={strokeColor}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              name={selectedPair}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
