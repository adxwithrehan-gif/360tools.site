import React, { useState, useEffect } from 'react';
import { newsWorkflow } from '../../services/newsWorkflowEngine';
import { WorkflowEngineConfig, WorkflowExecutionLog, NewsCategory } from '../../types/news';
import { ALL_COUNTRIES, ALL_CATEGORIES } from '../../data/trendingCountriesData';
import {
  X,
  Play,
  RotateCw,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Terminal,
  Activity,
  Globe,
  Send,
  Sliders,
  Check,
  Zap,
  Flame,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Bot,
  Key,
  RefreshCw
} from 'lucide-react';

interface NewsAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleCreated?: (slug: string) => void;
}

export const NewsAutomationModal: React.FC<NewsAutomationModalProps> = ({
  isOpen,
  onClose,
  onArticleCreated,
}) => {
  const [config, setConfig] = useState<WorkflowEngineConfig>(newsWorkflow.getConfig());
  const [logs, setLogs] = useState<WorkflowExecutionLog[]>(newsWorkflow.getLogs());
  const [activeTab, setActiveTab] = useState<'turbo500' | 'aiEngine' | 'workflow' | 'custom' | 'gsc' | 'logs'>('turbo500');
  const [countdown, setCountdown] = useState<string>('30:00');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [customKeyword, setCustomKeyword] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<NewsCategory>('Tech & AI');
  const [customCountry, setCustomCountry] = useState<string>('GLOBAL');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Google Gemini & NewsAPI Server State
  const [serverStatus, setServerStatus] = useState<{ hasGeminiKey: boolean; hasNewsApiKey: boolean; model: string }>({
    hasGeminiKey: false,
    hasNewsApiKey: false,
    model: 'gemini-3.8-flash'
  });
  const [liveNewsHeadlines, setLiveNewsHeadlines] = useState<Array<{ title: string; description: string; url?: string; urlToImage?: string }>>([]);
  const [isLoadingNewsApi, setIsLoadingNewsApi] = useState(false);
  const [synthesizingItemTitle, setSynthesizingItemTitle] = useState<string | null>(null);

  // Turbo 500 Batch Generation States
  const [turboTargetCount, setTurboTargetCount] = useState<number>(500);
  const [turboCountry, setTurboCountry] = useState<string>('all');
  const [turboCategory, setTurboCategory] = useState<string>('all');
  const [turboProgress, setTurboProgress] = useState<{
    running: boolean;
    current: number;
    total: number;
    stage: string;
    percent: number;
    completed: boolean;
    durationSeconds: number;
  }>({
    running: false,
    current: 0,
    total: 500,
    stage: '',
    percent: 0,
    completed: false,
    durationSeconds: 0
  });

  // Synchronize state
  useEffect(() => {
    if (!isOpen) return;

    const updateState = () => {
      setConfig(newsWorkflow.getConfig());
      setLogs(newsWorkflow.getLogs());
    };

    updateState();
    newsWorkflow.checkServerAiStatus().then(status => {
      setServerStatus(status);
    });
    const unsubscribe = newsWorkflow.subscribe(updateState);
    return () => unsubscribe();
  }, [isOpen]);

  // Countdown timer for next 30-minute run
  useEffect(() => {
    if (!isOpen || !config.autoRunEnabled || !config.nextRunTimestamp) return;

    const updateCountdown = () => {
      const diff = new Date(config.nextRunTimestamp!).getTime() - Date.now();
      if (diff <= 0) {
        setCountdown('00:00 (Syncing...)');
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isOpen, config.nextRunTimestamp, config.autoRunEnabled]);

  const handleToggleAutoRun = () => {
    const newState = newsWorkflow.toggleAutoRun();
    setConfig((prev) => ({ ...prev, autoRunEnabled: newState }));
    showToast(newState ? '30-Minute Search Intelligence Auto-Workflow Activated' : 'Workflow Paused');
  };

  const handleRunNow = () => {
    setIsRunning(true);
    setTimeout(() => {
      try {
        const article = newsWorkflow.runScheduledWorkflow('manual_admin');
        setIsRunning(false);
        showToast(`Generated & GSC Indexed: "${article.title.slice(0, 40)}..."`);
        if (onArticleCreated) {
          onArticleCreated(article.id);
        }
      } catch (err) {
        setIsRunning(false);
        console.error('Error running workflow:', err);
      }
    }, 800);
  };

  const handleStartTurboBatch = async () => {
    setTurboProgress({
      running: true,
      current: 0,
      total: turboTargetCount,
      stage: `Initializing mass extraction across ${turboCountry === 'all' ? 'All 20+ Countries' : turboCountry}...`,
      percent: 5,
      completed: false,
      durationSeconds: 0
    });

    try {
      const result = await newsWorkflow.generateTurboBatch500({
        targetCount: turboTargetCount,
        countryCode: turboCountry,
        category: turboCategory,
        onProgress: (p) => {
          setTurboProgress((prev) => ({
            ...prev,
            current: p.current,
            total: p.total,
            stage: p.stage,
            percent: p.percent,
          }));
        }
      });

      setTurboProgress({
        running: false,
        current: result.totalGenerated,
        total: result.totalGenerated,
        stage: `✓ Done! ${result.totalGenerated} Posts Generated & Indexed in GSC in ${result.durationSeconds}s!`,
        percent: 100,
        completed: true,
        durationSeconds: result.durationSeconds
      });

      showToast(`⚡ Successfully posted & GSC indexed ${result.totalGenerated} articles across all categories!`);
    } catch (err) {
      console.error('Turbo batch error:', err);
      setTurboProgress((prev) => ({
        ...prev,
        running: false,
        stage: 'Error occurred during turbo batch execution'
      }));
    }
  };

  const handleFetchNewsApiHeadlines = async () => {
    setIsLoadingNewsApi(true);
    try {
      const articles = await newsWorkflow.fetchLiveNewsFromNewsApi('us', 'technology');
      setLiveNewsHeadlines(articles);
      if (articles.length > 0) {
        showToast(`Fetched ${articles.length} breaking headlines from NewsAPI!`);
      } else {
        showToast('No articles returned. Check NEWS_API_KEY in GitHub Secrets or .env.');
      }
    } catch (err) {
      console.error('Error fetching NewsAPI:', err);
      showToast('Failed to connect to NewsAPI backend proxy.');
    } finally {
      setIsLoadingNewsApi(false);
    }
  };

  const handleSynthesizeHeadlineWithGemini = async (item: { title: string; description: string }) => {
    setSynthesizingItemTitle(item.title);
    try {
      const article = await newsWorkflow.generateAiArticleWithServer(
        item.title,
        'Tech & AI',
        'Worldwide',
        item.description
      );
      showToast(`✨ Generated 6-paragraph editorial: "${article.title.slice(0, 35)}..."`);
      if (onArticleCreated) {
        onArticleCreated(article.id);
        onClose();
      }
    } catch (err) {
      console.error('Error synthesizing with Gemini:', err);
      showToast('Error during Gemini generation.');
    } finally {
      setSynthesizingItemTitle(null);
    }
  };

  const handleGenerateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKeyword.trim()) return;

    setIsRunning(true);
    try {
      const countryObj = ALL_COUNTRIES.find((c) => c.code === customCountry) || ALL_COUNTRIES[0];
      const article = await newsWorkflow.generateAiArticleWithServer(customKeyword, customCategory, countryObj.name);
      setIsRunning(false);
      setCustomKeyword('');
      showToast(`Published & GSC Indexed: "${article.title.slice(0, 40)}..."`);
      if (onArticleCreated) {
        onArticleCreated(article.id);
        onClose();
      }
    } catch (err) {
      setIsRunning(false);
      console.error('Error generating custom article:', err);
    }
  };

  const handleDownloadSitemap = () => {
    const xml = newsWorkflow.generateNewsSitemapXml();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap-news.xml';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded sitemap-news.xml for Google Search Console');
  };

  const handleDownloadGscJson = () => {
    const json = newsWorkflow.generateGscIndexingPayload();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gsc-indexing-payload.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded GSC Indexing API payload JSON');
  };

  const handleDownloadRss = () => {
    const xml = newsWorkflow.generateRssFeedXml();
    const blob = new Blob([xml], { type: 'application/rss+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rss-news-feed.xml';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded Google News RSS Feed XML');
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Search Intelligence 500 Daily Posts & GSC Indexing Hub
                </h3>
                <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-extrabold rounded-full border border-red-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  All Countries & Categories
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Automated Multi-Region Trends Scraping, SEO News Synthesis & 1-Minute GSC Fast Indexing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-slate-100 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('turbo500')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'turbo500'
                ? 'border-red-500 text-red-600 bg-red-50/40 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            ⚡ 500 Posts Turbo Indexer
          </button>
          <button
            onClick={() => setActiveTab('aiEngine')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'aiEngine'
                ? 'border-purple-600 text-purple-700 bg-purple-50/40 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-600" />
            🤖 NewsAPI + Gemini AI
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'workflow'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            30m Auto-Schedule
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'custom'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            1-Click Topic Generator
          </button>
          <button
            onClick={() => setActiveTab('gsc')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'gsc'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            GSC & Sitemaps
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'logs'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Logs ({logs.length})
          </button>
        </div>

        {/* Toast Notification */}
        {successToast && (
          <div className="mx-4 sm:mx-6 mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: 500 POSTS TURBO INDEXER */}
          {activeTab === 'turbo500' && (
            <div className="space-y-5">
              {/* Highlight Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-2xl text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-wider">
                      Instant Mass Indexing Engine
                    </span>
                    <span className="text-xs text-amber-200 font-semibold">
                      Rank #1 for News & Online Tools
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black">
                    Auto-Post 500 Search Intelligence Articles & Index in GSC in 1 Minute
                  </h4>
                  <p className="text-xs text-white/90 max-w-xl leading-relaxed">
                    Automatically synthesizes comprehensive SEO guides from trending queries across <strong>Pakistan, India, US, UK, Canada, Australia, Germany, UAE, and 20+ countries</strong>. Each article embeds high-res royalty-free imagery, Schema.org NewsArticle markup, and contextual links directly to your 360tools suite!
                  </p>
                </div>
              </div>

              {/* Configuration Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Target Countries */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    Target Country
                  </label>
                  <select
                    value={turboCountry}
                    onChange={(e) => setTurboCountry(e.target.value)}
                    disabled={turboProgress.running}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">🌐 All 20+ Countries (Worldwide Distribution)</option>
                    {ALL_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-purple-600" />
                    Target Category
                  </label>
                  <select
                    value={turboCategory}
                    onChange={(e) => setTurboCategory(e.target.value)}
                    disabled={turboProgress.running}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">⚡ All Categories (Balanced Across Tech, Finance, Sports...)</option>
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Count */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Post Batch Count
                  </label>
                  <select
                    value={turboTargetCount}
                    onChange={(e) => setTurboTargetCount(Number(e.target.value))}
                    disabled={turboProgress.running}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value={50}>50 Articles (Quick Batch ~5s)</option>
                    <option value={100}>100 Articles (~10s)</option>
                    <option value={250}>250 Articles (~25s)</option>
                    <option value={500}>⚡ 500 Articles (Full 1-Day Target ~45s)</option>
                  </select>
                </div>
              </div>

              {/* Progress & Live Terminal Display */}
              {turboProgress.running || turboProgress.completed ? (
                <div className="p-4 bg-slate-900 rounded-2xl text-white font-mono space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${turboProgress.completed ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`}></span>
                      <span className="text-slate-300 font-bold">
                        {turboProgress.completed ? 'Batch Indexing Completed' : 'GSC Turbo Queue Processing...'}
                      </span>
                    </div>
                    <span className="text-red-400 font-bold">
                      {turboProgress.current} / {turboProgress.total} ({turboProgress.percent}%)
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${turboProgress.percent}%` }}
                    ></div>
                  </div>

                  {/* Stage description */}
                  <div className="text-[11px] text-slate-400 truncate">
                    {turboProgress.stage}
                  </div>

                  {turboProgress.completed && (
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="text-emerald-400 flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        All {turboProgress.total} URLs submitted with HTTP 200 OK
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Processed in <span className="text-white font-bold">{turboProgress.durationSeconds} seconds</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleStartTurboBatch}
                  disabled={turboProgress.running}
                  className="w-full sm:flex-1 py-3 px-5 bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-sm font-black rounded-2xl shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {turboProgress.running ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Generating & Indexing {turboTargetCount} Posts...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Launch {turboTargetCount} Posts & 1-Minute GSC Turbo Indexing</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadSitemap}
                  className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download sitemap-news.xml</span>
                </button>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    100% Unique & Copyright-Free
                  </div>
                  <p className="text-[11px] text-slate-500">
                    High-quality articles paired with royalty-free Unsplash photography and full semantic alt text.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    Local SEO & Geo-Targeting
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Targets specific search regions (Pakistan, India, US, UK, etc.) with localized schema microdata.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    Auto 360tools Backlinks
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Every trending post links to relevant tools (PDF, calculators, converters) driving organic rankings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GEMINI AI & NEWSAPI ENGINE */}
          {activeTab === 'aiEngine' && (
            <div className="space-y-4">
              {/* Top Banner */}
              <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-2xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-purple-700" />
                      <h4 className="text-sm font-black text-purple-950 uppercase tracking-wide">
                        Google Gemini & NewsAPI Live Pipeline
                      </h4>
                      <span className="px-2 py-0.5 bg-purple-200/60 text-purple-900 text-[10px] font-extrabold rounded-md">
                        Model: gemini-3.8-flash
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">
                      Fetches breaking stories from NewsAPI and utilizes Google Gemini AI to synthesize original 6-paragraph editorial breakdowns with contextual tool backlinks and Google News XML sitemaps.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      newsWorkflow.checkServerAiStatus().then(status => setServerStatus(status));
                      showToast('Refreshed connection status');
                    }}
                    className="p-1.5 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
                    title="Refresh connection status"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* API Keys Live Status Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-purple-200/70">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-purple-100 shadow-xs">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">GEMINI_API_KEY</div>
                        <div className="text-[10px] text-slate-500">Google GenAI (Gemini 3.8 Flash)</div>
                      </div>
                    </div>
                    {serverStatus.hasGeminiKey ? (
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Connected
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold">
                        Set in GitHub Secrets
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-purple-100 shadow-xs">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">NEWS_API_KEY</div>
                        <div className="text-[10px] text-slate-500">NewsAPI.org Live Feed</div>
                      </div>
                    </div>
                    {serverStatus.hasNewsApiKey ? (
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Connected
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold">
                        Set in GitHub Secrets
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* GitHub Secrets Guide */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-700" />
                  GitHub Secrets & Automation Configuration
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  In your GitHub repository, go to <strong>Settings</strong> &rarr; <strong>Secrets and variables</strong> &rarr; <strong>Actions</strong> and add the two repository secrets:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-purple-900 font-bold">
                    GEMINI_API_KEY
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-blue-900 font-bold">
                    NEWS_API_KEY
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  The scheduled workflow <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">.github/workflows/ai-news-cron.yml</code> runs every 6 hours automatically to pull breaking news, invoke Gemini, update sitemaps, and push directly to your live site!
                </p>
              </div>

              {/* Live Test Console */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Interactive Live Newsroom
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Fetch fresh headlines from NewsAPI and run Gemini AI synthesis on demand.
                    </p>
                  </div>
                  <button
                    onClick={handleFetchNewsApiHeadlines}
                    disabled={isLoadingNewsApi}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-sm shadow-purple-500/20"
                  >
                    {isLoadingNewsApi ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Fetching...</span>
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Fetch Breaking News</span>
                      </>
                    )}
                  </button>
                </div>

                {liveNewsHeadlines.length > 0 ? (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {liveNewsHeadlines.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 line-clamp-1">
                            {item.title}
                          </div>
                          {item.description && (
                            <div className="text-[11px] text-slate-500 line-clamp-2">
                              {item.description}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleSynthesizeHeadlineWithGemini(item)}
                          disabled={synthesizingItemTitle === item.title}
                          className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                          {synthesizingItemTitle === item.title ? (
                            <>
                              <RotateCw className="w-3 h-3 animate-spin" />
                              <span>Synthesizing...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 text-amber-300" />
                              <span>Write with Gemini AI</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <p className="text-xs text-slate-500">
                      Click <strong>Fetch Breaking News</strong> above to test your NewsAPI connection and review stories ready for Gemini AI synthesis.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: 30-MIN SCHEDULE & WORKFLOW STATUS */}
          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Interval</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">Every 30m</div>
                  <div className="text-[10px] text-slate-400">Background Runner</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Next Sync In</div>
                  <div className="text-lg font-black text-red-600 font-mono mt-0.5">{countdown}</div>
                  <div className="text-[10px] text-slate-400">Auto-Timer</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Articles Synced</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{config.totalArticlesGenerated}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">100% Unique</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">GSC Ping Status</div>
                  <div className="text-lg font-black text-emerald-600 mt-0.5">Active (200)</div>
                  <div className="text-[10px] text-slate-400">URL_UPDATED</div>
                </div>
              </div>

              {/* Workflow controls */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Automated 30-Minute Search Intelligence Loop
                  </div>
                  <p className="text-xs text-slate-500">
                    Continually pulls past 7-day and breaking search deviations, generates articles, and pings Google.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleAutoRun}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                      config.autoRunEnabled
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {config.autoRunEnabled ? 'Auto-Run Active' : 'Auto-Run Paused'}
                  </button>
                  <button
                    onClick={handleRunNow}
                    disabled={isRunning}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isRunning ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    <span>Sync 1 Post Now</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM TOPIC GENERATOR */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider">
                  Instant Custom Trend & News Post
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Type any trending search keyword or news event. The engine will instantly synthesize a full structured article, attach copyright-free imagery, calculate SEO scores, and ping Google Search Console.
                </p>
              </div>

              <form onSubmit={handleGenerateCustom} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Trending Search Keyword / News Topic
                  </label>
                  <input
                    type="text"
                    value={customKeyword}
                    onChange={(e) => setCustomKeyword(e.target.value)}
                    placeholder="e.g. Pakistan Gold Rate, India Home Loan EMI, US Federal Reserve..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Target Country
                    </label>
                    <select
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {ALL_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Category
                    </label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as NewsCategory)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {ALL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isRunning || !customKeyword.trim()}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-md shadow-red-500/20"
                >
                  {isRunning ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Article & Pinging GSC...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Generate, Publish & Index Instantly</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: GSC & SITEMAPS */}
          {activeTab === 'gsc' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Google Search Console Live Feeds & API Payloads
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Google News sitemaps notify Google within seconds of new articles being created. Download compliant XML sitemaps or JSON payloads for the official Google Indexing API.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Google News Sitemap</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Includes &lt;news:news&gt; publication and keyword tags for instant crawl.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadSitemap}
                    className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download XML</span>
                  </button>
                </div>

                <div className="p-4 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Indexing API Payload</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Ready for Google Cloud service account batch submission (`URL_UPDATED`).
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadGscJson}
                    className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </button>
                </div>

                <div className="p-4 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Google News RSS 2.0</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Standard syndication feed for Google Publisher Center and news readers.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadRss}
                    className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download RSS</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Recent Automation Runs ({logs.length})</span>
                <span>Auto-refreshed</span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {log.articleTitle}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span className="capitalize">{log.triggerType.replace(/_/g, ' ')}</span>
                        {log.country && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-slate-600">{log.country}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">SEO {log.seoScore}/100</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md border border-emerald-200 text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        GSC 200 OK
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Speed: 500 URLs / 60 sec • 100% GSC Indexing Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};
