import React from 'react';

export const News: React.FC = () => {
  // PYTHON_START
  const articles = [
    {
      id: 'news-1789318351',
      title: 'Breaking: Global Technology Breakthrough Live Updates',
      snippet: 'Get real-time global insights, multi-country updates, and complete breakdown of Global Technology Breakthrough.',
      category: 'Trending',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80',
      slug: 'global-technology-breakthrough',
      date: '2026-09-13 16:52'
    },
    {
      id: '1',
      title: 'Welcome to Global Trending News Hub',
      snippet: 'Stay updated with the latest technology, web development, and digital trends right from your dashboard.',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80',
      slug: 'welcome-to-news',
      date: '2026-09-13 12:00'
    }
  ];
  // PYTHON_END

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Latest Trending News</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((item: any) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-xs overflow-hidden border border-slate-200 flex flex-col justify-between">
            <div>
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-5">
                <span className="text-xs text-[#e5322d] font-bold uppercase tracking-wider">{item.category}</span>
                <h2 className="text-lg font-bold mt-1 mb-2 text-slate-900">{item.title}</h2>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">{item.snippet}</p>
                <span className="text-[10px] text-slate-400 block mb-2">{item.date}</span>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button 
                onClick={() => alert("Full article view coming soon!")}
                className="text-[#e5322d] hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
              >
                Read Full Article &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
