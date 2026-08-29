'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchMega7Data } from '@/lib/api';
import { Mega7ApiResponse } from '@/lib/types';
import { Mega7MetricCards } from './Mega7MetricCards';
import { DebtVsCashChart } from './DebtVsCashChart';
import { Mega7MatrixTable } from './Mega7MatrixTable';
import { RefreshCw, Landmark, AlertCircle } from 'lucide-react';

export function Mega7Dashboard() {
  const [mega7Data, setMega7Data] = useState<Mega7ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchMega7Data();
      setMega7Data(data);
    } catch (err: any) {
      console.error('Failed to load Mega7 analytics:', err);
      setError(err.message || 'Failed to load Mega7 debt and cash reserves data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-6">
      {/* Controls Bar for Mega 7 Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            🏦 Mega 7 Corporate Debt &amp; Cash Reserve Tracker
          </h2>
          <p className="text-xs text-slate-400">
            Dedicated debt issuance, cash reserves, net liquidity, and FCF tracking for AAPL, MSFT, GOOGL, AMZN, NVDA, META, and TSLA
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 w-full sm:w-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Financials
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-950/60 border border-rose-800/80 rounded-2xl p-4 flex items-start gap-3 text-rose-200 shadow-xl backdrop-blur-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <span className="font-bold">Error fetching Mega 7 data:</span> {error}
            <div className="mt-1 text-xs text-rose-300">
              Ensure the Python FastAPI backend server is running.
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

      {/* Loading Skeleton */}
      {isLoading && !mega7Data && (
        <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
          <p className="text-sm font-medium">Extracting annual balance sheets &amp; debt trends for Mega 7 tech giants...</p>
        </div>
      )}

      {/* Mega 7 Content */}
      {mega7Data && (
        <div className="space-y-6">
          {/* KPI Metric Cards */}
          <Mega7MetricCards summary={mega7Data.summary} />

          {/* Interactive Debt vs Cash Breakdown & 4-Year Trend Chart */}
          <DebtVsCashChart companies={mega7Data.companies} />

          {/* Side-by-Side Financial Matrix Table */}
          <Mega7MatrixTable companies={mega7Data.companies} />
        </div>
      )}
    </div>
  );
}
