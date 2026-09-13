import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, FileText, ArrowUp, ArrowDown, Trash2, Download, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface UploadedPdf {
  id: string;
  file: File;
  name: string;
  size: string;
  pageCount?: number;
}

export const MergePdfTool: React.FC = () => {
  const [files, setFiles] = useState<UploadedPdf[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setErrorMessage(null);
    setDownloadUrl(null);

    const newFiles: UploadedPdf[] = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        newFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          size: formatFileSize(file.size),
        });
      }
    }

    if (newFiles.length === 0) {
      setErrorMessage('Please upload valid PDF documents (.pdf)');
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setDownloadUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setErrorMessage('Please add at least 2 PDF files to merge.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setProgressText('Initializing PDF Document Builder...');

      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        setProgressText(`Processing document ${i + 1} of ${files.length}: "${files[i].name}"...`);
        const arrayBuffer = await files[i].file.arrayBuffer();
        const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      setProgressText('Finalizing merged PDF document...');
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgressText('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to merge PDF files. One of the documents may be password-protected or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFiles([]);
    setDownloadUrl(null);
    setErrorMessage(null);
    setProgressText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 hover:bg-rose-50/80 hover:border-rose-400 p-8 text-center transition-all"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-105 transition-transform">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-800">
          Click to Select or Drag & Drop PDF Files
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Select multiple PDF files to combine. Files are processed locally on your device for absolute privacy.
        </p>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Selected Documents ({files.length})
            </span>
            <button
              onClick={resetAll}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Clear List
            </button>
          </div>

          <div className="space-y-2.5">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {index + 1}
                  </div>
                  <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{item.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 disabled:opacity-30 rounded transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === files.length - 1}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 disabled:opacity-30 rounded transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors ml-1"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge Trigger Button */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleMerge}
              disabled={isProcessing || files.length < 2}
              className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Merging Documents...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Merge {files.length} PDF Documents</span>
                </>
              )}
            </button>

            {isProcessing && (
              <span className="text-xs text-slate-500 font-medium animate-pulse">
                {progressText}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Download Action Area */}
      {downloadUrl && (
        <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">PDFs Successfully Merged!</h4>
              <p className="text-xs text-emerald-700">Your single combined PDF is ready for immediate download.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download="360toolapp-merged.pdf"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Merged PDF
          </a>
        </div>
      )}
    </div>
  );
};
