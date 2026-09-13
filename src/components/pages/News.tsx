import React from 'react';
import { newsData } from '../../data/newsData';
import { AdUnit } from '../AdUnit';

export const News: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Latest Trending News</h1>
      
      {/* Top Banner Ad */}
      <div className="my-4">
        <AdUnit />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {newsData && newsData.length > 0 ? (
          newsData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col justify-between">
              <div>
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <span className="text-xs text-blue-600 font-semibold uppercase">{item.category}</span>
                  <h2 className="text-lg font-bold mt-1 mb-2 text-gray-900 line-clamp-2">{item.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.snippet}</p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <a 
                  href={`/news/${item.slug}`} 
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      window.history.pushState({}, '', `/news/${item.slug}`);
                    }
                  }}
                  className="text-blue-500 hover:underline font-medium text-sm"
                >
                  Read Full Article &rarr;
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-3 text-center py-10">Fetching latest global trends...</p>
        )}
      </div>

      {/* Bottom Banner Ad */}
      <div className="my-8">
        <AdUnit />
      </div>
    </div>
  );
};

export default News;
