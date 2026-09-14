import { NewsCategory, NewsCountry } from '../types/news';

export const ALL_COUNTRIES: NewsCountry[] = [
  { code: 'GLOBAL', name: 'Worldwide / Global', flag: '🌐', defaultLang: 'en' },
  { code: 'US', name: 'United States', flag: '🇺🇸', defaultLang: 'en' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', defaultLang: 'ur-PK' },
  { code: 'IN', name: 'India', flag: '🇮🇳', defaultLang: 'hi-IN' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', defaultLang: 'en-GB' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', defaultLang: 'en-CA' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', defaultLang: 'en-AU' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', defaultLang: 'de' },
  { code: 'FR', name: 'France', flag: '🇫🇷', defaultLang: 'fr' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', defaultLang: 'ja' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', defaultLang: 'ar-SA' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', defaultLang: 'ar-AE' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', defaultLang: 'tr' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', defaultLang: 'pt-BR' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', defaultLang: 'es-MX' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', defaultLang: 'id' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', defaultLang: 'en-NG' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', defaultLang: 'en-ZA' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', defaultLang: 'es' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', defaultLang: 'it' },
];

export const ALL_CATEGORIES: NewsCategory[] = [
  'Tech & AI',
  'Finance & Economy',
  'Web & Developer',
  'Tools & Productivity',
  'Cybersecurity & Privacy',
  'Health & Lifestyle',
  'Media & Design',
  'Sports & Entertainment',
  'World & Politics'
];

export interface TrendSeedTopic {
  keyword: string;
  category: NewsCategory;
  countryCode?: string; // e.g. "PK", "US", "GLOBAL"
  baseSurge: number;
  headlineTemplate: string;
  subtitleTemplate: string;
  toolId: string;
  toolName: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
}

export const MASS_TREND_SEEDS: TrendSeedTopic[] = [
  // Global & Multi-Country Tech
  {
    keyword: 'Google Search Core Algorithm Update 2026',
    category: 'Web & Developer',
    countryCode: 'GLOBAL',
    baseSurge: 1450,
    headlineTemplate: 'Google Search Core Update: Why Webmasters and Tool Suites Are Seeing Massive Organic Traffic Swings',
    subtitleTemplate: 'Global search intelligence reports a +1,450% breakout spike as SEO professionals audit site speed, clean URLs, and utility tool pages.',
    toolId: 'meta-tag-generator',
    toolName: 'Meta Tag & Open Graph Generator',
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Search engine optimization analytics and data graphs on screen',
    tags: ['Search Engine Update', 'SEO Analysis', 'Search Inquiries', 'Core Update', 'Webmaster Tools']
  },
  {
    keyword: 'AI Video Generation & Prompt Formats',
    category: 'Tech & AI',
    countryCode: 'GLOBAL',
    baseSurge: 1200,
    headlineTemplate: 'Generative Video Breakthrough: How Creators Are Streamlining Media Formats and Online Conversions',
    subtitleTemplate: 'Searches for prompt structuring and media file conversion rocketed 1,200% over the past 48 hours.',
    toolId: 'image-to-png-converter',
    toolName: 'Image Format Converter',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Abstract futuristic neon AI digital art visualization',
    tags: ['AI Video', 'Generative AI', 'Digital Media', 'Creative Tools']
  },
  {
    keyword: 'DeepSeek & Open Weights AI Computing',
    category: 'Tech & AI',
    countryCode: 'US',
    baseSurge: 980,
    headlineTemplate: 'Autonomous Intelligence in the Enterprise: Why In-Browser Privacy Tools Are In High Demand',
    subtitleTemplate: 'US search volume shows an unprecedented shift towards confidential local computing without API data scraping.',
    toolId: 'json-formatter',
    toolName: 'JSON Formatter & Schema Validator',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'High performance computer chips and server microprocessors',
    tags: ['Artificial Intelligence', 'US Tech', 'DeepSeek', 'Developer Tools']
  },
  // Pakistan
  {
    keyword: 'Freelancer Remittances & FBR Tax Calculator 2026',
    category: 'Finance & Economy',
    countryCode: 'PK',
    baseSurge: 890,
    headlineTemplate: 'Pakistan Freelance Boom: Over 1.5 Million Remote Workers Track Dollar Remittances & Tax Deductions Online',
    subtitleTemplate: 'Real-time search intelligence in Pakistan records +890% surge in currency conversion, income tax calculation, and invoice utility searches.',
    toolId: 'currency-converter',
    toolName: 'Universal Currency & Remittance Converter',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Bank notes and global currencies exchange calculation',
    tags: ['Pakistan Trends', 'FBR Tax', 'Freelancing', 'Currency Rates', 'Pakistan Economy']
  },
  {
    keyword: 'BISE Matric & Inter Result Roll Number Verification',
    category: 'Tools & Productivity',
    countryCode: 'PK',
    baseSurge: 1100,
    headlineTemplate: 'Annual Board Exam Results: Online Roll Number Verification & Fast PDF Scorecard Compression Explained',
    subtitleTemplate: 'With servers under heavy load, Pakistani students rely on client-side PDF and image compressors to submit admission forms.',
    toolId: 'compress-pdf',
    toolName: 'Compress PDF (Under 100KB)',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Student desk with notebook and study materials',
    tags: ['Pakistan Education', 'BISE Results', 'PDF Compress', 'Admissions']
  },
  {
    keyword: 'Gold Rate Today in Pakistan & Tola Calculator',
    category: 'Finance & Economy',
    countryCode: 'PK',
    baseSurge: 760,
    headlineTemplate: 'Gold Price Volatility in Pakistan: How Investors and Families Calculate Tola & Gram Value Accurately',
    subtitleTemplate: 'Daily bullion rate search spikes prompt smart buyers to calculate investment margins locally.',
    toolId: 'percentage-calculator',
    toolName: 'Percentage & Margin Calculator',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Gold bullion bars and precious metal investment calculation',
    tags: ['Gold Rate Pakistan', 'Tola Price', 'Bullion', 'Finance']
  },
  // India
  {
    keyword: 'Home Loan EMI Calculation & RBI Repo Rate Cut',
    category: 'Finance & Economy',
    countryCode: 'IN',
    baseSurge: 920,
    headlineTemplate: 'RBI Monetary Policy Shift: Indian Homebuyers Flood Online EMI Calculators as Mortgage Rates Fluctuate',
    subtitleTemplate: 'Search analytics across India display a 920% spike in search interest for loan amortization schedules and tax-saving interest tools.',
    toolId: 'loan-emi-calculator',
    toolName: 'Home Loan & EMI Amortization Calculator',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Modern home keys and financial mortgage paperwork',
    tags: ['India Trends', 'Home Loan EMI', 'RBI Policy', 'Real Estate', 'Personal Finance']
  },
  {
    keyword: 'Income Tax Return (ITR) Filing Deadline & Form 16 PDF Merge',
    category: 'Web & Developer',
    countryCode: 'IN',
    baseSurge: 1350,
    headlineTemplate: 'ITR Filing Season in India: How Taxpayers Merge Bank Statements and Form 16 Securely in Browser',
    subtitleTemplate: 'Indian internet users prioritize zero-server upload PDF utilities to prevent sensitive Aadhaar/PAN identity exposure.',
    toolId: 'merge-pdf',
    toolName: 'Merge PDF Documents Free',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Financial balance sheet and tax calculation documents',
    tags: ['ITR Filing', 'Form 16', 'India Tax', 'PDF Merge', 'Aadhaar Privacy']
  },
  // United States
  {
    keyword: 'Federal Reserve Interest Rate & HYSA Yields',
    category: 'Finance & Economy',
    countryCode: 'US',
    baseSurge: 850,
    headlineTemplate: 'Fed Monetary Policy & High-Yield Savings: How US Consumers Are Projecting Compound Interest Returns',
    subtitleTemplate: 'Interest in compound yield formulas skyrocketed +850% across US metropolitan regions over the last 7 days.',
    toolId: 'compound-interest-calculator',
    toolName: 'Compound Interest Growth Calculator',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Stock market financial chart and growth analytics',
    tags: ['Federal Reserve', 'HYSA', 'US Economy', 'Compound Interest', 'Investing']
  },
  {
    keyword: 'IRS Free File & Digital Signature PDF Signer',
    category: 'Tools & Productivity',
    countryCode: 'US',
    baseSurge: 780,
    headlineTemplate: 'US Tax Season Document Preparation: The Growing Preference for In-Browser PDF Signers and Converters',
    subtitleTemplate: 'Search data across the US demonstrates heavy concentration for confidential digital signers without monthly subscriptions.',
    toolId: 'sign-pdf',
    toolName: 'Sign PDF & Add Digital Signature',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Legal signature on business agreement document',
    tags: ['IRS Free File', 'Sign PDF', 'US Taxes', 'Digital Signature']
  },
  // United Kingdom
  {
    keyword: 'HMRC Self Assessment & Stamp Duty Calculator',
    category: 'Finance & Economy',
    countryCode: 'GB',
    baseSurge: 810,
    headlineTemplate: 'UK Property Market & HMRC Returns: Buyers Rush to Calculate Exact Stamp Duty & Mortgage Costs',
    subtitleTemplate: 'Searches across London, Manchester, and Birmingham surge by 810% for verified UK property tax and loan calculators.',
    toolId: 'mortgage-calculator',
    toolName: 'Mortgage Repayment Calculator',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'British architecture and modern city residential homes',
    tags: ['UK Trends', 'HMRC', 'Stamp Duty', 'Mortgage Rates', 'London Finance']
  },
  // Canada
  {
    keyword: 'CRA My Account & RRSP Contribution Limit Calculator',
    category: 'Finance & Economy',
    countryCode: 'CA',
    baseSurge: 740,
    headlineTemplate: 'Canadian Tax Filing & RRSP Deadlines: How Canadians Optimize Retirement Contributions and Tax Credits',
    subtitleTemplate: 'Search intelligence across Canada indicates a 740% rise in personal finance calculations and secure document preparation.',
    toolId: 'retirement-calculator',
    toolName: 'Retirement & Savings Calculator',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Canadian currency notes and personal wealth planning notebook',
    tags: ['Canada News', 'CRA Taxes', 'RRSP Calculator', 'Personal Finance CA']
  },
  // Australia
  {
    keyword: 'ATO Tax Withholding & Superannuation Growth',
    category: 'Finance & Economy',
    countryCode: 'AU',
    baseSurge: 690,
    headlineTemplate: 'Australia Superannuation & Income Tax: Why Aussie Workers Rely on Fast In-Browser Financial Planners',
    subtitleTemplate: 'Search data across Sydney and Melbourne notes sharp upticks in compounding retirement calculators and PDF tools.',
    toolId: 'investment-return-calculator',
    toolName: 'Investment Return ROI Calculator',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Australian financial planning graph and office table',
    tags: ['Australia Trends', 'ATO Tax', 'Superannuation', 'ROI Calculator']
  },
  // Germany & Europe
  {
    keyword: 'GDPR In-Browser Data Compliance 2026',
    category: 'Cybersecurity & Privacy',
    countryCode: 'DE',
    baseSurge: 940,
    headlineTemplate: 'European Data Sovereignty: Why German Tech Enterprises Ban Cloud File Uploads for Confidential PDFs',
    subtitleTemplate: 'Trending searches in Berlin and Frankfurt show high velocity for zero-server client-side PDF merge and split utilities.',
    toolId: 'split-pdf',
    toolName: 'Split PDF Pages Online',
    imageUrl: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Padlock and digital security encryption visualization in dark room',
    tags: ['Germany Tech', 'GDPR', 'Privacy Tools', 'PDF Split', 'Data Security']
  },
  // Middle East & Gulf (Saudi Arabia & UAE)
  {
    keyword: 'Saudi Vision 2030 Tech Startups & Corporate Tax',
    category: 'Finance & Economy',
    countryCode: 'SA',
    baseSurge: 830,
    headlineTemplate: 'Riyadh Startup Ecosystem: Entrepreneurs Calculate ROI, Currency Exchange, and Digital Invoicing Free',
    subtitleTemplate: 'Searches across Saudi Arabia and the GCC region jump 830% for verified commercial calculations and web converters.',
    toolId: 'currency-converter',
    toolName: 'Currency & Exchange Rate Calculator',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Futuristic Gulf city skyscrapers and modern business center',
    tags: ['Saudi Arabia', 'Vision 2030', 'Riyadh Tech', 'Gulf Business', 'Currency']
  },
  // Sports & Entertainment
  {
    keyword: 'Cricket World Cup & IPL Points Table Net Run Rate (NRR) Calculator',
    category: 'Sports & Entertainment',
    countryCode: 'GLOBAL',
    baseSurge: 1680,
    headlineTemplate: 'International Cricket Tournament Heat: How Fans & Analysts Calculate Net Run Rate (NRR) in Real-Time',
    subtitleTemplate: 'Search analytics record a massive +1,680% breakout surge as tournament group stages demand instant mathematical qualification scenarios.',
    toolId: 'percentage-calculator',
    toolName: 'Sports Margin & Percentage Calculator',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Cricket stadium field under bright stadium floodlights',
    tags: ['Cricket News', 'World Cup', 'Net Run Rate', 'Sports Calculator', 'Tournament Insights']
  },
  {
    keyword: 'FIFA World Cup 2026 Qualifications & Group Standing Math',
    category: 'Sports & Entertainment',
    countryCode: 'GLOBAL',
    baseSurge: 1420,
    headlineTemplate: 'FIFA World Cup Schedule & Group Qualification Formulas: Sports Statisticians Leverage Fast Web Tools',
    subtitleTemplate: 'Global soccer enthusiasts search for goal differential equations and tournament progression probabilities.',
    toolId: 'scientific-calculator',
    toolName: 'Advanced Scientific Calculator',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Soccer stadium pitch with green grass and football goal',
    tags: ['FIFA World Cup', 'Soccer News', 'Sports Analytics', 'Football Trends']
  },
  {
    keyword: 'Trending Hollywood & Anime Stylish Social Media Bios',
    category: 'Media & Design',
    countryCode: 'GLOBAL',
    baseSurge: 950,
    headlineTemplate: 'Viral Social Media Trends: Why Aesthetic Unicode Fonts & Bio Generators Are Dominating Search Queries',
    subtitleTemplate: 'Influencers and content creators trigger a 950% spike in search traffic for stylish copy-paste fonts and bio styling tools.',
    toolId: 'stylish-font-generator',
    toolName: 'Stylish Font & Fancy Text Generator',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Vibrant neon computer technology representing aesthetic digital design tools',
    tags: ['Social Media', 'Stylish Fonts', 'Instagram Bios', 'TikTok Trends', 'Aesthetic Text']
  },
  // Health & Lifestyle
  {
    keyword: 'Intermittent Fasting & Calorie Deficit Macro Calculator',
    category: 'Health & Lifestyle',
    countryCode: 'GLOBAL',
    baseSurge: 870,
    headlineTemplate: 'New Year Health Goals & Body Mass Trends: How Millions Calculate Ideal BMI and Daily Basal Metabolic Rates',
    subtitleTemplate: 'Search velocity metrics record heavy global surges for instant, confidential body mass index (BMI) and calorie calculators.',
    toolId: 'bmi-calculator',
    toolName: 'Accurate BMI & Ideal Weight Calculator',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Fresh healthy organic food and fitness measurement tape',
    tags: ['Health Trends', 'BMI Calculator', 'Weight Loss', 'Fitness', 'Wellness']
  },
  {
    keyword: 'Sleep Cycle & Circadian Rhythm Sleep Calculator',
    category: 'Health & Lifestyle',
    countryCode: 'GLOBAL',
    baseSurge: 640,
    headlineTemplate: 'Sleep Optimization Science: Why Users Are Calculating REM Sleep Cycles Before Bedtime',
    subtitleTemplate: 'Searches for natural 90-minute REM cycles and wake-up calculators grow 640% globally as wellness routines evolve.',
    toolId: 'age-calculator',
    toolName: 'Precise Time & Date Duration Calculator',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Peaceful bedroom setup with soft morning ambient light',
    tags: ['Sleep Science', 'Circadian Rhythm', 'Sleep Calculator', 'Lifestyle']
  }
];
