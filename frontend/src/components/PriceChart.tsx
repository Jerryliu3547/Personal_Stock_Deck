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
  Scatter,
} from 'recharts';
import { ChartDataPoint } from '../lib/types';
import { Eye, EyeOff } from 'lucide-react';

interface PriceChartProps {
  data: ChartDataPoint[];
  symbol: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d: ChartDataPoint = payload[0].payload;
    return (
      <div className="bg-slate-950/90 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono space-y-1.5 min-w-[200px]">
        <div className="font-sans font-bold text-slate-200 border-b border-slate-800 pb-1 flex justify-between">
          <span>{label}</span>
          {d.signal !== 'HOLD' && (
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                d.signal === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {d.signal}
            </span>
          )}
        </div>
        <div className="flex justify-between text-white font-bold">
          <span className="text-slate-400">Price:</span>
          <span>${d.price?.toFixed(2)}</span>
        </div>
        {d.sma && (
          <div className="flex justify-between text-amber-400">
            <span>20-Day SMA:</span>
            <span>${d.sma.toFixed(2)}</span>
          </div>
        )}
        {d.upperBand && (
          <div className="flex justify-between text-emerald-400">
            <span>Upper Band:</span>
            <span>${d.upperBand.toFixed(2)}</span>
          </div>
        )}
        {d.lowerBand && (
          <div className="flex justify-between text-rose-400">
            <span>Lower Band:</span>
            <span>${d.lowerBand.toFixed(2)}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Custom shape for Buy markers
const BuyShape = (props: any) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;
  return (
    <g transform={`translate(${cx - 7},${cy - 7})`}>
      <polygon points="7,0 14,14 0,14" fill="#10b981" stroke="#047857" strokeWidth="1" />
    </g>
  );
};

// Custom shape for Sell markers
const SellShape = (props: any) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;
  return (
    <g transform={`translate(${cx - 7},${cy - 7})`}>
      <polygon points="0,0 14,0 7,14" fill="#f43f5e" stroke="#be123c" strokeWidth="1" />
    </g>
  );
};

export const PriceChart: React.FC<PriceChartProps> = ({ data, symbol }) => {
  const [showBands, setShowBands] = useState(true);
  const [showSma, setShowSma] = useState(true);
  const [showSignals, setShowSignals] = useState(true);

  if (!data || data.length === 0) return null;

  // Min and Max for Y Axis scaling
  const prices = data.map((d) => d.price).filter((p) => p !== null);
  const uppers = data.map((d) => d.upperBand).filter((b): b is number => b !== null);
  const lowers = data.map((d) => d.lowerBand).filter((b): b is number => b !== null);

  const minVal = Math.floor(Math.min(...prices, ...(lowers.length ? lowers : [])) * 0.98);
  const maxVal = Math.ceil(Math.max(...prices, ...(uppers.length ? uppers : [])) * 1.02);

  // Prepare scatter data for buy/sell dots
  const buyData = data.filter((d) => d.signal === 'BUY').map((d) => ({ date: d.date, buyPrice: d.buyPrice }));
  const sellData = data.filter((d) => d.signal === 'SELL').map((d) => ({ date: d.date, sellPrice: d.sellPrice }));

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            📈 {symbol} Price & Bollinger Bands
          </h2>
          <p className="text-xs text-slate-400">Interactive Price Chart with 20-Day SMA & Volatility Envelope</p>
        </div>

        {/* Indicator Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowBands(!showBands)}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition ${
              showBands
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-950 text-slate-500 border-slate-800 line-through'
            }`}
          >
            {showBands ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Bollinger Bands
          </button>

          <button
            onClick={() => setShowSma(!showSma)}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition ${
              showSma
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-950 text-slate-500 border-slate-800 line-through'
            }`}
          >
            {showSma ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} 20D SMA
          </button>

          <button
            onClick={() => setShowSignals(!showSignals)}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition ${
              showSignals
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-950 text-slate-500 border-slate-800 line-through'
            }`}
          >
            {showSignals ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Buy/Sell Markers
          </button>
        </div>
      </div>

      <div className="h-[420px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} minTickGap={40} />
            <YAxis stroke="#64748b" domain={[minVal, maxVal]} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />

            {/* Bollinger Bands Shaded Area */}
            {showBands && (
              <>
                <Line
                  type="monotone"
                  dataKey="upperBand"
                  stroke="#10b981"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Upper Band"
                />
                <Line
                  type="monotone"
                  dataKey="lowerBand"
                  stroke="#f43f5e"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Lower Band"
                />
              </>
            )}

            {/* 20-Day SMA */}
            {showSma && (
              <Line
                type="monotone"
                dataKey="sma"
                stroke="#f59e0b"
                strokeWidth={1.5}
                dot={false}
                name="20-Day SMA"
              />
            )}

            {/* Close Price Line */}
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#priceGradient)"
              name="Price"
            />

            {/* Buy Signals Scatter */}
            {showSignals && (
              <Scatter dataKey="buyPrice" data={buyData} shape={<BuyShape />} name="Buy Signal" />
            )}

            {/* Sell Signals Scatter */}
            {showSignals && (
              <Scatter dataKey="sellPrice" data={sellData} shape={<SellShape />} name="Sell Signal" />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-blue-500 inline-block"></span> Price
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-amber-500 inline-block"></span> 20D SMA
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-emerald-500 border-b border-dashed border-emerald-500 inline-block"></span> Upper Band
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-rose-500 border-b border-dashed border-rose-500 inline-block"></span> Lower Band
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-emerald-500 rotate-45 inline-block"></span> Buy Signal (▲)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-rose-500 rotate-45 inline-block"></span> Sell Signal (▼)
        </div>
      </div>
    </div>
  );
};
