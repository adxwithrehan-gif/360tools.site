import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Globe } from 'lucide-react';

interface NewsArticle {
  title: string;
  slug: string;
  date: string;
  description: string;
  category: string;
}

export function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Yahan hum site ke news folder ya index se dynamic articles fetch kar sakte hain
    // Ya agar aap JSON list rakhte hain toh woh load hogi. Filhal yeh real fetch logic hai.
    fetch('/news/manifest.json')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => {
        // Agar koi post abhi tak nahi bani toh khali list show hogi (koi dummy post nahi)
        setArticles([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-6">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Global Trending News Hub
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Real-time AI-generated breaking news across all countries and categories, updated every 30 minutes.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-medium">Loading live news...</div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-2xs">
          <Globe className="w-10 h-10 text-slate-400 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-slate-800">No News Posts Yet</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Your automated GitHub bot is setting up. The first real-time trending news post will appear here shortly!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-1 bg-red-50 text-[#e5322d] text-[11px] font-bold uppercase tracking-wider rounded-md">
                  {art.category || 'Trending'}
                </span>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                  {art.title}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {art.description}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {art.date}
                </span>
                <a
                  href={`/news/${art.slug}.html`}
                  className="inline-flex items-center gap-1 font-bold text-[#e5322d] hover:underline"
                >
                  Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
