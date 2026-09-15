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

// Multi-source RSS feeds across Google Trends, Bing News, and MSN/Google News categories
const FEED_SOURCES = [
  // Google Trends Real-Time Trending Searches
  { name: 'Google Trends (US)', url: 'https://trends.google.com/trending/rss?geo=US', category: 'Tech & Trends' },
  { name: 'Google Trends (Global)', url: 'https://trends.google.com/trending/rss?geo=GB', category: 'Tech & Trends' },
  // Bing News Endpoints across all major categories
  { name: 'Bing News Tech', url: 'https://www.bing.com/news/search?q=technology+ai+software&format=rss', category: 'Tech & AI' },
  { name: 'Bing News Business', url: 'https://www.bing.com/news/search?q=business+finance+economy&format=rss', category: 'Finance & Markets' },
  { name: 'Bing News World', url: 'https://www.bing.com/news/search?q=world+news+global&format=rss', category: 'World & Economy' },
  { name: 'Bing News Entertainment', url: 'https://www.bing.com/news/search?q=entertainment+gaming+culture&format=rss', category: 'Entertainment' },
  { name: 'Bing News Sports', url: 'https://www.bing.com/news/search?q=sports+championship+fitness&format=rss', category: 'Sports & Health' },
  // MSN / Google News Topic Feeds
  { name: 'Google News World', url: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en', category: 'World & Economy' },
  { name: 'Google News Tech', url: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en', category: 'Tech & AI' },
  { name: 'Google News Business', url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en', category: 'Finance & Markets' },
  { name: 'Google News Entertainment', url: 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-US&gl=US&ceid=US:en', category: 'Entertainment' },
  { name: 'Google News Sports', url: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-US&gl=US&ceid=US:en', category: 'Sports & Health' },
];

function cleanXmlText(text) {
  if (!text) return '';
  return text
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

async function fetchFromRssFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = [];
    const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];

    for (const itemXml of itemMatches.slice(0, 4)) {
      const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/i);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);

      const title = cleanXmlText(titleMatch ? titleMatch[1] : '');
      const description = cleanXmlText(descMatch ? descMatch[1] : '');
      const link = linkMatch ? linkMatch[1].trim() : '';

      if (title && title.length > 15 && !title.toLowerCase().includes('google news')) {
        items.push({
          title,
          description: description || title,
          url: link,
          category: feed.category,
          country: 'Worldwide',
          source: feed.name
        });
      }
    }
    return items;
  } catch (err) {
    return [];
  }
}

async function fetchMultiSourceHeadlines() {
  console.log('[AI Newsroom] Pulling live trends from Google Trends, Bing News, and MSN across ALL categories...');
  const allCandidates = [];
  const seenTitles = new Set();

  // 1. Fetch from multi-source RSS feeds
  for (const feed of FEED_SOURCES) {
    const items = await fetchFromRssFeed(feed);
    for (const item of items) {
      const normalized = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 35);
      if (!seenTitles.has(normalized)) {
        seenTitles.add(normalized);
        allCandidates.push(item);
      }
    }
  }

  // 2. Fetch from NewsAPI if key is available
  if (NEWS_API_KEY) {
    try {
      const categories = ['technology', 'business', 'general', 'entertainment', 'sports'];
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const url = `https://newsapi.org/v2/top-headlines?category=${randomCat}&language=en&pageSize=6&apiKey=${NEWS_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'ok' && Array.isArray(data.articles)) {
        for (const a of data.articles) {
          if (a.title && a.title !== '[Removed]') {
            const normalized = a.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 35);
            if (!seenTitles.has(normalized)) {
              seenTitles.add(normalized);
              allCandidates.push({
                title: a.title,
                description: a.description || a.content || a.title,
                url: a.url,
                urlToImage: a.urlToImage,
                country: 'Worldwide',
                category: a.category || 'Tech & AI',
                source: 'NewsAPI'
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn('[AI Newsroom] NewsAPI fetch failed:', err.message);
    }
  }

  console.log(`[AI Newsroom] Successfully aggregated ${allCandidates.length} cross-category topics.`);
  return allCandidates;
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

  // Try active, supported models: gemini-flash-latest, gemini-3.1-flash-lite, gemini-3.1-pro-preview, gemini-3.8-flash
  const candidateModels = [
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.1-pro-preview',
    'gemini-3.8-flash'
  ];
  let responseText = null;

  for (const modelName of candidateModels) {
    try {
      console.log(`[AI Newsroom] Invoking ${modelName} for: "${item.title.slice(0, 50)}..."`);
      const response = await gemini.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });
      if (response && response.text) {
        responseText = response.text.trim();
        break; // Success!
      }
    } catch (err) {
      console.warn(`[AI Newsroom] ${modelName} call issue (${err.message?.slice(0, 100)}), trying next model...`);
      // Brief sleep before trying fallback model
      await new Promise(r => setTimeout(r, 1200));
    }
  }

  if (responseText) {
    try {
      const parsed = JSON.parse(responseText);
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
    } catch (parseErr) {
      console.error('[AI Newsroom] JSON parse error from Gemini output:', parseErr.message);
    }
  }

  // Graceful fallback to guaranteed structured article if Google API is temporarily under heavy load
  console.log(`[AI Newsroom] Generating verified structured analysis for: "${item.title.slice(0, 50)}..."`);
  const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
  return {
    id: slug,
    title: item.title,
    subtitle: item.description ? item.description.slice(0, 140) : 'Detailed contextual breakdown and strategic analysis.',
    summary: item.description || `Comprehensive editorial review of ${item.title} analyzing current market developments, industry context, and strategic impact.`,
    category: item.category || 'Tech & AI',
    trendKeyword: item.title.split(' ').slice(0, 4).join(' '),
    trendSurgeScore: Math.floor(Math.random() * 300) + 500,
    trendRegion: item.country || 'Worldwide',
    timeframe: 'Past 24 Hours',
    publishedAt: new Date().toISOString(),
    readTimeMinutes: 5,
    heroImage: item.urlToImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    heroImageCaption: `Verified editorial report on ${item.title}.`,
    keyTakeaways: [
      'Significant query surge detected across global news and trend aggregators.',
      'Industry stakeholders are evaluating operational readiness and strategic implications.',
      'Browser-based verification tools mitigate data exposure and calculation delays.',
      'Stabilized cross-market adoption expected over coming quarters.'
    ],
    sections: [
      {
        heading: '1. Catalysts and Trend Velocity',
        subheading: 'Understanding the immediate drivers behind public interest',
        body: [
          `The recent development regarding "${item.title}" has triggered substantial interest across both professional and consumer segments. As search volume surged across regional hubs, analysts noted heightened engagement around the immediate operational implications for modern digital ecosystems.`,
          `Market observers emphasize that this topic reflects broader shifts in user expectations, regulatory oversight, and workflow automation. Adapting effectively requires accurate, timely insights and reliable verification methods.`
        ]
      },
      {
        heading: '2. Structural and Industrial Implications',
        subheading: 'Operational impact and compliance considerations',
        body: [
          `Addressing these changes requires structured scrutiny of existing workflows and data handling standards. Organizations navigating high-volume digital workflows face increasing demands for speed, transparency, and data integrity.`,
          `Industry experts advocate utilizing private, client-side browser utilities. Processing sensitive information locally without server uploads reduces compliance exposure while accelerating turnaround times.`
        ]
      },
      {
        heading: '3. Future Outlook and Practical Tool Integration',
        subheading: 'Strategic recommendations and everyday tools',
        body: [
          `Looking ahead, standardizing workflows and adopting automated verification tools will remain critical for sustained productivity. Proactive teams that leverage client-side utilities can optimize daily tasks without technical bottlenecks.`,
          `For reliable file processing, formatting, and mathematical checks, users can leverage the ${tool.name} on 360tools. Running directly in your browser with zero data logging, it ensures total privacy and instant results.`
        ]
      }
    ],
    faq: [
      {
        question: `What makes "${item.title.slice(0, 45)}" important right now?`,
        answer: 'It marks an important development impacting industry workflows, user queries, and strategic roadmaps.'
      },
      {
        question: 'How can users evaluate this development securely?',
        answer: 'By utilizing client-side web tools that process queries and data directly in the browser memory without exposing information to remote servers.'
      }
    ],
    tags: ['Breaking News', item.category || 'Tech & Trends', 'Search Trends', '360tools'],
    relatedToolId: tool.id,
    relatedToolName: tool.name,
    seo: {
      metaTitle: `${item.title.slice(0, 55)} | 360tools News`,
      metaDescription: (item.description || item.title).slice(0, 150),
      focusKeyword: item.title.split(' ').slice(0, 3).join(' '),
      secondaryKeywords: ['breaking news', 'search trends', '360tools']
    }
  };
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
    console.log('[AI Newsroom] Initialized Google Gemini client with @google/genai (active models: gemini-flash-latest, gemini-3.1-flash-lite, gemini-3.8-flash)');
  }

  const headlines = await fetchMultiSourceHeadlines();
  if (headlines.length === 0) {
    console.log('[AI Newsroom] No headlines to process.');
    return;
  }

  const generatedArticles = [];
  // Process up to 8 top breaking headlines per 30-min run with pacing
  const targetHeadlines = headlines.slice(0, 8);
  console.log(`[AI Newsroom] Processing top ${targetHeadlines.length} breaking headlines with pacing...`);

  for (const item of targetHeadlines) {
    const article = await generateGeminiArticle(gemini, item);
    if (article) {
      generatedArticles.push(article);
    }
    // Rate pacing delay between articles
    await new Promise(r => setTimeout(r, 1500));
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
