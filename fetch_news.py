import os
import json
import feedparser
import google.generativeai as genai
from datetime import datetime
import re

# Gemini API Configure karein
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

# Google Trends RSS URL (Global / US feed)
TRENDS_URL = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US"

def clean_filename(text):
    text = re.sub(r'[^\w\s-]', '', text).lower()
    return re.sub(r'[-\s]+', '-', text).strip('-')

def run_bot():
    print("Fetching Google Trends...")
    feed = feedparser.parse(TRENDS_URL)
    
    if not feed.entries:
        print("No trends found.")
        return

    os.makedirs("news", exist_ok=True)
    manifest_path = "news/manifest.json"
    
    # Purani manifest list load karein agar mojood hai
    articles = []
    if os.path.exists(manifest_path):
        with open(manifest_path, "r", encoding="utf-8") as f:
            try:
                articles = json.load(f)
            except:
                articles = []

    existing_slugs = [art['slug'] for art in articles]

    # Top trends mein se pehla naya trend uthayein jo pehle se na bana ho
    target_entry = None
    for entry in feed.entries[:5]:
        slug = clean_filename(entry.title)
        if slug not in existing_slugs:
            target_entry = entry
            break

    if not target_entry:
        print("All top trends are already posted.")
        return

    trend_title = target_entry.title
    file_slug = clean_filename(trend_title)
    file_path = f"news/{file_slug}.html"
    current_date = datetime.now().strftime('%Y-%m-%d %H:%M')

    print(f"Generating article for: {trend_title}")

    # Gemini API se unique SEO article generate karwayein
    prompt = f"""
    Write a detailed, unique, and SEO-optimized news article in English about the trending topic: '{trend_title}'.
    Provide:
    1. A short compelling meta description (max 150 characters).
    2. Well-structured HTML content (use <h2>, <p>, <ul> tags) with in-depth coverage.
    Format your response cleanly.
    """
    
    response = model.generate_content(prompt)
    ai_response_text = response.text

    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{trend_title} - 360 Tools News</title>
    <meta name="description" content="Latest live updates and comprehensive overview of {trend_title}.">
    <link rel="stylesheet" href="../../style.css">
</head>
<body class="bg-[#f8f9fa] text-slate-800 font-sans">
    <header class="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center">
        <a href="/" class="font-black text-lg text-slate-900">360tools</a>
        <a href="/news" class="text-sm font-bold text-[#e5322d]">← Back to News</a>
    </header>
    <main class="max-w-3xl mx-auto px-4 py-10 bg-white my-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <span class="px-3 py-1 bg-red-50 text-[#e5322d] text-xs font-bold uppercase rounded-md">Trending News</span>
        <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{trend_title}</h1>
        <p class="text-xs text-slate-400 font-medium">Published on: {current_date}</p>
        <hr class="border-slate-100">
        <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
            {ai_response_text}
        </div>
    </main>
</body>
</html>"""

    # HTML file save karein
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_template)

    # Manifest mein naya article add karein
    new_article_meta = {
        "title": trend_title,
        "slug": file_slug,
        "date": current_date,
        "description": f"Live coverage and automated updates regarding {trend_title}.",
        "category": "Trending"
    }
    
    articles.insert(0, new_article_meta) # Sab se upar rakhne ke liye
    
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2)

    print(f"Successfully created and added to manifest: {file_slug}")

if __name__ == "__main__":
    run_bot()
