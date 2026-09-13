import os
import datetime
import requests

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
REPO_NAME = os.environ.get("GITHUB_REPOSITORY")

def fetch_google_trends():
    url = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=PK"
    try:
        response = requests.get(url)
        from xml.etree import ElementTree as ET
        root = ET.fromstring(response.content)
        items = root.findall('.//item')
        if items:
            return items[0].find('title').text
    except Exception as e:
        print(f"Error fetching trends: {e}")
    return "Global Technology Breakthrough"

def update_news_file(new_article):
    # GitHub API ke zariye src/components/pages/News.tsx ya news data file ko update karna
    api_url = f"https://api.github.com/repos/{REPO_NAME}/contents/src/components/pages/News.tsx"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "vnd.github+json"
    }
    
    # Pehle se mojood file ka content fetch karna taake SHA mil sakay
    res = requests.get(api_url, headers=headers)
    if res.status_code == 200:
        file_data = res.json()
        sha = file_data['sha']
        
        # Naya article array mein add karne ke liye updated code structure
        updated_content = f"""import React from 'react';

export const News: React.FC = () => {{
  const articles = [
    {{
      id: '{new_article['id']}',
      title: '{new_article['title']}',
      snippet: '{new_article['snippet']}',
      category: '{new_article['category']}',
      image: '{new_article['image']}',
      slug: '{new_article['slug']}'
    }},
    {{
      id: '1',
      title: 'Welcome to Global Trending News Hub',
      snippet: 'Stay updated with the latest technology, web development, and digital trends right from your dashboard.',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80',
      slug: 'welcome-to-news'
    }}
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Latest Trending News</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {{articles.map((item) => (
          <div key={{item.id}} className="bg-white rounded-2xl shadow-xs overflow-hidden border border-slate-200 flex flex-col justify-between">
            <div>
              <img src={{item.image}} alt={{item.title}} className="w-full h-48 object-cover" />
              <div className="p-5">
                <span className="text-xs text-[#e5322d] font-bold uppercase tracking-wider">{{item.category}}</span>
                <h2 className="text-lg font-bold mt-1 mb-2 text-slate-900">{{item.title}}</h2>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">{{item.snippet}}</p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button onClick={{() => alert("Full article view coming soon!")}} className="text-[#e5322d] hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer">
                Read Full Article &rarr;
              </button>
            </div>
          </div>
        ))}}
      </div>
    </div>
  );
};

export default News;
"""
        import base64
        encoded_content = base64.b64encode(updated_content.encode('utf-8')).decode('utf-8')
        
        # GitHub par file update/commit karna
        commit_data = {
            "message": f"Auto-publish new trending article: {new_article['title']}",
            "content": encoded_content,
            "sha": sha
        }
        put_res = requests.put(api_url, headers=headers, json=commit_data)
        if put_res.status_code in [200, 201]:
            print("Successfully published new article to website!")
        else:
            print(f"Failed to commit: {put_res.text}")

if __name__ == "__main__":
    trend = fetch_google_trends()
    article = {
        "id": f"news-{int(datetime.datetime.now().timestamp())}",
        "title": f"Breaking: {trend} Updates",
        "slug": trend.lower().replace(" ", "-")[:50],
        "snippet": f"Real-time coverage and latest global analysis about {trend}.",
        "category": "Trending",
        "image": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80"
    }
    update_news_file(article)
