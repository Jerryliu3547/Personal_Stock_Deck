'use client';

import React, { useState } from 'react';
import { Search, Calendar, RefreshCw } from 'lucide-react';

const POPULAR_STOCKS = [
  'GLD', 'AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'META', 'GOOGL', 'SPY', 'QQQ',
  'NFLX', 'BRK-B', 'V', 'JNJ', 'WMT', 'JPM', 'PG', 'MA', 'HD', 'CVX',
  'LLY', 'BAC', 'PFE', 'KO', 'PEP', 'COST', 'DIS', 'CSCO', 'SLV', 'ARKK'
];

interface StockControlsProps {
  symbol: string;
  onSymbolChange: (newSymbol: string) => void;
  startDate: string;
  onStartDateChange: (newDate: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const StockControls: React.FC<StockControlsProps> = ({
  symbol,
  onSymbolChange,
  startDate,
  onStartDateChange,
  onRefresh,
  isLoading,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSymbolChange(searchInput.trim().toUpperCase());
      setSearchInput('');
    }
  };

  const handleDatePreset = (months: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() - months);
    onStartDateChange(d.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Symbol Selection & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Stock / ETF</label>
            <select
              value={symbol}
              onChange={(e) => onSymbolChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            >
              {POPULAR_STOCKS.map((stk) => (
                <option key={stk} value={stk}>
                  {stk}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleCustomSubmit} className="flex-1 min-w-[220px]">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Or Custom Ticker</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. AMD, PLTR"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder:text-slate-600 uppercase"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </form>
        </div>

        {/* Date Selector & Preset Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div className="self-end flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleDatePreset(6)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-300 hover:bg-slate-800 transition"
            >
              6M
            </button>
            <button
              onClick={() => handleDatePreset(12)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-300 hover:bg-slate-800 transition"
            >
              1Y
            </button>
            <button
              onClick={() => handleDatePreset(24)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-300 hover:bg-slate-800 transition"
            >
              2Y
            </button>
            <button
              onClick={() => handleDatePreset(60)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-300 hover:bg-slate-800 transition"
            >
              5Y
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="self-end p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Select Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pt-2 text-xs border-t border-slate-800/80">
        <span className="text-slate-500 font-semibold uppercase text-[10px]">Popular:</span>
        {['GLD', 'AAPL', 'NVDA', 'TSLA', 'SPY', 'QQQ', 'BTC-USD'].map((ticker) => (
          <button
            key={ticker}
            onClick={() => onSymbolChange(ticker)}
            className={`px-2.5 py-1 rounded-lg font-mono transition ${
              symbol === ticker
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {ticker}
          </button>
        ))}
      </div>
    </div>
  );
};
