import React, { useState, useRef, useEffect } from 'react';
import { Radio, Play, Pause, Volume2, Sparkles, Headphones } from 'lucide-react';

type WaveType = 'sine' | 'square' | 'sawtooth' | 'triangle';

export const ToneGenerator: React.FC = () => {
  const [frequency, setFrequency] = useState<number>(440);
  const [waveType, setWaveType] = useState<WaveType>('sine');
  const [volume, setVolume] = useState<number>(0.2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [binauralMode, setBinauralMode] = useState<boolean>(false);
  const [binauralBeatHz, setBinauralBeatHz] = useState<number>(7.83); // Schumann resonance

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const oscRightRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startTone = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Gain
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.connect(ctx.destination);
    gainNodeRef.current = gainNode;

    if (!binauralMode) {
      const osc = ctx.createOscillator();
      osc.type = waveType;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.connect(gainNode);
      osc.start();
      oscRef.current = osc;
    } else {
      // Stereo Binaural setup
      const merger = ctx.createChannelMerger(2);

      // Left oscillator
      const oscL = ctx.createOscillator();
      oscL.type = waveType;
      oscL.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Right oscillator
      const oscR = ctx.createOscillator();
      oscR.type = waveType;
      oscR.frequency.setValueAtTime(frequency + binauralBeatHz, ctx.currentTime);

      oscL.connect(merger, 0, 0); // Left channel
      oscR.connect(merger, 0, 1); // Right channel

      merger.connect(gainNode);

      oscL.start();
      oscR.start();

      oscRef.current = oscL;
      oscRightRef.current = oscR;
    }

    setIsPlaying(true);
  };

  const stopTone = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {}
      oscRef.current = null;
    }
    if (oscRightRef.current) {
      try {
        oscRightRef.current.stop();
        oscRightRef.current.disconnect();
      } catch {}
      oscRightRef.current = null;
    }
    setIsPlaying(false);
  };

  // Update frequency live if playing
  useEffect(() => {
    if (isPlaying && oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
      if (oscRightRef.current) {
        oscRightRef.current.frequency.setValueAtTime(frequency + binauralBeatHz, audioCtxRef.current.currentTime);
      }
    }
  }, [frequency, binauralBeatHz, isPlaying]);

  // Update volume live
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTone();
    };
  }, []);

  const presets = [
    { name: '100 Hz (Sub Bass)', hz: 100 },
    { name: '432 Hz (Healing A)', hz: 432 },
    { name: '440 Hz (Concert Pitch)', hz: 440 },
    { name: '528 Hz (Solfeggio Miracle)', hz: 528 },
    { name: '1000 Hz (1 kHz Calibrate)', hz: 1000 },
    { name: '8000 Hz (High Treble)', hz: 8000 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
      {/* Frequency Display */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 text-center shadow-inner relative overflow-hidden">
        <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center justify-center gap-1.5">
          <Radio className="w-3.5 h-3.5" />
          Live Audio Tone Frequency
        </div>
        <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-white my-2">
          {frequency.toFixed(1)} <span className="text-2xl font-normal text-purple-300">Hz</span>
        </div>
        <p className="text-xs text-slate-400 capitalize">
          Waveform: <strong className="text-purple-300">{waveType}</strong> • Mode:{' '}
          <strong className="text-purple-300">{binauralMode ? `Binaural (+${binauralBeatHz} Hz)` : 'Pure Mono/Stereo'}</strong>
        </p>

        {isPlaying && (
          <div className="mt-4 flex items-center justify-center gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-purple-400 rounded-full animate-pulse"
                style={{
                  height: `${12 + (i % 4) * 8}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Main Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Frequency Slider (20 Hz - 10,000 Hz):</span>
            <span className="font-mono text-purple-700 font-bold">{frequency} Hz</span>
          </div>
          <input
            type="range"
            min="20"
            max="10000"
            step="1"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>20 Hz (Sub-bass)</span>
            <span>1 kHz (Mid)</span>
            <span>10 kHz (High)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Volume Output ({Math.round(volume * 100)}%):</span>
            <Volume2 className="w-4 h-4 text-purple-600" />
          </div>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>
      </div>

      {/* Waveform types */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Oscillator Waveform
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(['sine', 'square', 'triangle', 'sawtooth'] as WaveType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setWaveType(type);
                if (isPlaying) {
                  stopTone();
                  setTimeout(startTone, 50);
                }
              }}
              className={`py-2 px-3 text-xs font-bold rounded-xl border capitalize transition-all ${
                waveType === type
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {type} Wave
            </button>
          ))}
        </div>
      </div>

      {/* Binaural Beats Toggle */}
      <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Headphones className="w-5 h-5 text-purple-600 shrink-0" />
          <div>
            <h5 className="text-xs font-bold text-purple-950">Binaural Beats (Headphones Recommended)</h5>
            <p className="text-[11px] text-purple-700">
              Plays base Hz in left ear and +{binauralBeatHz} Hz in right ear to stimulate brainwaves.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const next = !binauralMode;
            setBinauralMode(next);
            if (isPlaying) {
              stopTone();
              setTimeout(startTone, 50);
            }
          }}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors shrink-0 ${
            binauralMode ? 'bg-purple-700 text-white border-purple-700' : 'bg-white text-purple-800 border-purple-300'
          }`}
        >
          {binauralMode ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {/* Presets */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Popular Tone Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.hz}
              onClick={() => setFrequency(p.hz)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                frequency === p.hz
                  ? 'bg-purple-100 border-purple-400 text-purple-800 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Start / Stop */}
      <div className="pt-2">
        <button
          onClick={isPlaying ? stopTone : startTone}
          className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isPlaying ? 'Stop Audio Tone' : 'Play Sound Tone'}
        </button>
      </div>
    </div>
  );
};
