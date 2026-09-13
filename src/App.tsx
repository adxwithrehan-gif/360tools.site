import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CATEGORIES, TOOLS } from './data/toolsData';
import { ToolCategory, ToolItem } from './types';
import { ToolView } from './components/tools/ToolView';
import { StaticPages } from './components/pages/StaticPages';
import { News } from './pages/News';
import { IconRenderer } from './components/common/IconRenderer';
import { ToolCard } from './components/common/ToolCard';
import { NativeAdCard } from './components/ads/NativeAdCard';
import { ADS_CONFIG } from './config/adsConfig';
import { InstallShortcutModal } from './components/common/InstallShortcutModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { injectToolSEO, injectCategorySEO, resetDefaultSEO } from './utils/seo';
import {
  Search,
  Lock,
  Zap,
  Globe,
  Menu,
  X,
  ChevronRight,
  Download
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentToolId, setCurrentToolId] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<ToolCategory | 'all'>('all');
  const [currentPage, setCurrentPage] = useState<'privacy' | 'terms' | 'disclaimer' | 'about' | 'contact' | 'news' | null>(null);

  // Search & UI State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // PWA Install Engine
  const {
    isInstallable,
    install: triggerNativeInstall,
  } = usePWAInstall();

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await triggerNativeInstall();
      if (!accepted) {
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state with URL paths & search params
  useEffect(() => {
    const handleUrlChange = () => {
      const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
      const searchParams = new URLSearchParams(window.location.search);

      let targetToolId: string | null = null;
      let targetCategory: ToolCategory | null = null;
      let targetPage: 'privacy' | 'terms' | 'disclaimer' | 'about' | 'contact' | 'news' | null = null;

      if (pathname.startsWith('/tools/')) {
        targetToolId = decodeURIComponent(pathname.slice('/tools/'.length));
      } else if (pathname.startsWith('/tool/')) {
        targetToolId = decodeURIComponent(pathname.slice('/tool/'.length));
      } else if (pathname.startsWith('/category/')) {
        const cat = decodeURIComponent(pathname.slice('/category/'.length)) as ToolCategory;
        if (['pdf', 'finance', 'math', 'health', 'media', 'utility', 'developer'].includes(cat)) {
          targetCategory = cat;
        }
      } else if (['/privacy', '/terms', '/disclaimer', '/about', '/contact', '/news'].includes(pathname)) {
        targetPage = pathname.slice(1) as any;
      } else if (pathname !== '/') {
        const slug = decodeURIComponent(pathname.slice(1));
        const found = TOOLS.find((t) => t.id === slug);
        if (found) {
          targetToolId = slug;
        }
      }

      if (!targetToolId && !targetCategory && !targetPage) {
        const toolParam = searchParams.get('tool');
        const pageParam = searchParams.get('page');
        const catParam = searchParams.get('category');

        if (toolParam) {
          targetToolId = toolParam;
        } else if (pageParam && ['privacy', 'terms', 'disclaimer', 'about', 'contact', 'news'].includes(pageParam)) {
          targetPage = pageParam as any;
        } else if (catParam && ['pdf', 'finance', 'math', 'health', 'media', 'utility', 'developer'].includes(catParam)) {
          targetCategory = catParam as ToolCategory;
        }
      }

      if (targetToolId) {
        const found = TOOLS.find((t) => t.id === targetToolId);
        if (found) {
          setCurrentToolId(targetToolId);
          setCurrentPage(null);
          injectToolSEO(targetToolId);
          return;
        }
      }

      if (targetPage) {
        setCurrentPage(targetPage);
        setCurrentToolId(null);
        document.title = `${targetPage.charAt(0).toUpperCase() + targetPage.slice(1)} - 360tools.site`;
        return;
      }

      if (targetCategory) {
        setCurrentCategory(targetCategory);
        setCurrentToolId(null);
        setCurrentPage(null);
        injectCategorySEO(targetCategory);
        return;
      }

      setCurrentToolId(null);
      setCurrentPage(null);
      setCurrentCategory('all');
      resetDefaultSEO();
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Keyboard shortcut (⌘K or /) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateToTool = (toolId: string) => {
    setCurrentToolId(toolId);
    setCurrentPage(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const newUrl = `/tools/${encodeURIComponent(toolId)}`;
    window.history.pushState({ toolId }, '', newUrl);
    injectToolSEO(toolId);
  };

  const navigateToPage = (page: 'privacy' | 'terms' | 'disclaimer' | 'about' | 'contact' | 'news') => {
    setCurrentPage(page);
    setCurrentToolId(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const newUrl = `/${encodeURIComponent(page)}`;
    window.history.pushState({ page }, '', newUrl);
    document.title = `${page.charAt(0).toUpperCase() + page.slice(1)} - 360tools.site`;
  };

  const navigateToCategory = (category: ToolCategory) => {
    setCurrentToolId(null);
    setCurrentPage(null);
    setCurrentCategory(category);
    setSearchQuery('');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const newUrl = `/category/${encodeURIComponent(category)}`;
    window.history.pushState({ category }, '', newUrl);
    injectCategorySEO(category);
  };

  const navigateToHome = (category: ToolCategory | 'all' = 'all') => {
    if (category !== 'all') {
      navigateToCategory(category);
      return;
    }
    setCurrentToolId(null);
    setCurrentPage(null);
    setCurrentCategory('all');
    setSearchQuery('');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.history.pushState({}, '', '/');
    resetDefaultSEO();
  };

  const filteredTools = useMemo(() => {
    let result = TOOLS;

    if (currentCategory !== 'all') {
      result = result.filter((t) => t.category === currentCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortDesc.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [currentCategory, searchQuery]);

  const gridWithAds = useMemo(() => {
    if (!ADS_CONFIG.enabled || filteredTools.length === 0) {
      return filteredTools.map((tool) => ({ type: 'tool' as const, tool }));
    }

    const totalAds = Math.min(ADS_CONFIG.homeGridAds.length, 50);
    const step = Math.max(3, Math.floor(filteredTools.length / 50));

    const items: Array<
      | { type: 'tool'; tool: ToolItem }
      | { type: 'ad'; adConfig: typeof ADS_CONFIG.homeGridAds[0]; index: number }
    > = [];

    let adCount = 0;
    filteredTools.forEach((tool, idx) => {
      items.push({ type: 'tool', tool });
      if (
        (idx + 1) % step === 0 &&
        adCount < totalAds &&
        adCount < ADS_CONFIG.homeGridAds.length
      ) {
        items.push({
          type: 'ad',
          adConfig: ADS_CONFIG.homeGridAds[adCount],
          index: adCount,
        });
        adCount++;
      }
    });

    return items;
  }, [filteredTools]);

  const activeTool = useMemo(() => {
    return TOOLS.find((t) => t.id === currentToolId) || null;
  }, [currentToolId]);

  const relatedTools = useMemo(() => {
    if (!activeTool) return [];
    return TOOLS.filter((t) => t.category === activeTool.category && t.id !== activeTool.id).slice(0, 6);
  }, [activeTool]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => navigateToHome('all')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#e5322d] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              360
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-slate-900 leading-none">
                360tools
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                100% Free & Client-Side
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700">
            <a
              href="/news"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  navigateToPage('news');
                }
              }}
              className={`px-3 py-2 rounded-lg transition-colors hover:text-[#e5322d] ${
                currentPage === 'news' ? 'text-[#e5322d] bg-red-50/70' : ''
              }`}
            >
              News
            </a>
            <a
              href="/tools/merge-pdf"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  navigateToTool('merge-pdf');
                }
              }}
              className={`px-3 py-2 rounded-lg transition-colors hover:text-[#e5322d] ${
                currentToolId === 'merge-pdf' ? 'text-[#e5322d] bg-red-50/70' : ''
              }`}
            >
              Merge PDF
            </a>
            <a
              href="/category/math"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  navigateToCategory('math');
                }
              }}
              className={`px-3 py-2 rounded-lg transition-colors hover:text-[#e5322d] ${
                !currentToolId && currentCategory === 'math' ? 'text-[#e5322d] bg-red-50/70' : ''
              }`}
            >
              Math
            </a>
            <a
              href="/category/finance"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  navigateToCategory('finance');
                }
              }}
              className={`px-3 py-2 rounded-lg transition-colors hover:text-[#e5322d] ${
                !currentToolId && currentCategory === 'finance' ? 'text-[#e5322d] bg-red-50/70' : ''
              }`}
            >
              Finance
            </a>
            <a
              href="/"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  navigateToHome('all');
                }
              }}
              className={`px-3 py-2 rounded-lg transition-colors hover:text-[#e5322d] ${
                !currentToolId && currentCategory === 'all' && !currentPage ? 'text-[#e5322d] bg-red-50/70' : ''
              }`}
            >
              All Tools
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-red-50 hover:bg-red-100 text-[#e5322d] border border-red-200/90 rounded-xl text-xs font-bold transition-all shadow-2xs hover:scale-[1.02] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#e5322d] shrink-0" />
              <span className="hidden sm:inline">Install App</span>
              <span className="sm:hidden text-xs">Install</span>
            </button>

            <button
              onClick={() => {
                if (currentToolId || currentPage) navigateToHome();
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-slate-100/90 hover:bg-slate-200/80 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search tools...</span>
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-300 text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleInstallClick();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl bg-red-50 text-[#e5322d] text-sm font-bold flex items-center justify-between border border-red-200/80"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[#e5322d]" />
                <span>Add Desktop & Mobile Shortcut</span>
              </span>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </button>

            <a
              href="/news"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  navigateToPage('news');
                }
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              <span>Latest News</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>

            <a
              href="/"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  navigateToHome('all');
                }
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              <span>All Tools ({TOOLS.length})</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase text-slate-400 px-3">Categories</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigateToHome(cat.id)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-between text-slate-600"
                >
                  <span className="flex items-center gap-2">
                    <IconRenderer name={cat.iconName} className="w-4 h-4 text-slate-500" />
                    {cat.name}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-xs text-slate-600">
              <button onClick={() => navigateToPage('about')} className="text-left px-3 py-1.5 hover:text-[#e5322d]">
                About Us
              </button>
              <button onClick={() => navigateToPage('privacy')} className="text-left px-3 py-1.5 hover:text-[#e5322d]">
                Privacy Policy
              </button>
              <button onClick={() => navigateToPage('contact')} className="text-left px-3 py-1.5 hover:text-[#e5322d]">
                Contact
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {currentPage ? (
          <div className="space-y-6">
            <button
              onClick={() => navigateToHome('all')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              ← Back to All Tools
            </button>
            {currentPage === 'news' ? (
              <News />
            ) : (
              <StaticPages page={currentPage as any} />
            )}
          </div>
        ) : activeTool ? (
          <ToolView
            tool={activeTool}
            onBack={() => navigateToHome(activeTool.category)}
            onSelectTool={(id) => navigateToTool(id)}
            relatedTools={relatedTools}
          />
        ) : (
          <div className="space-y-10">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                Every tool you need in one place
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                100% free, private, and client-side web suite. Merge PDFs, compute loans, solve complex math, track health
                metrics, and edit media without uploading your files to any remote server.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto pt-2">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search all free tools (e.g. mortgage, scientific, fonts, age, bmi, pdf)..."
                    className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#e5322d] focus:ring-4 focus:ring-red-50 rounded-2xl text-sm font-semibold transition-all shadow-xs focus:outline-hidden"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2">
                  <span>Showing {filteredTools.length} of {TOOLS.length} tools</span>
                  <span>Tip: Press <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border">/</kbd> to search</span>
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => navigateToHome('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentCategory === 'all'
                    ? 'bg-[#e5322d] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Tools ({TOOLS.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = TOOLS.filter((t) => t.category === cat.id).length;
                const isActive = currentCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => navigateToHome(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#e5322d] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <IconRenderer name={cat.iconName} className="w-3.5 h-3.5" />
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Tools Grid */}
            {filteredTools.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No tools found matching "{searchQuery}"</h3>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentCategory('all');
                  }}
                  className="px-4 py-2 bg-[#e5322d] text-white text-xs font-bold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5">
                  {gridWithAds.map((item, idx) => {
                    if (item.type === 'tool') {
                      return <ToolCard key={`tool-${item.tool.id}`} tool={item.tool} onSelect={navigateToTool} />;
                    } else {
                      return (
                        <NativeAdCard
                          key={`ad-${item.adConfig.id}-${idx}`}
                          id={item.adConfig.id}
                          index={item.index}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-16 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-3">
              <div
                onClick={() => navigateToHome('all')}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <div className="w-8 h-8 rounded-lg bg-[#e5322d] flex items-center justify-center text-white font-black text-sm">
                  360
                </div>
                <span className="font-black text-base text-slate-900">
                  360tools
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-sm">
                The modern, privacy-first web utilities suite. Complete client-side computations, PDF workflows, financial calculators, and media conversions without remote server storage.
              </p>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Quick Links
              </h4>
              <ul className="space-y-2 text-slate-500">
                <li>
                  <a
                    href="/news"
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault();
                        navigateToPage('news');
                      }
                    }}
                    className="hover:text-[#e5322d]"
                  >
                    Latest News
                  </a>
                </li>
                <li>
                  <a
                    href="/tools/merge-pdf"
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault();
                        navigateToTool('merge-pdf');
                      }
                    }}
                    className="hover:text-[#e5322d]"
                  >
                    Merge PDF
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Company & Legal
              </h4>
              <ul className="space-y-2 text-slate-500">
                <li>
                  <a
                    href="/privacy"
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault();
                        navigateToPage('privacy');
                      }
                    }}
                    className="hover:text-[#e5322d]"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault();
                        navigateToPage('about');
                      }
                    }}
                    className="hover:text-[#e5322d]"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} 360tools.site. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <InstallShortcutModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onNativeInstall={triggerNativeInstall}
        isInstallable={isInstallable}
      />
    </div>
  );
}
