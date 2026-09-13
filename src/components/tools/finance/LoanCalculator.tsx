import React, { useState, useMemo } from 'react';
import { DollarSign, PieChart, Calendar, ChevronDown } from 'lucide-react';

export const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  const { monthlyEmi, totalPayment, totalInterest, amortization } = useMemo(() => {
    const P = Math.max(0, loanAmount);
    const annualRate = Math.max(0.001, interestRate) / 100;
    const r = annualRate / 12;
    const n = Math.max(1, loanTermYears) * 12;

    // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    const factor = Math.pow(1 + r, n);
    const emi = (P * r * factor) / (factor - 1);
    const totalPay = emi * n;
    const totalInt = totalPay - P;

    // Amortization schedule by year
    const schedule: { year: number; interestPaid: number; principalPaid: number; balance: number }[] = [];
    let balance = P;

    for (let yr = 1; yr <= loanTermYears; yr++) {
      let yrInterest = 0;
      let yrPrincipal = 0;
      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const interestM = balance * r;
        const principalM = emi - interestM;
        yrInterest += interestM;
        yrPrincipal += principalM;
        balance -= principalM;
      }
      schedule.push({
        year: yr,
        interestPaid: Math.round(yrInterest),
        principalPaid: Math.round(yrPrincipal),
        balance: Math.max(0, Math.round(balance)),
      });
    }

    return {
      monthlyEmi: Math.round(emi),
      totalPayment: Math.round(totalPay),
      totalInterest: Math.round(totalInt),
      amortization: schedule,
    };
  }, [loanAmount, interestRate, loanTermYears]);

  const principalRatio = Math.round((loanAmount / (totalPayment || 1)) * 100);
  const interestRatio = 100 - principalRatio;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {/* Controls & Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Loan Parameters</h3>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {['$', '€', '£', '₹'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrencySymbol(curr)}
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    currencySymbol === curr ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Loan Amount:</span>
              <span className="text-sm text-emerald-700 font-mono">
                {currencySymbol}{loanAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="2000000"
              step="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-slate-400 text-sm font-semibold">{currencySymbol}</span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Annual Interest Rate:</span>
              <span className="text-sm text-emerald-700 font-mono">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="25"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0.1, Number(e.target.value)))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800"
              />
              <span className="text-slate-400 text-sm font-semibold">%</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Loan Tenure (Years):</span>
              <span className="text-sm text-emerald-700 font-mono">{loanTermYears} Years ({loanTermYears * 12} Mos)</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={loanTermYears}
              onChange={(e) => setLoanTermYears(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex gap-2 mt-2">
              {[5, 15, 20, 30].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setLoanTermYears(yr)}
                  className={`flex-1 py-1 text-xs font-semibold rounded border transition-colors ${
                    loanTermYears === yr
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {yr} Yrs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-gradient-to-br from-emerald-50/50 via-slate-50 to-teal-50/50 rounded-2xl border border-emerald-200/70 p-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Monthly Equated Installment (EMI)
            </span>
            <div className="mt-2 text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
              {currencySymbol}{monthlyEmi.toLocaleString()}
              <span className="text-sm font-medium text-slate-500 font-sans"> / month</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Total Interest</span>
                <p className="text-lg font-bold text-rose-600 font-mono mt-1">
                  {currencySymbol}{totalInterest.toLocaleString()}
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Total Payment</span>
                <p className="text-lg font-bold text-slate-900 font-mono mt-1">
                  {currencySymbol}{totalPayment.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Proportion Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                <span>Principal: {principalRatio}%</span>
                <span>Interest: {interestRatio}%</span>
              </div>
              <div className="h-3.5 w-full rounded-full bg-slate-200 overflow-hidden flex">
                <div style={{ width: `${principalRatio}%` }} className="bg-emerald-500 h-full"></div>
                <div style={{ width: `${interestRatio}%` }} className="bg-rose-500 h-full"></div>
              </div>
              <div className="flex items-center justify-center gap-6 mt-3 text-[11px] font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Principal ({currencySymbol}{loanAmount.toLocaleString()})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Total Interest ({currencySymbol}{totalInterest.toLocaleString()})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Table */}
      <div className="mt-10 pt-6 border-t border-slate-200">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          Annual Amortization Schedule
        </h4>
        <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Principal Paid</th>
                <th className="py-3 px-4">Interest Paid</th>
                <th className="py-3 px-4">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {amortization.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-800">Year {row.year}</td>
                  <td className="py-2.5 px-4 text-emerald-600">{currencySymbol}{row.principalPaid.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-rose-600">{currencySymbol}{row.interestPaid.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-slate-800">{currencySymbol}{row.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
