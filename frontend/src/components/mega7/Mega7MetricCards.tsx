'use client';

import React from 'react';
import { Mega7Summary } from '@/lib/types';
import { Landmark, DollarSign, Wallet, ShieldCheck, TrendingUp, Award } from 'lucide-react';

interface Mega7MetricCardsProps {
  summary: Mega7Summary;
}

export function Mega7MetricCards({ summary }: Mega7MetricCardsProps) {
  const {
    totalCashReserves,
    totalCorporateDebt,
    netLiquidity,
    totalFreeCashFlow,
    topCashLeader,
    topDebtLeader,
  } = summary;

  const isNetCashPositive = netLiquidity >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Combined Cash Reserves */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-emerald-500/40 transition-all backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mega 7 Cash Reserves</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono text-emerald-300">
            ${totalCashReserves.toFixed(1)}B
          </span>
          <span className="text-xs font-mono text-slate-400">USD</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 font-mono">
          Top Cash Leader: <span className="text-emerald-400 font-bold">{topCashLeader.symbol} (${topCashLeader.value.toFixed(1)}B)</span>
        </div>
      </div>

      {/* 2. Total Corporate Debt */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-amber-500/40 transition-all backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Corporate Debt</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono text-amber-300">
            ${totalCorporateDebt.toFixed(1)}B
          </span>
          <span className="text-xs font-mono text-slate-400">USD</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 font-mono">
          Top Debt Issuer: <span className="text-amber-400 font-bold">{topDebtLeader.symbol} (${topDebtLeader.value.toFixed(1)}B)</span>
        </div>
      </div>

      {/* 3. Aggregate Net Liquidity Position */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-cyan-500/40 transition-all backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Net Liquidity Position</span>
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl font-bold font-mono ${isNetCashPositive ? 'text-cyan-300' : 'text-rose-400'}`}>
            {isNetCashPositive ? `+$${netLiquidity.toFixed(1)}B` : `-$${Math.abs(netLiquidity).toFixed(1)}B`}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
            {isNetCashPositive ? 'CASH SURPLUS' : 'NET DEBT'}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 font-mono">
          Cash minus Total Corporate Debt
        </div>
      </div>

      {/* 4. Combined Free Cash Flow */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-indigo-500/40 transition-all backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Annual Free Cash Flow</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono text-indigo-300">
            ${totalFreeCashFlow.toFixed(1)}B
          </span>
          <span className="text-xs font-mono text-slate-400">USD / Yr</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 font-mono">
          Annual FCF Generation across Mega 7
        </div>
      </div>
    </div>
  );
}
