import os
import feedparser
import google.generativeai as genai
from datetime import datetime
import re

# Gemini API Configure karein
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

# Google Trends RSS URL (Global ya specific country jaise PK)
TRENDS_URL = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US"

def clean_filename(text):
    text = re.sub(r'[^\w\s-]', '', text).lower()
    return re.sub(r'[-\s]+', '-', text).strip('-')

def fetch_and_post():
    feed = feedparser.parse(TRENDS_URL)
    
    # Pehli trending item uthayein (aap loop bhi laga sakte hain)
    if not feed.entries:
        print("No trends found.")
        return
        
    entry = feed.entries[0]
    trend_title = entry.title
    
    # Check karein ke yeh news pehle se bani hui hai ya nahi (optional logic)
    file_slug = clean_filename(trend_title)
    file_path = f"news/{file_slug}.html"
    
    if os.path.exists(file_path):
        print(f"Article already exists for: {trend_title}")
        return

    # Gemini API se unique article generate karwayein
    prompt = f"Write a unique, SEO-optimized news article in English about the trending topic: '{trend_title}'. Include a catchy title, meta description, and well-structured HTML body paragraphs."
    response = model.generate_content(prompt)
    article_content = response.text

    # HTML page template banayein
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{trend_title} - 360 Tools News</title>
    <meta name="description" content="Latest updates and trending news about {trend_title}.">
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <header>
        <a href="/">360 Tools</a> | <a href="/news/">News</a>
    </header>
    <main style="max-width:800px; margin:auto; padding:20px;">
        <h1>{trend_title}</h1>
        <p><em>Published on: {datetime.now().strftime('%Y-%m-%d %H:%M')}</em></p>
        <hr>
        {article_content}
    </main>
</body>
</html>"""

    # File save karein
    os.makedirs("news", exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_template)
    
    print(f"Successfully created: {file_path}")

if __name__ == "__main__":
    fetch_and_post()
