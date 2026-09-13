import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read tools data to get all 360 tool IDs
const toolsDataPath = path.join(__dirname, '../src/data/toolsData.ts');
const toolsDataContent = fs.readFileSync(toolsDataPath, 'utf8');

const idMatches = [...toolsDataContent.matchAll(/"?id"?:\s*['"]([^'"]+)['"]/g)];
const categoryIds = new Set(['math', 'finance', 'health', 'developer', 'utility', 'pdf', 'media']);
const uniqueToolIds = [...new Set(idMatches.map(m => m[1]))].filter(id => !categoryIds.has(id));

const HOST = '360tools.site';
const DOMAIN = `https://${HOST}`;
const KEY = '360tools-indexnow-key';
const KEY_LOCATION = `${DOMAIN}/360tools-indexnow-key.txt`;

const allUrls = [
  `${DOMAIN}/`,
  `${DOMAIN}/category/developer`,
  `${DOMAIN}/category/math`,
  `${DOMAIN}/category/finance`,
  `${DOMAIN}/category/health`,
  `${DOMAIN}/category/utility`,
  `${DOMAIN}/category/pdf`,
  `${DOMAIN}/category/media`,
  ...uniqueToolIds.map(id => `${DOMAIN}/tools/${encodeURIComponent(id)}`)
];

console.log(`[IndexNow Engine] Prepared ${allUrls.length} URLs for instant search engine indexing.`);

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: allUrls.slice(0, 10000) // IndexNow supports up to 10,000 URLs per batch
};

async function pingIndexNow() {
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`[IndexNow] Pinging endpoint: ${endpoint}...`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      console.log(`[IndexNow] ${endpoint} response status: ${response.status} ${response.statusText}`);
      if (response.status === 200 || response.status === 202) {
        console.log(`✅ [IndexNow] Successfully submitted all 360 tools URLs to ${endpoint}!`);
      } else {
        const bodyText = await response.text();
        console.log(`⚠️ [IndexNow] Endpoint returned status ${response.status}: ${bodyText}`);
      }
    } catch (err) {
      console.error(`❌ [IndexNow] Error pinging ${endpoint}:`, err.message);
    }
  }

  console.log('\n======================================================');
  console.log('🚀 FAST GOOGLE INDEXING INSTRUCTIONS (24-48 HOUR PLAN)');
  console.log('======================================================');
  console.log('1. Go to Google Search Console (https://search.google.com/search-console).');
  console.log('2. Add property: https://360tools.site/');
  console.log('3. Submit Sitemap: https://360tools.site/sitemap.xml');
  console.log('4. Googlebot will queue and crawl all 360 clean URLs.');
  console.log('5. Use Google Indexing API for batch URL push if service account is active.');
  console.log('======================================================\n');
}

pingIndexNow();
