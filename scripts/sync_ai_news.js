import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

console.log('[AI Newsroom] Starting automated NewsAPI + Google Gemini sync pipeline...');

if (!GEMINI_API_KEY) {
  console.warn('[AI Newsroom] WARNING: GEMINI_API_KEY is not set. Please set GEMINI_API_KEY in GitHub Secrets or .env file.');
}
if (!NEWS_API_KEY) {
  console.warn('[AI Newsroom] WARNING: NEWS_API_KEY is not set. Please set NEWS_API_KEY in GitHub Secrets or .env file.');
}

// Map tools for smart contextual internal linking
const TOOL_MAP = [
  { id: 'currency-converter', name: 'Live Currency Converter', match: ['dollar', 'rupee', 'currency', 'forex', 'pkr', 'inr', 'exchange'] },
  { id: 'loan-emi-calculator', name: 'Loan EMI Calculator', match: ['loan', 'interest', 'bank', 'mortgage', 'debt', 'fed', 'rate'] },
  { id: 'percentage-calculator', name: 'Percentage Calculator', match: ['inflation', 'percentage', 'growth', 'tax', 'gdp', 'profit'] },
  { id: 'meta-tag-generator', name: 'SEO Meta Tag Generator', match: ['seo', 'google', 'search', 'ranking', 'website', 'meta'] },
  { id: 'merge-pdf', name: 'Merge PDF Online', match: ['pdf', 'document', 'report', 'file', 'contract', 'paper'] },
  { id: 'compress-pdf', name: 'Compress PDF Online', match: ['size', 'storage', 'document', 'archive'] },
  { id: 'json-formatter', name: 'JSON Formatter & Validator', match: ['code', 'developer', 'software', 'api', 'tech', 'ai', 'data'] }
];

function pickMatchingTool(text) {
  const lower = (text || '').toLowerCase();
  for (const tool of TOOL_MAP) {
    if (tool.match.some(m => lower.includes(m))) {
      return tool;
    }
  }
  return { id: 'currency-converter', name: 'Financial & Conversion Suite' };
}

async function fetchNewsApiHeadlines() {
  if (!NEWS_API_KEY) {
    console.log('[AI Newsroom] NEWS_API_KEY missing, using trending tech and finance focus topics.');
    return [
      {
        title: 'Global Central Banks Signal Coordinated Digital Currency Protocols and Privacy Standards',
        description: 'Monetary authorities and financial regulators initiate phased adoption of verifiable instant settlement corridors.',
        country: 'Worldwide',
        category: 'Finance & Markets'
      },
      {
        title: 'Open-Weights AI Developer Models Deliver Milestone Reductions in Local Hardware Memory Footprints',
        description: 'New quantisation techniques and browser-native inference models remove high GPU barriers for everyday software engineers.',
        country: 'United States',
        category: 'Tech & AI'
      },
      {
        title: 'Cross-Border Freelance Remittance Rates Shift Under Updated Interbank Settlement Guidelines',
        description: 'Regional freelance developers and exporters across South Asia and the Middle East monitor forex conversion adjustments.',
        country: 'Pakistan',
        category: 'Finance & Markets'
      }
    ];
  }

  try {
    const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'ok' && Array.isArray(data.articles) && data.articles.length > 0) {
      console.log(`[AI Newsroom] Retrieved ${data.articles.length} breaking articles from NewsAPI.`);
      return data.articles.filter(a => a.title && a.title !== '[Removed]').map(a => ({
        title: a.title,
        description: a.description || a.content || '',
        url: a.url,
        urlToImage: a.urlToImage,
        country: 'Worldwide',
        category: 'Tech & AI'
      }));
    } else {
      console.warn('[AI Newsroom] NewsAPI response message:', data.message || 'No articles returned');
    }
  } catch (err) {
    console.error('[AI Newsroom] Error fetching NewsAPI:', err.message);
  }

  return [];
}

