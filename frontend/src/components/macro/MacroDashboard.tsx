'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchMacroData } from '@/lib/api';
import { MacroApiResponse } from '@/lib/types';
import { YieldMonitorCards } from './YieldMonitorCards';
import { YieldTrendChart } from './YieldTrendChart';
import { InflationChart } from './InflationChart';
import { GlobalBondMatrix } from './GlobalBondMatrix';
import { InternationalMacroWindow } from './InternationalMacroWindow';
import { FxTrendChart } from './FxTrendChart';
import { JapanReservesChart } from './JapanReservesChart';
import { RefreshCw, Calendar, Globe, AlertCircle } from 'lucide-react';

export function MacroDashboard() {
  const [startDate, setStartDate] = useState<string>('2022-01-01');
  const [macroData, setMacroData] = useState<MacroApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMacroData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchMacroData(startDate);
      setMacroData(data);
    } catch (err: any) {
      console.error('Failed to load macro analytics:', err);
      setError(err.message || 'Failed to load macro analytics data.');
    } finally {
      setIsLoading(false);
    }
  }, [startDate]);

  useEffect(() => {
    loadMacroData();
  }, [loadMacroData]);

  return (
    <div className="space-y-6">
      {/* Controls Bar for Macro Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            🌐 Global Bond &amp; Macro Indicators Hub
          </h2>
          <p className="text-xs text-slate-400">Continuous 10Y/30Y yield monitoring, CPI inflation analytics, International FX &amp; Japan Reserves</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400 font-medium">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-slate-200 font-mono focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={loadMacroData}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-950/60 border border-rose-800/80 rounded-2xl p-4 flex items-start gap-3 text-rose-200 shadow-xl backdrop-blur-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <span className="font-bold">Error fetching macro indicators:</span> {error}
            <div className="mt-1 text-xs text-rose-300">
              Ensure the Python FastAPI backend (`backend/main.py`) is running.
            </div>
          </div>
          <button
            onClick={loadMacroData}
            className="px-3 py-1.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-xs font-semibold border border-rose-700 transition flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && !macroData && (
        <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-sm font-medium">Fetching 10Y/30Y Yields, CPI, FX &amp; Japan FX Reserves...</p>
        </div>
      )}

      {/* Macro Data Layout */}
      {macroData && (
        <div className="space-y-6">
          {/* Top KPI Metric Cards (US Focus) */}
          <YieldMonitorCards summary={macroData.summary} />

          {/* Treasury 10Y & 30Y Yield Trend Chart */}
          <YieldTrendChart data={macroData.yieldHistory} />

          {/* Compact International Sovereign Yield & FX Window (UK, Germany, France, Japan) */}
          <InternationalMacroWindow countries={macroData.internationalMacro} />

          {/* Interactive Foreign Exchange Rate Trend Research */}
          <FxTrendChart data={macroData.fxHistory} />

          {/* Japan Foreign Exchange (FX) Reserves & Intervention Monitor */}
          <JapanReservesChart data={macroData.japanReservesHistory} summary={macroData.summary} />

          {/* CPI & Inflation Analytics Chart */}
          <InflationChart data={macroData.inflationHistory} />

          {/* Sovereign Bond ETF Matrix & Risk Gauges */}
          <GlobalBondMatrix bonds={macroData.globalBonds} summary={macroData.summary} />
        </div>
      )}
    </div>
  );
}
