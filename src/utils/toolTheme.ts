/**
 * Dynamic Tool Themes
 * 
 * Strict User Requirements:
 * - Developer / Coding Tools: Dark mode theme (#0f172a background, neon green #22c55e or cyan #06b6d4 accents)
 * - Utility / Converter Tools: Clean minimal light theme (#ffffff background, royal blue buttons #2563eb)
 * - Math Tools: Precision scientific blueprint / navy theme
 * - Financial Tools: Wealth & Emerald green theme
 * - Health & Fitness Tools: Vitality Coral / Rose theme
 * - PDF Tools: Document Studio Crimson theme
 * - Media (Audio/Video) Tools: Creative Studio Violet / Dark theme
 */

export interface ToolThemeStyle {
  themeType: 'developer' | 'utility' | 'finance' | 'math' | 'health' | 'pdf' | 'media';
  bg: string;              // Card icon container background
  color: string;           // Primary accent text / icon color
  badge?: string;
  badgeClass: string;      // Badge style
  cardBgClass: string;     // Card outer background class
  cardBorderClass: string; // Card border class
  containerClass: string;  // ToolView container style
  headerBg: string;        // ToolView top banner / header background
  buttonClass: string;     // Primary action button style
  accentBorder: string;    // Border accent
  tagLabel: string;
}

