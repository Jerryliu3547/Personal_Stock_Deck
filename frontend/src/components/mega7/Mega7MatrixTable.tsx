'use client';

import React from 'react';
import { Mega7CompanyQuote } from '@/lib/types';
import { Landmark, Wallet, ShieldCheck, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

interface Mega7MatrixTableProps {
  companies: Mega7CompanyQuote[];
}

export function Mega7MatrixTable({ companies }: Mega7MatrixTableProps) {
  if (!companies || companies.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            🏛️ Mega 7 Financial Matrix &amp; Liquidity Ratios
          </h2>
          <p className="text-xs text-slate-400">
            Comparative balance sheet analysis, cash reserves, total debt, net position, and annual FCF
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold hidden sm:inline">
          7 Tech Giants
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800/80">
              <th className="pb-3 font-semibold">Company / Ticker</th>
              <th className="pb-3 font-semibold">Sector</th>
              <th className="pb-3 font-semibold text-right">Cash Reserves ($B)</th>
              <th className="pb-3 font-semibold text-right">Total Debt ($B)</th>
              <th className="pb-3 font-semibold text-right">Net Cash / Debt ($B)</th>
              <th className="pb-3 font-semibold text-right">Free Cash Flow ($B)</th>
              <th className="pb-3 font-semibold text-right">Liquidity Ratio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {companies.map((c) => {
              const isNetCashPositive = c.netCash >= 0;
              return (
                <tr key={c.symbol} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 font-bold text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700">
                        {c.symbol}
                      </span>
                      <span className="font-sans font-medium text-slate-300 hidden sm:inline">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-400 font-sans text-[11px]">{c.sector}</td>
                  <td className="py-3 text-right font-bold text-emerald-400">${c.cashReserves.toFixed(2)}B</td>
                  <td className="py-3 text-right font-bold text-amber-400">${c.totalDebt.toFixed(2)}B</td>
                  <td className="py-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        isNetCashPositive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {isNetCashPositive ? `+$${c.netCash.toFixed(2)}B` : `-$${Math.abs(c.netCash).toFixed(2)}B`}
                    </span>
                  </td>
                  <td className="py-3 text-right font-bold text-indigo-300">${c.freeCashFlow.toFixed(2)}B</td>
                  <td className="py-3 text-right font-bold text-slate-200">
                    {c.liquidityRatio >= 1.0 ? (
                      <span className="text-emerald-400">{c.liquidityRatio.toFixed(2)}x</span>
                    ) : (
                      <span className="text-amber-400">{c.liquidityRatio.toFixed(2)}x</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
