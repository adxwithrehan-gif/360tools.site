import React, { useState, useMemo } from 'react';
import { Activity, Heart, Flame, Scale, Baby, Timer, Wine, ShieldCheck } from 'lucide-react';

interface AdvancedHealthSuiteProps {
  toolId: string;
}

export const AdvancedHealthSuite: React.FC<AdvancedHealthSuiteProps> = ({ toolId }) => {
  // 1. Core Biometrics State
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('28');
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('74');
  const [activityLevel, setActivityLevel] = useState('1.55'); // 1.2, 1.375, 1.55, 1.725, 1.9

  // 2. Body Fat Circumferences (Navy Method)
  const [neckCm, setNeckCm] = useState('38');
  const [waistCm, setWaistCm] = useState('84');
  const [hipCm, setHipCm] = useState('96');

  // 3. Pregnancy State
  const [lmpDate, setLmpDate] = useState('2026-01-15');

  // 4. Pace State
  const [raceDistanceKm, setRaceDistanceKm] = useState('10');
  const [raceTimeMins, setRaceTimeMins] = useState('52');

  // 5. One Rep Max State
  const [liftWeight, setLiftWeight] = useState('100');
  const [liftReps, setLiftReps] = useState('5');

  // 6. Blood Alcohol Content (BAC) State
  const [drinksCount, setDrinksCount] = useState('3');
  const [drinkingHours, setDrinkingHours] = useState('2');

  // BMI & Healthy Weight Range
  const bmiInfo = useMemo(() => {
    const hM = (parseFloat(heightCm) || 170) / 100;
    const w = parseFloat(weightKg) || 70;
    if (hM <= 0 || w <= 0) return null;

    const bmi = w / (hM * hM);
    const minHealthy = 18.5 * (hM * hM);
    const maxHealthy = 24.9 * (hM * hM);

    let status = 'Normal weight';
    let color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (bmi < 18.5) {
      status = 'Underweight';
      color = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (bmi >= 25 && bmi < 29.9) {
      status = 'Overweight';
      color = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (bmi >= 30) {
      status = 'Obese';
      color = 'text-rose-700 bg-rose-50 border-rose-200';
    }

    return {
      bmi: bmi.toFixed(1),
      status,
      color,
      healthyRange: `${minHealthy.toFixed(1)} - ${maxHealthy.toFixed(1)} kg`,
    };
  }, [heightCm, weightKg]);

  // Calorie & TDEE (Mifflin-St Jeor)
  const caloricNeeds = useMemo(() => {
    const w = parseFloat(weightKg) || 70;
    const h = parseFloat(heightCm) || 170;
    const a = parseFloat(age) || 25;
    const act = parseFloat(activityLevel) || 1.2;

    // BMR
    let bmr = 10 * w + 6.25 * h - 5 * a;
    bmr += gender === 'male' ? 5 : -161;

    const tdee = bmr * act;
    const cut = tdee - 500;
    const bulk = tdee + 350;

    // Macros based on TDEE (Balanced: 30% Protein, 40% Carbs, 30% Fat)
    const proteinGrams = (tdee * 0.3) / 4;
    const carbsGrams = (tdee * 0.4) / 4;
    const fatGrams = (tdee * 0.3) / 9;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      cut: Math.round(cut),
      bulk: Math.round(bulk),
      proteinGrams: Math.round(proteinGrams),
      carbsGrams: Math.round(carbsGrams),
      fatGrams: Math.round(fatGrams),
    };
  }, [weightKg, heightCm, age, gender, activityLevel]);

  // Ideal Weight (Devine, Robinson, Miller formulas)
  const idealWeights = useMemo(() => {
    const hInches = (parseFloat(heightCm) || 170) / 2.54;
    const over5Ft = Math.max(0, hInches - 60);

    let devine = 0;
    let robinson = 0;
    if (gender === 'male') {
      devine = 50 + 2.3 * over5Ft;
      robinson = 52 + 1.9 * over5Ft;
    } else {
      devine = 45.5 + 2.3 * over5Ft;
      robinson = 49 + 1.7 * over5Ft;
    }

    return {
      devine: devine.toFixed(1),
      robinson: robinson.toFixed(1),
      average: ((devine + robinson) / 2).toFixed(1),
    };
  }, [heightCm, gender]);

  // Pregnancy Due Date (Naegele's rule)
  const pregnancyInfo = useMemo(() => {
    try {
      const lmp = new Date(lmpDate);
      if (isNaN(lmp.getTime())) return null;

      // Add 280 days
      const due = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const elapsedDays = Math.max(0, Math.floor((now.getTime() - lmp.getTime()) / (24 * 60 * 60 * 1000)));
      const weeks = Math.floor(elapsedDays / 7);
      const days = elapsedDays % 7;

      let trimester = 'First Trimester';
      if (weeks >= 28) trimester = 'Third Trimester';
      else if (weeks >= 13) trimester = 'Second Trimester';

      return {
        dueDate: due.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        gestationalAge: `${weeks} weeks, ${days} days`,
        trimester,
      };
    } catch {
      return null;
    }
  }, [lmpDate]);

  // One Rep Max (Brzycki Formula)
  const oneRepMax = useMemo(() => {
    const w = parseFloat(liftWeight) || 0;
    const r = parseFloat(liftReps) || 1;
    if (w <= 0 || r <= 0) return 0;
    const max = r === 1 ? w : w * (36 / (37 - r));
    return Math.round(max);
  }, [liftWeight, liftReps]);

  // Pace Calculator
  const paceInfo = useMemo(() => {
    const dist = parseFloat(raceDistanceKm) || 1;
    const timeMins = parseFloat(raceTimeMins) || 0;
    if (dist <= 0 || timeMins <= 0) return null;

    const pacePerKm = timeMins / dist;
    const paceM = Math.floor(pacePerKm);
    const paceS = Math.round((pacePerKm - paceM) * 60);

    const speedKmh = (dist / (timeMins / 60)).toFixed(2);
    const marathonEst = ((pacePerKm * 42.195) / 60).toFixed(2);

    return {
      paceFormatted: `${paceM}:${paceS < 10 ? '0' : ''}${paceS} /km`,
      speedKmh,
      marathonHours: marathonEst,
    };
  }, [raceDistanceKm, raceTimeMins]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      {/* 1. BMI & Body Weight Suite */}
      {(toolId === 'bmi-calculator' ||
        toolId === 'ideal-weight-calculator' ||
        toolId === 'healthy-weight-calculator' ||
        toolId === 'anorexic-bmi-calculator' ||
        toolId === 'overweight-calculator' ||
        toolId === 'body-surface-area-calculator' ||
        toolId === 'gfr-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {bmiInfo && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Your Body Mass Index</span>
                <div className="text-5xl font-black text-slate-900 mt-1">{bmiInfo.bmi}</div>
                <div className="mt-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${bmiInfo.color}`}>
                    {bmiInfo.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 font-bold uppercase">Healthy Weight Range</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{bmiInfo.healthyRange}</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
                  <span className="text-xs text-blue-700 font-bold uppercase">Ideal Weight (Devine Formula)</span>
                  <div className="text-2xl font-black text-blue-600 mt-1">{idealWeights.devine} kg</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Calorie, TDEE, BMR & Macro Suite */}
      {(toolId === 'calorie-calculator' ||
        toolId === 'tdee-calculator' ||
        toolId === 'bmr-calculator' ||
        toolId === 'macro-calculator' ||
        toolId === 'calories-burned-calculator' ||
        toolId === 'carbohydrate-calculator' ||
        toolId === 'protein-calculator' ||
        toolId === 'fat-intake-calculator' ||
        toolId === 'weight-watcher-points-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Daily Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
            >
              <option value="1.2">Sedentary (desk job, little or no exercise)</option>
              <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
              <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
              <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
              <option value="1.9">Extremely active (heavy training, physical labor)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
              <span className="text-xs text-blue-700 font-bold uppercase tracking-wider">Maintenance TDEE</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{caloricNeeds.tdee} kcal</div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">To keep current weight</span>
            </div>
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
              <span className="text-xs text-amber-800 font-bold uppercase tracking-wider">Weight Loss (-500 kcal)</span>
              <div className="text-3xl font-black text-amber-700 mt-1">{caloricNeeds.cut} kcal</div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Lose approx 0.5 kg / week</span>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Muscle Gain (+350 kcal)</span>
              <div className="text-3xl font-black text-emerald-700 mt-1">{caloricNeeds.bulk} kcal</div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Lean bulking target</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
              Daily Macro Nutrient Targets (Balanced Ratio)
            </span>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Protein</span>
                <div className="text-lg font-bold text-blue-600 mt-0.5">{caloricNeeds.proteinGrams}g</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Carbohydrates</span>
                <div className="text-lg font-bold text-amber-600 mt-0.5">{caloricNeeds.carbsGrams}g</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Healthy Fats</span>
                <div className="text-lg font-bold text-emerald-600 mt-0.5">{caloricNeeds.fatGrams}g</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Pregnancy, Due Date & Conception */}
      {(toolId === 'pregnancy-calculator' ||
        toolId === 'due-date-calculator' ||
        toolId === 'pregnancy-weight-gain-calculator' ||
        toolId === 'pregnancy-conception-calculator' ||
        toolId === 'ovulation-calculator' ||
        toolId === 'conception-calculator' ||
        toolId === 'period-calculator') && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              First Day of Last Menstrual Period (LMP)
            </label>
            <input
              type="date"
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
            />
          </div>

          {pregnancyInfo && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-xs text-rose-700 font-bold uppercase tracking-wider">Estimated Due Date</span>
                <div className="text-3xl sm:text-4xl font-black text-rose-600 mt-2">{pregnancyInfo.dueDate}</div>
                <div className="mt-2 text-xs font-semibold text-rose-800">
                  Current progress: <span className="font-bold">{pregnancyInfo.gestationalAge}</span> ({pregnancyInfo.trimester})
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Estimated Conception Window</span>
                  <div className="text-sm font-bold text-slate-800 mt-1">Approx. 14 days after LMP</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Recommended Weight Gain</span>
                  <div className="text-sm font-bold text-slate-800 mt-1">11.5 - 16.0 kg (Normal BMI)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. One Rep Max & Pace */}
      {(toolId === 'one-rep-max-calculator' || toolId === 'pace-calculator') && (
        <div className="space-y-6">
          {toolId === 'one-rep-max-calculator' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Weight Lifted (kg/lbs)</label>
                  <input
                    type="number"
                    value={liftWeight}
                    onChange={(e) => setLiftWeight(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Reps Completed</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={liftReps}
                    onChange={(e) => setLiftReps(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
                <span className="text-xs text-blue-700 font-bold uppercase">Estimated One Rep Max (1RM)</span>
                <div className="text-4xl font-black text-slate-900 mt-1">{oneRepMax} units</div>
                <div className="grid grid-cols-3 gap-3 mt-4 text-xs font-semibold text-slate-700">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">80%: {Math.round(oneRepMax * 0.8)}</div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">85%: {Math.round(oneRepMax * 0.85)}</div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">90%: {Math.round(oneRepMax * 0.9)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Distance (Kilometers)</label>
                  <input
                    type="number"
                    value={raceDistanceKm}
                    onChange={(e) => setRaceDistanceKm(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Total Time (Minutes)</label>
                  <input
                    type="number"
                    value={raceTimeMins}
                    onChange={(e) => setRaceTimeMins(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                  />
                </div>
              </div>

              {paceInfo && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
                    <span className="text-xs text-blue-700 font-bold uppercase">Average Running Pace</span>
                    <div className="text-3xl font-black text-slate-900 mt-1">{paceInfo.paceFormatted}</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
                    <span className="text-xs text-emerald-800 font-bold uppercase">Average Speed</span>
                    <div className="text-3xl font-black text-emerald-700 mt-1">{paceInfo.speedKmh} km/h</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-xs text-slate-500 font-medium">Estimated Marathon Time</span>
                    <div className="text-2xl font-bold text-slate-900 mt-1">{paceInfo.marathonHours} hrs</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