export function getToolTheme(toolId: string, category?: string): ToolThemeStyle {
  // 1. Check Developer / Coding Tools (Dark mode theme: #0f172a, neon green / cyan)
  const isDevTool = category === 'developer' || [
    'json-formatter-validator', 'base64-encode-decode', 'url-encode-decode', 'regex-tester',
    'uuid-v4-generator', 'hash-generator-md5-sha256', 'color-hex-rgb-converter', 'css-minifier-beautifier',
    'html-entity-encoder', 'sql-formatter', 'jwt-debugger-decoder', 'epoch-timestamp-converter',
    'markdown-to-html-converter', 'text-diff-checker', 'binary-ascii-converter', 'user-agent-parser',
    'meta-tag-generator', 'html-minifier', 'javascript-beautifier', 'curl-to-fetch-converter',
    'crontab-generator', 'xml-to-json-converter', 'yaml-to-json-converter', 'string-obfuscator',
    'ip-subnet-calculator', 'lorem-ipsum-generator', 'text-case-converter', 'word-character-counter',
    'qr-code-generator', 'morse-code-converter', 'binary-calculator', 'hex-calculator', 'matrix-calculator',
    'big-number-calculator', 'ch-mod-permissions-calculator', 'csv-to-json-converter', 'json-to-csv-converter',
    'slug-generator', 'punycode-converter', 'hex-to-ascii-converter', 'barcode-generator', 'svg-to-data-uri-converter'
  ].includes(toolId);

  if (isDevTool) {
    return {
      themeType: 'developer',
      bg: 'bg-slate-900 border border-emerald-500/30 text-emerald-400',
      color: 'text-emerald-400',
      badge: 'Code Engine',
      badgeClass: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono',
      cardBgClass: 'bg-[#0f172a] text-slate-100 shadow-md hover:shadow-emerald-500/10 hover:border-emerald-500/50',
      cardBorderClass: 'border-slate-800',
      containerClass: 'bg-[#0f172a] text-slate-100 border-slate-800 shadow-2xl',
      headerBg: 'bg-gradient-to-r from-slate-950 via-[#0f172a] to-slate-900 border-b border-emerald-500/20 text-slate-100',
      buttonClass: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 focus:ring-emerald-400',
      accentBorder: 'border-emerald-500',
      tagLabel: 'Developer Suite',
    };
  }

  // 2. Financial Calculators (Emerald Green & Wealth theme)
  const isFinance = category === 'finance' || toolId.includes('loan') || toolId.includes('mortgage') || toolId.includes('tax') || toolId.includes('interest') || toolId.includes('salary') || toolId.includes('investment');
  if (isFinance) {
    return {
      themeType: 'finance',
      bg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      color: 'text-emerald-600',
      badge: 'Wealth & ROI',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      cardBgClass: 'bg-white text-slate-800 shadow-xs hover:shadow-md hover:border-emerald-300',
      cardBorderClass: 'border-slate-200/80',
      containerClass: 'bg-white text-slate-800 border-emerald-100 shadow-xs',
      headerBg: 'bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm focus:ring-emerald-500',
      accentBorder: 'border-emerald-600',
      tagLabel: 'Financial Calc',
    };
  }

  // 3. Health & Fitness (Vitality Coral / Rose theme)
  const isHealth = category === 'health' || toolId.includes('bmi') || toolId.includes('calorie') || toolId.includes('weight') || toolId.includes('heart') || toolId.includes('pregnancy');
  if (isHealth) {
    return {
      themeType: 'health',
      bg: 'bg-rose-50 text-rose-600 border border-rose-100',
      color: 'text-rose-600',
      badge: 'Vitality',
      badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
      cardBgClass: 'bg-white text-slate-800 shadow-xs hover:shadow-md hover:border-rose-300',
      cardBorderClass: 'border-slate-200/80',
      containerClass: 'bg-white text-slate-800 border-rose-100 shadow-xs',
      headerBg: 'bg-gradient-to-r from-rose-600 via-rose-700 to-pink-800 text-white',
      buttonClass: 'bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm focus:ring-rose-500',
      accentBorder: 'border-rose-500',
      tagLabel: 'Health & Fitness',
    };
  }

  // 4. PDF Tools (Crimson / Document Red theme)
  const isPdf = category === 'pdf' || toolId.includes('pdf');
  if (isPdf) {
    return {
      themeType: 'pdf',
      bg: 'bg-red-50 text-red-600 border border-red-100',
      color: 'text-red-600',
      badge: '100% Client-Side',
      badgeClass: 'bg-red-50 text-red-700 border border-red-200',
      cardBgClass: 'bg-white text-slate-800 shadow-xs hover:shadow-md hover:border-red-300',
      cardBorderClass: 'border-slate-200/80',
      containerClass: 'bg-white text-slate-800 border-red-100 shadow-xs',
      headerBg: 'bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white',
      buttonClass: 'bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm focus:ring-red-500',
      accentBorder: 'border-red-600',
      tagLabel: 'PDF Document Studio',
    };
  }

  // 5. Media Tools (Creative Studio Violet / Dark theme)
  const isMedia = category === 'media' || toolId.includes('audio') || toolId.includes('video') || toolId.includes('tone') || toolId.includes('voice');
  if (isMedia) {
    return {
      themeType: 'media',
      bg: 'bg-purple-950/40 text-purple-400 border border-purple-800/40',
      color: 'text-purple-400',
      badge: 'Media Studio',
      badgeClass: 'bg-purple-900/60 text-purple-200 border border-purple-700/50',
      cardBgClass: 'bg-[#120f24] text-slate-100 shadow-md hover:shadow-purple-500/10 hover:border-purple-500/50',
      cardBorderClass: 'border-purple-900/30',
      containerClass: 'bg-[#131124] text-slate-100 border-purple-900/40 shadow-2xl',
      headerBg: 'bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white border-b border-purple-800/30',
      buttonClass: 'bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-900/30 focus:ring-purple-400',
      accentBorder: 'border-purple-500',
      tagLabel: 'Audio & Video Studio',
    };
  }

  // 6. Math Calculators (Scientific Blueprint Navy theme)
  const isMath = category === 'math' || toolId.includes('calculator') || toolId.includes('sequence') || toolId.includes('triangle') || toolId.includes('deviation') || toolId.includes('fraction') || toolId.includes('percentage');
  if (isMath) {
    return {
      themeType: 'math',
      bg: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
      color: 'text-indigo-700',
      badge: 'Pure Math',
      badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono',
      cardBgClass: 'bg-white text-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300',
      cardBorderClass: 'border-slate-200/80',
      containerClass: 'bg-white text-slate-800 border-indigo-100 shadow-xs',
      headerBg: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white',
      buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm focus:ring-indigo-500',
      accentBorder: 'border-indigo-600',
      tagLabel: 'Scientific Math',
    };
  }

  // 7. Utility & Converter Tools: Clean Minimal Light Theme (#ffffff background, royal blue buttons #2563eb)
  return {
    themeType: 'utility',
    bg: 'bg-blue-50 text-[#2563eb] border border-blue-100',
    color: 'text-[#2563eb]',
    badge: '100% Free',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    cardBgClass: 'bg-white text-slate-800 shadow-xs hover:shadow-md hover:border-blue-300',
    cardBorderClass: 'border-slate-200/80',
    containerClass: 'bg-white text-slate-800 border-slate-200/80 shadow-xs',
    headerBg: 'bg-gradient-to-r from-[#1e40af] via-[#2563eb] to-[#3b82f6] text-white',
    buttonClass: 'bg-[#2563eb] hover:bg-blue-700 text-white font-semibold shadow-sm focus:ring-[#2563eb]',
    accentBorder: 'border-[#2563eb]',
    tagLabel: 'Minimal Utility',
  };
}
