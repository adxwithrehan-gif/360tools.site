import React, { useState, useMemo } from 'react';
import { Droplets, GlassWater } from 'lucide-react';

export const WaterIntakeTool: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(70);
  const [exerciseMins, setExerciseMins] = useState<number>(45);
  const [climate, setClimate] = useState<'moderate' | 'hot' | 'very_hot'>('moderate');

  const { liters, ounces, glasses } = useMemo(() => {
    // Base: 35ml per kg
    let ml = weightKg * 35;
    // Exercise: +350ml per 30 mins
    ml += (exerciseMins / 30) * 350;
    // Climate factor
    if (climate === 'hot') ml *= 1.15;
    if (climate === 'very_hot') ml *= 1.3;

    const totalLiters = (ml / 1000).toFixed(1);
    const totalOz = Math.round(ml * 0.033814);
    const totalGlasses = Math.round(ml / 250); // 250ml per glass

    return {
      liters: totalLiters,
      ounces: totalOz,
      glasses: totalGlasses,
    };
  }, [weightKg, exerciseMins, climate]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Body Weight: {weightKg} kg</span>
            </div>
            <input
              type="range"
              min="35"
              max="160"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Daily Exercise / Workout: {exerciseMins} mins</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="15"
              value={exerciseMins}
              onChange={(e) => setExerciseMins(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Climate & Temperature
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'moderate', label: 'Temperate (Normal)' },
                { id: 'hot', label: 'Warm / Sunny' },
                { id: 'very_hot', label: 'Hot & Arid' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setClimate(c.id as any)}
                  className={`py-2 px-2 text-[11px] font-bold rounded-lg border transition-colors ${
                    climate === c.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-6 bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-2xl border border-blue-200 p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <Droplets className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
            Recommended Daily Hydration
          </span>
          <div className="mt-2 text-5xl font-extrabold font-mono text-slate-900">
            {liters} <span className="text-xl font-normal text-slate-500 font-sans">Liters</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {ounces} fl oz • ~{glasses} standard glasses (250ml each)
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-1.5 max-w-xs mx-auto">
            {Array.from({ length: Math.min(16, glasses) }).map((_, i) => (
              <div
                key={i}
                className="w-7 h-9 rounded-md bg-blue-200/80 border border-blue-300 flex items-center justify-center text-blue-700 text-[10px] font-bold shadow-2xs"
                title={`Glass #${i + 1}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
