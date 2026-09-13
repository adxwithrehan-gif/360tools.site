import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Upload, Image as ImageIcon, Download, Trash2, ArrowUp, ArrowDown, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  width: number;
  height: number;
}

export const ImageToPdfTool: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [orientation, setOrientation] = useState<'p' | 'l'>('p');
  const [margin, setMargin] = useState<number>(10); // mm
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    filesArray.forEach((file: File) => {
      if (!file.type.startsWith('image/')) return;
      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        setImages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            file,
            previewUrl,
            name: file.name,
            width: img.width,
            height: img.height,
          },
        ]);
      };
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
    setDownloadUrl(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setDownloadUrl(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;

    try {
      setIsConverting(true);
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage(pageSize, orientation);

        const imgItem = images[i];
        const imgRatio = imgItem.width / imgItem.height;
        const pageRatio = usableWidth / usableHeight;

        let renderWidth = usableWidth;
        let renderHeight = usableHeight;
        let x = margin;
        let y = margin;

        if (imgRatio > pageRatio) {
          renderWidth = usableWidth;
          renderHeight = usableWidth / imgRatio;
          y = margin + (usableHeight - renderHeight) / 2;
        } else {
          renderHeight = usableHeight;
          renderWidth = usableHeight * imgRatio;
          x = margin + (usableWidth - renderWidth) / 2;
        }

        // Convert file to Base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imgItem.file);
        });

        const imageFormat = imgItem.file.type.includes('png') ? 'PNG' : 'JPEG';
        pdf.addImage(base64, imageFormat, x, y, renderWidth, renderHeight);
      }

      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 hover:bg-rose-50/80 hover:border-rose-400 p-8 text-center transition-all"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-800">
          Click to Upload or Drag & Drop Images (JPG, PNG, WebP)
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Add photos, scans, and graphic documents to assemble into a crisp multi-page PDF.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Page Size
          </label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as 'a4' | 'letter')}
            className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-rose-500"
          >
            <option value="a4">A4 (210 x 297 mm)</option>
            <option value="letter">US Letter (8.5 x 11 in)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Orientation
          </label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as 'p' | 'l')}
            className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-rose-500"
          >
            <option value="p">Portrait (Vertical)</option>
            <option value="l">Landscape (Horizontal)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Margins: {margin}mm
          </label>
          <input
            type="range"
            min="0"
            max="30"
            step="5"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full accent-rose-600 mt-2"
          />
        </div>
      </div>

      {/* Images List */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Images to Convert ({images.length})
            </span>
            <button
              onClick={() => { setImages([]); setDownloadUrl(null); }}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="relative rounded-xl border border-slate-200 bg-slate-50 p-2.5 flex flex-col justify-between group"
              >
                <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-200/50 mb-2">
                  <img src={img.previewUrl} alt={img.name} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Page {idx + 1}
                  </span>
                </div>

                <p className="text-[11px] font-medium text-slate-700 truncate mb-2">{img.name}</p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30"
                      title="Move left"
                    >
                      <ArrowUp className="w-3 h-3 -rotate-90" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === images.length - 1}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30"
                      title="Move right"
                    >
                      <ArrowDown className="w-3 h-3 -rotate-90" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={convertToPdf}
              disabled={isConverting}
              className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {isConverting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Converting Images to PDF...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  <span>Convert {images.length} Image{images.length > 1 ? 's' : ''} to PDF</span>
                </>
              )}
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
              <h4 className="text-sm font-bold text-emerald-900">PDF Ready for Download!</h4>
              <p className="text-xs text-emerald-700">Images successfully converted into a high-resolution PDF.</p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download="360toolapp-converted.pdf"
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
