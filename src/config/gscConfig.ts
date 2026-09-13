/**
 * ============================================================================
 * GOOGLE SEARCH CONSOLE (GSC) & SEO VERIFICATION CONFIGURATION
 * ============================================================================
 * 
 * [URDU INSTRUCTIONS]:
 * Apni Google Search Console (GSC) ki HTML tag verification yahan paste karein.
 * 
 * Agar GSC aapko HTML tag deta hai:
 * <meta name="google-site-verification" content="YAHAN_APNA_CODE_LIKHEIN" />
 * 
 * Toh aap niche `verificationCode` me sirf apna content code likh sakte hain,
 * ya `rawMetaTag` me poori meta tag paste kar sakte hain.
 * Dono me se koi bhi ek fill karein, site automatically head me add kar degi!
 * 
 * [ENGLISH INSTRUCTIONS]:
 * Insert your Google Search Console verification code or full meta tag below.
 * The application will automatically inject it into the HTML <head> on runtime.
 * ============================================================================
 */

export interface GSCVerificationConfig {
  /**
   * Google Site Verification Code only.
   * Example: "abc1234567890xyz_QWERTY"
   */
  verificationCode: string;

  /**
   * Optional: Full raw meta tag if you copied the entire HTML tag from GSC.
   * Example: '<meta name="google-site-verification" content="abc1234567890xyz" />'
   */
  rawMetaTag?: string;

  /**
   * Bing Webmaster Tools verification code (Optional)
   */
  bingVerificationCode?: string;

  /**
   * Yandex Webmaster Tools verification code (Optional)
   */
  yandexVerificationCode?: string;

  /**
   * Pinterest verification tag (Optional)
   */
  pinterestVerificationCode?: string;
}

export const GSC_CONFIG: GSCVerificationConfig = {
  // 👉 YAHAN APNA GOOGLE SEARCH CONSOLE CODE PASTE KAREIN:
  verificationCode: "google-site-verification=REPLACE_WITH_YOUR_GSC_CODE",

  // 👉 YA PHIR POORI META TAG YAHAN PASTE KAR SAKTE HAIN:
  rawMetaTag: "",

  // Optional: Bing Webmaster code
  bingVerificationCode: "",

  // Optional: Yandex verification code
  yandexVerificationCode: "",

  // Optional: Pinterest code
  pinterestVerificationCode: "",
};

/**
 * Initializes and injects Google Search Console verification into document head.
 */
export function initGSCVerification(): void {
  if (typeof document === 'undefined') return;

  // 1. Check raw meta tag
  if (GSC_CONFIG.rawMetaTag && GSC_CONFIG.rawMetaTag.trim()) {
    const match = GSC_CONFIG.rawMetaTag.match(/content=["']([^"']+)["']/i);
    if (match && match[1]) {
      applyMetaTag('google-site-verification', match[1]);
    }
  }

  // 2. Check direct verification code
  if (GSC_CONFIG.verificationCode && GSC_CONFIG.verificationCode.trim() && !GSC_CONFIG.verificationCode.includes('REPLACE_WITH_YOUR')) {
    let cleanCode = GSC_CONFIG.verificationCode.trim();
    if (cleanCode.startsWith('google-site-verification=')) {
      cleanCode = cleanCode.replace('google-site-verification=', '').trim();
    }
    applyMetaTag('google-site-verification', cleanCode);
  }

  // 3. Optional Bing Verification
  if (GSC_CONFIG.bingVerificationCode && GSC_CONFIG.bingVerificationCode.trim()) {
    applyMetaTag('msvalidate.01', GSC_CONFIG.bingVerificationCode.trim());
  }

  // 4. Optional Yandex Verification
  if (GSC_CONFIG.yandexVerificationCode && GSC_CONFIG.yandexVerificationCode.trim()) {
    applyMetaTag('yandex-verification', GSC_CONFIG.yandexVerificationCode.trim());
  }
}

function applyMetaTag(name: string, content: string): void {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}
