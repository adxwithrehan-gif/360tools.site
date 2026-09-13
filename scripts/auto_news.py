import os
import json
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

def fetch_google_trends():
    url = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            trends = []
            for item in root.findall('.//item'):
                title = item.find('title')
                if title is not None and title.text:
                    trends.append(title.text.strip())
            return trends[:5]
    except Exception as e:
        print(f"Error fetching trends: {e}")
        return []

def update_news_file(trend_title):
    file_path = "src/data/newsData.ts"
    if not os.path.exists(file_path):
        return

    slug = trend_title.lower().replace(" ", "-").replace("?", "").replace("!", "")
    slug = "".join([c for c in slug if c.isalnum() or c == '-'])
    
    new_id = f"news-{int(datetime.now().timestamp())}"
    current_date = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    new_article_code = f"""  {{
    id: "{new_id}",
    title: "Latest Update: {trend_title}",
    slug: "{slug}",
    content: "In recent global developments, {trend_title} has captured significant attention across social media and search platforms. Analysts and digital communities are actively tracking the implications as fresh updates emerge.",
    snippet: "Explore the latest updates and global discussions surrounding {trend_title}.",
    category: "Global News",
    date: "{current_date}",
    image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60"
  }},"""

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Insert new article right after `export const newsData: NewsItem[] = [`
    target = "export const newsData: NewsItem[] = ["
    if target in content:
        updated_content = content.replace(target, f"{target}\n{new_article_code}")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(updated_content)
        print(f"Successfully added: {trend_title}")

if __name__ == "__main__":
    trends = fetch_google_trends()
    if trends:
        # Add the top trending topic automatically
        update_news_file(trends[0])
