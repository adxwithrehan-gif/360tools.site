import React, { useState, useMemo } from 'react';
import { Activity, Heart } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  // Metric: kg, cm
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);

  // Imperial: lbs, ft, in
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);

  const { bmi, category, color, idealMin, idealMax, gaugePercent } = useMemo(() => {
    let bmiValue = 0;
    let minW = 0;
    let maxW = 0;

    if (unitSystem === 'metric') {
      const heightM = heightCm / 100;
      if (heightM > 0) {
        bmiValue = weightKg / (heightM * heightM);
        minW = 18.5 * (heightM * heightM);
        maxW = 24.9 * (heightM * heightM);
      }
    } else {
      const totalInches = heightFt * 12 + heightIn;
      if (totalInches > 0) {
        bmiValue = (weightLbs / (totalInches * totalInches)) * 703;
        minW = (18.5 * (totalInches * totalInches)) / 703;
        maxW = (24.9 * (totalInches * totalInches)) / 703;
      }
    }

    let cat = 'Normal Weight';
    let col = 'text-emerald-600 bg-emerald-50 border-emerald-200';
    let gauge = 50;

    if (bmiValue < 18.5) {
      cat = 'Underweight';
      col = 'text-blue-600 bg-blue-50 border-blue-200';
      gauge = Math.min(25, (bmiValue / 18.5) * 25);
    } else if (bmiValue < 25) {
      cat = 'Normal (Healthy)';
      col = 'text-emerald-600 bg-emerald-50 border-emerald-200';
      gauge = 25 + ((bmiValue - 18.5) / 6.4) * 25;
    } else if (bmiValue < 30) {
      cat = 'Overweight';
      col = 'text-amber-600 bg-amber-50 border-amber-200';
      gauge = 50 + ((bmiValue - 25) / 5) * 25;
    } else {
      cat = 'Obese';
      col = 'text-rose-600 bg-rose-50 border-rose-200';
      gauge = Math.min(100, 75 + ((bmiValue - 30) / 10) * 25);
    }

    return {
      bmi: Number(bmiValue.toFixed(1)),
      category: cat,
      color: col,
      idealMin: minW.toFixed(1),
      idealMax: maxW.toFixed(1),
      gaugePercent: Math.min(100, Math.max(0, gauge)),
    };
  }, [unitSystem, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {/* Unit Switch */}
      <div className="flex bg-slate-100 p-1 rounded-xl max-w-xs mx-auto mb-6">
        <button
          onClick={() => setUnitSystem('metric')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            unitSystem === 'metric' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
          }`}
        >
          Metric (cm, kg)
        </button>
        <button
          onClick={() => setUnitSystem('imperial')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            unitSystem === 'imperial' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
          }`}
        >
          Imperial (ft/in, lbs)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Input Fields */}
        <div className="lg:col-span-6 space-y-5">
          {unitSystem === 'metric' ? (
            <>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Height: {heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="220"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full mt-2 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Weight: {weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full mt-2 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Height (Feet & Inches)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold"
                    />
                    <span className="text-xs text-slate-500 font-bold">ft</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold"
                    />
                    <span className="text-xs text-slate-500 font-bold">in</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Weight (Pounds)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold"
                  />
                  <span className="text-xs text-slate-500 font-bold">lbs</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Gauge Result */}
        <div className="lg:col-span-6 bg-gradient-to-br from-amber-50/70 to-slate-50 rounded-2xl border border-amber-200 p-6 text-center">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Your Body Mass Index (BMI)
          </span>

          <div className="mt-2 text-5xl font-extrabold font-mono text-slate-900">
            {bmi}
          </div>

          <div className="mt-3 inline-block px-4 py-1.5 rounded-full text-xs font-extrabold border uppercase tracking-wide">
            <span className={color.split(' ')[0]}>{category}</span>
          </div>

          {/* Visual Spectrum Gauge */}
          <div className="mt-6">
            <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-rose-500">
              <div
                style={{ left: `${gaugePercent}%` }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900 shadow-md"
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5">
              <span>&lt; 18.5 Under</span>
              <span>18.5-24.9 Normal</span>
              <span>25-29.9 Over</span>
              <span>30+ Obese</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-200/60 text-xs text-slate-600">
            Healthy Target Weight Range:{' '}
            <strong className="text-slate-900 font-mono">
              {idealMin} - {idealMax} {unitSystem === 'metric' ? 'kg' : 'lbs'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
