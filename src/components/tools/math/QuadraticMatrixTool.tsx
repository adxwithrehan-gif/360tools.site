import React, { useState } from 'react';
import { Grid3X3, Calculator } from 'lucide-react';

export const QuadraticMatrixTool: React.FC = () => {
  const [tab, setTab] = useState<'quadratic' | 'matrix'>('quadratic');

  // Quadratic ax^2 + bx + c = 0
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-5);
  const [c, setC] = useState<number>(6);

  // 2x2 Matrix
  const [m, setM] = useState<number[][]>([
    [4, 2],
    [3, 5],
  ]);

  // Solve Quadratic
  const discriminant = b * b - 4 * a * c;
  let root1 = '';
  let root2 = '';
  let rootsType = '';

  if (a === 0) {
    rootsType = 'Linear equation (a = 0)';
    root1 = (-c / b).toFixed(4);
  } else if (discriminant > 0) {
    rootsType = 'Two Distinct Real Roots';
    root1 = ((-b + Math.sqrt(discriminant)) / (2 * a)).toFixed(4);
    root2 = ((-b - Math.sqrt(discriminant)) / (2 * a)).toFixed(4);
  } else if (discriminant === 0) {
    rootsType = 'One Repeated Real Root';
    root1 = (-b / (2 * a)).toFixed(4);
  } else {
    rootsType = 'Two Complex Conjugate Roots';
    const realPart = (-b / (2 * a)).toFixed(4);
    const imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
    root1 = `${realPart} + ${imagPart}i`;
    root2 = `${realPart} - ${imagPart}i`;
  }

  // Matrix Determinant 2x2: ad - bc
  const det2x2 = m[0][0] * m[1][1] - m[0][1] * m[1][0];

  const updateMatrixCell = (row: number, col: number, val: number) => {
    setM((prev) => {
      const copy = prev.map((r) => [...r]);
      copy[row][col] = val;
      return copy;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {/* Tab switch */}
      <div className="flex bg-slate-100 p-1 rounded-xl max-w-sm mx-auto mb-6">
        <button
          onClick={() => setTab('quadratic')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            tab === 'quadratic' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
          }`}
        >
          Quadratic Solver (ax²+bx+c)
        </button>
        <button
          onClick={() => setTab('matrix')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            tab === 'matrix' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
          }`}
        >
          2x2 Matrix Determinant
        </button>
      </div>

      {tab === 'quadratic' ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-base font-bold">
            <input
              type="number"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              className="w-16 p-2 text-center bg-white border border-slate-300 rounded-lg text-blue-600 font-mono"
            />
            <span>x² +</span>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              className="w-16 p-2 text-center bg-white border border-slate-300 rounded-lg text-blue-600 font-mono"
            />
            <span>x +</span>
            <input
              type="number"
              value={c}
              onChange={(e) => setC(Number(e.target.value))}
              className="w-16 p-2 text-center bg-white border border-slate-300 rounded-lg text-blue-600 font-mono"
            />
            <span>= 0</span>
          </div>

          <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-blue-900 uppercase">
              <span>Discriminant (b² - 4ac):</span>
              <span className="font-mono text-sm">{discriminant}</span>
            </div>
            <div className="text-xs font-semibold text-slate-700">
              Root Classification: <strong className="text-blue-800">{rootsType}</strong>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Root 1 (x₁)</span>
                <p className="text-base font-mono font-bold text-blue-700 mt-0.5">{root1}</p>
              </div>
              {root2 && (
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Root 2 (x₂)</span>
                  <p className="text-base font-mono font-bold text-blue-700 mt-0.5">{root2}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-4xl font-light text-slate-400">[</div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={m[0][0]}
                onChange={(e) => updateMatrixCell(0, 0, Number(e.target.value))}
                className="w-16 p-2 text-center bg-white border border-slate-300 rounded-lg font-bold font-mono"
              />
              <input
                type="number"
                value={m[0][1]}
                onChange={(e) => updateMatrixCell(0, 1, Number(e.target.value))}
                className="w-16 p-2 text-center bg-white border border-slate-300 rounded-lg font-bold font-mono"
              />
              <input
                type="number"
                value={m[1][0]}
                onChange={(e) => updateMatrixCell(1, 0, Number(e.target.value))}
                className="w-16 p-2 text-center bg-white border border-slate-300 rounded-lg font-bold font-mono"
              />
              <input
                type="number"
                value={m[1][1]}
                onChange={(e) => updateMatrixCell(1, 1, Number(e.target.value))}
                className="w-16 p-2 text-center bg-white border border-slate-300 rounded-lg font-bold font-mono"
              />
            </div>
            <div className="text-4xl font-light text-slate-400">]</div>
          </div>

          <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl text-center">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Determinant det(A) = ad - bc
            </span>
            <div className="text-3xl font-extrabold font-mono text-blue-700 mt-2">
              {det2x2}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
