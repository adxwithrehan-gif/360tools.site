import React, { useState, useEffect, useMemo } from 'react';
import { NewsArticle } from '../../types/news';
import { newsWorkflow } from '../../services/newsWorkflowEngine';
import { NativeAdCard } from '../ads/NativeAdCard';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  TrendingUp,
  Globe,
  Check,
  ChevronRight
} from 'lucide-react';

interface NewsArticleViewProps {
  article: NewsArticle;
  onBack: () => void;
  onSelectArticle: (id: string) => void;
  onSelectTool?: (toolId: string) => void;
}

export const NewsArticleView: React.FC<NewsArticleViewProps> = ({
  article,
  onBack,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Scroll to top on article load & inject comprehensive On-Page SEO
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 1. Dynamic Page Title & Meta Description
    document.title = `${article.title} | 360tools News`;
    
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = article.seo.metaDescription || article.summary;

    // 2. Canonical URL for GSC Indexing
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://360tools.site/news/${article.id}`;

    // 3. OpenGraph Social & Search Meta Tags
    const ogTags = [
      { property: 'og:title', content: article.title },
      { property: 'og:description', content: article.summary },
      { property: 'og:image', content: article.imageUrl },
      { property: 'og:url', content: `https://360tools.site/news/${article.id}` },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: article.title },
      { name: 'twitter:description', content: article.summary },
      { name: 'twitter:image', content: article.imageUrl },
    ];

    ogTags.forEach((tag) => {
      const selector = tag.property ? `meta[property="${tag.property}"]` : `meta[name="${tag.name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (tag.property) el.setAttribute('property', tag.property);
        if (tag.name) el.setAttribute('name', tag.name);
        document.head.appendChild(el);
      }
      el.content = tag.content;
    });

    // 4. Schema.org NewsArticle Microdata (JSON-LD) for Google News / Search
    const schemaId = 'newsarticle-jsonld-schema';
    let script = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.summary,
      image: [article.imageUrl],
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: [
        {
          '@type': 'Person',
          name: article.author.name,
          jobTitle: article.author.role,
        },
      ],
      publisher: {
        '@type': 'Organization',
        name: '360tools',
        url: 'https://360tools.site',
        logo: {
          '@type': 'ImageObject',
          url: 'https://360tools.site/favicon.svg',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://360tools.site/news/${article.id}`,
      },
    });

    return () => {
      const existingScript = document.getElementById(schemaId);
      if (existingScript) existingScript.remove();
    };
  }, [article]);

  const relatedArticles = useMemo(() => {
    return newsWorkflow
      .getArticles()
      .filter((a) => a.id !== article.id)
      .slice(0, 3);
  }, [article.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://360tools.site/news/${article.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${article.title} - via 360tools`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(`https://360tools.site/news/${article.id}`)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://360tools.site/news/${article.id}`)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`${article.title} - https://360tools.site/news/${article.id}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Build exactly 5 to 6 polished editorial paragraphs
  const articleContent = useMemo(() => {
    const rawParagraphs: string[] = [];

    // Extract all paragraphs from existing sections
    if (article.sections && article.sections.length > 0) {
      for (const sec of article.sections) {
        if (Array.isArray(sec.body)) {
          for (const p of sec.body) {
            if (p && p.trim()) rawParagraphs.push(p.trim());
          }
        }
      }
    }

    // Default headings
    const heading1 = article.sections?.[1]?.heading || `Market Dynamics & Regional Impact Across ${article.trendRegion}`;
    const heading2 = article.sections?.[2]?.heading || `Strategic Takeaways & Actionable Guidance`;

    // Ensure we have exactly 5 to 6 robust paragraphs
    const p1 = rawParagraphs[0] ||
      `Search interest surrounding "${article.trendKeyword}" experienced a notable acceleration across ${article.trendRegion}, registering a ${article.trendSurgeScore}% increase according to real-time search intelligence data. The sudden surge reflects a growing public and professional focus on understanding emerging developments, regulatory adjustments, and digital workflow shifts impacting the region.`;

    const p2 = rawParagraphs[1] ||
      `Analyses of live query velocity show that user interest spans multiple demographics, with searchers actively looking for verified contextual breakdowns, practical action items, and reliable tools. Rather than navigating fragmented reports across different portals, readers are prioritizing comprehensive coverage that addresses both theoretical causes and immediate daily implications.`;

    const p3 = rawParagraphs[2] ||
      `From an economic and operational standpoint, the expansion of queries around ${article.trendKeyword} highlights broader behavioral adjustments. Across major metropolitan hubs and secondary commercial centers in ${article.trendRegion}, professionals and consumers are demanding faster, friction-free solutions that eliminate bloated middleware and protect personal data.`;

    const p4 = rawParagraphs[3] ||
      `Technological advances in client-side computing and browser runtimes have played an instrumental role in shaping user expectations. Modern audiences are increasingly reluctant to upload sensitive financial, legal, or personal documents to remote cloud storage. In-browser processing and local computations offer an attractive, zero-risk alternative that ensures immediate execution without data harvesting.`;

    const p5 = rawParagraphs[4] ||
      `For individuals and businesses navigating these shifts in ${article.trendRegion}, adopting a proactive stance is essential. Industry analysts recommend establishing standardized, privacy-conscious protocols, utilizing verified digital utilities, and regularly reviewing core operational workflows to maintain compliance and maximize productivity.`;

    const p6 = rawParagraphs[5] ||
      `As the momentum behind ${article.trendKeyword} continues to evolve over the coming weeks, search patterns indicate sustained long-term relevance rather than a fleeting spike. Organizations and digital toolmakers that prioritize transparency, instant responsiveness, and zero-server security will remain well-positioned to serve this expanding demand.`;

    return {
      p1,
      p2,
      heading1,
      p3,
      p4,
      heading2,
      p5,
      p6,
    };
  }, [article]);

  return (
    <article className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Top Navigation & Breadcrumbs - Clean and non-distracting */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <a
          href="/news"
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
              e.preventDefault();
              onBack();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to News</span>
        </a>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <a href="/news" onClick={(e) => { e.preventDefault(); onBack(); }} className="hover:text-slate-600 cursor-pointer">News</a>
          <span>/</span>
          <span className="text-slate-500 font-semibold">{article.category}</span>
          <span>/</span>
          <span className="text-slate-700 font-bold truncate max-w-[140px] sm:max-w-[200px]">
            {article.trendRegion}
          </span>
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* CLEAN ARTICLE READING ZONE (5-6 Paragraphs + SEO)                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        {/* Article Header */}
        <header className="p-6 sm:p-10 space-y-6">
          {/* Category & Region Tag */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-black rounded-full border border-red-100 uppercase tracking-wider">
              {article.category}
            </span>
            <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xs">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{article.trendRegion}</span>
            </span>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Search Surge +{article.trendSurgeScore}%</span>
            </span>
          </div>

          {/* Headline (H1) */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Subtitle / Excerpt */}
          {article.subtitle && (
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Clean Metadata Bar (No Bot Badges) */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                360
              </div>
              <div>
                <div className="font-bold text-slate-800">{article.author.name}</div>
                <div className="text-[11px] text-slate-400">{article.author.role}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.readTimeMinutes} min read</span>
              </span>
            </div>
          </div>

          {/* Clean Hero Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200/80 mt-6">
            <img
              src={article.imageUrl}
              alt={article.imageAlt}
              className="w-full h-full object-cover"
              loading="eager"
              referrerPolicy="no-referrer"
            />
            {article.imageCredit && (
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] text-slate-300">
                {article.imageCredit}
              </div>
            )}
          </div>
        </header>

        {/* Pure Editorial Article Body (Exactly 5 to 6 Paragraphs) */}
        <div className="p-6 sm:p-10 space-y-6 pt-2 text-slate-800 text-base sm:text-lg leading-relaxed">
          {/* Paragraph 1 */}
          <p className="leading-relaxed">
            {articleContent.p1}
          </p>

          {/* Paragraph 2 */}
          <p className="leading-relaxed">
            {articleContent.p2}
          </p>

          {/* EXACTLY ONE IN-ARTICLE AD (Seamlessly placed between Paragraph 2 and Paragraph 3) */}
          <div className="my-8 py-4 border-y border-slate-100 flex flex-col items-center">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
              Advertisement
            </div>
            <div className="w-full max-w-xl mx-auto min-h-[120px] bg-slate-50/60 rounded-2xl p-2 border border-slate-200/70 overflow-hidden flex items-center justify-center">
              <NativeAdCard id={`in-article-native-${article.id}`} index={1} />
            </div>
          </div>

          {/* Subheading 1 */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-2">
            {articleContent.heading1}
          </h2>

          {/* Paragraph 3 */}
          <p className="leading-relaxed">
            {articleContent.p3}
          </p>

          {/* Paragraph 4 */}
          <p className="leading-relaxed">
            {articleContent.p4}
          </p>

          {/* Subheading 2 */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-2">
            {articleContent.heading2}
          </h2>

          {/* Paragraph 5 */}
          <p className="leading-relaxed">
            {articleContent.p5}
          </p>

          {/* Paragraph 6 */}
          <p className="leading-relaxed">
            {articleContent.p6}
          </p>

          {/* Editorial Footer Line */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <span>Published by 360tools Editorial Desk</span>
            <span>Canonical: 360tools.site/news/{article.id}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POST-ARTICLE ZONE: Rest of details appear ONLY after article is finished  */}
      {/* ========================================================================= */}

      {/* 1. REMAINING ADS (Placed strictly below the article) */}
      <div className="space-y-3 pt-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 text-center">
          Sponsored Recommendations
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-3 border border-slate-200/80 min-h-[140px] flex items-center justify-center shadow-2xs">
            <NativeAdCard id={`bottom-native-1-${article.id}`} index={2} />
          </div>
          <div className="bg-white rounded-2xl p-3 border border-slate-200/80 min-h-[140px] flex items-center justify-center shadow-2xs">
            <NativeAdCard id={`bottom-native-2-${article.id}`} index={3} />
          </div>
        </div>
      </div>

      {/* 2. Social Share Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-slate-400" />
          <span>Share this Story:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={shareOnTwitter}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Twitter / X
          </button>
          <button
            onClick={shareOnLinkedIn}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            LinkedIn
          </button>
          <button
            onClick={shareOnWhatsApp}
            className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            WhatsApp
          </button>
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
            <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* 3. More Trending Stories (Every link opens in NEW TAB with distinct weblink) */}
      {relatedArticles.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">
              More Trending Stories
            </h3>
            <a
              href="/news"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>Explore All News</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <a
                key={rel.id}
                href={`/news/${rel.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-red-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group block no-underline text-inherit"
              >
                <div className="space-y-2">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={rel.imageUrl}
                      alt={rel.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-600">
                    <span>{rel.category}</span>
                    <span>•</span>
                    <span>+{rel.trendSurgeScore}% Surge</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>{rel.readTimeMinutes} min read</span>
                  <span className="text-red-500 font-bold group-hover:translate-x-0.5 transition-transform">
                    Read Story →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
