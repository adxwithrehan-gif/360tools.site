# 360tools.site - Complete SEO & Fast Indexing Strategy Guide

Domain: **https://360tools.site/**  
Architecture: **360+ Clean Dedicated URLs (`/tools/:toolSlug`), XML Sitemap, Dynamic OpenGraph & JSON-LD Schemas**

---

## 1. Dynamic Routing Architecture & URL Slugs
Every single tool is mapped to a dedicated canonical URL:
- Canonical Format: `https://360tools.site/tools/:toolSlug` (e.g. `https://360tools.site/tools/age-calculator`, `https://360tools.site/tools/merge-pdf`)
- Category Hubs: `https://360tools.site/category/:categorySlug`
- Static Legal Pages: `https://360tools.site/about`, `https://360tools.site/privacy`, `https://360tools.site/terms`, `https://360tools.site/contact`, `https://360tools.site/disclaimer`
- Backward Compatibility: `/?tool=slug` automatically resolves to the canonical tool view.
- Internal Crawlability: All homepage and related tool cards use semantic HTML `<a href="/tools/:slug">` anchors so Googlebot, Bingbot, and web crawlers can discover every internal link directly without JavaScript execution.

---

## 2. Dynamic Sitemap Automation
The automated script scans all 360 tool IDs and generates a valid XML sitemap during every `npm run build`:
```bash
npm run sitemap
# or
node scripts/generate-sitemap.js
```
The resulting file is saved directly to `public/sitemap.xml` and accessible at:
👉 **https://360tools.site/sitemap.xml**

---

## 3. Fast Indexing with IndexNow API (Bing, Yandex, Seznam)
IndexNow alerts search engines immediately when pages are published:
```bash
npm run indexnow
```
- Verification Key: `360tools-indexnow-key`
- Key Location: `https://360tools.site/360tools-indexnow-key.txt`
- Endpoint: `https://api.indexnow.org/indexnow`

---

## 4. Google Search Console 24–48 Hour Setup Checklist
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add Domain property: `https://360tools.site/`.
3. Submit Sitemap: `https://360tools.site/sitemap.xml`.
4. In **URL Inspection**, enter your top 5 high-traffic tools:
   - `https://360tools.site/tools/merge-pdf`
   - `https://360tools.site/tools/split-pdf`
   - `https://360tools.site/tools/compress-pdf`
   - `https://360tools.site/tools/scientific-calculator`
   - `https://360tools.site/tools/loan-calculator`
5. Click **Request Indexing**.

---

## 5. Free High-DA Web 2.0 Backlinks Action Plan
Build strong baseline domain authority by submitting to these free platforms:

1. **GitHub Repository (DA 96)**:
   - Create public repository: `360tools`.
   - Add a detailed README with description, feature list, and dofollow link to `https://360tools.site/`.
2. **Product Hunt (DA 91)**:
   - Launch on Product Hunt as a free privacy-first web tools suite.
3. **Reddit (DA 98)**:
   - Share helpful tutorials in `r/SideProject`, `r/webdev`, `r/InternetIsBeautiful`, and `r/usefulwebsites`.
4. **Dev.to / Hashnode (DA 89)**:
   - Publish an engineering story: *"How we built 360 client-side tools using Web APIs without servers"*.

---

## 6. On-Page SEO & Structured Data Schemas
Every single tool page dynamically serves:
- Primary keyword `<h1>` tag
- `<h2>` and `<h3>` tags for "How to use", "Key Features", and "FAQs"
- 300–500 words of tailored instructional content
- `SoftwareApplication` / `WebApplication` schema (Rating 4.9, $0 USD price)
- `FAQPage` schema (Rich collapsible snippets in Google SERPs)
- `BreadcrumbList` schema
- `Organization` & `LocalBusiness` schema for brand entity authority
- "Related Tools" internal linking section (6–9 tools with semantic anchors)
- Built-in social sharing (WhatsApp, Twitter/X, Facebook, LinkedIn, Copy Link)
