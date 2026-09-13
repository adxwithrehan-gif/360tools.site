import React, { useState } from 'react';
import { 
  X, CheckCircle2, Copy, Check, ExternalLink, Globe, Sparkles, 
  Send, ShieldCheck, Share2, Terminal, ArrowRight, Zap, Code
} from 'lucide-react';

interface SeoActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeoActionModal: React.FC<SeoActionModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'backlinks' | 'indexnow' | 'schemas' | 'sitemap'>('backlinks');

  if (!isOpen) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-linear-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-white tracking-tight">
                360 Tools SEO & Fast Indexing Action Plan
              </h3>
              <p className="text-xs text-slate-300">
                24–48 Hour Search Engine Ranking & High-DA Backlinks Strategy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('backlinks')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'backlinks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. High-DA Web 2.0 Backlinks
          </button>
          <button
            onClick={() => setActiveTab('indexnow')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'indexnow'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. IndexNow & Instant Crawling
          </button>
          <button
            onClick={() => setActiveTab('schemas')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'schemas'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Local & Schema Markup
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sitemap'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. 360 URLs Sitemap
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[68vh] overflow-y-auto">
          {activeTab === 'backlinks' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <strong>High-DA Backlinks Strategy:</strong> Submit your 360tools website to these 4 free platforms to establish domain authority (DA 90+) and start receiving organic referral traffic within days.
              </div>

              {/* GitHub */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">1. GitHub Repository Showcase (DA 96)</span>
                  </div>
                  <button
                    onClick={() => copyText(
                      `# 360tools.site - 360+ Free Online Browser Tools\n\n100% Client-side, private, and instant web utilities for PDF, Developer, Math, Finance, Health, Media and more.\n\n🌐 Live Website: https://360tools.site/\n\n## Features\n- 360+ web tools in one clean suite\n- Zero server uploads (100% in-browser processing)\n- Mobile & desktop responsive`,
                      'github'
                    )}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'github' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'github' ? 'Copied' : 'Copy README Text'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Publish a public GitHub repository named <code>360tools</code> with a clean README containing the dofollow backlink to <code>https://360tools.site/</code>.
                </p>
              </div>

              {/* Product Hunt */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">2. Product Hunt Launch (DA 91)</span>
                  <button
                    onClick={() => copyText(
                      `Tagline: 360+ Free Online Web Tools with Zero Server Uploads\n\nDescription: We built 360tools (https://360tools.site/) to give everyone an instant, ad-light, and completely private suite of web calculators, converters, and PDF tools. All processing runs right inside your browser memory!`,
                      'ph'
                    )}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'ph' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ph' ? 'Copied' : 'Copy Pitch'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Post on Product Hunt "Ship" and upcoming products page for 1,000+ targeted tech early adopters.
                </p>
              </div>

              {/* Reddit */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">3. Reddit (r/webdev, r/SideProject, r/usefulwebsites) (DA 98)</span>
                  <button
                    onClick={() => copyText(
                      `Title: I made 360tools.site - A suite of 360 free client-side tools with zero data uploaded to servers\n\nHey everyone, I wanted a fast, privacy-friendly alternative to bloated tool sites. 360tools runs completely inside local browser memory with instant calculations and no login required.\n\nCheck it out here: https://360tools.site/\n\nFeedback is warmly appreciated!`,
                      'reddit'
                    )}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'reddit' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'reddit' ? 'Copied' : 'Copy Reddit Post'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Share in r/SideProject, r/InternetIsBeautiful, and r/webdev to generate viral social signals.
                </p>
              </div>

              {/* Dev.to */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">4. Dev.to / Hashnode Article (DA 89)</span>
                  <button
                    onClick={() => copyText(
                      `# Building 360tools.site: How We Created 360 In-Browser Tools Without Any Backend Servers\n\nIn this article, I share how client-side Web APIs, Web Workers, and modern JavaScript let us build over 360 utilities ranging from PDF mergers to scientific calculators.\n\nTry the live tools: [360tools.site](https://360tools.site/)`,
                      'devto'
                    )}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'devto' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'devto' ? 'Copied' : 'Copy Article Intro'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Publish a developer story on dev.to with markdown links to your tools.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'indexnow' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <strong>Instant Indexing via IndexNow Protocol:</strong> IndexNow instantly alerts Bing, Yandex, Seznam, and partner engines whenever new tools are published or updated, indexing URLs within 24 hours.
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    Automated IndexNow Ping Command
                  </span>
                  <button
                    onClick={() => copyText('npm run indexnow', 'cmd-indexnow')}
                    className="text-blue-400 hover:text-blue-300 font-sans text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'cmd-indexnow' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'cmd-indexnow' ? 'Copied' : 'Copy Command'}</span>
                  </button>
                </div>
                <p className="text-emerald-400">$ npm run indexnow</p>
                <p className="text-slate-400 text-[11px]">
                  Pings https://api.indexnow.org/indexnow with all 360 URLs and key file at https://360tools.site/360tools-indexnow-key.txt.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs text-slate-700">
                <h4 className="font-bold text-slate-900">Google Search Console 24-Hour Checklist:</h4>
                <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                  <li>Open <strong>Google Search Console</strong> and verify ownership of <code>https://360tools.site/</code>.</li>
                  <li>Click <strong>Sitemaps</strong> in the left sidebar.</li>
                  <li>Enter <code>sitemap.xml</code> and click <strong>Submit</strong>.</li>
                  <li>Use the <strong>URL Inspection Tool</strong> to manually inspect 5 key URLs (e.g. <code>/tools/merge-pdf</code>, <code>/tools/bmi-calculator</code>) and click <strong>Request Indexing</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'schemas' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 leading-relaxed">
                <strong>Schema.org Rich Snippets Enabled:</strong> Every single tool page automatically serves dynamic Google-compliant JSON-LD structured data for:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="font-bold text-xs text-blue-600">SoftwareApplication</span>
                  <p className="text-[11px] text-slate-600">
                    Triggers software snippet with 4.9 star rating, free offer ($0 USD), and browser requirements.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="font-bold text-xs text-blue-600">FAQPage Schema</span>
                  <p className="text-[11px] text-slate-600">
                    Expands Google Search SERP real-estate with rich collapsible Q&A accordions.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="font-bold text-xs text-blue-600">BreadcrumbList Schema</span>
                  <p className="text-[11px] text-slate-600">
                    Displays clean breadcrumb hierarchy (Home &gt; Category &gt; Tool Name) in search results.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="font-bold text-xs text-blue-600">Organization & Brand Schema</span>
                  <p className="text-[11px] text-slate-600">
                    Establishes brand entity authority for 360tools.site with official logo and socials.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sitemap' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Dynamic XML Sitemap (373 Indexed URLs):</strong> Generated directly during build via <code>scripts/generate-sitemap.js</code>.
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Sitemap URL:</h4>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-blue-600 hover:underline flex items-center gap-1"
                  >
                    https://360tools.site/sitemap.xml
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <button
                  onClick={() => copyText('https://360tools.site/sitemap.xml', 'sitemap-url')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'sitemap-url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'sitemap-url' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
                <span className="text-slate-400 block text-[11px]">Re-generate sitemap manually at any time:</span>
                <p className="text-emerald-400">$ npm run sitemap</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Close Action Plan
          </button>
        </div>

      </div>
    </div>
  );
};
