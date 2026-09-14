import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
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

function pickMatchingTool(text: string) {
  const lower = (text || '').toLowerCase();
  for (const tool of TOOL_MAP) {
    if (tool.match.some(m => lower.includes(m))) {
      return tool;
    }
  }
  return { id: 'currency-converter', name: 'Financial & Conversion Suite' };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health check & configuration status
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      hasNewsApiKey: Boolean(process.env.NEWS_API_KEY),
      model: "gemini-3.8-flash",
      time: new Date().toISOString()
    });
  });

  // 2. Fetch live headlines from NewsAPI (proxy to protect API key)
  app.get("/api/news/breaking", async (req, res) => {
    const category = (req.query.category as string) || "technology";
    const country = (req.query.country as string) || "us";
    const q = (req.query.q as string) || "";
    const newsApiKey = process.env.NEWS_API_KEY;

    if (!newsApiKey) {
      return res.json({
        success: false,
        requiresKey: true,
        message: "NEWS_API_KEY is not configured yet. Add it to GitHub Secrets or .env file to enable live feeds.",
        articles: []
      });
    }

    try {
      let url = "";
      if (q) {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&pageSize=10&apiKey=${newsApiKey}`;
      } else {
        url = `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(category)}&country=${encodeURIComponent(country)}&pageSize=10&apiKey=${newsApiKey}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "ok" && Array.isArray(data.articles)) {
        const cleanArticles = data.articles
          .filter((a: any) => a.title && a.title !== "[Removed]")
          .map((a: any) => ({
            title: a.title,
            description: a.description || "",
            url: a.url,
            urlToImage: a.urlToImage,
            source: a.source?.name || "Global News",
            publishedAt: a.publishedAt
          }));
        return res.json({ success: true, articles: cleanArticles });
      } else {
        return res.json({
          success: false,
          message: data.message || "NewsAPI did not return articles",
          articles: []
        });
      }
    } catch (err: any) {
      console.error("NewsAPI fetch error:", err);
      return res.status(500).json({ success: false, message: err.message || "Failed to fetch from NewsAPI" });
    }
  });

  // 3. Synthesize full 6-paragraph in-depth article using Google Gemini (model: gemini-3.8-flash)
  app.post("/api/news/generate-ai-article", async (req, res) => {
    const { headline, topic, country = "Worldwide", category = "Tech & AI", initialSummary = "" } = req.body;

    if (!headline && !topic) {
      return res.status(400).json({ success: false, message: "Headline or topic is required" });
    }

    const queryHeadline = (headline || topic).trim();
    const tool = pickMatchingTool(queryHeadline + " " + initialSummary);
    const gemini = getGeminiClient();

    if (!gemini) {
      return res.json({
        success: false,
        requiresKey: true,
        message: "GEMINI_API_KEY is not configured yet. Add GEMINI_API_KEY in GitHub Secrets or .env file to activate Gemini AI news synthesis."
      });
    }

    try {
      const prompt = `You are a world-class investigative technology and financial journalist and senior SEO editor at 360tools.site.
Analyze this breaking news inquiry:
Headline: "${queryHeadline}"
Context Summary: "${initialSummary}"
Country/Region: "${country}"
Category: "${category}"
Associated Utility Tool: "${tool.name}" (Tool ID: "${tool.id}")

Requirements:
1. Write a 100% original, human-like editorial story.
2. Provide exactly 3 sections. Each section MUST contain exactly 2 substantial paragraphs (65-90 words per paragraph, giving 6 rich paragraphs total).
3. The final paragraph must contextually reference how the ${tool.name} tool on 360tools.site provides users with free, private, client-side calculations and verification.
4. Output STRICTLY valid JSON with no markdown backticks, matching this exact format:
{
  "title": "Compelling journalistic headline (60-80 chars)",
  "subtitle": "Informative analytical subhead (100-140 chars)",
  "summary": "Crisp 2-sentence executive summary",
  "keyTakeaways": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3",
    "Key takeaway point 4"
  ],
  "sections": [
    {
      "heading": "1. Catalysts and Trend Velocity",
      "subheading": "Analytical breakdown of primary drivers",
      "body": [
        "Paragraph 1 text...",
        "Paragraph 2 text..."
      ]
    },
    {
      "heading": "2. Structural and Industrial Implications",
      "subheading": "Operational impact on systems and professionals",
      "body": [
        "Paragraph 3 text...",
        "Paragraph 4 text..."
      ]
    },
    {
      "heading": "3. Outlook and Actionable Tool Solutions",
      "subheading": "Strategic forecast and client-side utilities",
      "body": [
        "Paragraph 5 text...",
        "Paragraph 6 text contextually introducing ${tool.name}..."
      ]
    }
  ],
  "faq": [
    { "question": "Relevant question 1?", "answer": "Clear factual answer 1" },
    { "question": "Relevant question 2?", "answer": "Clear factual answer 2" },
    { "question": "Relevant question 3?", "answer": "Clear factual answer 3" }
  ],
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
  "metaTitle": "SEO Meta Title (55-65 chars)",
  "metaDescription": "SEO Meta Description (145-160 chars)"
}`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      });

      const parsed = JSON.parse(response.text.trim());
      const slug = (parsed.title || queryHeadline)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 80);

      const article = {
        id: slug,
        title: parsed.title || queryHeadline,
        subtitle: parsed.subtitle || initialSummary || "In-depth editorial examination and strategic overview.",
        summary: parsed.summary || initialSummary,
        category,
        trendKeyword: queryHeadline.split(" ").slice(0, 4).join(" "),
        trendSurgeScore: Math.floor(Math.random() * 400) + 480,
        trendRegion: country,
        timeframe: "Past 24 Hours",
        publishedAt: new Date().toISOString(),
        readTimeMinutes: 5,
        heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
        heroImageCaption: `Verified editorial report on ${parsed.title || queryHeadline}.`,
        keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [],
        sections: Array.isArray(parsed.sections) ? parsed.sections : [],
        faq: Array.isArray(parsed.faq) ? parsed.faq : [],
        tags: Array.isArray(parsed.tags) ? parsed.tags : ["Search Intelligence", category, "360tools"],
        relatedToolId: tool.id,
        relatedToolName: tool.name,
        seo: {
          metaTitle: parsed.metaTitle || `${parsed.title} | 360tools News`,
          metaDescription: parsed.metaDescription || (parsed.summary || "").slice(0, 155),
          focusKeyword: queryHeadline.split(" ").slice(0, 3).join(" "),
          secondaryKeywords: ["breaking news", "search intelligence", "360tools", "in-depth guide"]
        }
      };

      return res.json({ success: true, article });
    } catch (err: any) {
      console.error("Gemini generation error:", err);
      return res.status(500).json({ success: false, message: err.message || "Failed to generate AI article" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`360tools Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
