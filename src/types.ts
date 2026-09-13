export type ToolCategory = 'pdf' | 'finance' | 'math' | 'health' | 'media' | 'utility' | 'developer';

export interface FAQItem {
  question: string;
  answer: string;
  q?: string;
  a?: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  shortDesc: string;
  longDesc: string;
  description?: string;
  iconName: string;
  badge?: string;
  featured?: boolean;
  tags: string[];
  seoTitle: string;
  seoDesc: string;
  themeType?: 'developer' | 'utility' | 'finance' | 'math' | 'health' | 'pdf' | 'media';
  howToSteps?: { step: number; title: string; desc: string }[];
  faq?: FAQItem[];
  faqs?: FAQItem[];
  exampleInput?: string;
  exampleOutput?: string;
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  bgLight: string;
  accentBorder: string;
}

export type PageView = 'home' | 'tool' | 'privacy' | 'disclaimer' | 'terms' | 'about' | 'contact';
