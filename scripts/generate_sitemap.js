import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read toolsData.ts and extract all tool IDs
const toolsDataPath = path.join(__dirname, '../src/data/toolsData.ts');
const toolsDataContent = fs.readFileSync(toolsDataPath, 'utf8');

// Regex match all id: '...' or "id": "..." inside TOOLS array
const idMatches = [...toolsDataContent.matchAll(/"?id"?:\s*['"]([^'"]+)['"]/g)];
// Filter out category IDs
const categoryIds = new Set(['math', 'finance', 'health', 'developer', 'utility', 'pdf', 'media']);
const uniqueToolIds = [...new Set(idMatches.map(m => m[1]))].filter(id => !categoryIds.has(id));

console.log(`Found ${uniqueToolIds.length} tool IDs.`);

const DOMAIN = 'https://360tools.site';
const TODAY = new Date().toISOString().split('T')[0];

const categories = ['developer', 'math', 'finance', 'health', 'utility', 'pdf', 'media'];
const staticPages = ['about', 'privacy', 'terms', 'disclaimer', 'contact'];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
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

  <!-- High Priority Category Hubs -->
${categories.map(cat => `  <url>
    <loc>${DOMAIN}/?category=${cat}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}

  <!-- Static Information & Legal Trust Pages -->
${staticPages.map(page => `  <url>
    <loc>${DOMAIN}/?page=${page}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`).join('\n')}

  <!-- 360 Free Online Tools (Dedicated Crawlable Endpoints) -->
${uniqueToolIds.map(id => `  <url>
    <loc>${DOMAIN}/?tool=${encodeURIComponent(id)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>
`;

const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`Successfully generated ${sitemapPath} with ${uniqueToolIds.length + categories.length + staticPages.length + 1} indexed URLs!`);
