import React, { useState, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temp' | 'area' | 'speed';

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');

  // Conversion definitions relative to a base unit
  const unitsData: Record<UnitCategory, { base: string; units: Record<string, { name: string; toBase: (v: number) => number; fromBase: (v: number) => number }> }> = {
    length: {
      base: 'm',
      units: {
        m: { name: 'Meter (m)', toBase: (v) => v, fromBase: (v) => v },
        km: { name: 'Kilometer (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        cm: { name: 'Centimeter (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
        mm: { name: 'Millimeter (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        mi: { name: 'Mile (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
        yd: { name: 'Yard (yd)', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
        ft: { name: 'Foot (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
        in: { name: 'Inch (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      },
    },
    weight: {
      base: 'kg',
      units: {
        kg: { name: 'Kilogram (kg)', toBase: (v) => v, fromBase: (v) => v },
        g: { name: 'Gram (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        mg: { name: 'Milligram (mg)', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
        lb: { name: 'Pound (lb)', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
        oz: { name: 'Ounce (oz)', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      },
    },
    temp: {
      base: 'c',
      units: {
        c: { name: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
        f: { name: 'Fahrenheit (°F)', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
        k: { name: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
      },
    },
    area: {
      base: 'sqm',
      units: {
        sqm: { name: 'Square Meter (m²)', toBase: (v) => v, fromBase: (v) => v },
        sqkm: { name: 'Square Kilometer (km²)', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
        sqft: { name: 'Square Foot (ft²)', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
        acre: { name: 'Acre', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
        hectare: { name: 'Hectare (ha)', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      },
    },
    speed: {
      base: 'mps',
      units: {
        mps: { name: 'Meters / second (m/s)', toBase: (v) => v, fromBase: (v) => v },
        kph: { name: 'Kilometers / hour (km/h)', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
        mph: { name: 'Miles / hour (mph)', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
        knot: { name: 'Knot (kn)', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
      },
    },
  };

  const currentCategoryData = unitsData[category];

  // Convert
  const convertedResult = useMemo(() => {
    const fromDef = currentCategoryData.units[fromUnit] || Object.values(currentCategoryData.units)[0];
    const toDef = currentCategoryData.units[toUnit] || Object.values(currentCategoryData.units)[1];

    const baseVal = fromDef.toBase(inputValue);
    const finalVal = toDef.fromBase(baseVal);

    return Number(finalVal.toFixed(6));
  }, [category, fromUnit, toUnit, inputValue, currentCategoryData]);

  const handleCategorySwitch = (cat: UnitCategory) => {
    setCategory(cat);
    const keys = Object.keys(unitsData[cat].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 mb-6 border-b border-slate-100">
        {(
          [
            { id: 'length', label: 'Length' },
            { id: 'weight', label: 'Weight / Mass' },
            { id: 'temp', label: 'Temperature' },
            { id: 'area', label: 'Area' },
            { id: 'speed', label: 'Speed' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleCategorySwitch(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              category === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inputs and Converter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">From</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-lg font-bold font-mono mb-3"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
          >
            {Object.entries(currentCategoryData.units).map(([key, item]: [string, any]) => (
              <option key={key} value={key}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col justify-between">
          <label className="block text-xs font-bold text-blue-900 uppercase mb-2">Converted To</label>
          <div className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-lg font-bold font-mono text-blue-700 mb-3 overflow-x-auto">
            {convertedResult}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-semibold"
          >
            {Object.entries(currentCategoryData.units).map(([key, item]: [string, any]) => (
              <option key={key} value={key}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