async function generateGeminiArticle(gemini, item) {
  const tool = pickMatchingTool(item.title + ' ' + item.description);

  if (!gemini) {
    console.log(`[AI Newsroom] Synthesizing structural editorial for: "${item.title}"`);
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
    return {
      id: slug,
      title: item.title,
      subtitle: item.description ? item.description.slice(0, 140) : 'Detailed contextual breakdown and strategic roadmap.',
      summary: item.description || `Comprehensive examination of ${item.title} covering core developments, market dynamics, and operational impact.`,
      category: item.category || 'Tech & AI',
      trendKeyword: item.title.split(' ').slice(0, 4).join(' '),
      trendSurgeScore: 540,
      trendRegion: item.country || 'Worldwide',
      timeframe: 'Past 24 Hours',
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 5,
      heroImage: item.urlToImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
      heroImageCaption: 'Real-time intelligence report generated for verified multi-channel distribution.',
      keyTakeaways: [
        'Rapid query acceleration observed across search indexes and regional hubs.',
        'Policy analysts recommend proactive verification of digital compliance frameworks.',
        'Automated, zero-upload tool pipelines offer immediate risk mitigation and calculation speed.',
        'Broader market consensus points toward stabilized adoption curves across upcoming quarters.'
      ],
      sections: [
        {
          heading: '1. Core Catalysts and Real-Time Search Trends',
          subheading: 'Understanding the immediate inflection points driving global user queries.',
          body: [
            `The rapid surge surrounding "${item.title}" highlights a decisive shift in public and industrial attention across ${item.country || 'international'} markets. Search velocity data recorded a multi-fold acceleration as practitioners, institutions, and consumers moved to decipher the direct consequences of newly released benchmarks.`,
            `Rather than treating this development as an isolated occurrence, market participants recognize it as the culmination of shifting operational requirements. As reliance on distributed digital infrastructure expands, timely and verifiable reporting becomes the primary differentiator between proactive adaptation and costly friction.`
          ]
        },
        {
          heading: '2. Operational Implications and Strategic Friction Points',
          subheading: 'Evaluating risk exposure, data privacy, and infrastructural adaptability.',
          body: [
            `From an engineering and regulatory perspective, adapting to these developments requires structured scrutiny of existing workflows. Organizations processing sensitive documentation and high-volume transactions face mounting scrutiny regarding client confidentiality, server-side data exposure, and automated audit trails.`,
            `Specialists emphasize the value of client-side, browser-isolated computational tools. By carrying out document transformations, conversion audits, and mathematical modeling directly within the user’s local browser, teams mitigate external data leakage while retaining frictionless operational agility.`
          ]
        },
        {
          heading: '3. Outlook and Actionable Tool Solutions',
          subheading: 'Actionable steps and recommended verified utilities.',
          body: [
            `Over the coming weeks, attention will naturally turn toward standardized policy implementations and cross-border regulatory harmonization. Early adopters who implement verifiable checklists and automated toolchains will maintain a tangible advantage over competitors navigating manual adjustments.`,
            `To assist readers in verifying calculations, securing files, and streamlining daily tasks, 360tools provides high-performance utilities including the ${tool.name}. These client-side tools operate with zero server retention, ensuring comprehensive privacy, rapid execution, and reliable daily productivity.`
          ]
        }
      ],
      faq: [
        {
          question: `Why is "${item.title.slice(0, 50)}" trending right now?`,
          answer: `Search volume surged due to breaking announcements, regulatory policy adjustments, and heightened professional focus across major industrial corridors.`
        },
        {
          question: 'How can individuals and teams protect their private data while researching this topic?',
          answer: 'We recommend utilizing client-side web tools that execute computations locally in your browser memory without uploading confidential files to remote servers.'
        },
        {
          question: `Which 360tools utility is recommended for this development?`,
          answer: `The ${tool.name} allows users to run precision checks, conversions, and document operations instantaneously.`
        }
      ],
      tags: ['Search Intelligence', 'Breaking News', 'Verified Analysis', item.category || 'Tech & AI', '360tools'],
      relatedToolId: tool.id,
      relatedToolName: tool.name,
      seo: {
        metaTitle: `${item.title.slice(0, 60)} | 360tools News`,
        metaDescription: (item.description || item.title).slice(0, 155),
        focusKeyword: item.title.split(' ').slice(0, 3).join(' '),
        secondaryKeywords: ['search trends', 'industry analysis', '360tools', 'real-time report']
      }
    };
  }

  // Use Gemini 3.8 Flash to write a high-ranking original 6-paragraph deep dive
  console.log(`[AI Newsroom] Invoking Google Gemini 3.8 Flash for: "${item.title}"`);
  const prompt = `You are a world-class investigative technology, business, and financial journalist at 360tools.site.
Analyze this news story:
Headline: "${item.title}"
Context: "${item.description}"
Country/Region: "${item.country || 'Worldwide'}"
Category: "${item.category || 'Tech & AI'}"
Associated Utility Tool: "${tool.name}" (tool ID: "${tool.id}")

Generate a comprehensive, 100% original, human-like editorial story.
Return STRICTLY valid JSON with no markdown formatting around it, matching this JSON structure:
{
  "title": "Clear, professional headline (60-80 chars)",
  "subtitle": "Informative analytical subhead (100-140 chars)",
  "summary": "Crisp 2-sentence executive summary",
  "keyTakeaways": [
    "Point 1",
    "Point 2",
    "Point 3",
    "Point 4"
  ],
  "sections": [
    {
      "heading": "1. Catalysts and Trend Velocity",
      "subheading": "Analytical breakdown of the primary drivers",
      "body": [
        "Paragraph 1 (65-90 words, detailed, journalistic)",
        "Paragraph 2 (65-90 words, market impact, facts)"
      ]
    },
    {
      "heading": "2. Structural and Industrial Implications",
      "subheading": "How this affects everyday professionals and systems",
      "body": [
        "Paragraph 3 (65-90 words, technical and regulatory perspective)",
        "Paragraph 4 (65-90 words, privacy and operational workflow considerations)"
      ]
    },
    {
      "heading": "3. Future Outlook and Practical Tool Integration",
      "subheading": "Actionable takeaways and browser tool integration",
      "body": [
        "Paragraph 5 (65-90 words, projected roadmaps for the coming months)",
        "Paragraph 6 (65-90 words, specifically highlighting how ${tool.name} on 360tools assists users with local private calculations or transformations)"
      ]
    }
  ],
  "faq": [
    { "question": "Question 1?", "answer": "Answer 1" },
    { "question": "Question 2?", "answer": "Answer 2" },
    { "question": "Question 3?", "answer": "Answer 3" }
  ],
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
  "metaTitle": "SEO Meta Title (55-65 chars)",
  "metaDescription": "SEO Meta Description (145-160 chars)"
}`;

  try {
    const response = await gemini.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const parsed = JSON.parse(response.text.trim());
    const slug = (parsed.title || item.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);

    return {
      id: slug,
      title: parsed.title || item.title,
      subtitle: parsed.subtitle || item.description,
      summary: parsed.summary || item.description,
      category: item.category || 'Tech & AI',
      trendKeyword: item.title.split(' ').slice(0, 4).join(' '),
      trendSurgeScore: Math.floor(Math.random() * 400) + 450,
      trendRegion: item.country || 'Worldwide',
      timeframe: 'Past 24 Hours',
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 5,
      heroImage: item.urlToImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
      heroImageCaption: `Verified editorial report on ${parsed.title || item.title}.`,
      keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [
        'Rapid query acceleration observed across search indexes.',
        'Broader enterprise adoption projected over the current quarter.',
        'Local browser computation ensures privacy for calculations and conversions.'
      ],
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
      faq: Array.isArray(parsed.faq) ? parsed.faq : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags : ['Search Intelligence', 'Tech & AI', '360tools'],
      relatedToolId: tool.id,
      relatedToolName: tool.name,
      seo: {
        metaTitle: parsed.metaTitle || `${parsed.title} | 360tools`,
        metaDescription: parsed.metaDescription || (parsed.summary || '').slice(0, 155),
        focusKeyword: item.title.split(' ').slice(0, 3).join(' '),
        secondaryKeywords: ['breaking news', 'search trends', '360tools']
      }
    };
  } catch (err) {
    console.error('[AI Newsroom] Gemini generation error, using structured fallback:', err.message);
    return null;
  }
}

