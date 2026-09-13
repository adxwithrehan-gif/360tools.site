import React, { useState, useMemo } from 'react';
import { Copy, Check, RefreshCw, Calculator, ShieldCheck, Key, Dices, Clock, Calendar, Zap, Sparkles, Hash, ArrowRightLeft } from 'lucide-react';

interface UtilityToolProps {
  toolId: string;
}

export const GeneralUtilityTools: React.FC<UtilityToolProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Age Calculator State
  const [birthDate, setBirthDate] = useState('1998-05-15');
  const [targetAgeDate, setTargetAgeDate] = useState(new Date().toISOString().split('T')[0]);

  // 2. Password Generator State
  const [passLength, setPassLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generatedPass, setGeneratedPass] = useState('s7#Q9$mK2@vP8*xL');

  // 3. Base64 / URL Encode / Decode State
  const [codecInput, setCodecInput] = useState('Hello World! 360toolapp.online');
  const [codecMode, setCodecMode] = useState<'encode' | 'decode'>('encode');

  // 4. IP Subnet State
  const [ipAddress, setIpAddress] = useState('192.168.1.100');
  const [cidrPrefix, setCidrPrefix] = useState('24');

  // 5. GPA Calculator State
  const [courses, setCourses] = useState([
    { name: 'Course 1', grade: 'A', credits: 3 },
    { name: 'Course 2', grade: 'A-', credits: 4 },
    { name: 'Course 3', grade: 'B+', credits: 3 },
  ]);

  // 6. Tip Calculator State
  const [billAmount, setBillAmount] = useState('85.00');
  const [tipPercent, setTipPercent] = useState('18');
  const [numPeople, setNumPeople] = useState('3');

  // 7. Dice Roller State
  const [diceSides, setDiceSides] = useState(6);
  const [diceCount, setDiceCount] = useState(2);
  const [diceResults, setDiceResults] = useState<number[]>([4, 6]);

  // 8. Ohms Law / Electricity State
  const [voltage, setVoltage] = useState('120');
  const [current, setCurrent] = useState('10');

  // 9. Love Calculator State
  const [name1, setName1] = useState('Alex');
  const [name2, setName2] = useState('Jordan');

  // 10. Sleep Cycle State
  const [wakeTime, setWakeTime] = useState('07:00');

  // 11. Roman Numeral State
  const [romanInput, setRomanInput] = useState('2026');

  // 12. Fuel Cost State
  const [distance, setDistance] = useState('250');
  const [mpg, setMpg] = useState('28');
  const [gasPrice, setGasPrice] = useState('3.85');

  // 13. Square Footage / BTU / Concrete State
  const [roomLength, setRoomLength] = useState('20');
  const [roomWidth, setRoomWidth] = useState('15');
  const [slabDepth, setSlabDepth] = useState('4');

  // 14. Time / Hours / Time Card State
  const [timeIn, setTimeIn] = useState('09:00');
  const [timeOut, setTimeOut] = useState('17:30');
  const [breakMins, setBreakMins] = useState('30');
  const [hourlyWage, setHourlyWage] = useState('25');

  // Age calculations
  const ageResults = useMemo(() => {
    try {
      const b = new Date(birthDate);
      const t = new Date(targetAgeDate);
      if (isNaN(b.getTime()) || isNaN(t.getTime()) || b > t) return null;

      let years = t.getFullYear() - b.getFullYear();
      let months = t.getMonth() - b.getMonth();
      let days = t.getDate() - b.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonthDays = new Date(t.getFullYear(), t.getMonth(), 0).getDate();
        days += prevMonthDays;
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const diffMs = t.getTime() - b.getTime();
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const totalHours = totalDays * 24;

      // Next birthday countdown
      const nextBday = new Date(t.getFullYear(), b.getMonth(), b.getDate());
      if (nextBday < t) nextBday.setFullYear(t.getFullYear() + 1);
      const daysToNextBday = Math.ceil((nextBday.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));

      return { years, months, days, totalDays, totalWeeks, totalHours, daysToNextBday };
    } catch {
      return null;
    }
  }, [birthDate, targetAgeDate]);

  // Password Generation Logic
  const handleGeneratePassword = () => {
    let pool = '';
    if (useUpper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) pool += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) pool += '0123456789';
    if (useSymbols) pool += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!pool) pool = 'abcdefghijklmnopqrstuvwxyz';

    let res = '';
    const array = new Uint32Array(passLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < passLength; i++) {
      res += pool[array[i] % pool.length];
    }
    setGeneratedPass(res);
  };

  // Base64 & URL logic
  const codecOutput = useMemo(() => {
    try {
      if (toolId === 'base64-encode-decode') {
        if (codecMode === 'encode') {
          return btoa(unescape(encodeURIComponent(codecInput)));
        } else {
          return decodeURIComponent(escape(atob(codecInput)));
        }
      } else if (toolId === 'url-encode-decode') {
        if (codecMode === 'encode') {
          return encodeURIComponent(codecInput);
        } else {
          return decodeURIComponent(codecInput);
        }
      }
    } catch (e: any) {
      return `Invalid format for decoding: ${e.message}`;
    }
    return '';
  }, [toolId, codecInput, codecMode]);

  // IP Subnet calculations
  const subnetInfo = useMemo(() => {
    try {
      const parts = ipAddress.split('.').map(Number);
      if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return null;
      const prefix = parseInt(cidrPrefix);
      if (isNaN(prefix) || prefix < 0 || prefix > 32) return null;

      const ipNum = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
      const maskNum = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
      const netNum = (ipNum & maskNum) >>> 0;
      const bcastNum = (netNum | ~maskNum) >>> 0;

      const toIp = (num: number) =>
        [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');

      const totalHosts = Math.pow(2, 32 - prefix);
      const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : totalHosts - 2;

      return {
        subnetMask: toIp(maskNum),
        networkAddress: toIp(netNum),
        broadcastAddress: toIp(bcastNum),
        firstUsable: prefix >= 31 ? toIp(netNum) : toIp(netNum + 1),
        lastUsable: prefix >= 31 ? toIp(bcastNum) : toIp(bcastNum - 1),
        totalHosts,
        usableHosts: Math.max(0, usableHosts),
      };
    } catch {
      return null;
    }
  }, [ipAddress, cidrPrefix]);

  // Dice roll handler
  const rollDice = () => {
    const rolls: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(Math.floor(Math.random() * diceSides) + 1);
    }
    setDiceResults(rolls);
  };

  // GPA computation
  const gradePoints: Record<string, number> = {
    'A+': 4.0, A: 4.0, 'A-': 3.7,
    'B+': 3.3, B: 3.0, 'B-': 2.7,
    'C+': 2.3, C: 2.0, 'C-': 1.7,
    'D+': 1.3, D: 1.0, F: 0.0,
  };

  const gpaResult = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach((c) => {
      const pts = gradePoints[c.grade] ?? 0;
      totalPoints += pts * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  }, [courses]);

  // Roman Numeral Converter
  const romanOutput = useMemo(() => {
    const val = romanInput.trim().toUpperCase();
    if (!val) return '';
    // If input is number
    if (/^\d+$/.test(val)) {
      let num = parseInt(val);
      if (num > 3999 || num <= 0) return 'Number must be between 1 and 3999';
      const romanMatrix: [number, string][] = [
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
        [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
        [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
      ];
      let res = '';
      for (const [v, r] of romanMatrix) {
        while (num >= v) {
          res += r;
          num -= v;
        }
      }
      return res;
    } else {
      // Roman to Decimal
      const romanMap: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let total = 0;
      for (let i = 0; i < val.length; i++) {
        const curr = romanMap[val[i]];
        const next = romanMap[val[i + 1]];
        if (!curr) return 'Invalid Roman Numeral Character';
        if (next && curr < next) {
          total -= curr;
        } else {
          total += curr;
        }
      }
      return `${total}`;
    }
  }, [romanInput]);

  // Render Tool based on toolId
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      {/* 1. Age Calculator */}
      {(toolId === 'age-calculator' || toolId === 'date-calculator' || toolId === 'day-counter' || toolId === 'day-of-the-week-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Date of Birth / Start Date
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-medium text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target Date / Today
              </label>
              <input
                type="date"
                value={targetAgeDate}
                onChange={(e) => setTargetAgeDate(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-medium text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          {ageResults && (
            <div className="space-y-4 pt-2">
              <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Calculated Age</span>
                <div className="mt-2 text-3xl sm:text-4xl font-black text-slate-900">
                  {ageResults.years} <span className="text-lg font-bold text-slate-600">years</span> {ageResults.months} <span className="text-lg font-bold text-slate-600">months</span> {ageResults.days} <span className="text-lg font-bold text-slate-600">days</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Total Days</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">{ageResults.totalDays.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Total Weeks</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">{ageResults.totalWeeks.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Total Hours</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">{ageResults.totalHours.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Next Birthday</span>
                  <div className="text-xl font-bold text-blue-600 mt-1">{ageResults.daysToNextBday} days</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Password Generator */}
      {toolId === 'password-generator' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div className="font-mono text-lg sm:text-xl font-bold text-slate-900 tracking-wider break-all select-all">
              {generatedPass}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleGeneratePassword}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                title="Regenerate Password"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => copyToClipboard(generatedPass)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-2xs"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Password Length: {passLength}</span>
                <span className={passLength >= 16 ? 'text-emerald-600' : 'text-amber-600'}>
                  {passLength >= 16 ? 'Very Strong' : passLength >= 12 ? 'Strong' : 'Moderate'}
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={passLength}
                onChange={(e) => setPassLength(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Uppercase (A-Z)', val: useUpper, set: setUseUpper },
                { label: 'Lowercase (a-z)', val: useLower, set: setUseLower },
                { label: 'Numbers (0-9)', val: useNumbers, set: setUseNumbers },
                { label: 'Symbols (!@#$)', val: useSymbols, set: setUseSymbols },
              ].map((opt, i) => (
                <label key={i} className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={opt.val}
                    onChange={(e) => opt.set(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Base64 & URL Encode/Decode */}
      {(toolId === 'base64-encode-decode' || toolId === 'url-encode-decode') && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCodecMode('encode')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                codecMode === 'encode' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Encode Mode
            </button>
            <button
              onClick={() => setCodecMode('decode')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                codecMode === 'decode' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Decode Mode
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Input String
            </label>
            <textarea
              rows={4}
              value={codecInput}
              onChange={(e) => setCodecInput(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-xl font-mono text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Processed Output
              </label>
              <button
                onClick={() => copyToClipboard(codecOutput)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Output'}
              </button>
            </div>
            <textarea
              rows={4}
              readOnly
              value={codecOutput}
              className="w-full p-4 border border-slate-200 rounded-xl font-mono text-sm text-slate-900 bg-slate-100 outline-hidden select-all"
            />
          </div>
        </div>
      )}

      {/* 4. IP Subnet Calculator */}
      {toolId === 'ip-subnet-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                IPv4 Address
              </label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="192.168.1.1"
                className="w-full p-3 border border-slate-300 rounded-xl font-mono text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                CIDR Prefix (/xx)
              </label>
              <select
                value={cidrPrefix}
                onChange={(e) => setCidrPrefix(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-mono text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                {Array.from({ length: 33 }, (_, i) => (
                  <option key={i} value={i}>/{i} (2^{32 - i} addresses)</option>
                ))}
              </select>
            </div>
          </div>

          {subnetInfo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Subnet Mask</span>
                <div className="font-mono text-base font-bold text-slate-900 mt-1">{subnetInfo.subnetMask}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Network Address</span>
                <div className="font-mono text-base font-bold text-slate-900 mt-1">{subnetInfo.networkAddress}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Broadcast Address</span>
                <div className="font-mono text-base font-bold text-slate-900 mt-1">{subnetInfo.broadcastAddress}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Usable Host Range</span>
                <div className="font-mono text-xs font-bold text-blue-600 mt-1">
                  {subnetInfo.firstUsable} - {subnetInfo.lastUsable}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 sm:col-span-2 text-center">
                <span className="text-xs text-blue-700 font-bold uppercase">Total Usable Hosts</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {subnetInfo.usableHosts.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Tip Calculator */}
      {toolId === 'tip-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Bill Amount ($)
              </label>
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tip Percentage (%)
              </label>
              <input
                type="number"
                value={tipPercent}
                onChange={(e) => setTipPercent(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Split (Number of People)
              </label>
              <input
                type="number"
                min="1"
                value={numPeople}
                onChange={(e) => setNumPeople(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {(() => {
            const bill = parseFloat(billAmount) || 0;
            const tipPct = parseFloat(tipPercent) || 0;
            const people = Math.max(1, parseInt(numPeople) || 1);
            const totalTip = (bill * tipPct) / 100;
            const grandTotal = bill + totalTip;
            const tipPerPerson = totalTip / people;
            const totalPerPerson = grandTotal / people;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Total Tip</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">${totalTip.toFixed(2)}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Grand Total</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">${grandTotal.toFixed(2)}</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
                  <span className="text-xs text-blue-700 font-bold">Tip per Person</span>
                  <div className="text-xl font-bold text-blue-600 mt-1">${tipPerPerson.toFixed(2)}</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 font-bold">Total per Person</span>
                  <div className="text-xl font-bold text-emerald-700 mt-1">${totalPerPerson.toFixed(2)}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 6. Dice Roller */}
      {toolId === 'dice-roller' && (
        <div className="space-y-6 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            {[4, 6, 8, 10, 12, 20, 100].map((sides) => (
              <button
                key={sides}
                onClick={() => setDiceSides(sides)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  diceSides === sides ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                d{sides}
              </button>
            ))}
          </div>

          <div className="flex justify-center items-center gap-3">
            <span className="text-xs font-bold text-slate-600">Number of Dice:</span>
            {[1, 2, 3, 4, 5].map((cnt) => (
              <button
                key={cnt}
                onClick={() => setDiceCount(cnt)}
                className={`w-8 h-8 rounded-lg text-xs font-bold ${
                  diceCount === cnt ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 py-4">
            {diceResults.map((val, idx) => (
              <div
                key={idx}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 flex flex-col items-center justify-center shadow-md animate-pulse"
              >
                <span className="text-3xl font-black text-blue-900">{val}</span>
                <span className="text-[10px] text-blue-600 font-semibold">d{diceSides}</span>
              </div>
            ))}
          </div>

          <div className="text-sm font-bold text-slate-600">
            Total Sum: <span className="text-2xl font-black text-slate-900">{diceResults.reduce((a, b) => a + b, 0)}</span>
          </div>

          <button
            onClick={rollDice}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Dices className="w-5 h-5" />
            Roll Dice Now
          </button>
        </div>
      )}

      {/* 7. Ohms Law / Resistor / Electricity */}
      {(toolId === 'ohms-law-calculator' || toolId === 'voltage-drop-calculator' || toolId === 'resistor-calculator' || toolId === 'electricity-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Voltage (Volts - V)
              </label>
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Current (Amperes - I)
              </label>
              <input
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {(() => {
            const v = parseFloat(voltage) || 0;
            const i = parseFloat(current) || 0;
            const r = i > 0 ? v / i : 0;
            const p = v * i;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Resistance (R)</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">{r.toFixed(2)} Ω</div>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-center">
                  <span className="text-xs text-amber-800 font-bold">Power (P)</span>
                  <div className="text-xl font-bold text-amber-700 mt-1">{p.toFixed(2)} Watts</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
                  <span className="text-xs text-blue-700 font-bold">Kilowatts (kW)</span>
                  <div className="text-xl font-bold text-blue-600 mt-1">{(p / 1000).toFixed(3)} kW</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 font-bold">Cost @ $0.15/kWh (10h)</span>
                  <div className="text-xl font-bold text-emerald-700 mt-1">${((p / 1000) * 10 * 0.15).toFixed(2)}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 8. Roman Numeral Converter */}
      {toolId === 'roman-numeral-converter' && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Enter Integer (1-3999) or Roman Numerals (e.g. MMXXVI)
            </label>
            <input
              type="text"
              value={romanInput}
              onChange={(e) => setRomanInput(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-xl font-mono text-lg uppercase text-slate-900 bg-slate-50"
            />
          </div>

          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase">Converted Result</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 select-all font-mono">
                {romanOutput}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(romanOutput)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-blue-700"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy
            </button>
          </div>
        </div>
      )}

      {/* 9. Fuel Cost Calculator */}
      {(toolId === 'fuel-cost-calculator' || toolId === 'gas-mileage-calculator' || toolId === 'mileage-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Trip Distance (Miles)
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Fuel Efficiency (MPG)
              </label>
              <input
                type="number"
                value={mpg}
                onChange={(e) => setMpg(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Gas Price ($ / Gallon)
              </label>
              <input
                type="number"
                step="0.01"
                value={gasPrice}
                onChange={(e) => setGasPrice(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {(() => {
            const dist = parseFloat(distance) || 0;
            const efficiency = parseFloat(mpg) || 1;
            const price = parseFloat(gasPrice) || 0;
            const gallonsNeeded = dist / efficiency;
            const totalCost = gallonsNeeded * price;
            const costPerMile = dist > 0 ? totalCost / dist : 0;

            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Gallons of Fuel Needed</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{gallonsNeeded.toFixed(2)} gal</div>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 font-bold uppercase">Total Estimated Fuel Cost</span>
                  <div className="text-3xl font-black text-emerald-700 mt-1">${totalCost.toFixed(2)}</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Cost Per Mile</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">${costPerMile.toFixed(3)}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 10. Square Footage / BTU / Concrete */}
      {(toolId === 'square-footage-calculator' || toolId === 'btu-calculator' || toolId === 'concrete-calculator' || toolId === 'roofing-calculator' || toolId === 'tile-calculator' || toolId === 'mulch-calculator' || toolId === 'gravel-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Length (Feet)
              </label>
              <input
                type="number"
                value={roomLength}
                onChange={(e) => setRoomLength(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Width (Feet)
              </label>
              <input
                type="number"
                value={roomWidth}
                onChange={(e) => setRoomWidth(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Thickness / Depth (Inches)
              </label>
              <input
                type="number"
                value={slabDepth}
                onChange={(e) => setSlabDepth(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {(() => {
            const l = parseFloat(roomLength) || 0;
            const w = parseFloat(roomWidth) || 0;
            const dInches = parseFloat(slabDepth) || 0;
            const sqFt = l * w;
            const cubicYards = (l * w * (dInches / 12)) / 27;
            const btuNeeded = Math.round(sqFt * 20); // 20 BTU per sq ft rule of thumb
            const bags60lb = Math.ceil(cubicYards * 60);

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Total Area</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">{sqFt.toLocaleString()} sq ft</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
                  <span className="text-xs text-blue-700 font-bold">Cubic Yards</span>
                  <div className="text-xl font-bold text-blue-600 mt-1">{cubicYards.toFixed(2)} yd³</div>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-center">
                  <span className="text-xs text-amber-800 font-bold">AC Cooling BTUs</span>
                  <div className="text-xl font-bold text-amber-700 mt-1">{btuNeeded.toLocaleString()} BTU</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 font-bold">60-lb Bags Needed</span>
                  <div className="text-xl font-bold text-emerald-700 mt-1">{bags60lb} bags</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 11. Time Card & Hours Calculator */}
      {(toolId === 'time-calculator' || toolId === 'hours-calculator' || toolId === 'time-card-calculator' || toolId === 'time-duration-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Clock In Time
              </label>
              <input
                type="time"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-medium text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Clock Out Time
              </label>
              <input
                type="time"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-medium text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Unpaid Break (Minutes)
              </label>
              <input
                type="number"
                value={breakMins}
                onChange={(e) => setBreakMins(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Hourly Wage ($)
              </label>
              <input
                type="number"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          {(() => {
            const [inH, inM] = timeIn.split(':').map(Number);
            const [outH, outM] = timeOut.split(':').map(Number);
            let totalMins = (outH * 60 + outM) - (inH * 60 + inM);
            if (totalMins < 0) totalMins += 24 * 60; // overnight shift
            const workedMins = Math.max(0, totalMins - (parseInt(breakMins) || 0));
            const workedHours = workedMins / 60;
            const wage = parseFloat(hourlyWage) || 0;
            const grossPay = workedHours * wage;

            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 font-medium">Total Shift Time</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    {Math.floor(totalMins / 60)}h {totalMins % 60}m
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
                  <span className="text-xs text-blue-700 font-bold">Net Work Hours</span>
                  <div className="text-2xl font-black text-blue-600 mt-1">{workedHours.toFixed(2)} hrs</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 font-bold uppercase">Estimated Gross Pay</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">${grossPay.toFixed(2)}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 12. Love Compatibility Calculator */}
      {toolId === 'love-calculator' && (
        <div className="space-y-6 text-center max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Person 1 Name
              </label>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 text-center bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Person 2 Name
              </label>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 text-center bg-slate-50"
              />
            </div>
          </div>

          {(() => {
            const combined = (name1 + name2).toLowerCase().replace(/[^a-z]/g, '');
            let hash = 0;
            for (let i = 0; i < combined.length; i++) {
              hash = (hash << 5) - hash + combined.charCodeAt(i);
              hash |= 0;
            }
            const pct = Math.abs(hash % 41) + 60; // 60% to 100%

            return (
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Love Compatibility Index
                </span>
                <div className="text-4xl sm:text-5xl font-black text-rose-600">
                  {name1 && name2 ? `${pct}%` : '--'}
                </div>
                <p className="text-xs text-rose-800 font-medium">
                  {pct >= 90 ? 'Soulmate level connection! High harmony and chemistry.' : pct >= 75 ? 'Great pairing! Strong mutual respect and support.' : 'Good connection with room to grow!'}
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* 13. Sleep Cycle Calculator */}
      {toolId === 'sleep-calculator' && (
        <div className="space-y-6 max-w-xl mx-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              What time do you need to wake up?
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50 text-center text-xl"
            />
          </div>

          {(() => {
            const [h, m] = wakeTime.split(':').map(Number);
            const wakeDate = new Date();
            wakeDate.setHours(h, m, 0, 0);

            // Calculate backwards in 90-minute sleep cycles + 15 mins to fall asleep
            const cycles = [6, 5, 4, 3]; // 9h, 7.5h, 6h, 4.5h

            return (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
                  Optimal Times to Fall Asleep (90-min Sleep Cycles)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {cycles.map((c) => {
                    const bedTime = new Date(wakeDate.getTime() - (c * 90 + 15) * 60 * 1000);
                    const timeStr = bedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div
                        key={c}
                        className={`p-4 rounded-xl border text-center ${
                          c === 5
                            ? 'bg-blue-50 border-blue-300 text-blue-900 ring-2 ring-blue-400'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="text-lg font-black">{timeStr}</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-1">{c} cycles ({c * 1.5} hrs)</div>
                        {c === 5 && <div className="text-[10px] font-bold text-blue-600 mt-0.5">Recommended</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
