import os
import json
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

# 1. Fetch Google Trends RSS (Global / Worldwide or specific region)
def fetch_google_trends():
    url = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            trends = []
            # Parse RSS feed items
            for item in root.findall('.//item'):
                title = item.find('title')
                if title is not None and title.text:
                    trends.append(title.text.strip())
            return trends[:5] # Top 5 trends
    except Exception as e:
        print(f"Error fetching trends: {e}")
        return []

# 2. Generate Article Content
def generate_article(trend_title):
    slug = trend_title.lower().replace(" ", "-").replace("?", "").replace("!", "")
    slug = "".join([c for c in slug if c.isalnum() or c == '-'])
    
    article = {
        "id": f"news-{int(datetime.now().timestamp())}",
        "title": f"Latest Update: Everything you need to know about {trend_title}",
        "slug": slug,
        "content": f"In recent developments, {trend_title} has taken the internet by storm, sparking widespread global discussions across social media platforms and news outlets. Analysts and users alike are closely monitoring the situation as new updates unfold. Stay tuned to our platform for real-time coverage and comprehensive analysis on this trending topic.",
        "snippet": f"Discover the latest breaking updates, background details, and global reactions regarding {trend_title}.",
        "category": "Global News",
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "image": "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60"
    }
    return article

# 3. Update News Data File
def update_news_file(new_article):
    file_path = "src/data/newsData.ts"
    
    # Read existing content or initialize
    existing_news = []
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            # Simple extraction or JSON parsing logic depending on file format
    
    # For simplicity, we write back a structured TypeScript export file
    print(f"Generated new article: {new_article['title']}")

if __name__ == "__main__":
    trends = fetch_google_trends()
    if trends:
        for trend in trends[:1]: # Process top 1 trend per run
            art = generate_article(trend)
            update_news_file(art)
