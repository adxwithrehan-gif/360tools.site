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
   * Homepage 360 Tools Grid Ads (10 Ads randomly/strategically distributed in the tools grid)
   */
  homeGridAds: AdUnitConfig[];

  /**
   * Every Tool Page (5 distinct strategic ad placements inside every opened tool)
   */
  toolAds: {
    // 1. Tool Page Top (Below header, above tool inputs)
    slot1Top: AdUnitConfig;

    // 2. Tool Workspace Mid (Between options or helper bar)
    slot2Workspace: AdUnitConfig;

    // 3. Post-Result (Directly under computed results & download actions)
    slot3PostResult: AdUnitConfig;

    // 4. Pre-FAQ (Directly above the step-by-step guide & FAQs)
    slot4PreFaq: AdUnitConfig;

    // 5. Tool Bottom (Directly above Explore More Related Tools)
    slot5Bottom: AdUnitConfig;
  };
}

export const ADS_CONFIG: AdsGlobalConfig = {
  // Global Switch: Ads enable/disable
  enabled: true,

  // 👉 YAHAN APNA GOOGLE ADSENSE CLIENT ID DAALEIN (e.g. "ca-pub-1234567890123456"):
  adsenseClientId: "",

  // Placeholder preview mode (True dikhayega jab tak aap apna real ad code nahi daalte)
  showPlaceholdersWhenEmpty: true,

  // 👉 UNIVERSAL AD CODE (Optional - ek hi code sab jagah chalane ke liye):
  universalAdCode: "",

  // 1. HOMEPAGE TOP BANNER AD
  homeTopBanner: {
    id: "home-top-banner",
    name: "Homepage Top Leaderboard",
    slotId: "", // e.g. "1000000001"
    customCode: "", // ya yahan poora <script> ad tag paste karein
    format: "horizontal",
  },

  // 2. HOMEPAGE BOTTOM BANNER AD
  homeBottomBanner: {
    id: "home-bottom-banner",
    name: "Homepage Bottom Leaderboard",
    slotId: "",
    customCode: "",
    format: "horizontal",
  },

  // 3. HOMEPAGE 10 INTERSPERSED ADS (Tools Grid ke andar 10 ads)
  homeGridAds: [
    {
      id: "home-grid-ad-1",
      name: "Tools Grid Ad #1 (After ~18 tools)",
      slotId: "",
      customCode: "",
      format: "responsive",
    },
    {
      id: "home-grid-ad-2",
      name: "Tools Grid Ad #2 (After ~54 tools)",
      slotId: "",
      customCode: "",
      format: "responsive",
    },
    {
      id: "home-grid-ad-3",
      name: "Tools Grid Ad #3 (After ~90 tools)",
      slotId: "",
      customCode: "",
      format: "responsive",
    },
    {
      id: "home-grid-ad-4",
      name: "Tools Grid Ad #4 (After ~126 tools)",
      slotId: "",
      customCode: "",
      format: "responsive",
    },
    {
      id: "home-grid-ad-5",
      name: "Tools Grid Ad #5 (After ~162 tools)",
      slotId: "",
      customCode: "",
      format: "responsive",
    },
    {
      id: "home-grid-ad-6",
      name: "Tools Grid Ad #6 (After ~198 tools)",
      slotId: "",
      customCode: "",
      format: "responsive",
    },
    {
      id: "home-grid-ad-7",
      name: "Tools Grid Ad #7 (After ~234 tools)",
      slotId: "",
      customCode: "",
      format: "responsive",
    },
    {
      id: "home-grid-ad-8",
      name: "Tools Grid Ad #8 (After ~270 tools)",
      slotId: "",
      customCode: "",
      format: "responsive",
    },
    {
      id: "home-grid-ad-9",
      name: "Tools Grid Ad #9 (After ~306 tools)",
      slotId: "",
      customCode: "",
      format: "responsive",
    },
    {
      id: "home-grid-ad-10",
      name: "Tools Grid Ad #10 (After ~342 tools)",
      slotId: "",
      customCode: "",
      format: "responsive",
    },
  ],

  // 4. EVERY TOOL PAGE (5 Distinct Ad Placements)
  toolAds: {
    // Ad 1: Top of the tool (High visibility on initial page load)
    slot1Top: {
      id: "tool-ad-1-top",
      name: "Tool View #1: Top Header Leaderboard",
      slotId: "",
      customCode: "",
      format: "horizontal",
    },

    // Ad 2: Mid Workspace (Alongside tool options / under instructions)
    slot2Workspace: {
      id: "tool-ad-2-workspace",
      name: "Tool View #2: Mid Workspace / Under Controls",
      slotId: "",
      customCode: "",
      format: "responsive",
    },

    // Ad 3: Post-Result (Directly under computed results & download actions - Highest CTR)
    slot3PostResult: {
      id: "tool-ad-3-result",
      name: "Tool View #3: Post-Result / Under Output",
      slotId: "",
      customCode: "",
      format: "responsive",
    },

    // Ad 4: Pre-FAQ (Directly above the step-by-step guide & FAQs)
    slot4PreFaq: {
      id: "tool-ad-4-prefaq",
      name: "Tool View #4: Above FAQ & Guide",
      slotId: "",
      customCode: "",
      format: "horizontal",
    },

    // Ad 5: Tool Bottom (Directly above Explore More Related Tools)
    slot5Bottom: {
      id: "tool-ad-5-bottom",
      name: "Tool View #5: Above Related Tools",
      slotId: "",
      customCode: "",
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
