import React, { useState, useMemo } from 'react';
import { Calculator, Check, Copy, RefreshCw, Hash, Sigma, Box, Compass } from 'lucide-react';

interface AdvancedMathSuiteProps {
  toolId: string;
}

export const AdvancedMathSuite: React.FC<AdvancedMathSuiteProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Triangle / Pythagorean State
  const [sideA, setSideA] = useState('3');
  const [sideB, setSideB] = useState('4');
  const [sideC, setSideC] = useState('5');

  // 2. Volume & Surface Area State
  const [shapeType, setShapeType] = useState<'cylinder' | 'sphere' | 'cone' | 'cube' | 'box'>('cylinder');
  const [radius, setRadius] = useState('5');
  const [height, setHeight] = useState('10');
  const [boxLength, setBoxLength] = useState('6');
  const [boxWidth, setBoxWidth] = useState('4');

  // 3. Statistics & Standard Deviation State
  const [statDataInput, setStatDataInput] = useState('10, 12, 23, 23, 16, 23, 21, 16, 12, 14');

  // 4. Quadratic Formula State
  const [quadA, setQuadA] = useState('1');
  const [quadB, setQuadB] = useState('-5');
  const [quadC, setQuadC] = useState('6');

  // 5. LCM / GCF / Factors State
  const [num1, setNum1] = useState('48');
  const [num2, setNum2] = useState('180');

  // 6. Slope Calculator State
  const [x1, setX1] = useState('1');
  const [y1, setY1] = useState('2');
  const [x2, setX2] = useState('4');
  const [y2, setY2] = useState('8');

  // 7. Exponent / Log / Root State
  const [baseVal, setBaseVal] = useState('2');
  const [expVal, setExpVal] = useState('10');

  // 8. Binary / Hex Converter State
  const [binInput, setBinInput] = useState('110110');

  // 9. Random Number Generator State
  const [randMin, setRandMin] = useState('1');
  const [randMax, setRandMax] = useState('100');
  const [randCount, setRandCount] = useState('5');
  const [randResults, setRandResults] = useState<number[]>([14, 42, 67, 88, 93]);

  // 10. Long Division State
  const [dividend, setDividend] = useState('456');
  const [divisor, setDivisor] = useState('7');

  // Calculations for Statistics
  const statMetrics = useMemo(() => {
    const nums = statDataInput
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    if (nums.length === 0) return null;

    const n = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    const sorted = [...nums].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;

    const median =
      n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];

    // Mode
    const freq: Record<number, number> = {};
    let maxFreq = 0;
    nums.forEach((val) => {
      freq[val] = (freq[val] || 0) + 1;
      if (freq[val] > maxFreq) maxFreq = freq[val];
    });
    const modes = Object.keys(freq)
      .filter((k) => freq[Number(k)] === maxFreq && maxFreq > 1)
      .map(Number);

    // Variance & Standard Deviation
    const sqDiffSum = nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    const popVar = sqDiffSum / n;
    const popSD = Math.sqrt(popVar);
    const sampleVar = n > 1 ? sqDiffSum / (n - 1) : 0;
    const sampleSD = Math.sqrt(sampleVar);

    return {
      count: n,
      sum,
      mean: mean.toFixed(4),
      median: median.toFixed(4),
      mode: modes.length > 0 ? modes.join(', ') : 'No unique mode',
      range: range.toFixed(4),
      min,
      max,
      popSD: popSD.toFixed(4),
      sampleSD: sampleSD.toFixed(4),
      popVar: popVar.toFixed(4),
      sampleVar: sampleVar.toFixed(4),
    };
  }, [statDataInput]);

  // Triangle calculations
  const triangleInfo = useMemo(() => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);

    if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) return null;
    if (a + b <= c || a + c <= b || b + c <= a) {
      return { valid: false, error: 'The sum of any two sides must be greater than the third side.' };
    }

    const perimeter = a + b + c;
    const s = perimeter / 2;
    const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));

    // Law of cosines for angles in degrees
    const angleA = (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
    const angleB = (Math.acos((a * a + c * c - b * b) / (2 * a * c)) * 180) / Math.PI;
    const angleC = (Math.acos((a * a + b * b - c * c) / (2 * a * b)) * 180) / Math.PI;

    return {
      valid: true,
      perimeter: perimeter.toFixed(2),
      area: area.toFixed(2),
      semiPerimeter: s.toFixed(2),
      angleA: angleA.toFixed(1) + '°',
      angleB: angleB.toFixed(1) + '°',
      angleC: angleC.toFixed(1) + '°',
      isRight: Math.abs(a * a + b * b - c * c) < 0.001 || Math.abs(a * a + c * c - b * b) < 0.001 || Math.abs(b * b + c * c - a * a) < 0.001,
    };
  }, [sideA, sideB, sideC]);

  // Volume & Surface Area
  const volumeInfo = useMemo(() => {
    const r = parseFloat(radius) || 0;
    const h = parseFloat(height) || 0;
    const l = parseFloat(boxLength) || 0;
    const w = parseFloat(boxWidth) || 0;

    let volume = 0;
    let surfaceArea = 0;

    if (shapeType === 'cylinder') {
      volume = Math.PI * r * r * h;
      surfaceArea = 2 * Math.PI * r * h + 2 * Math.PI * r * r;
    } else if (shapeType === 'sphere') {
      volume = (4 / 3) * Math.PI * Math.pow(r, 3);
      surfaceArea = 4 * Math.PI * r * r;
    } else if (shapeType === 'cone') {
      volume = (1 / 3) * Math.PI * r * r * h;
      const slant = Math.sqrt(r * r + h * h);
      surfaceArea = Math.PI * r * (r + slant);
    } else if (shapeType === 'cube') {
      volume = Math.pow(l, 3);
      surfaceArea = 6 * l * l;
    } else if (shapeType === 'box') {
      volume = l * w * h;
      surfaceArea = 2 * (l * w + l * h + w * h);
    }

    return {
      volume: volume.toFixed(3),
      surfaceArea: surfaceArea.toFixed(3),
    };
  }, [shapeType, radius, height, boxLength, boxWidth]);

  // Quadratic Formula
  const quadResult = useMemo(() => {
    const a = parseFloat(quadA);
    const b = parseFloat(quadB);
    const c = parseFloat(quadC);

    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) return null;

    const disc = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;

    if (disc > 0) {
      const root1 = (-b + Math.sqrt(disc)) / (2 * a);
      const root2 = (-b - Math.sqrt(disc)) / (2 * a);
      return {
        roots: `x₁ = ${root1.toFixed(4)}, x₂ = ${root2.toFixed(4)}`,
        discriminant: disc.toFixed(2),
        type: 'Two Distinct Real Roots',
        vertex: `(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`,
      };
    } else if (disc === 0) {
      const root = -b / (2 * a);
      return {
        roots: `x = ${root.toFixed(4)}`,
        discriminant: '0',
        type: 'One Repeated Real Root',
        vertex: `(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`,
      };
    } else {
      const real = (-b / (2 * a)).toFixed(4);
      const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(4);
      return {
        roots: `x = ${real} ± ${imag}i`,
        discriminant: disc.toFixed(2),
        type: 'Two Complex Conjugate Roots',
        vertex: `(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`,
      };
    }
  }, [quadA, quadB, quadC]);

  // GCF & LCM Logic
  const numberTheory = useMemo(() => {
    let a = Math.abs(parseInt(num1)) || 1;
    let b = Math.abs(parseInt(num2)) || 1;

    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
    const gcfVal = gcd(a, b);
    const lcmVal = (a * b) / gcfVal;

    // Factors of a
    const factorsA: number[] = [];
    for (let i = 1; i <= a; i++) {
      if (a % i === 0) factorsA.push(i);
    }

    // Prime factors of a
    let temp = a;
    const primeFactors: number[] = [];
    let factor = 2;
    while (factor * factor <= temp) {
      if (temp % factor === 0) {
        primeFactors.push(factor);
        temp /= factor;
      } else {
        factor++;
      }
    }
    if (temp > 1) primeFactors.push(temp);

    return {
      gcf: gcfVal,
      lcm: lcmVal,
      factorsA: factorsA.join(', '),
      primeFactorsA: primeFactors.join(' × ') || a.toString(),
    };
  }, [num1, num2]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      {/* 1. Statistics & Standard Deviation Suite */}
      {(toolId === 'standard-deviation-calculator' ||
        toolId === 'statistics-calculator' ||
        toolId === 'mean-median-mode-range-calculator' ||
        toolId === 'average-calculator' ||
        toolId === 'z-score-calculator' ||
        toolId === 'confidence-interval-calculator' ||
        toolId === 'p-value-calculator' ||
        toolId === 'sample-size-calculator') && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Enter Numbers (comma or space separated)
            </label>
            <textarea
              rows={3}
              value={statDataInput}
              onChange={(e) => setStatDataInput(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-xl font-mono text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-hidden"
              placeholder="e.g. 10, 15, 20, 25, 30"
            />
          </div>

          {statMetrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
                <span className="text-xs text-blue-700 font-bold uppercase">Mean (Average)</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{statMetrics.mean}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Sample Std Dev (s)</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{statMetrics.sampleSD}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Population Std Dev (σ)</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{statMetrics.popSD}</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                <span className="text-xs text-emerald-800 font-bold uppercase">Median</span>
                <div className="text-2xl font-black text-emerald-700 mt-1">{statMetrics.median}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Mode</span>
                <div className="text-sm font-bold text-slate-800 mt-1 truncate">{statMetrics.mode}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Range (Max - Min)</span>
                <div className="text-lg font-bold text-slate-900 mt-1">{statMetrics.range}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Sample Variance (s²)</span>
                <div className="text-lg font-bold text-slate-900 mt-1">{statMetrics.sampleVar}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Data Count (N)</span>
                <div className="text-lg font-bold text-slate-900 mt-1">{statMetrics.count} items</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Triangle & Pythagorean Theorem */}
      {(toolId === 'triangle-calculator' ||
        toolId === 'right-triangle-calculator' ||
        toolId === 'pythagorean-theorem-calculator' ||
        toolId === 'area-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Side a</label>
              <input
                type="number"
                value={sideA}
                onChange={(e) => setSideA(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Side b</label>
              <input
                type="number"
                value={sideB}
                onChange={(e) => setSideB(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Side c</label>
              <input
                type="number"
                value={sideC}
                onChange={(e) => setSideC(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {triangleInfo && triangleInfo.valid && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
                <span className="text-xs text-blue-700 font-bold uppercase">Area</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{triangleInfo.area}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Perimeter</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{triangleInfo.perimeter}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Angles (A, B, C)</span>
                <div className="text-xs font-bold text-slate-900 mt-2">
                  {triangleInfo.angleA}, {triangleInfo.angleB}, {triangleInfo.angleC}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                <span className="text-xs text-emerald-800 font-bold">Right Triangle?</span>
                <div className="text-xl font-black text-emerald-700 mt-1">
                  {triangleInfo.isRight ? 'Yes (90°)' : 'No'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Volume & Surface Area Suite */}
      {(toolId === 'volume-calculator' || toolId === 'surface-area-calculator' || toolId === 'circle-calculator') && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(['cylinder', 'sphere', 'cone', 'cube', 'box'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setShapeType(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  shapeType === s ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(shapeType === 'cylinder' || shapeType === 'sphere' || shapeType === 'cone') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Radius (r)</label>
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                />
              </div>
            )}
            {(shapeType === 'cylinder' || shapeType === 'cone' || shapeType === 'box') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Height (h)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                />
              </div>
            )}
            {(shapeType === 'cube' || shapeType === 'box') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Length (l)</label>
                <input
                  type="number"
                  value={boxLength}
                  onChange={(e) => setBoxLength(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                />
              </div>
            )}
            {shapeType === 'box' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Width (w)</label>
                <input
                  type="number"
                  value={boxWidth}
                  onChange={(e) => setBoxWidth(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
              <span className="text-xs text-blue-700 font-bold uppercase tracking-wider">Calculated Volume</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{volumeInfo.volume} units³</div>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Surface Area</span>
              <div className="text-3xl font-black text-emerald-700 mt-1">{volumeInfo.surfaceArea} units²</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Quadratic Formula Calculator */}
      {toolId === 'quadratic-formula-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Coefficient a (x²)</label>
              <input
                type="number"
                value={quadA}
                onChange={(e) => setQuadA(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Coefficient b (x)</label>
              <input
                type="number"
                value={quadB}
                onChange={(e) => setQuadB(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Constant c</label>
              <input
                type="number"
                value={quadC}
                onChange={(e) => setQuadC(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {quadResult && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
                <span className="text-xs text-blue-700 font-bold uppercase tracking-wider">Equation Roots</span>
                <div className="text-3xl font-black text-slate-900 mt-1">{quadResult.roots}</div>
                <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-1 bg-white rounded-full text-blue-800 border border-blue-200">
                  {quadResult.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Discriminant (b² - 4ac)</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">{quadResult.discriminant}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Parabola Vertex (x, y)</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">{quadResult.vertex}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. LCM, GCF & Factors */}
      {(toolId === 'least-common-multiple-calculator-lcm' ||
        toolId === 'greatest-common-factor-calculator-gcf' ||
        toolId === 'factor-calculator' ||
        toolId === 'prime-factorization-calculator' ||
        toolId === 'common-factor-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Number 1</label>
              <input
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Number 2</label>
              <input
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
              <span className="text-xs text-blue-700 font-bold uppercase">Greatest Common Factor (GCF)</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{numberTheory.gcf}</div>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-xs text-emerald-800 font-bold uppercase">Least Common Multiple (LCM)</span>
              <div className="text-3xl font-black text-emerald-700 mt-1">{numberTheory.lcm.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-1">All Divisors/Factors of {num1}:</span>
              <div className="font-mono text-xs text-slate-800 break-all">{numberTheory.factorsA}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-1">Prime Factorization of {num1}:</span>
              <div className="font-mono text-sm font-bold text-blue-600">{numberTheory.primeFactorsA}</div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Slope Calculator */}
      {(toolId === 'slope-calculator' || toolId === 'distance-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Point 1 X (x₁)</label>
              <input
                type="number"
                value={x1}
                onChange={(e) => setX1(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Point 1 Y (y₁)</label>
              <input
                type="number"
                value={y1}
                onChange={(e) => setY1(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Point 2 X (x₂)</label>
              <input
                type="number"
                value={x2}
                onChange={(e) => setX2(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Point 2 Y (y₂)</label>
              <input
                type="number"
                value={y2}
                onChange={(e) => setY2(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {(() => {
            const pX1 = parseFloat(x1) || 0;
            const pY1 = parseFloat(y1) || 0;
            const pX2 = parseFloat(x2) || 0;
            const pY2 = parseFloat(y2) || 0;

            const dx = pX2 - pX1;
            const dy = pY2 - pY1;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const slope = dx !== 0 ? dy / dx : Infinity;
            const yIntercept = isFinite(slope) ? pY1 - slope * pX1 : 0;
            const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
                  <span className="text-xs text-blue-700 font-bold uppercase">Slope (m)</span>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    {isFinite(slope) ? slope.toFixed(4) : 'Undefined (Vertical)'}
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 font-bold uppercase">Distance (d)</span>
                  <div className="text-3xl font-black text-emerald-700 mt-1">{distance.toFixed(4)} units</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Line Equation</span>
                  <div className="text-lg font-mono font-bold text-slate-900 mt-2">
                    {isFinite(slope)
                      ? `y = ${slope.toFixed(2)}x ${yIntercept >= 0 ? '+' : '-'} ${Math.abs(yIntercept).toFixed(2)}`
                      : `x = ${pX1}`}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 7. Random Number Generator */}
      {toolId === 'random-number-generator' && (
        <div className="space-y-6 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Min Value</label>
              <input
                type="number"
                value={randMin}
                onChange={(e) => setRandMin(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Max Value</label>
              <input
                type="number"
                value={randMax}
                onChange={(e) => setRandMax(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Count</label>
              <input
                type="number"
                min="1"
                max="50"
                value={randCount}
                onChange={(e) => setRandCount(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 text-center"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Generated Random Numbers</span>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              {randResults.map((r, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-xl bg-white border border-blue-300 text-blue-900 font-mono text-xl font-black shadow-xs"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              const min = parseInt(randMin) || 1;
              const max = parseInt(randMax) || 100;
              const count = Math.min(50, Math.max(1, parseInt(randCount) || 1));
              const out: number[] = [];
              for (let i = 0; i < count; i++) {
                out.push(Math.floor(Math.random() * (max - min + 1)) + min);
              }
              setRandResults(out);
            }}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Generate New Numbers
          </button>
        </div>
      )}

      {/* 8. Exponent / Root / Log / Half-life */}
      {(toolId === 'exponent-calculator' ||
        toolId === 'root-calculator' ||
        toolId === 'log-calculator' ||
        toolId === 'half-life-calculator' ||
        toolId === 'scientific-notation-calculator' ||
        toolId === 'big-number-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Base Value (x)</label>
              <input
                type="number"
                value={baseVal}
                onChange={(e) => setBaseVal(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Exponent / Power (y)</label>
              <input
                type="number"
                value={expVal}
                onChange={(e) => setExpVal(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {(() => {
            const b = parseFloat(baseVal) || 0;
            const e = parseFloat(expVal) || 0;
            const power = Math.pow(b, e);
            const sqrt = b >= 0 ? Math.sqrt(b) : NaN;
            const cbrt = Math.cbrt(b);
            const log10 = b > 0 ? Math.log10(b) : NaN;
            const ln = b > 0 ? Math.log(b) : NaN;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
                  <span className="text-xs text-blue-700 font-bold uppercase">xʸ (Power)</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{power.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Square Root (√x)</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">{isNaN(sqrt) ? 'NaN' : sqrt.toFixed(4)}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Cube Root (∛x)</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">{cbrt.toFixed(4)}</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 font-bold">Log₁₀(x) & Ln(x)</span>
                  <div className="text-xs font-bold text-emerald-700 mt-2">
                    Log10: {isNaN(log10) ? 'NaN' : log10.toFixed(3)} | Ln: {isNaN(ln) ? 'NaN' : ln.toFixed(3)}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 9. Binary & Hex Calculator */}
      {(toolId === 'binary-calculator' || toolId === 'hex-calculator') && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Enter Value (Binary or Decimal)
            </label>
            <input
              type="text"
              value={binInput}
              onChange={(e) => setBinInput(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-xl font-mono text-base text-slate-900 bg-slate-50"
            />
          </div>

          {(() => {
            let dec = 0;
            if (/^[01]+$/.test(binInput)) {
              dec = parseInt(binInput, 2);
            } else {
              dec = parseInt(binInput, 10) || 0;
            }

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
                  <span className="text-xs text-blue-700 font-bold uppercase">Decimal (Base 10)</span>
                  <div className="font-mono text-xl font-bold text-slate-900 mt-1">{dec}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Binary (Base 2)</span>
                  <div className="font-mono text-base font-bold text-slate-900 mt-1 break-all">{dec.toString(2)}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Hexadecimal (Base 16)</span>
                  <div className="font-mono text-xl font-bold text-slate-900 mt-1 uppercase">{dec.toString(16)}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Octal (Base 8)</span>
                  <div className="font-mono text-xl font-bold text-slate-900 mt-1">{dec.toString(8)}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
