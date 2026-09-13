import React, { useState } from 'react';
import { Percent, Tag } from 'lucide-react';

export const PercentageCalculator: React.FC = () => {
  // Mode 1: What is P% of X?
  const [p1, setP1] = useState<number>(20);
  const [x1, setX1] = useState<number>(150);

  // Mode 2: X is what % of Y?
  const [x2, setX2] = useState<number>(35);
  const [y2, setY2] = useState<number>(140);

  // Mode 3: % Increase/Decrease from A to B
  const [a3, setA3] = useState<number>(80);
  const [b3, setB3] = useState<number>(120);

  // Mode 4: Retail Discount
  const [origPrice, setOrigPrice] = useState<number>(89.99);
  const [discountPercent, setDiscountPercent] = useState<number>(25);

  const res1 = ((p1 / 100) * x1).toFixed(2);
  const res2 = y2 !== 0 ? (((x2 / y2) * 100).toFixed(2)) : '0';
  const changePct = a3 !== 0 ? (((b3 - a3) / a3) * 100).toFixed(2) : '0';
  const discountSavings = ((origPrice * discountPercent) / 100).toFixed(2);
  const finalPrice = (origPrice - parseFloat(discountSavings)).toFixed(2);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-8">
      {/* 1. What is P% of X */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
          1. Calculate Percentage of a Number
        </h4>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-medium text-slate-600">What is</span>
          <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-lg border border-slate-300">
            <input
              type="number"
              value={p1}
              onChange={(e) => setP1(Number(e.target.value))}
              className="w-16 font-bold text-center focus:outline-hidden"
            />
            <span className="text-slate-400 font-bold">%</span>
          </div>
          <span className="font-medium text-slate-600">of</span>
          <input
            type="number"
            value={x1}
            onChange={(e) => setX1(Number(e.target.value))}
            className="w-24 px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-center"
          />
          <span className="font-bold text-slate-400">=</span>
          <span className="px-4 py-1.5 bg-blue-600 text-white font-mono font-extrabold rounded-lg text-base">
            {res1}
          </span>
        </div>
      </div>

      {/* 2. X is what % of Y */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
          2. Find Percentage Ratio
        </h4>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <input
            type="number"
            value={x2}
            onChange={(e) => setX2(Number(e.target.value))}
            className="w-20 px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-center"
          />
          <span className="font-medium text-slate-600">is what % of</span>
          <input
            type="number"
            value={y2}
            onChange={(e) => setY2(Number(e.target.value))}
            className="w-20 px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-center"
          />
          <span className="font-bold text-slate-400">=</span>
          <span className="px-4 py-1.5 bg-blue-600 text-white font-mono font-extrabold rounded-lg text-base">
            {res2}%
          </span>
        </div>
      </div>

      {/* 3. Percentage Increase / Decrease */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
          3. Percentage Increase / Decrease
        </h4>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-medium text-slate-600">From</span>
          <input
            type="number"
            value={a3}
            onChange={(e) => setA3(Number(e.target.value))}
            className="w-20 px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-center"
          />
          <span className="font-medium text-slate-600">to</span>
          <input
            type="number"
            value={b3}
            onChange={(e) => setB3(Number(e.target.value))}
            className="w-20 px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-center"
          />
          <span className="font-bold text-slate-400">=</span>
          <span className={`px-4 py-1.5 text-white font-mono font-extrabold rounded-lg text-base ${parseFloat(changePct) >= 0 ? 'bg-emerald-600' : 'bg-rose-600'}`}>
            {parseFloat(changePct) > 0 ? `+${changePct}% Increase` : `${changePct}% Decrease`}
          </span>
        </div>
      </div>

      {/* 4. Retail Sale & Discount Calculator */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-blue-50/50 border border-amber-200/80">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            4. Retail Sale & Discount Price
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Original Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={origPrice}
              onChange={(e) => setOrigPrice(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Discount (% Off)</label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
            />
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">You Save</span>
            <span className="text-lg font-bold text-emerald-600 font-mono">${discountSavings}</span>
          </div>
          <div className="p-3 bg-blue-600 text-white rounded-xl flex flex-col justify-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-blue-200">Final Price</span>
            <span className="text-xl font-extrabold font-mono">${finalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
