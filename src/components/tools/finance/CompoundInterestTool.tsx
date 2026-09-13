import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';

export const CompoundInterestTool: React.FC = () => {
  const [initialPrincipal, setInitialPrincipal] = useState<number>(10000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(500);
  const [interestRate, setInterestRate] = useState<number>(8);
  const [years, setYears] = useState<number>(15);
  const [frequency, setFrequency] = useState<number>(12); // 12=monthly, 1=annually

  const { futureValue, totalDeposits, totalInterest, yearlyData } = useMemo(() => {
    let balance = initialPrincipal;
    let totalInvested = initialPrincipal;
    const r = interestRate / 100;
    const data: { year: number; balance: number; deposits: number; interest: number }[] = [];

    for (let yr = 1; yr <= years; yr++) {
      for (let m = 1; m <= 12; m++) {
        balance += monthlyDeposit;
        totalInvested += monthlyDeposit;
        balance *= Math.pow(1 + r / frequency, frequency / 12);
      }
      data.push({
        year: yr,
        balance: Math.round(balance),
        deposits: Math.round(totalInvested),
        interest: Math.round(balance - totalInvested),
      });
    }

    return {
      futureValue: Math.round(balance),
      totalDeposits: Math.round(totalInvested),
      totalInterest: Math.round(balance - totalInvested),
      yearlyData: data,
    };
  }, [initialPrincipal, monthlyDeposit, interestRate, years, frequency]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-6 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
            Investment Parameters
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Starting Principal ($)
            </label>
            <input
              type="number"
              value={initialPrincipal}
              onChange={(e) => setInitialPrincipal(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Monthly Contribution ($)
            </label>
            <input
              type="number"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Estimated Return ({interestRate}%)
              </label>
              <input
                type="number"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Time Horizon ({years} Years)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={years}
                onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Compounding Interval
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
            >
              <option value={12}>Compounded Monthly (12x / yr)</option>
              <option value={4}>Compounded Quarterly (4x / yr)</option>
              <option value={1}>Compounded Annually (1x / yr)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 bg-gradient-to-br from-emerald-50/70 to-slate-50 rounded-2xl border border-emerald-200/80 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Projected Portfolio Balance
            </span>
            <div className="mt-2 text-4xl font-extrabold text-slate-900 font-mono">
              ${futureValue.toLocaleString()}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-600">Total Money Contributed</span>
                <span className="text-sm font-bold font-mono text-slate-800">${totalDeposits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-emerald-700">Total Compound Interest Earned</span>
                <span className="text-sm font-bold font-mono text-emerald-600">+${totalInterest.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="h-4 w-full rounded-full bg-slate-200 overflow-hidden flex">
                <div style={{ width: `${(totalDeposits / futureValue) * 100}%` }} className="bg-slate-700 h-full" title="Principal Deposits"></div>
                <div style={{ width: `${(totalInterest / futureValue) * 100}%` }} className="bg-emerald-500 h-full" title="Interest Earned"></div>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-2">
                <span>Principal Deposits ({Math.round((totalDeposits / futureValue) * 100)}%)</span>
                <span>Interest Growth ({Math.round((totalInterest / futureValue) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
