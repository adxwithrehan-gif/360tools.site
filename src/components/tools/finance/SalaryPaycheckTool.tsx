import React, { useState, useMemo } from 'react';
import { Banknote, PieChart } from 'lucide-react';

export const SalaryPaycheckTool: React.FC = () => {
  const [grossSalary, setGrossSalary] = useState<number>(75000);
  const [payPeriod, setPayPeriod] = useState<'annual' | 'monthly' | 'hourly'>('annual');
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [taxRate, setTaxRate] = useState<number>(22); // combined fed & state
  const [retirementPercent, setRetirementPercent] = useState<number>(5);
  const [healthInsuranceMonthly, setHealthInsuranceMonthly] = useState<number>(150);

  const calculations = useMemo(() => {
    let annualGross = grossSalary;
    if (payPeriod === 'monthly') annualGross = grossSalary * 12;
    if (payPeriod === 'hourly') annualGross = grossSalary * hoursPerWeek * 52;

    const annualTax = annualGross * (taxRate / 100);
    const annualFica = annualGross * 0.0765; // Social Security (6.2%) + Medicare (1.45%)
    const annualRetirement = annualGross * (retirementPercent / 100);
    const annualHealth = healthInsuranceMonthly * 12;

    const totalDeductions = annualTax + annualFica + annualRetirement + annualHealth;
    const netAnnual = Math.max(0, annualGross - totalDeductions);

    return {
      annualGross,
      netAnnual: Math.round(netAnnual),
      netMonthly: Math.round(netAnnual / 12),
      netBiWeekly: Math.round(netAnnual / 26),
      netHourly: (netAnnual / (hoursPerWeek * 52)).toFixed(2),
      taxDeduction: Math.round(annualTax),
      ficaDeduction: Math.round(annualFica),
      retirementDeduction: Math.round(annualRetirement),
      healthDeduction: Math.round(annualHealth),
    };
  }, [grossSalary, payPeriod, hoursPerWeek, taxRate, retirementPercent, healthInsuranceMonthly]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
            Earnings & Deductions
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {(['annual', 'monthly', 'hourly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPayPeriod(p)}
                className={`py-1.5 text-xs font-bold rounded-lg border capitalize transition-colors ${
                  payPeriod === p ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Gross Pay ({payPeriod})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Income Tax Est. ({taxRate}%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                401(k) / Pension ({retirementPercent}%)
              </label>
              <input
                type="number"
                value={retirementPercent}
                onChange={(e) => setRetirementPercent(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-teal-50/50 rounded-2xl border border-emerald-200/80 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Estimated Take-Home Pay
            </span>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 font-mono">
              ${calculations.netMonthly.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 font-sans"> / month</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Bi-Weekly</span>
                <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">${calculations.netBiWeekly.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Hourly Net</span>
                <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">${calculations.netHourly}</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Annual Net</span>
                <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">${calculations.netAnnual.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Federal & State Income Tax:</span>
                <span className="font-mono text-rose-600">-${calculations.taxDeduction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>FICA (Social Security & Medicare):</span>
                <span className="font-mono text-rose-600">-${calculations.ficaDeduction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Retirement Contribution:</span>
                <span className="font-mono text-slate-700">-${calculations.retirementDeduction.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
