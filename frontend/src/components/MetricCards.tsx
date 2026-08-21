'use client';

import React from 'react';
import { StockSummary } from '../lib/types';
import { TrendingUp, TrendingDown, Layers, BarChart2, Zap } from 'lucide-react';

interface MetricCardsProps {
  summary: StockSummary | null;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary }) => {
  if (!summary) return null;

  const isPositive = summary.priceChange >= 0;
  const bandWidth = summary.upperBand && summary.lowerBand 
    ? (summary.upperBand - summary.lowerBand).toFixed(2) 
    : 'N/A';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Latest Price & Daily Change */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-md backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Latest Price</span>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {summary.symbol}
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-white font-mono">
            ${summary.latestPrice?.toFixed(2)}
          </span>
          <span
            className={`text-xs font-semibold flex items-center gap-0.5 font-mono ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isPositive ? '+' : ''}
            {summary.priceChange} ({summary.percentChange}%)
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500">Total Samples: {summary.totalDataPoints} days</div>
      </div>

      {/* Card 2: Bollinger Bands & SMA */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-md backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Bollinger Bands (20D)
          </span>
          <span className="text-[11px] font-mono text-cyan-400 font-medium">Width: {bandWidth}</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <div className="text-slate-500 text-[10px]">UPPER BAND</div>
            <div className="text-emerald-400 font-semibold">${summary.upperBand?.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-slate-500 text-[10px]">LOWER BAND</div>
            <div className="text-rose-400 font-semibold">${summary.lowerBand?.toFixed(2)}</div>
          </div>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex justify-between border-t border-slate-800/80 pt-1.5">
          <span>20-Day SMA:</span>
          <span className="font-mono text-amber-400">${summary.latestSma?.toFixed(2)}</span>
        </div>
      </div>

      {/* Card 3: MACD Indicator */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-md backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-purple-400" /> MACD Indicator
          </span>
          <span className="text-[11px] font-mono text-slate-400">12, 26, 9</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <div className="text-slate-500 text-[10px]">MACD LINE</div>
            <div className="text-purple-400 font-semibold">{summary.macdLine?.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-slate-500 text-[10px]">SIGNAL LINE</div>
            <div className="text-slate-300 font-semibold">{summary.signalLine?.toFixed(4)}</div>
          </div>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex justify-between border-t border-slate-800/80 pt-1.5">
          <span>Histogram:</span>
          <span className={`font-mono font-semibold ${(summary.macdHist || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {summary.macdHist?.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Card 4: Signal Summary */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-md backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Indicator Signal
          </span>
          <span className="text-[10px] font-semibold text-slate-400">STATUS</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-xl text-sm font-extrabold font-mono tracking-wider shadow-md ${
              summary.latestSignal === 'BUY'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-emerald-500/20'
                : summary.latestSignal === 'SELL'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-rose-500/20'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            {summary.latestSignal}
          </div>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 flex justify-between border-t border-slate-800/80 pt-1.5 font-mono">
          <span className="text-emerald-400">Buy Signals: {summary.totalBuySignals}</span>
          <span className="text-rose-400">Sell Signals: {summary.totalSellSignals}</span>
        </div>
      </div>
    </div>
  );
};
