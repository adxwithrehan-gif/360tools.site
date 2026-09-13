import React, { useState, useRef } from 'react';
import { Upload, Tv, Camera, Download, Play, Pause, RefreshCw } from 'lucide-react';

type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3';

export const VideoAspectResizer: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [aspect, setAspect] = useState<AspectRatio>('9:16');
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [isPlaying, setIsPlaying] = useState(false);
  const [capturedFrameUrl, setCapturedFrameUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setFileName(file.name);
    setCapturedFrameUrl(null);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const captureStill = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedFrameUrl(dataUrl);
  };

  const aspectStyles: Record<AspectRatio, string> = {
    '16:9': 'aspect-video max-w-xl',
    '9:16': 'aspect-9/16 max-w-[260px]',
    '1:1': 'aspect-square max-w-[320px]',
    '4:3': 'aspect-4/3 max-w-md',
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
            accept="video/mp4, video/webm, video/quicktime"
            onChange={handleVideoUpload}
            className="hidden"
          />
          <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Tv className="w-7 h-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">
            Select a Video Clip (MP4, WebM, MOV)
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Preview framing for TikTok, Reels, Shorts, and Instagram, and snap high-resolution still photos.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold text-slate-800 truncate max-w-xs">{fileName}</span>
            <button
              onClick={() => { setVideoSrc(null); setCapturedFrameUrl(null); }}
              className="text-xs text-slate-500 hover:text-purple-600 font-semibold"
            >
              Change Video
            </button>
          </div>

          {/* Aspect controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-1.5">
              {(['16:9', '9:16', '1:1', '4:3'] as AspectRatio[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setAspect(r)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    aspect === r
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Fit Mode:</span>
              <button
                onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}
                className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-300 rounded-md capitalize"
              >
                {fitMode} (Toggle)
              </button>
            </div>
          </div>

          {/* Video Preview Container */}
          <div className="flex justify-center bg-slate-900 rounded-2xl p-4 sm:p-6 overflow-hidden">
            <div className={`w-full ${aspectStyles[aspect]} mx-auto bg-black rounded-xl overflow-hidden relative shadow-lg flex items-center justify-center`}>
              <video
                ref={videoRef}
                src={videoSrc}
                loop
                playsInline
                className={`w-full h-full ${fitMode === 'contain' ? 'object-contain' : 'object-cover'}`}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-opacity opacity-0 hover:opacity-100"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={togglePlay}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause Video' : 'Play Video'}
            </button>

            <button
              onClick={captureStill}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Capture Still Screenshot
            </button>
          </div>

          {/* Captured Frame Preview */}
          {capturedFrameUrl && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-900">Captured High-Resolution Still Frame</span>
                <a
                  href={capturedFrameUrl}
                  download="360toolapp-frame.png"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download PNG
                </a>
              </div>
              <img src={capturedFrameUrl} alt="Captured frame" className="max-h-60 rounded-lg border border-emerald-300 mx-auto" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
