import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileEdit, Download, CheckCircle2, Sparkles } from 'lucide-react';

export const TextToPdfTool: React.FC = () => {
  const [docTitle, setDocTitle] = useState('Document Notes');
  const [textContent, setTextContent] = useState(
    `Welcome to 360toolapp.online Text to PDF Generator.\n\nYou can compose notes, contracts, documentation, or code snippets here.\nEverything is rendered directly in your browser using pure client-side JavaScript.\n\nKey Advantages:\n1. 100% Private - No text is sent to external servers.\n2. Automatic line wrapping and multi-page pagination.\n3. Customizable font sizing, margins, and paper sizes.`
  );
  const [fontSize, setFontSize] = useState<number>(12);
  const [orientation, setOrientation] = useState<'p' | 'l'>('p');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const generatePdf = () => {
    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;

    let cursorY = 25;

    // Header Title
    if (docTitle.trim()) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(fontSize + 8);
      doc.text(docTitle, margin, cursorY);
      cursorY += 12;

      // Divider line
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 10;
    }

    // Body Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);

    const splitText = doc.splitTextToSize(textContent, maxLineWidth);

    splitText.forEach((line: string) => {
      if (cursorY > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += fontSize * 0.45;
    });

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    setDownloadUrl(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Document Title
          </label>
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-rose-500 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Orientation
            </label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as 'p' | 'l')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-rose-500"
            >
              <option value="p">Portrait (Vertical)</option>
              <option value="l">Landscape (Horizontal)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Body Font Size: {fontSize}pt
            </label>
            <input
              type="range"
              min="9"
              max="20"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              className="w-full accent-rose-600 mt-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Document Content / Notes
          </label>
          <textarea
            rows={10}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 font-mono focus:outline-rose-500 focus:bg-white leading-relaxed"
          ></textarea>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={generatePdf}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <FileEdit className="w-4 h-4" />
            Generate PDF
          </button>
        </div>
      </div>

      {downloadUrl && (
        <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">PDF Document Ready!</h4>
              <p className="text-xs text-emerald-700">Your text has been typeset and exported into PDF format.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download={`${(docTitle || 'document').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};
