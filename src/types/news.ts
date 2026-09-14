export type NewsCategory =
  | 'Tech & AI'
  | 'Finance & Economy'
  | 'Web & Developer'
  | 'Tools & Productivity'
  | 'Cybersecurity & Privacy'
  | 'Health & Lifestyle'
  | 'Media & Design'
  | 'Sports & Entertainment'
  | 'World & Politics';

export interface NewsCountry {
  code: string;
  name: string;
  flag: string;
  defaultLang: string;
}

export type NewsTimeframe = 'latest' | 'past_7_days' | 'breaking';

export interface NewsSection {
  heading: string;
  subheading?: string;
  body: string[];
  keyPoints?: string[];
  quote?: {
    text: string;
    author: string;
  };
}

export interface NewsArticleSEO {
  focusKeyword: string;
  secondaryKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  readabilityScore: number; // 0-100
  seoScore: number; // 0-100
  keywordDensity: string; // e.g. "1.8%"
  schemaType: 'NewsArticle';
  canonicalUrl: string;
  targetRegion: string;
}

export interface GSCIndexStatus {
  indexed: boolean;
  status: 'indexed' | 'submitted' | 'pending';
  lastPingTime?: string;
  httpResponseCode?: number;
  apiNotificationType?: 'URL_UPDATED' | 'URL_DELETED';
}

export interface NewsArticle {
  id: string; // URL slug, e.g. "google-trends-ai-web-tools-2026"
  title: string;
  subtitle: string;
  summary: string;
  category: NewsCategory;
  timeframe: NewsTimeframe;
  trendKeyword: string;
  trendSurgeScore: number; // e.g. 480 (+480% search surge)
  trendRegion: string; // e.g. "Worldwide", "United States", "Global"
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  publishedAt: string; // ISO date
  updatedAt: string;
  readTimeMinutes: number;
  keyTakeaways: string[];
  sections: NewsSection[];
  faq?: {
    question: string;
    answer: string;
  }[];
  tags: string[];
  relatedToolId?: string; // id of related 360tool, e.g. "merge-pdf"
  relatedToolName?: string;
  seo: NewsArticleSEO;
  gscStatus: GSCIndexStatus;
}

export interface WorkflowExecutionLog {
  id: string;
  timestamp: string;
  triggerType: 'scheduled_30m' | 'manual_admin' | 'trend_surge' | 'turbo_batch_500';
  trendTopic: string;
  articleGeneratedId: string;
  articleTitle: string;
  gscPingResult: 'success' | 'queued' | 'simulated';
  seoScore: number;
  country?: string;
  category?: string;
}

export interface WorkflowEngineConfig {
  autoRunEnabled: boolean;
  intervalMinutes: number;
  targetRegion: string;
  selectedCategories: NewsCategory[];
  selectedCountries?: string[];
  lastRunTimestamp: string | null;
  nextRunTimestamp: string | null;
  totalArticlesGenerated: number;
  totalGscPingsSent: number;
  dailyTargetPosts?: number; // e.g. 500
  dailyPostsCount?: number;
  turboIndexingSpeed?: string; // e.g. "500 URLs / 60 sec"
  autoBatch500Enabled?: boolean;
}
