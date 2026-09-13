import React, { useEffect, useRef, useState } from 'react';

interface NativeAdCardProps {
  id: string;
  index: number;
  className?: string;
}

export const ADSTERRA_NATIVE_BANNER_CODE = `<script async="async" data-cfasync="false" src="https://professionalsusceptible.com/1cd889dea3cd4462595169e7f5655753/invoke.js"></script><div id="container-1cd889dea3cd4462595169e7f5655753"></div>`;

export const NativeAdCard: React.FC<NativeAdCardProps> = ({ id, index, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const containerId = 'container-1cd889dea3cd4462595169e7f5655753';

  // Lazy viewport observer so ads load smoothly
  useEffect(() => {
    // Priority: First 4 ad cards load immediately
    if (index < 4) {
      setIsInViewport(true);
      return;
    }

    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '350px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  // Clean iframe document isolating the Adsterra script and container
  // Each iframe has its own isolated DOM so container-1cd889dea3cd4462595169e7f5655753 works in every single card!
  const iframeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base target="_blank">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: transparent;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #${containerId} {
      width: 100%;
      min-height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <script async="async" data-cfasync="false" src="https://professionalsusceptible.com/1cd889dea3cd4462595169e7f5655753/invoke.js"></script>
  <div id="${containerId}"></div>
</body>
</html>`;

  return (
    <div
      ref={cardRef}
      id={`native-ad-slot-${id}`}
      className={`group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-2 sm:p-3 md:p-4 flex flex-col items-center justify-center relative hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg h-full min-h-[170px] sm:min-h-[210px] overflow-hidden transition-all duration-200 ${className}`}
    >
      {/* Pure Ad Element with zero labels, zero sponsored text, zero partner text */}
      <div className="w-full h-full flex-1 flex items-center justify-center min-h-[150px] sm:min-h-[185px] overflow-hidden rounded-xl">
        {isInViewport ? (
          <iframe
            title={`Ad Slot ${index + 1}`}
            srcDoc={iframeHtml}
            className="w-full h-full min-h-[150px] sm:min-h-[185px] border-0 overflow-hidden bg-transparent"
            loading="lazy"
            scrolling="no"
          />
        ) : (
          <div className="w-full h-full min-h-[150px] bg-transparent rounded-xl" />
        )}
      </div>
    </div>
  );
};
