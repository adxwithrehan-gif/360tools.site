import React, { useEffect, useRef, useState } from 'react';
import { ADS_CONFIG, AdUnitConfig } from '../../config/adsConfig';

interface AdSlotProps {
  adConfig: AdUnitConfig;
  variant?: 'banner' | 'infeed' | 'box' | 'compact';
  className?: string;
  minHeight?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdSlot: React.FC<AdSlotProps> = ({
  adConfig,
  variant = 'banner',
  className = '',
  minHeight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [impressionCounted, setImpressionCounted] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);

  // Determine active ad payload
  const activeCode = adConfig.customCode || ADS_CONFIG.universalAdCode || '';
  const activeSlotId = adConfig.slotId || '';
  const hasRealAd = Boolean(activeCode || (activeSlotId && ADS_CONFIG.adsenseClientId));

  // Determine if this is a priority slot that should render immediately without waiting for scroll
  const isPrioritySlot = 
    adConfig.id === 'home-top-banner' || 
    adConfig.id === 'tool-ad-1-top' || 
    adConfig.id.endsWith('-1') || 
    adConfig.id.endsWith('-2');

  // 1. Lazy Viewport Trigger using IntersectionObserver
  useEffect(() => {
    if (!ADS_CONFIG.enabled || isPrioritySlot) {
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
  }, [adConfig.id, isPrioritySlot]);

  // 2. Viewport Impression Tracking (Accurately counts impressions when 40%+ visible)
  useEffect(() => {
    if (!ADS_CONFIG.enabled || impressionCounted) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            setImpressionCounted(true);
            // If window custom analytics exists, fire impression event
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'ad_impression', {
                ad_slot_id: adConfig.id,
                ad_slot_name: adConfig.name,
              });
            }
          }
        });
      },
      { threshold: [0.4] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [adConfig.id, adConfig.name, impressionCounted]);

  // 3. Google AdSense / Script execution (Only executed when slot is in or near viewport)
  useEffect(() => {
    if (!ADS_CONFIG.enabled || !hasRealAd || (!isInViewport && !isPrioritySlot) || adLoaded) return;

    const el = containerRef.current;
    if (!el) return;

    // Handle Google AdSense push
    if (activeSlotId && ADS_CONFIG.adsenseClientId) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (err) {
        console.debug('AdSense init', err);
      }
    } else if (activeCode) {
      // If user pasted custom HTML or <script> tags, execute safely
      try {
        const slotDiv = el.querySelector('.custom-ad-container');
        if (slotDiv) {
          slotDiv.innerHTML = activeCode;
          // Execute any embedded scripts
          const scripts = slotDiv.querySelectorAll('script');
          scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach((attr: Attr) =>
              newScript.setAttribute(attr.name, attr.value)
            );
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode?.replaceChild(newScript, oldScript);
          });
          setAdLoaded(true);
        }
      } catch (e) {
        console.error('Error rendering custom ad code', e);
      }
    }
  }, [activeCode, activeSlotId, hasRealAd, isInViewport, isPrioritySlot, adLoaded]);

  if (!ADS_CONFIG.enabled) return null;

  // Variant Heights
  const defaultHeight = minHeight || (
    variant === 'banner' ? 'min-h-[90px]' :
    variant === 'box' ? 'min-h-[250px]' :
    variant === 'infeed' ? 'min-h-[160px]' :
    'min-h-[100px]'
  );

  return (
    <div
      ref={containerRef}
      id={`ad-slot-${adConfig.id}`}
      data-ad-slot-id={adConfig.id}
      data-impression={impressionCounted ? 'counted' : 'pending'}
      className={`relative w-full overflow-hidden transition-all duration-300 ${defaultHeight} ${className}`}
    >
      {hasRealAd ? (
        // Real Ad Display
        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1 w-full text-center">
            Advertisement
          </div>

          {activeSlotId && ADS_CONFIG.adsenseClientId ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', minHeight: '90px' }}
              data-ad-client={ADS_CONFIG.adsenseClientId}
              data-ad-slot={activeSlotId}
              data-ad-format={adConfig.format || 'auto'}
              data-full-width-responsive="true"
            />
          ) : (
            <div className="custom-ad-container w-full flex justify-center items-center overflow-hidden" />
          )}
        </div>
      ) : ADS_CONFIG.showPlaceholdersWhenEmpty ? (
        // High-Quality Preview / Ready Slot Container (Shows where ads will appear)
        <div
          className={`w-full h-full rounded-2xl border border-dashed border-slate-300/90 bg-slate-50/70 p-4 flex flex-col items-center justify-center text-center select-none group hover:border-blue-400 hover:bg-blue-50/20 transition-all ${
            variant === 'infeed' ? 'p-3 sm:p-5' : 'py-5 px-4'
          }`}
        >
          {/* Header Label */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-200/70 px-2 py-0.5 rounded">
              ADVERTISEMENT
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                impressionCounted
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
              title={impressionCounted ? 'Viewed in viewport - Impression Ready' : 'Scroll into view to count impression'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  impressionCounted ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`}
              />
              {impressionCounted ? 'Impression Counted' : 'Slot Active'}
            </span>
          </div>

          {/* Ad Slot Identification */}
          <h4 className="font-bold text-xs sm:text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
            {adConfig.name}
          </h4>

          <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm">
            Ready for Google AdSense / Adsterra code in <code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-600 font-mono text-[10px]">src/config/adsConfig.ts</code>
          </p>
        </div>
      ) : null}
    </div>
  );
};
