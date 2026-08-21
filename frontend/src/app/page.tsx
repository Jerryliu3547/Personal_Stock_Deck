'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { StockControls } from '@/components/StockControls';
import { MetricCards } from '@/components/MetricCards';
import { PriceChart } from '@/components/PriceChart';
import { MacdChart } from '@/components/MacdChart';
import { SignalTable } from '@/components/SignalTable';
import { fetchStockData } from '@/lib/api';
import { StockApiResponse } from '@/lib/types';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [symbol, setSymbol] = useState<string>('GLD');
  const [startDate, setStartDate] = useState<string>('2022-01-01');
  const [stockData, setStockData] = useState<StockApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'loading'>('loading');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchStockData(symbol, startDate);
      setStockData(data);
      setApiStatus('online');
    } catch (err: any) {
      console.error('Failed to load stock data:', err);
      setError(err.message || 'Failed to load stock analytics data.');
      setApiStatus('offline');
    } finally {
      setIsLoading(false);
    }
  }, [symbol, startDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header apiStatus={apiStatus} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Controls Bar */}
        <StockControls
          symbol={symbol}
          onSymbolChange={(newSym) => setSymbol(newSym)}
          startDate={startDate}
          onStartDateChange={(newDate) => setStartDate(newDate)}
          onRefresh={loadData}
          isLoading={isLoading}
        />

        {/* Error Banner */}
        {error && (
          <div className="bg-rose-950/60 border border-rose-800/80 rounded-2xl p-4 flex items-start gap-3 text-rose-200 shadow-xl backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <span className="font-bold">Error fetching data for &quot;{symbol}&quot;:</span> {error}
              <div className="mt-1 text-xs text-rose-300">
                Please make sure the Python FastAPI backend server is running and accessible (check NEXT_PUBLIC_API_URL or CORS settings).
              </div>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-xs font-semibold border border-rose-700 transition flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && !stockData && (
          <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-sm font-medium">Downloading &amp; calculating indicators for {symbol}...</p>
          </div>
        )}

        {/* Dashboard Content */}
        {stockData && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <MetricCards summary={stockData.summary} />

            {/* Price Chart with Bollinger Bands & Signals */}
            <PriceChart data={stockData.chartData} symbol={stockData.summary.symbol} />

            {/* MACD Indicator Chart */}
            <MacdChart data={stockData.chartData} />

            {/* Signal Log Table */}
            <SignalTable signals={stockData.signalsLog} />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        Personal Stock Deck • Decoupled Next.js Frontend + Python FastAPI Backend
      </footer>
    </div>
  );
}
