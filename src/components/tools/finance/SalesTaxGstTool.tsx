import React, { useState, useMemo } from 'react';
import { Receipt, Percent } from 'lucide-react';

export const SalesTaxGstTool: React.FC = () => {
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [amount, setAmount] = useState<number>(100);
  const [taxRate, setTaxRate] = useState<number>(10);

  const { netAmount, taxAmount, grossAmount } = useMemo(() => {
    const rate = taxRate / 100;
    if (mode === 'exclusive') {
      // Net -> Gross
      const net = amount;
      const tax = net * rate;
      const gross = net + tax;
      return { netAmount: net, taxAmount: tax, grossAmount: gross };
    } else {
      // Gross -> Net
      const gross = amount;
      const net = gross / (1 + rate);
      const tax = gross - net;
      return { netAmount: net, taxAmount: tax, grossAmount: gross };
    }
  }, [mode, amount, taxRate]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      <div className="flex bg-slate-100 p-1.5 rounded-xl max-w-md mx-auto mb-6">
        <button
          onClick={() => setMode('exclusive')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            mode === 'exclusive' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Add Tax (Net → Gross)
        </button>
        <button
          onClick={() => setMode('inclusive')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            mode === 'inclusive' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Remove Tax (Gross → Net)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {mode === 'exclusive' ? 'Net Price (Before Tax)' : 'Gross Price (Total with Tax)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tax / GST / VAT Rate (%)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.5"
                value={taxRate}
                onChange={(e) => setTaxRate(Math.max(0, Number(e.target.value)))}
                className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
              />
            </div>
            {/* Quick Presets */}
            <div className="flex gap-1.5 mt-2">
              {[5, 7, 10, 15, 18, 20].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setTaxRate(rate)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md border transition-colors ${
                    taxRate === rate
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Tax Breakdown
            </span>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-600">Net Amount:</span>
                <span className="text-sm font-bold font-mono text-slate-800">${netAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-emerald-700">Tax Amount ({taxRate}%):</span>
                <span className="text-sm font-bold font-mono text-emerald-600">+${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-600 text-white rounded-xl shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Total:</span>
                <span className="text-base font-extrabold font-mono">${grossAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
