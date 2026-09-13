import React, { useState, useMemo } from 'react';
import { Heart, Activity } from 'lucide-react';

export const HeartRateZonesTool: React.FC = () => {
  const [age, setAge] = useState<number>(30);
  const [restingHr, setRestingHr] = useState<number>(65);

  const { maxHr, hrReserve, zones } = useMemo(() => {
    // Tanaka formula: 208 - 0.7 * age
    const max = Math.round(208 - 0.7 * age);
    // Karvonen formula: Target HR = ((Max HR - Resting HR) * %Intensity) + Resting HR
    const reserve = max - restingHr;

    const computeRange = (lowPct: number, highPct: number) => {
      const low = Math.round(reserve * lowPct + restingHr);
      const high = Math.round(reserve * highPct + restingHr);
      return `${low} - ${high} BPM`;
    };

    const zoneList = [
      {
        name: 'Zone 1: Very Light (Active Recovery)',
        intensity: '50% - 60%',
        range: computeRange(0.5, 0.6),
        benefit: 'Warm-up, cooldown, active recovery, promotes blood flow.',
        color: 'border-l-blue-500 bg-blue-50/40',
      },
      {
        name: 'Zone 2: Light (Aerobic Base & Fat Burn)',
        intensity: '60% - 70%',
        range: computeRange(0.6, 0.7),
        benefit: 'Builds endurance, maximizes fat oxidation, mitochondrial density.',
        color: 'border-l-emerald-500 bg-emerald-50/40',
      },
      {
        name: 'Zone 3: Moderate (Aerobic Fitness)',
        intensity: '70% - 80%',
        range: computeRange(0.7, 0.8),
        benefit: 'Cardiovascular efficiency, sustained tempo running and cycling.',
        color: 'border-l-amber-500 bg-amber-50/40',
      },
      {
        name: 'Zone 4: Hard (Lactate Threshold)',
        intensity: '80% - 90%',
        range: computeRange(0.8, 0.9),
        benefit: 'High-speed endurance, pushes anaerobic threshold, interval work.',
        color: 'border-l-orange-500 bg-orange-50/40',
      },
      {
        name: 'Zone 5: Maximum (VO2 Max & Sprint)',
        intensity: '90% - 100%',
        range: computeRange(0.9, 1.0),
        benefit: 'Peak explosive power, neuromuscular speed, short sprint bursts.',
        color: 'border-l-rose-500 bg-rose-50/40',
      },
    ];

    return {
      maxHr: max,
      hrReserve: reserve,
      zones: zoneList,
    };
  }, [age, restingHr]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Age: {age} Years</span>
          </div>
          <input
            type="range"
            min="15"
            max="90"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full accent-rose-600"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Resting Heart Rate: {restingHr} BPM</span>
          </div>
          <input
            type="range"
            min="40"
            max="100"
            value={restingHr}
            onChange={(e) => setRestingHr(Number(e.target.value))}
            className="w-full accent-rose-600"
          />
        </div>
      </div>

      <div className="flex items-center justify-around p-4 bg-rose-50/50 rounded-xl border border-rose-100 text-center">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase">Estimated Max Heart Rate</span>
          <p className="text-2xl font-extrabold font-mono text-rose-600">{maxHr} BPM</p>
        </div>
        <div className="h-8 w-px bg-rose-200"></div>
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase">Heart Rate Reserve</span>
          <p className="text-2xl font-extrabold font-mono text-slate-800">{hrReserve} BPM</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {zones.map((zone, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border border-slate-200 border-l-4 ${zone.color} flex flex-col sm:flex-row sm:items-center justify-between gap-2`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{zone.name}</span>
                <span className="text-[10px] font-semibold text-slate-500">({zone.intensity})</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{zone.benefit}</p>
            </div>
            <div className="text-sm font-extrabold font-mono text-slate-900 shrink-0">
              {zone.range}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
