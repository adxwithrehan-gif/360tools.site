import React, { useState, useEffect } from 'react';
import { Delete, History, Trash2, Equal } from 'lucide-react';

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [isRad, setIsRad] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const inputDigit = (digit: string) => {
    setDisplay((prev) => (prev === '0' || prev === 'Error' ? digit : prev + digit));
  };

  const inputDot = () => {
    if (!display.includes('.')) {
      setDisplay((prev) => prev + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setFormula('');
  };

  const backspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleOperator = (op: string) => {
    setFormula(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculateFactorial = (n: number): number => {
    if (n < 0 || n > 170) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const scientificOp = (op: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    const toRad = isRad ? val : (val * Math.PI) / 180;

    switch (op) {
      case 'sin':
        res = Math.sin(toRad);
        break;
      case 'cos':
        res = Math.cos(toRad);
        break;
      case 'tan':
        res = Math.tan(toRad);
        break;
      case 'sqrt':
        res = Math.sqrt(val);
        break;
      case 'sqr':
        res = val * val;
        break;
      case 'cube':
        res = val * val * val;
        break;
      case 'log':
        res = Math.log10(val);
        break;
      case 'ln':
        res = Math.log(val);
        break;
      case 'fact':
        res = calculateFactorial(Math.round(val));
        break;
      case 'inv':
        res = 1 / val;
        break;
      case 'neg':
        res = -val;
        break;
      default:
        return;
    }

    const formatted = parseFloat(res.toFixed(8)).toString();
    setHistory((prev) => [`${op}(${display}) = ${formatted}`, ...prev.slice(0, 9)]);
    setDisplay(formatted);
  };

  const evaluateResult = () => {
    try {
      const fullExpression = (formula + display)
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

      // Safe evaluation with math tokens only
      if (!/^[0-9+\-*/().\s*]+$/.test(fullExpression)) {
        setDisplay('Error');
        return;
      }

      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${fullExpression})`)();
      const formatted = parseFloat(Number(result).toFixed(8)).toString();

      setHistory((prev) => [`${formula + display} = ${formatted}`, ...prev.slice(0, 9)]);
      setDisplay(formatted);
      setFormula('');
    } catch {
      setDisplay('Error');
    }
  };

  // Memory functions
  const memoryAdd = () => setMemory((prev) => prev + parseFloat(display || '0'));
  const memorySub = () => setMemory((prev) => prev - parseFloat(display || '0'));
  const memoryRecall = () => setDisplay(memory.toString());
  const memoryClear = () => setMemory(0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 max-w-2xl mx-auto">
      {/* Top Display */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 mb-5 shadow-inner relative">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
          <span className="flex items-center gap-2">
            <button
              onClick={() => setIsRad(!isRad)}
              className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-blue-400 hover:bg-slate-700 transition-colors"
            >
              {isRad ? 'RAD' : 'DEG'}
            </button>
            {memory !== 0 && <span className="text-amber-400 font-bold">M ({memory})</span>}
          </span>
          <span className="truncate max-w-[200px]">{formula}</span>
        </div>

        <div className="text-right text-3xl sm:text-4xl font-extrabold font-mono tracking-wider overflow-x-auto whitespace-nowrap pb-1">
          {display}
        </div>
      </div>

      {/* Function and Keypad Grid */}
      <div className="grid grid-cols-5 gap-2 text-xs font-bold">
        {/* Row 1: Memory & Specials */}
        <button onClick={memoryClear} className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">MC</button>
        <button onClick={memoryRecall} className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">MR</button>
        <button onClick={memoryAdd} className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">M+</button>
        <button onClick={memorySub} className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">M-</button>
        <button onClick={clearAll} className="p-2.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700">C</button>

        {/* Row 2: Scientific Trig */}
        <button onClick={() => scientificOp('sin')} className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800">sin</button>
        <button onClick={() => scientificOp('cos')} className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800">cos</button>
        <button onClick={() => scientificOp('tan')} className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800">tan</button>
        <button onClick={() => scientificOp('log')} className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800">log</button>
        <button onClick={() => scientificOp('ln')} className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800">ln</button>

        {/* Row 3: Powers & Roots */}
        <button onClick={() => scientificOp('sqrt')} className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800">√x</button>
        <button onClick={() => scientificOp('sqr')} className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800">x²</button>
        <button onClick={() => scientificOp('cube')} className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800">x³</button>
        <button onClick={() => scientificOp('fact')} className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800">x!</button>
        <button onClick={() => handleOperator('÷')} className="p-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-base">÷</button>

        {/* Row 4: 7 8 9 * */}
        <button onClick={() => inputDigit('(')} className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">(</button>
        <button onClick={() => inputDigit('7')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-base shadow-xs">7</button>
        <button onClick={() => inputDigit('8')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-base shadow-xs">8</button>
        <button onClick={() => inputDigit('9')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-base shadow-xs">9</button>
        <button onClick={() => handleOperator('×')} className="p-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-base">×</button>

        {/* Row 5: 4 5 6 - */}
        <button onClick={() => inputDigit(')')} className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">)</button>
        <button onClick={() => inputDigit('4')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-base shadow-xs">4</button>
        <button onClick={() => inputDigit('5')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-base shadow-xs">5</button>
        <button onClick={() => inputDigit('6')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-base shadow-xs">6</button>
        <button onClick={() => handleOperator('-')} className="p-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-base">−</button>

        {/* Row 6: 1 2 3 + */}
        <button onClick={() => setDisplay(Math.PI.toFixed(6))} className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800">π</button>
        <button onClick={() => inputDigit('1')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-base shadow-xs">1</button>
        <button onClick={() => inputDigit('2')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-base shadow-xs">2</button>
        <button onClick={() => inputDigit('3')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-base shadow-xs">3</button>
        <button onClick={() => handleOperator('+')} className="p-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-base">+</button>

        {/* Row 7: 0 . +/- = */}
        <button onClick={() => setDisplay(Math.E.toFixed(6))} className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800">e</button>
        <button onClick={() => scientificOp('neg')} className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">±</button>
        <button onClick={() => inputDigit('0')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-base shadow-xs">0</button>
        <button onClick={inputDot} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-base shadow-xs">.</button>
        <button onClick={evaluateResult} className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base shadow-md flex items-center justify-center">
          <Equal className="w-5 h-5" />
        </button>
      </div>

      {/* History Drawer Toggle */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1.5"
        >
          <History className="w-3.5 h-3.5" />
          {showHistory ? 'Hide History' : `Show History (${history.length})`}
        </button>

        <button
          onClick={backspace}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1"
        >
          <Delete className="w-3.5 h-3.5" /> Backspace
        </button>
      </div>

      {showHistory && history.length > 0 && (
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-1.5">
          <div className="flex justify-between items-center text-slate-400 uppercase text-[10px] font-bold mb-1">
            <span>Recent Calculations</span>
            <button onClick={() => setHistory([])} className="hover:text-rose-600">Clear</button>
          </div>
          {history.map((h, i) => (
            <div key={i} className="text-slate-700 truncate">{h}</div>
          ))}
        </div>
      )}
    </div>
  );
};
