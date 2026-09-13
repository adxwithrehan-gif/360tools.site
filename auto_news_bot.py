import os
import json
import datetime
import requests

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

def generate_unique_article(trend_title):
    article = {
        "id": f"news-{int(datetime.datetime.now().timestamp())}",
        "title": f"Breaking: {trend_title} Live Updates & Analysis",
        "slug": trend_title.lower().replace(" ", "-")[:50],
        "snippet": f"Get real-time insights, multi-country updates, and complete breakdown of {trend_title}.",
        "category": "Trending",
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "image": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
        "content": f"<p>Complete live coverage and breaking news regarding <strong>{trend_title}</strong>. Stay ahead with real-time tracking across global networks...</p>"
    }
    return article

if __name__ == "__main__":
    print("Running automated news generation workflow...")
    trend = fetch_google_trends()
    new_article = generate_unique_article(trend)
    print(f"Generated Article: {new_article['title']}")
