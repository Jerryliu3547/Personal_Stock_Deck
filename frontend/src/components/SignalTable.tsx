'use client';

import React from 'react';
import { SignalEvent } from '../lib/types';
import { ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface SignalTableProps {
  signals: SignalEvent[];
}

export const SignalTable: React.FC<SignalTableProps> = ({ signals }) => {
  if (!signals || signals.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-sm">
        No Buy/Sell signals triggered in the selected date range.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Historical Signal Triggers Log
          </h2>
          <p className="text-xs text-slate-400">
            Detected crossover events (Price &lt; Lower Band &amp; MACD &gt; Signal = BUY, Price &gt; Upper Band &amp; MACD &lt; Signal = SELL)
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
          {signals.length} Signals
        </span>
      </div>

      <div className="overflow-x-auto max-h-[320px]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="sticky top-0 bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Signal</th>
              <th className="py-2.5 px-3">Trigger Price</th>
              <th className="py-2.5 px-3">Lower Band</th>
              <th className="py-2.5 px-3">Upper Band</th>
              <th className="py-2.5 px-3">MACD Hist</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {signals.map((sig, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition">
                <td className="py-2.5 px-3 font-sans font-medium text-slate-200">{sig.date}</td>
                <td className="py-2.5 px-3">
                  {sig.type === 'BUY' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5" /> BUY
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold">
                      <ArrowDownRight className="w-3.5 h-3.5" /> SELL
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-white font-bold">${sig.price.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-slate-400">${sig.lowerBand?.toFixed(2) || 'N/A'}</td>
                <td className="py-2.5 px-3 text-slate-400">${sig.upperBand?.toFixed(2) || 'N/A'}</td>
                <td className={`py-2.5 px-3 font-semibold ${(sig.macdHist || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {sig.macdHist?.toFixed(4) || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
