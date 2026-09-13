import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Scissors, Download, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const SplitPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>('1-2');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please choose a valid PDF file.');
      return;
    }

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      setFile(selectedFile);
      setPageCount(count);
      setRangeInput(count > 1 ? `1-${Math.min(count, 3)}` : '1');
      setErrorMessage(null);
      setDownloadUrl(null);
    } catch (err) {
      setErrorMessage('Could not read PDF. It may be encrypted or corrupted.');
    }
  };

  const parsePageRange = (input: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const lower = Math.max(1, Math.min(start, end));
          const upper = Math.min(max, Math.max(start, end));
          for (let i = lower; i <= upper; i++) {
            pages.add(i - 1); // 0-indexed
          }
        }
      } else {
        const single = parseInt(trimmed, 10);
        if (!isNaN(single) && single >= 1 && single <= max) {
          pages.add(single - 1);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleExtract = async () => {
    if (!file || pageCount === 0) return;
    const selectedZeroIndices = parsePageRange(rangeInput, pageCount);

    if (selectedZeroIndices.length === 0) {
      setErrorMessage(`Please enter a valid page range between 1 and ${pageCount}.`);
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const arrayBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(srcPdf, selectedZeroIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to extract selected pages.');
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
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">
            Select a PDF Document to Extract Pages
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Upload any PDF and extract specific chapters, individual pages, or ranges.
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500 font-mono">
                  {pageCount} Total Pages • {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setDownloadUrl(null); }}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold"
            >
              Choose Different File
            </button>
          </div>

          <div className="p-5 bg-rose-50/50 rounded-xl border border-rose-100 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Specify Pages or Ranges to Extract (1 - {pageCount})
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="e.g. 1-3, 5, 8"
                  className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-rose-500"
                />
                <button
                  onClick={handleExtract}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Scissors className="w-4 h-4" />
                  )}
                  Extract Pages
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Tip: Combine commas and dashes like: <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">1-2, 4, 6-8</code>.
              </p>
            </div>
          </div>
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
              <h4 className="text-sm font-bold text-emerald-900">Extracted PDF Ready!</h4>
              <p className="text-xs text-emerald-700">Selected pages have been isolated into a new clean PDF.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download={`extracted-${rangeInput.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Extracted PDF
          </a>
        </div>
      )}
    </div>
  );
};
