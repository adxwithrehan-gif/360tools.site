import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Read toolsData.ts and extract all tool IDs
const toolsDataPath = path.join(__dirname, '../src/data/toolsData.ts');
const toolsDataContent = fs.readFileSync(toolsDataPath, 'utf8');

const idMatches = [...toolsDataContent.matchAll(/"?id"?:\s*['"]([^'"]+)['"]/g)];
const categoryIds = new Set(['math', 'finance', 'health', 'developer', 'utility', 'pdf', 'media']);
const uniqueToolIds = [...new Set(idMatches.map(m => m[1]))].filter(id => !categoryIds.has(id));

// 2. Read news article IDs from initialNewsData.ts, massiveNewsCatalog.ts, and liveAiArticles.json
const allNewsIds = new Set();

const newsDataPath = path.join(__dirname, '../src/data/initialNewsData.ts');
if (fs.existsSync(newsDataPath)) {
  const newsContent = fs.readFileSync(newsDataPath, 'utf8');
  const newsIdMatches = [...newsContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)];
  newsIdMatches.forEach(m => allNewsIds.add(m[1]));
}

const massiveDataPath = path.join(__dirname, '../src/data/massiveNewsCatalog.ts');
if (fs.existsSync(massiveDataPath)) {
  const massiveContent = fs.readFileSync(massiveDataPath, 'utf8');
  const massiveMatches = [...massiveContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)];
  massiveMatches.forEach(m => allNewsIds.add(m[1]));
}

const liveArticlesPath = path.join(__dirname, '../src/data/liveAiArticles.json');
if (fs.existsSync(liveArticlesPath)) {
  try {
    const liveList = JSON.parse(fs.readFileSync(liveArticlesPath, 'utf8'));
    if (Array.isArray(liveList)) {
      liveList.forEach(a => { if (a && a.id) allNewsIds.add(a.id); });
    }
  } catch {}
}

const newsArticles = [...allNewsIds];

console.log(`[Sitemap Generator] Discovered ${uniqueToolIds.length} tool slugs and ${newsArticles.length} news article slugs.`);

const DOMAIN = 'https://360tools.site';
const TODAY = new Date().toISOString().split('T')[0];
const NOW = new Date().toISOString();

const categories = ['developer', 'math', 'finance', 'health', 'utility', 'pdf', 'media'];
const staticPages = ['about', 'privacy', 'terms', 'disclaimer', 'contact'];

// Main Sitemap including all Pages, Tools, and News
let mainXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Core Website & Homepage -->
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Google Trends News & Industry Intelligence Hub -->
  <url>
    <loc>${DOMAIN}/news</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.95</priority>
  </url>

  <!-- High Priority Category Hubs -->
${categories.map(cat => `  <url>
    <loc>${DOMAIN}/category/${cat}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}

  <!-- Static Information & Legal Trust Pages -->
${staticPages.map(page => `  <url>
    <loc>${DOMAIN}/${page}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}

  <!-- Dedicated Clean Crawlable Tool URLs (/tools/:slug) -->
${uniqueToolIds.map(id => `  <url>
    <loc>${DOMAIN}/tools/${encodeURIComponent(id)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`).join('\n')}

  <!-- Industry & Search Intelligence News Stories (/news/:slug) for GSC Indexing -->
${newsArticles.map(id => `  <url>
    <loc>${DOMAIN}/news/${encodeURIComponent(id)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>
`;

// Dedicated Google News Sitemap (sitemap-news.xml) for GSC & Google News Publisher
let newsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsArticles.map(id => `  <url>
    <loc>${DOMAIN}/news/${encodeURIComponent(id)}</loc>
    <news:news>
      <news:publication>
        <news:name>360tools Search Intelligence</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${NOW}</news:publication_date>
      <news:title>Search Intelligence In-Depth Analysis: ${id.replace(/-/g, ' ')}</news:title>
    </news:news>
  </url>`).join('\n')}
</urlset>
`;

const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, mainXml.trim(), 'utf8');

const sitemapNewsPath = path.join(publicDir, 'sitemap-news.xml');
fs.writeFileSync(sitemapNewsPath, newsXml.trim(), 'utf8');

console.log(`[Sitemap Generator] Successfully generated ${sitemapPath} (tools + pages + news)`);
console.log(`[Sitemap Generator] Successfully generated ${sitemapNewsPath} (Google News sitemap)`);
