'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { StockControls } from '@/components/StockControls';
import { MetricCards } from '@/components/MetricCards';
import { PriceChart } from '@/components/PriceChart';
import { MacdChart } from '@/components/MacdChart';
import { SignalTable } from '@/components/SignalTable';
import { MacroDashboard } from '@/components/macro/MacroDashboard';
import { Mega7Dashboard } from '@/components/mega7/Mega7Dashboard';
import { fetchStockData, fetchMacroData } from '@/lib/api';
import { StockApiResponse, MacroApiResponse } from '@/lib/types';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<NavTab>('stocks');
  const [symbol, setSymbol] = useState<string>('GLD');
  const [startDate, setStartDate] = useState<string>('2022-01-01');
  const [stockData, setStockData] = useState<StockApiResponse | null>(null);
  const [macroSummaryData, setMacroSummaryData] = useState<MacroApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'loading'>('loading');

  const loadStockData = useCallback(async () => {
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

  // Fetch quick macro data for sidebar live tickers
  useEffect(() => {
    fetchMacroData('2024-01-01')
      .then((res) => setMacroSummaryData(res))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === 'stocks') {
      loadStockData();
    }
  }, [activeTab, loadStockData]);

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        apiStatus={apiStatus}
        us10yVal={macroSummaryData?.summary?.us10y?.value}
        cpiYoYVal={macroSummaryData?.summary?.cpiYoY?.value}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header apiStatus={apiStatus} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          {activeTab === 'stocks' ? (
            <div className="space-y-6">
              {/* Controls Bar */}
              <StockControls
                symbol={symbol}
                onSymbolChange={(newSym) => setSymbol(newSym)}
                startDate={startDate}
                onStartDateChange={(newDate) => setStartDate(newDate)}
                onRefresh={loadStockData}
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
                    onClick={loadStockData}
                    className="px-3 py-1.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-xs font-semibold border border-rose-700 transition flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry
                  </button>
                </div>
              )}

              {/* Loading Spinner */}
              {isLoading && !stockData && (
                <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
                  <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
                  <p className="text-sm font-medium">Downloading &amp; calculating MACD &amp; Bollinger Bands for {symbol}...</p>
                </div>
              )}

              {/* Stock Technicals Dashboard */}
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
            </div>
          ) : activeTab === 'macro' ? (
            /* Dedicated Global Bond & Macro Indicators View */
            <MacroDashboard />
          ) : (
            /* Dedicated Mega 7 Debt & Cash Reserve Tracker View */
            <Mega7Dashboard />
          )}
        </main>

        <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
          Personal Stock Deck • Decoupled Next.js Frontend + Python FastAPI Backend
        </footer>
      </div>
    </div>
  );
}
