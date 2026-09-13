import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Pause, Scissors, Download, Volume2, Music, CheckCircle2 } from 'lucide-react';

export const AudioWaveformCutter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const f = e.target.files[0];
    setFile(f);
    setDownloadUrl(null);
    setIsDecoding(true);

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const arrayBuffer = await f.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer);

      setAudioBuffer(decoded);
      setDuration(decoded.duration);
      setStartTime(0);
      setEndTime(decoded.duration);

      drawWaveform(decoded);
    } catch (err) {
      console.error(err);
      alert('Could not decode audio file. Please try another MP3 or WAV file.');
    } finally {
      setIsDecoding(false);
    }
  };

  const drawWaveform = (buffer: AudioBuffer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / canvas.width);
    const amp = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#9333ea'; // Purple wave
    for (let i = 0; i < canvas.width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
  };

  const playTrimmedSection = () => {
    if (!audioBuffer) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    if (isPlaying) {
      sourceNodeRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const playDuration = Math.max(0.1, endTime - startTime);
    source.start(0, startTime, playDuration);
    sourceNodeRef.current = source;
    setIsPlaying(true);

    source.onended = () => {
      setIsPlaying(false);
    };
  };

  // Convert AudioBuffer segment to standard WAV blob
  const exportTrimmedWav = () => {
    if (!audioBuffer) return;
    const sampleRate = audioBuffer.sampleRate;
    const numChannels = audioBuffer.numberOfChannels;
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);
    const lengthSamples = Math.max(0, endSample - startSample);

    // Create interleaved PCM 16-bit
    const buffer = new ArrayBuffer(44 + lengthSamples * numChannels * 2);
    const view = new DataView(buffer);

    // RIFF identifier
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + lengthSamples * numChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // SubChunk1Size
    view.setUint16(20, 1, true); // AudioFormat PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true); // ByteRate
    view.setUint16(32, numChannels * 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample
    writeString(36, 'data');
    view.setUint32(40, lengthSamples * numChannels * 2, true);

    // Write samples
    let offset = 44;
    for (let i = 0; i < lengthSamples; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = audioBuffer.getChannelData(channel)[startSample + i];
        const clamped = Math.max(-1, Math.min(1, sample));
        const int16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
        view.setInt16(offset, int16, true);
        offset += 2;
      }
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = (secs % 60).toFixed(1);
    return `${m}:${Number(s) < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 hover:bg-purple-50/80 hover:border-purple-400 p-8 text-center transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Music className="w-7 h-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">
            Select an Audio File (MP3, WAV, OGG, AAC)
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Upload any song or recording to visualize waveform, isolate ringtones, and trim clips directly in browser.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-slate-500 font-mono">Total Duration: {formatTime(duration)}</p>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setAudioBuffer(null); setDownloadUrl(null); }}
              className="text-xs text-slate-500 hover:text-purple-600 font-semibold"
            >
              Choose Different Audio
            </button>
          </div>

          {/* Waveform Canvas */}
          <div className="relative rounded-xl border border-purple-200 bg-slate-50 p-2 overflow-hidden">
            <canvas ref={canvasRef} width={700} height={120} className="w-full h-28 rounded-lg" />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1 mt-1">
              <span>0:00</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Sliders for Start and End */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-purple-50/50 border border-purple-100">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Trim Start:</span>
                <span className="font-mono text-purple-700 font-bold">{formatTime(startTime)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={startTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val < endTime) setStartTime(val);
                }}
                className="w-full accent-purple-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Trim End:</span>
                <span className="font-mono text-purple-700 font-bold">{formatTime(endTime)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={endTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > startTime) setEndTime(val);
                }}
                className="w-full accent-purple-600"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={playTrimmedSection}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause Preview' : `Preview Segment (${formatTime(endTime - startTime)})`}
            </button>

            <button
              onClick={exportTrimmedWav}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              Cut & Export WAV
            </button>
          </div>
        </div>
      )}

      {/* Download Alert */}
      {downloadUrl && (
        <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">Trimmed Audio Ready!</h4>
              <p className="text-xs text-emerald-700">Your audio clip has been sliced to {formatTime(endTime - startTime)}.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download="360toolapp-trimmed.wav"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Trimmed Audio
          </a>
        </div>
      )}
    </div>
  );
};
