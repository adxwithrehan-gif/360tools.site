export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  snippet: string;
  category: string;
  date: string;
  image: string;
}

export const newsData: NewsItem[] = [
  {
    id: "news-initial-1",
    name: "",
    title: "Welcome to Global Trending News Hub",
    slug: "welcome-to-global-trending-news-hub",
    content: "Our automated platform brings you the latest breaking updates and trending topics from across the globe. Stay tuned as our system refreshes and publishes real-time news articles every 30 minutes to keep you ahead of the curve.",
    snippet: "Discover real-time global trends, breaking updates, and automated news coverage directly on our platform.",
    category: "Global News",
    date: "2026-09-13 12:00",
    image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60"
  }
];
