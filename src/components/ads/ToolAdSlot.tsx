import React, { useEffect, useRef, useState } from 'react';

interface ToolAdSlotProps {
  id: string;
  variant?: 'banner' | 'sidebar' | 'box' | 'inline';
  className?: string;
  priority?: boolean;
}

export const ToolAdSlot: React.FC<ToolAdSlotProps> = ({
  id,
  variant = 'banner',
  className = '',
  priority = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInViewport, setIsInViewport] = useState(priority);
  const containerId = 'container-1cd889dea3cd4462595169e7f5655753';

  useEffect(() => {
    if (priority) {
      setIsInViewport(true);
      return;
    }

    const el = containerRef.current;
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
      { rootMargin: '300px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  // Clean iframe document isolating the script and container so each of the 10 tool ads invokes smoothly
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
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 70px;
    }
  </style>
</head>
<body>
  <script async="async" data-cfasync="false" src="https://professionalsusceptible.com/1cd889dea3cd4462595169e7f5655753/invoke.js"></script>
  <div id="${containerId}"></div>
</body>
</html>`;

  const getContainerHeight = () => {
    switch (variant) {
      case 'banner':
        return 'min-h-[90px] sm:min-h-[100px]';
      case 'sidebar':
        return 'min-h-[180px] sm:min-h-[220px]';
      case 'box':
        return 'min-h-[140px] sm:min-h-[170px]';
      case 'inline':
      default:
        return 'min-h-[80px] sm:min-h-[95px]';
    }
  };

  return (
    <div
      ref={containerRef}
      id={`tool-ad-${id}`}
      className={`w-full bg-white rounded-2xl border border-slate-200/80 p-2 sm:p-3 overflow-hidden shadow-2xs transition-all duration-200 ${getContainerHeight()} ${className}`}
    >
      <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
        {isInViewport ? (
          <iframe
            title={`Ad Slot ${id}`}
            srcDoc={iframeHtml}
            className="w-full h-full border-0 overflow-hidden bg-transparent"
            loading={priority ? 'eager' : 'lazy'}
            scrolling="no"
          />
        ) : (
          <div className="w-full h-full bg-slate-50/50 rounded-xl" />
        )}
      </div>
    </div>
  );
};
