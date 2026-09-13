/**
 * ============================================================================
 * ADS PLACEMENT CONFIGURATION FILE (ADS MANAGEMENT)
 * ============================================================================
 * 
 * [URDU INSTRUCTIONS]:
 * Ye file Ads placement ke liye banayi gayi hai.
 * Yahan aap aasani se apna Google AdSense, Adsterra, Ezoic, ya kisi bhi Ad network
 * ka ad code ya slot ID daal sakte hain.
 * 
 * 1. `adsenseClientId`: Apna Google AdSense publisher ID daalein (e.g. "ca-pub-1234567890123456").
 * 2. `universalAdCode`: Agar aapke paas ek hi code hai aur aap sab jagah wahi chalana chahte hain,
 *    toh yahan paste kar dein.
 * 3. `homeGridAds`: Homepage par 360 tools ke darmiyan jo 10 ads aane hain, unke 10 ad codes
 *    ya slot IDs yahan daal sakte hain.
 * 4. `toolAds`: Har tool ke andar jo 5 ads aane hain, unke 5 slots yahan alag alag set kar sakte hain:
 *    - slot1Top: Tool ke top par
 *    - slot2Workspace: Tool calculation/input ke darmiyan
 *    - slot3PostResult: Result aane ke baad result ke bilkul niche (Best CTR)
 *    - slot4PreFaq: FAQ aur Guide se pehle
 *    - slot5Bottom: Related tools se upar
 * 
 * Impression Counting:
 * - Har ad slot ke sath automatic Viewport Impression Observer laga hua hai,
 *   jo impression ko accurately count aur fire karta hai.
 * ============================================================================
 */

export interface AdUnitConfig {
  id: string;
  name: string;
  slotId?: string;       // Google AdSense slot id (e.g. "1234567890")
  customCode?: string;   // Full custom HTML/JS ad snippet
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'responsive';
}

export interface AdsGlobalConfig {
  /**
   * Enable or disable ads globally
   */
  enabled: boolean;

  /**
   * Google AdSense Client ID.
   * Example: "ca-pub-1234567890123456"
   */
  adsenseClientId: string;

  /**
   * Test / Placeholder Mode:
   * Agar true ho ya ad code khali ho, toh preview placeholder dikhayega taake
   * aap dekh sakein ke ads kahan kahan aayengi aur impressions test kar sakein.
   */
  showPlaceholdersWhenEmpty: boolean;

  /**
   * Universal Ad Code:
   * Agar aap sabhi ad slots par ek jaisa general code chalana chahte hain,
   * toh is me paste kar dein. Specific slot khali hone par ye chalega.
   */
  universalAdCode: string;

  /**
   * Homepage Top Leaderboard Banner (728x90 / responsive)
   */
  homeTopBanner: AdUnitConfig;

  /**
   * Homepage Bottom Banner (Above footer)
   */
  homeBottomBanner: AdUnitConfig;

  /**
   * Homepage 360 Tools Grid Ads (50 Ads distributed seamlessly in the tools grid)
   */
  homeGridAds: AdUnitConfig[];

  /**
   * Every Tool Page (Exactly 5 distinct strategic ad placements inside every opened tool)
   */
  toolAds: {
    slot1PostWorkspace: AdUnitConfig;
    slot2Sidebar: AdUnitConfig;
    slot3PreGuide: AdUnitConfig;
    slot4PreFaq: AdUnitConfig;
    slot5Bottom: AdUnitConfig;
  };
}

export const NATIVE_BANNER_AD_CODE = `<script async="async" data-cfasync="false" src="https://professionalsusceptible.com/1cd889dea3cd4462595169e7f5655753/invoke.js"></script><div id="container-1cd889dea3cd4462595169e7f5655753"></div>`;

// Generate exactly 50 native ad slots distributed across the 360 tools grid
const generateGridAds = (count: number = 50): AdUnitConfig[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `home-grid-ad-${i + 1}`,
    name: `Tools Grid Native Ad #${i + 1}`,
    slotId: "",
    customCode: NATIVE_BANNER_AD_CODE,
    format: "responsive",
  }));
};

export const ADS_CONFIG: AdsGlobalConfig = {
  // Global Switch: Ads enable/disable
  enabled: true,

  // Google AdSense Client ID (if using AdSense alongside)
  adsenseClientId: "",

  // Placeholder preview mode (False when real ad code is active)
  showPlaceholdersWhenEmpty: false,

  // Native Banner Ad Code placed globally
  universalAdCode: NATIVE_BANNER_AD_CODE,

  // 1. HOMEPAGE TOP BANNER AD (Disabled as per user request to remove from header)
  homeTopBanner: {
    id: "home-top-banner",
    name: "Homepage Top Leaderboard",
    slotId: "",
    customCode: "",
    format: "horizontal",
  },

  // 2. HOMEPAGE BOTTOM BANNER AD (Disabled as per user request)
  homeBottomBanner: {
    id: "home-bottom-banner",
    name: "Homepage Bottom Leaderboard",
    slotId: "",
    customCode: "",
    format: "horizontal",
  },

  // 3. HOMEPAGE 50 ADS IN TOOLS GRID (Exactly 50 ads)
  homeGridAds: generateGridAds(50),

  // 4. EVERY TOOL PAGE (Exactly 5 Strategic Ad Placements inside every tool page)
  toolAds: {
    slot1PostWorkspace: {
      id: "tool-ad-1-post-workspace",
      name: "Tool View #1: Below Interactive Tool / Results",
      slotId: "",
      customCode: NATIVE_BANNER_AD_CODE,
      format: "horizontal",
    },
    slot2Sidebar: {
      id: "tool-ad-2-sidebar",
      name: "Tool View #2: Single Sidebar Feature",
      slotId: "",
      customCode: NATIVE_BANNER_AD_CODE,
      format: "responsive",
    },
    slot3PreGuide: {
      id: "tool-ad-3-preguide",
      name: "Tool View #3: Above Step-by-Step Guide",
      slotId: "",
      customCode: NATIVE_BANNER_AD_CODE,
      format: "horizontal",
    },
    slot4PreFaq: {
      id: "tool-ad-4-prefaq",
      name: "Tool View #4: Between Guide & FAQ",
      slotId: "",
      customCode: NATIVE_BANNER_AD_CODE,
      format: "horizontal",
    },
    slot5Bottom: {
      id: "tool-ad-5-bottom",
      name: "Tool View #5: Above Related Tools",
      slotId: "",
      customCode: NATIVE_BANNER_AD_CODE,
      format: "horizontal",
    },
  },
};

/**
 * Global helper to initialize Google AdSense script in <head> if clientId is provided.
 */
export function initAdSenseScript(): void {
  if (typeof document === 'undefined') return;
  if (!ADS_CONFIG.enabled || !ADS_CONFIG.adsenseClientId) return;

  const scriptId = 'adsense-global-sdk';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      ADS_CONFIG.adsenseClientId
    )}`;
    document.head.appendChild(script);
  }
}
