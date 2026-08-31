'use client';

import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Mega7CompanyQuote } from '@/lib/types';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';

interface DebtVsCashChartProps {
  companies: Mega7CompanyQuote[];
}

const CustomMega7Tooltip = ({ active, payload, label, mode }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-slate-950/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono space-y-1.5 min-w-[210px]">
        <div className="font-sans font-bold text-slate-200 border-b border-slate-800 pb-1 flex justify-between">
          <span>{d.name || label}</span>
          <span className="text-cyan-400 font-mono">{d.symbol || d.year}</span>
        </div>

        {d.cashReserves != null && (
          <div className="flex justify-between text-emerald-400 font-bold">
            <span>Cash Reserves:</span>
            <span>${d.cashReserves.toFixed(2)}B USD</span>
          </div>
        )}
        {d.totalDebt != null && (
          <div className="flex justify-between text-amber-400 font-bold">
            <span>Total Debt:</span>
            <span>${d.totalDebt.toFixed(2)}B USD</span>
          </div>
        )}
        {d.netCash != null && (
          <div className="flex justify-between text-cyan-300 pt-1 border-t border-slate-800">
            <span>Net Cash Position:</span>
            <span className={d.netCash >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {d.netCash >= 0 ? `+$${d.netCash.toFixed(2)}B` : `-$${Math.abs(d.netCash).toFixed(2)}B`}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function DebtVsCashChart({ companies }: DebtVsCashChartProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('ALL');

  if (!companies || companies.length === 0) return null;

  const selectedCompany = companies.find((c) => c.symbol === selectedSymbol);
  const trendHistory = selectedCompany ? selectedCompany.history : [];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            📊 Mega 7 Debt Issuance &amp; Cash Reserve Trends
          </h2>
          <p className="text-xs text-slate-400">
            {selectedSymbol === 'ALL'
              ? 'Comparative Cash Reserves vs Corporate Debt across all 7 Tech Giants'
              : `4-Year Debt Accumulation & Cash Reserves Trend for ${selectedCompany?.name} (${selectedSymbol})`}
          </p>
        </div>

        {/* Company Selector Dropdown / Buttons */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Select Focus:</label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">🌐 All Mega 7 Comparison</option>
            {companies.map((c) => (
              <option key={c.symbol} value={c.symbol}>
                {c.symbol} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[380px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {selectedSymbol === 'ALL' ? (
            <ComposedChart data={companies} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="symbol" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="B" />
              <Tooltip content={<CustomMega7Tooltip mode="all" />} />

              <Bar dataKey="cashReserves" name="Cash Reserves ($B)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
              <Bar dataKey="totalDebt" name="Total Debt ($B)" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={45} />
              <Line type="monotone" dataKey="netCash" name="Net Cash/Debt ($B)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
            </ComposedChart>
          ) : (
            <ComposedChart data={trendHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="B" />
              <Tooltip content={<CustomMega7Tooltip mode="single" />} />

              <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
              <Bar dataKey="cashReserves" name="Cash Reserves ($B)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
              <Bar dataKey="totalDebt" name="Total Debt ($B)" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={50} />
              <Line type="monotone" dataKey="netCash" name="Net Cash Trend" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 pt-3 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block"></span> Cash &amp; Short-Term Investments ($B)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-amber-500 rounded-sm inline-block"></span> Total Corporate Debt ($B)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span> Net Cash Position (Cash - Debt)
        </div>
      </div>
    </div>
  );
}
