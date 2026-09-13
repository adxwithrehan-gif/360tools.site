import os
import datetime
import requests
import base64
import json

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

def update_news_json(new_article):
    # Repository se news.json file fetch karna
    api_url = f"https://api.github.com/repos/{REPO_NAME}/contents/src/data/news.json"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "vnd.github+json"
    }
    
    res = requests.get(api_url, headers=headers)
    articles = []
    sha = None
    
    if res.status_code == 200:
        file_data = res.json()
        sha = file_data['sha']
        decoded_content = base64.b64decode(file_data['content']).decode('utf-8')
        articles = json.loads(decoded_content)
    
    # Naya article list ke shuru mein add karna
    articles.insert(0, new_article)
    
    # Updated list ko wapas JSON format mein encode karna
    updated_content = json.dumps(articles, indent=2)
    encoded_content = base64.b64encode(updated_content.encode('utf-8')).decode('utf-8')
    
    commit_data = {
        "message": f"Auto-publish trending article: {new_article['title']}",
        "content": encoded_content,
    }
    if sha:
        commit_data["sha"] = sha
        
    put_res = requests.put(api_url, headers=headers, json=commit_data)
    if put_res.status_code in [200, 201]:
        print("Successfully published new article via JSON!")
    else:
        print(f"Failed to commit JSON: {put_res.text}")

if __name__ == "__main__":
    trend = fetch_google_trends()
    article = {
        "id": f"news-{int(datetime.datetime.now().timestamp())}",
        "title": f"Breaking: {trend} Updates",
        "slug": trend.lower().replace(" ", "-")[:50],
        "snippet": f"Real-time coverage and latest global analysis about {trend}.",
        "category": "Trending",
        "image": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80",
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    }
    update_news_json(article)
