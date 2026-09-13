import React, { useState, useMemo } from 'react';
import { Flame, Activity } from 'lucide-react';

export const CalorieTdeeTool: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [activityMultiplier, setActivityMultiplier] = useState<number>(1.375); // Lightly active

  const { bmr, tdee } = useMemo(() => {
    // Mifflin-St Jeor formula
    // Male: 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
    // Female: 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    const computedBmr = gender === 'male' ? base + 5 : base - 161;
    const computedTdee = computedBmr * activityMultiplier;

    return {
      bmr: Math.round(computedBmr),
      tdee: Math.round(computedTdee),
    };
  }, [gender, age, weightKg, heightCm, activityMultiplier]);

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
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
                gender === 'female' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Female
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Age (Yrs)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
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
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Weekly Activity Level
            </label>
            <select
              value={activityMultiplier}
              onChange={(e) => setActivityMultiplier(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
            >
              <option value={1.2}>Sedentary (Little or no exercise, desk job)</option>
              <option value={1.375}>Lightly Active (Exercise 1-3 days/week)</option>
              <option value={1.55}>Moderately Active (Exercise 3-5 days/week)</option>
              <option value={1.725}>Very Active (Hard exercise 6-7 days/week)</option>
              <option value={1.9}>Extra Active (Intense daily training / athlete)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 bg-amber-50/60 rounded-2xl border border-amber-200/80 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Daily Calorie Maintenance (TDEE)
            </span>
            <div className="mt-2 text-4xl font-extrabold text-slate-900 font-mono">
              {tdee.toLocaleString()} <span className="text-sm font-normal text-slate-500 font-sans">kcal / day</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Basal Metabolic Rate (BMR): <strong className="font-mono text-slate-700">{bmr} kcal</strong> (resting burn).
            </p>

            {/* Calorie Goals */}
            <div className="mt-5 space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700">Weight Loss (-0.5 kg / wk):</span>
                <span className="font-mono font-bold text-blue-600">{tdee - 500} kcal</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700">Maintenance:</span>
                <span className="font-mono font-bold text-emerald-600">{tdee} kcal</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700">Muscle Gain (+0.25 kg / wk):</span>
                <span className="font-mono font-bold text-amber-600">{tdee + 300} kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
