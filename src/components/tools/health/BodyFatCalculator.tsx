import React, { useState, useMemo } from 'react';
import { HeartPulse } from 'lucide-react';

export const BodyFatCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<number>(178);
  const [neckCm, setNeckCm] = useState<number>(38);
  const [waistCm, setWaistCm] = useState<number>(84);
  const [hipCm, setHipCm] = useState<number>(96); // only for female
  const [weightKg, setWeightKg] = useState<number>(76);

  const { bodyFatPct, fatCategory, fatMassKg, leanMassKg } = useMemo(() => {
    let bf = 0;
    if (gender === 'male') {
      // 495 / (1.0324 - 0.19077*log10(waist - neck) + 0.15456*log10(height)) - 450
      const waistNeck = Math.max(1, waistCm - neckCm);
      const density = 1.0324 - 0.19077 * Math.log10(waistNeck) + 0.15456 * Math.log10(heightCm);
      bf = 495 / density - 450;
    } else {
      // 495 / (1.29579 - 0.35004*log10(waist + hip - neck) + 0.22100*log10(height)) - 450
      const totalCir = Math.max(1, waistCm + hipCm - neckCm);
      const density = 1.29579 - 0.35004 * Math.log10(totalCir) + 0.221 * Math.log10(heightCm);
      bf = 495 / density - 450;
    }

    const safeBf = Math.max(3, Math.min(50, Number(bf.toFixed(1))));
    const fatMass = (safeBf / 100) * weightKg;
    const leanMass = weightKg - fatMass;

    let cat = 'Average Fitness';
    if (gender === 'male') {
      if (safeBf < 6) cat = 'Essential Fat';
      else if (safeBf < 14) cat = 'Athletic / Lean';
      else if (safeBf < 18) cat = 'Fitness';
      else if (safeBf < 25) cat = 'Average';
      else cat = 'Above Average';
    } else {
      if (safeBf < 14) cat = 'Essential Fat';
      else if (safeBf < 21) cat = 'Athletic / Lean';
      else if (safeBf < 25) cat = 'Fitness';
      else if (safeBf < 32) cat = 'Average';
      else cat = 'Above Average';
    }

    return {
      bodyFatPct: safeBf,
      fatCategory: cat,
      fatMassKg: fatMass.toFixed(1),
      leanMassKg: leanMass.toFixed(1),
    };
  }, [gender, heightCm, neckCm, waistCm, hipCm, weightKg]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
                gender === 'male' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Male Formula
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
                gender === 'female' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Female Formula
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Neck Circumference (cm)</label>
              <input
                type="number"
                value={neckCm}
                onChange={(e) => setNeckCm(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Waist at Navel (cm)</label>
              <input
                type="number"
                value={waistCm}
                onChange={(e) => setWaistCm(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            {gender === 'female' && (
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Hips at Widest (cm)</label>
                <input
                  type="number"
                  value={hipCm}
                  onChange={(e) => setHipCm(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-6 bg-gradient-to-br from-amber-50/70 to-orange-50/40 rounded-2xl border border-amber-200/80 p-6 flex flex-col justify-between text-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Estimated Body Fat Percentage
            </span>
            <div className="mt-2 text-5xl font-extrabold font-mono text-slate-900">
              {bodyFatPct}%
            </div>
            <div className="mt-2 inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
              {fatCategory}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 text-left">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Lean Muscle Mass</span>
                <p className="text-base font-bold font-mono text-emerald-600 mt-0.5">{leanMassKg} kg</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fat Mass</span>
                <p className="text-base font-bold font-mono text-amber-600 mt-0.5">{fatMassKg} kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
