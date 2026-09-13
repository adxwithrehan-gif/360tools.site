import React, { useState, useRef } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { Upload, Stamp, Download, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const WatermarkPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.25);
  const [fontSize, setFontSize] = useState(48);
  const [rotation, setRotation] = useState(-45);
  const [colorHex, setColorHex] = useState('#e11d48'); // Rose
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const f = e.target.files[0];
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please select a valid PDF file.');
      return;
    }
    setFile(f);
    setErrorMessage(null);
    setDownloadUrl(null);
  };

  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    return rgb(r, g, b);
  };

  const applyWatermark = async () => {
    if (!file || !watermarkText.trim()) return;

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();
      const markColor = hexToRgb(colorHex);

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        page.drawText(watermarkText, {
          x: width / 2 - textWidth / 2 + 10,
          y: height / 2 - textHeight / 2,
          size: fontSize,
          font,
          color: markColor,
          opacity: opacity,
          rotate: degrees(rotation),
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to apply watermark.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 hover:bg-rose-50/80 hover:border-rose-400 p-8 text-center transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="hidden"
          />
          <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <Stamp className="w-7 h-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">
            Select a PDF Document to Watermark
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Add custom security or brand watermarks (CONFIDENTIAL, DRAFT, COPY) across all pages.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setDownloadUrl(null); }}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold"
            >
              Change File
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="CONFIDENTIAL"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:outline-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Opacity: {Math.round(opacity * 100)}%
              </label>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-rose-600 mt-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="20"
                max="90"
                step="2"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                className="w-full accent-rose-600 mt-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Rotation Angle: {rotation}°
              </label>
              <input
                type="range"
                min="-90"
                max="90"
                step="5"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                className="w-full accent-rose-600 mt-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Color
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-600">{colorHex}</span>
              </div>
            </div>
          </div>

          <button
            onClick={applyWatermark}
            disabled={isProcessing || !watermarkText.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Stamping Watermark...</span>
              </>
            ) : (
              <>
                <Stamp className="w-4 h-4" />
                <span>Stamp Watermark on All Pages</span>
              </>
            )}
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {downloadUrl && (
        <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">Watermark Applied Successfully!</h4>
              <p className="text-xs text-emerald-700">Your stamped PDF is protected and ready for download.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download="360toolapp-watermarked.pdf"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Watermarked PDF
          </a>
        </div>
      )}
    </div>
  );
};
