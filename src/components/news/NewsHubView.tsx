import React, { useState, useEffect, useMemo } from 'react';
import { newsWorkflow } from '../../services/newsWorkflowEngine';
import { NewsArticle, NewsCategory, NewsTimeframe } from '../../types/news';
import { ALL_COUNTRIES, ALL_CATEGORIES } from '../../data/trendingCountriesData';
import {
  TrendingUp,
  Search,
  Clock,
  Globe,
  ArrowRight,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

interface NewsHubViewProps {
  onSelectArticle: (id: string) => void;
  onBackToHome: () => void;
}

const ITEMS_PER_PAGE = 18;

export const NewsHubView: React.FC<NewsHubViewProps> = ({
  onSelectArticle,
}) => {
  const [articles, setArticles] = useState<NewsArticle[]>(newsWorkflow.getArticles());
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<NewsTimeframe | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isInstantPublishing, setIsInstantPublishing] = useState(false);

  // Handle publishing any real-time search topic immediately
  const handleInstantPublish = async (query: string) => {
    if (!query.trim() || isInstantPublishing) return;
    setIsInstantPublishing(true);
    try {
      const countryObj = ALL_COUNTRIES.find((c) => c.code === selectedCountry);
      const countryName = countryObj ? countryObj.name : 'Worldwide';
      const category = selectedCategory === 'all' ? 'Tech & AI' : selectedCategory;
      const article = await newsWorkflow.generateAiArticleWithServer(query.trim(), category, countryName);
      setArticles(newsWorkflow.getArticles());
      setIsInstantPublishing(false);
      setSearchQuery('');
      onSelectArticle(article.id);
    } catch (err) {
      console.error(err);
      setIsInstantPublishing(false);
    }
  };

  // Synchronize state with news workflow
  useEffect(() => {
    const updateState = () => {
      setArticles(newsWorkflow.getArticles());
    };

    updateState();
    const unsubscribe = newsWorkflow.subscribe(updateState);
    return () => unsubscribe();
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedCountry, selectedTimeframe, searchQuery]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesTimeframe = selectedTimeframe === 'all' || article.timeframe === selectedTimeframe;
      
      let matchesCountry = true;
      if (selectedCountry !== 'all') {
        const cObj = ALL_COUNTRIES.find((c) => c.code === selectedCountry);
        const countryName = cObj ? cObj.name.toLowerCase() : selectedCountry.toLowerCase();
        matchesCountry =
          article.trendRegion.toLowerCase().includes(countryName) ||
          article.tags.some((t) => t.toLowerCase().includes(countryName));
      }

      const matchesQuery =
        !searchQuery.trim() ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.trendKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesCountry && matchesTimeframe && matchesQuery;
    });
  }, [articles, selectedCategory, selectedCountry, selectedTimeframe, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const featuredArticle = currentPage === 1 && filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridArticles = featuredArticle && currentPage === 1 ? paginatedArticles.slice(1) : paginatedArticles;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Hero Banner — Clean, Editorial & Professional */}
      <div className="bg-gradient-to-br from-slate-900 via-neutral-900 to-slate-800 rounded-3xl text-white p-6 sm:p-10 shadow-sm relative overflow-hidden border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
              Live Search Intelligence
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>115+ Daily Stories • Worldwide & Regional</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
            Technology, Finance & Global Search Inquiries
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time editorial analysis covering trending search inquiries across Pakistan, India, United States, United Kingdom, Canada, Australia, UAE, and 20+ countries. Every queried topic is backed by full 6-paragraph in-depth analysis.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
        {/* Row 1: Timeframes + Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setSelectedTimeframe('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTimeframe === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Stories ({filteredArticles.length})
            </button>
            <button
              onClick={() => setSelectedTimeframe('past_7_days')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTimeframe === 'past_7_days'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setSelectedTimeframe('latest')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTimeframe === 'latest'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Breaking
            </button>
          </div>

          {/* Search Input with Instant Real-Time Publishing */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  if (filteredArticles.length === 0) {
                    handleInstantPublish(searchQuery);
                  }
                }
              }}
              placeholder="Search or publish any topic (e.g. gold rate, AI tools)..."
              className="w-full pl-10 pr-24 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-red-500 focus:ring-4 focus:ring-red-50 rounded-2xl text-xs font-medium outline-hidden transition-all"
            />
            <div className="absolute right-2 top-1.5 flex items-center gap-1">
              {searchQuery.trim().length > 1 && (
                <button
                  type="button"
                  onClick={() => handleInstantPublish(searchQuery)}
                  disabled={isInstantPublishing}
                  title="Even 1 search query triggers an instant full 6-paragraph news article!"
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-black flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                >
                  <Zap className="w-3 h-3" />
                  <span>{isInstantPublishing ? 'Publishing...' : 'Publish'}</span>
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Countries */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Filter by Country / Region:
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCountry('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCountry === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              Worldwide
            </button>
            {ALL_COUNTRIES.slice(0, 12).map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCountry === c.code
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Categories */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Filter by Category:
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              All Categories
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* No Results State with Real-Time Instant Publishing */}
      {filteredArticles.length === 0 && (
        <div className="max-w-xl mx-auto">
          {searchQuery.trim() ? (
            <div className="bg-gradient-to-br from-slate-900 to-neutral-900 rounded-3xl border border-slate-800 p-8 sm:p-10 text-center space-y-4 text-white shadow-xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                  Real-Time Search Inquiries
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white pt-1">
                  Topic "{searchQuery}" Search Detected
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                  Even if only 1 user searches for this topic, our real-time engine synthesizes an authoritative, 6-paragraph in-depth article immediately with verified insights, local privacy tools, and GSC sitemap indexing.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => handleInstantPublish(searchQuery)}
                  disabled={isInstantPublishing}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isInstantPublishing ? 'Publishing In-Depth Article...' : `Publish & Read "${searchQuery}" News Now`}</span>
                </button>
                <button
                  onClick={() => setSearchQuery('')}
                  className="w-full sm:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold rounded-xl transition-all"
                >
                  Clear Search
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No stories found</h3>
              <p className="text-xs text-slate-500">
                Try resetting your filters or selecting a different country or category.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedCountry('all');
                    setSelectedTimeframe('all');
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Featured Magazine Hero Article (Only on page 1) */}
      {featuredArticle && (
        <a
          href={`/news/${featuredArticle.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-red-300 hover:shadow-lg transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12 block no-underline text-inherit"
        >
          <div className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[280px] bg-slate-100 overflow-hidden">
            <img
              src={featuredArticle.imageUrl}
              alt={featuredArticle.imageAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-red-600 text-white font-black text-xs rounded-full shadow-md uppercase tracking-wider">
                Trending Story
              </span>
              <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-amber-300 font-bold text-xs rounded-full flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{featuredArticle.trendSurgeScore}% Surge</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
                <span>{featuredArticle.category}</span>
                <span>•</span>
                <span className="text-slate-800">{featuredArticle.trendRegion}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
                {featuredArticle.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {featuredArticle.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{featuredArticle.readTimeMinutes} min read</span>
              </div>

              <span className="text-red-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </a>
      )}

      {/* Grid of News Article Cards */}
      {gridArticles.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Latest Trending Stories ({filteredArticles.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {gridArticles.map((article) => (
              <a
                key={article.id}
                href={`/news/${article.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:border-red-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between block no-underline text-inherit"
              >
                <div className="space-y-3.5">
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 bg-slate-900/80 backdrop-blur-md text-white font-bold text-[10px] rounded-md uppercase">
                        {article.category}
                      </span>
                      <span className="px-2 py-0.5 bg-white/90 backdrop-blur-md text-slate-800 font-bold text-[10px] rounded-md">
                        {article.trendRegion}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-0.5 bg-amber-500 text-white font-bold text-[10px] rounded-md flex items-center gap-1 shadow-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>+{article.trendSurgeScore}%</span>
                      </span>
                    </div>
                  </div>

                  <div className="px-5 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      <span>•</span>
                      <span>{article.readTimeMinutes}m read</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                  <span className="text-slate-400 text-[11px]">
                    {article.author.name}
                  </span>

                  <span className="text-red-600 font-bold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs font-bold text-slate-600 px-3 py-2 bg-slate-100 rounded-xl">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
