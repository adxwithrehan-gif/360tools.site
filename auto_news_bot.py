import os
import datetime
import requests
import base64
import re

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

def update_news_tsx(new_article):
    api_url = f"https://api.github.com/repos/{REPO_NAME}/contents/src/components/pages/News.tsx"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "vnd.github+json"
    }
    
    res = requests.get(api_url, headers=headers)
    if res.status_code != 200:
        print(f"Failed to fetch News.tsx: {res.text}")
        return
        
    file_data = res.json()
    sha = file_data['sha']
    decoded_content = base64.b64decode(file_data['content']).decode('utf-8')
    
    # Naya article object string format mein
    new_item_str = f"""    {{
      id: '{new_article['id']}',
      title: '{new_article['title']}',
      snippet: '{new_article['snippet']}',
      category: '{new_article['category']}',
      image: '{new_article['image']}',
      slug: '{new_article['slug']}',
      date: '{new_article['date']}'
    }},"""

    # PYTHON_START aur PYTHON_END ke darmiyan naya article inject karna
    pattern = r'(// PYTHON_START.*?const articles = \[)(.*?)(\];\s*// PYTHON_END)'
    match = re.search(pattern, decoded_content, re.DOTALL)
    
    if match:
        prefix = match.group(1)
        existing_articles = match.group(2)
        suffix = match.group(3)
        
        updated_articles_array = prefix + "\n" + new_item_str + existing_articles + suffix
        updated_content = re.sub(pattern, updated_articles_array, decoded_content, flags=re.DOTALL)
        
        encoded_content = base64.b64encode(updated_content.encode('utf-8')).decode('utf-8')
        
        commit_data = {
            "message": f"Auto-publish trending article: {new_article['title']}",
            "content": encoded_content,
            "sha": sha
        }
        
        put_res = requests.put(api_url, headers=headers, json=commit_data)
        if put_res.status_code in [200, 201]:
            print("Successfully published new article directly to News.tsx!")
        else:
            print(f"Failed to update News.tsx: {put_res.text}")
    else:
        print("PYTHON_START markers not found in News.tsx")

if __name__ == "__main__":
    trend = fetch_google_trends()
    article = {
        "id": f"news-{int(datetime.datetime.now().timestamp())}",
        "title": f"Breaking: {trend} Live Updates",
        "slug": trend.lower().replace(" ", "-")[:50],
        "snippet": f"Get real-time global insights, multi-country updates, and complete breakdown of {trend}.",
        "category": "Trending",
        "image": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80",
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    }
    update_news_tsx(article)
