import React, { useState, useRef } from 'react';
import { Film, Camera, Download, ChevronLeft, ChevronRight, Trash2, Clock } from 'lucide-react';

interface StoredFrame {
  id: string;
  url: string;
  time: number;
}

export const VideoFrameExtractor: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [capturedFrames, setCapturedFrames] = useState<StoredFrame[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setFileName(file.name);
    setCapturedFrames([]);
    setCurrentTime(0);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const stepTime = (delta: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');

    const newFrame: StoredFrame = {
      id: Math.random().toString(36).substring(2, 9),
      url: dataUrl,
      time: video.currentTime,
    };

    setCapturedFrames((prev) => [newFrame, ...prev]);
  };

  const deleteFrame = (id: string) => {
    setCapturedFrames((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSec = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = (secs % 60).toFixed(2);
    return `${m}:${Number(s) < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {!videoSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 hover:bg-purple-50/80 hover:border-purple-400 p-8 text-center transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
          />
          <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Film className="w-7 h-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">
            Select Video to Extract Frames (MP4, MOV, WebM)
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Scrub precision frame-by-frame with millisecond step accuracy and save full-resolution snapshots.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold text-slate-800 truncate max-w-xs">{fileName}</span>
            <button
              onClick={() => setVideoSrc(null)}
              className="text-xs text-slate-500 hover:text-purple-600 font-semibold"
            >
              Change Video
            </button>
          </div>

          {/* Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden max-h-[380px] flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoSrc}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
              controls={false}
              className="max-h-[380px] w-auto mx-auto"
            />
          </div>

          {/* Time & Timeline Scrubbing */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-600">
              <span className="flex items-center gap-1 text-purple-700">
                <Clock className="w-3.5 h-3.5" />
                Time: {formatSec(currentTime)}
              </span>
              <span>Total: {formatSec(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 1}
              step="0.01"
              value={currentTime}
              onChange={(e) => {
                const t = Number(e.target.value);
                if (videoRef.current) videoRef.current.currentTime = t;
                setCurrentTime(t);
              }}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Precision Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <button
                onClick={() => stepTime(-0.5)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700"
              >
                -0.5s
              </button>
              <button
                onClick={() => stepTime(-0.04)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 flex items-center"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> -1 frame
              </button>
              <button
                onClick={() => stepTime(0.04)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 flex items-center"
              >
                +1 frame <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => stepTime(0.5)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700"
              >
                +0.5s
              </button>
            </div>

            <button
              onClick={captureFrame}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Snap Frame at {formatSec(currentTime)}
            </button>
          </div>

          {/* Captured Frames Gallery */}
          {capturedFrames.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Extracted Frames ({capturedFrames.length})
                </span>
                <button
                  onClick={() => setCapturedFrames([])}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {capturedFrames.map((frame) => (
                  <div
                    key={frame.id}
                    className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group"
                  >
                    <img src={frame.url} alt="Frame" className="w-full aspect-video object-cover" />
                    <div className="p-2 flex items-center justify-between text-[11px] font-mono bg-white">
                      <span className="text-slate-600 font-bold">{formatSec(frame.time)}</span>
                      <div className="flex items-center gap-1">
                        <a
                          href={frame.url}
                          download={`frame-${formatSec(frame.time).replace(':', '_')}.png`}
                          className="p-1 text-purple-600 hover:text-purple-800"
                          title="Download PNG"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => deleteFrame(frame.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
