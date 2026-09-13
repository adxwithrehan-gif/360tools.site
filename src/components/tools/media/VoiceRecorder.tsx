import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download, RefreshCw, Volume2 } from 'lucide-react';

export const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Web Audio Analyser for live mic visualization
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      visualizeMic();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);

        // Stop all mic tracks
        stream.getTracks().forEach((track) => track.stop());
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioUrl(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Microphone access was denied or not found. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const visualizeMic = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    render();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const formatSecs = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
      <div className="text-center">
        <div className="text-5xl font-mono font-extrabold text-slate-900 mb-2">
          {formatSecs(recordingTime)}
        </div>
        <p className="text-xs text-slate-500 font-medium">
          {isRecording ? 'Recording audio from your microphone...' : 'Press the button below to start voice recording.'}
        </p>
      </div>

      {/* Visualizer Canvas */}
      <div className="h-20 bg-slate-900 rounded-xl p-2 flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} width={300} height={70} className="w-full h-full" />
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center gap-2.5 transition-all"
          >
            <Mic className="w-5 h-5" />
            Start Voice Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center gap-2.5 transition-all animate-pulse"
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </button>
        )}
      </div>

      {/* Audio Playback & Download */}
      {audioUrl && (
        <div className="p-5 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
              Recording Ready ({formatSecs(recordingTime)})
            </span>
            <button
              onClick={() => { setAudioUrl(null); setRecordingTime(0); }}
              className="text-xs text-slate-500 hover:text-purple-600 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Record Again
            </button>
          </div>

          <audio src={audioUrl} controls className="w-full rounded-lg" />

          <div className="flex justify-end">
            <a
              href={audioUrl}
              download={`voice-note-${Date.now()}.webm`}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Audio File (.webm)
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
