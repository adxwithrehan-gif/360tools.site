import React, { useState } from 'react';
import { Divide } from 'lucide-react';

export const FractionRatioTool: React.FC = () => {
  // Fraction Calculator
  const [num1, setNum1] = useState<number>(3);
  const [den1, setDen1] = useState<number>(4);
  const [operator, setOperator] = useState<'+' | '-' | '*' | '/'>('+');
  const [num2, setNum2] = useState<number>(2);
  const [den2, setDen2] = useState<number>(5);

  // Ratio Solver: A : B = C : D
  const [ratioA, setRatioA] = useState<number>(16);
  const [ratioB, setRatioB] = useState<number>(9);
  const [ratioC, setRatioC] = useState<number>(1920);

  // Greatest Common Divisor
  const gcd = (a: number, b: number): number => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x || 1;
  };

  // Fraction Math
  let resNum = 0;
  let resDen = 1;

  if (operator === '+') {
    resNum = num1 * den2 + num2 * den1;
    resDen = den1 * den2;
  } else if (operator === '-') {
    resNum = num1 * den2 - num2 * den1;
    resDen = den1 * den2;
  } else if (operator === '*') {
    resNum = num1 * num2;
    resDen = den1 * den2;
  } else if (operator === '/') {
    resNum = num1 * den2;
    resDen = den1 * num2;
  }

  const divisor = gcd(resNum, resDen);
  const simpNum = resNum / divisor;
  const simpDen = resDen / divisor;

  const decimalVal = resDen !== 0 ? (resNum / resDen).toFixed(4) : 'Undefined';
  const mixedWhole = Math.floor(Math.abs(simpNum) / Math.abs(simpDen));
  const mixedRemainder = Math.abs(simpNum) % Math.abs(simpDen);

  // Ratio D = (B * C) / A
  const ratioD = ratioA !== 0 ? ((ratioB * ratioC) / ratioA).toFixed(2) : '0';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-8">
      {/* Fraction Arithmetic */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-4">
          Fraction Calculator (+, −, ×, ÷)
        </h4>

        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          {/* Fraction 1 */}
          <div className="flex flex-col items-center">
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(Number(e.target.value))}
              className="w-16 p-2 text-center bg-white border border-slate-300 rounded-lg font-bold"
            />
            <div className="w-16 h-0.5 bg-slate-800 my-1"></div>
            <input
              type="number"
              value={den1}
              onChange={(e) => setDen1(Number(e.target.value))}
              className="w-16 p-2 text-center bg-white border border-slate-300 rounded-lg font-bold"
            />
          </div>

          {/* Operator */}
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value as any)}
            className="p-2.5 text-lg font-bold bg-white border border-slate-300 rounded-xl"
          >
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="*">×</option>
            <option value="/">÷</option>
          </select>

          {/* Fraction 2 */}
          <div className="flex flex-col items-center">
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(Number(e.target.value))}
              className="w-16 p-2 text-center bg-white border border-slate-300 rounded-lg font-bold"
            />
            <div className="w-16 h-0.5 bg-slate-800 my-1"></div>
            <input
              type="number"
              value={den2}
              onChange={(e) => setDen2(Number(e.target.value))}
              className="w-16 p-2 text-center bg-white border border-slate-300 rounded-lg font-bold"
            />
          </div>

          <span className="text-2xl font-bold text-slate-400">=</span>

          {/* Result */}
          <div className="flex flex-col items-center bg-blue-600 text-white p-3 rounded-2xl min-w-[90px] shadow-sm">
            <span className="text-lg font-mono font-extrabold">{simpNum}</span>
            <div className="w-12 h-0.5 bg-blue-200 my-1"></div>
            <span className="text-lg font-mono font-extrabold">{simpDen}</span>
          </div>

          <div className="text-left text-xs text-slate-600 space-y-1 pl-4 border-l border-slate-200">
            <div>
              Decimal:{' '}
              <strong className="font-mono text-slate-900 text-sm">{decimalVal}</strong>
            </div>
            {mixedWhole > 0 && mixedRemainder > 0 && (
              <div>
                Mixed Number:{' '}
                <strong className="font-mono text-slate-900 text-sm">
                  {simpNum < 0 ? '-' : ''}
                  {mixedWhole} {mixedRemainder}/{Math.abs(simpDen)}
                </strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proportional Ratio Solver */}
      <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-3">
          Proportional Ratio & Aspect Solver (A : B = C : D)
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
          <input
            type="number"
            value={ratioA}
            onChange={(e) => setRatioA(Number(e.target.value))}
            className="w-20 p-2 bg-white border border-slate-300 rounded-lg text-center"
          />
          <span className="text-slate-400">:</span>
          <input
            type="number"
            value={ratioB}
            onChange={(e) => setRatioB(Number(e.target.value))}
            className="w-20 p-2 bg-white border border-slate-300 rounded-lg text-center"
          />
          <span className="text-slate-400 font-bold">=</span>
          <input
            type="number"
            value={ratioC}
            onChange={(e) => setRatioC(Number(e.target.value))}
            className="w-24 p-2 bg-white border border-slate-300 rounded-lg text-center"
          />
          <span className="text-slate-400">:</span>
          <div className="px-4 py-2 bg-blue-700 text-white font-mono font-bold rounded-lg text-base">
            D = {ratioD}
          </div>
        </div>
      </div>
    </div>
  );
};