async function main() {
  let gemini = null;
  if (GEMINI_API_KEY) {
    gemini = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    console.log('[AI Newsroom] Initialized Google Gemini client with @google/genai (model: gemini-3.8-flash)');
  }

  const headlines = await fetchNewsApiHeadlines();
  if (headlines.length === 0) {
    console.log('[AI Newsroom] No headlines to process.');
    return;
  }

  const generatedArticles = [];
  for (const item of headlines) {
    const article = await generateGeminiArticle(gemini, item);
    if (article) {
      generatedArticles.push(article);
    }
  }

  if (generatedArticles.length === 0) {
    console.log('[AI Newsroom] No articles generated.');
    return;
  }

  const liveArticlesPath = path.join(__dirname, '../src/data/liveAiArticles.json');
  let existing = [];
  if (fs.existsSync(liveArticlesPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(liveArticlesPath, 'utf8'));
    } catch {
      existing = [];
    }
  }

  const existingIds = new Set(existing.map(a => a.id));
  const newOnes = generatedArticles.filter(a => !existingIds.has(a.id));
  const merged = [...newOnes, ...existing].slice(0, 500);

  fs.writeFileSync(liveArticlesPath, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`[AI Newsroom] Successfully added ${newOnes.length} new AI articles. Total catalog: ${merged.length}`);

  // Trigger sitemap update
  try {
    const sitemapScript = path.join(__dirname, 'generate-sitemap.js');
    if (fs.existsSync(sitemapScript)) {
      console.log('[AI Newsroom] Refreshing sitemap.xml and sitemap-news.xml...');
      import('./generate-sitemap.js');
    }
  } catch (err) {
    console.warn('[AI Newsroom] Sitemap update warning:', err.message);
  }
}

main().catch(err => {
  console.error('[AI Newsroom] Fatal pipeline error:', err);
  process.exit(1);
});
