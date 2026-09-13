import React, { useState, useMemo } from 'react';
import { Coins, TrendingDown, ArrowRight } from 'lucide-react';

export const CurrencyInflationTool: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [inflationRate, setInflationRate] = useState<number>(3.2);
  const [years, setYears] = useState<number>(10);

  const { futureEquivalent, purchasingPowerLoss, remainingPercentage } = useMemo(() => {
    const rate = inflationRate / 100;
    // How much you need in future to have same purchasing power: amount * (1 + rate)^years
    const needed = amount * Math.pow(1 + rate, years);
    // Real value of that same amount today: amount / (1 + rate)^years
    const realValue = amount / Math.pow(1 + rate, years);
    const loss = amount - realValue;
    const remainingPct = (realValue / amount) * 100;

    return {
      futureEquivalent: Math.round(needed),
      realValue: Math.round(realValue),
      purchasingPowerLoss: Math.round(loss),
      remainingPercentage: remainingPct.toFixed(1),
    };
  }, [amount, inflationRate, years]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
            Inflation Inputs
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Starting Cash Amount ($)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Average Inflation Rate:</span>
              <span className="text-emerald-700">{inflationRate}% per year</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.1"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Timeframe:</span>
              <span className="text-emerald-700">{years} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>

        <div className="lg:col-span-6 bg-gradient-to-br from-amber-50/60 to-rose-50/40 rounded-2xl border border-amber-200/80 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Future Cost of Current Goods
            </span>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 font-mono">
              ${futureEquivalent.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              What costs ${amount.toLocaleString()} today will require{' '}
              <strong className="text-amber-800">${futureEquivalent.toLocaleString()}</strong> in {years} years.
            </p>

            <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Uninvested Cash Value in {years} Yrs:</span>
                <span className="text-rose-600 font-mono font-bold">${(amount - purchasingPowerLoss).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Purchasing Power Lost:</span>
                <span className="text-rose-600 font-mono font-bold">-{remainingPercentage}% of value lost</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
