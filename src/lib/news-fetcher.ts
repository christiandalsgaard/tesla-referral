import Parser from "rss-parser";

// RSS feeds for Tesla and EV news — these are free, public feeds
// covering Tesla announcements, EV industry trends, and energy news.
const FEEDS = [
  "https://electrek.co/feed/",                    // Top EV news site
  "https://www.teslarati.com/feed/",              // Tesla-focused news
  "https://insideevs.com/rss/news/all/",          // Broad EV coverage
  "https://cleantechnica.com/feed/",              // Clean energy + EVs
];

// Templates that turn a headline into a tweet-sized post.
// {headline} is replaced with the actual news headline.
// Each template has a different vibe to keep the feed varied.
const TEMPLATES = [
  "🚗⚡ {headline}",
  "📰 {headline}",
  "⚡ Breaking EV news: {headline}",
  "🔋 {headline}",
  "🚀 {headline}",
  "💡 {headline}",
  "🌍 {headline}",
  "⚡ {headline}",
];

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  imageUrl: string | null;
}

// Extract the first image URL from RSS item HTML content.
// Most EV news feeds embed a featured image in <img src="..."> within
// the content:encoded or content field. Falls back to null if none found.
function extractImageUrl(item: Record<string, unknown>): string | null {
  const content = (item["content:encoded"] as string) || (item.content as string) || "";
  // Match the first <img src="..."> in the HTML
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1].replace(/&amp;/g, "&") : null;
}

// Fetch recent headlines from all RSS feeds, sorted newest first.
// Returns up to `limit` items. Silently skips feeds that fail
// (network errors, temporary outages) so one broken feed doesn't
// kill the whole job.
export async function fetchTeslaNews(limit = 20): Promise<NewsItem[]> {
  const parser = new Parser();
  const allItems: NewsItem[] = [];

  // Fetch all feeds in parallel — fast and independent
  const results = await Promise.allSettled(
    FEEDS.map(async (feedUrl) => {
      const feed = await parser.parseURL(feedUrl);
      const sourceName = feed.title || feedUrl;

      return (feed.items || []).map((item) => ({
        title: (item.title || "").trim(),
        link: item.link || "",
        source: sourceName,
        pubDate: item.pubDate || "",
        imageUrl: extractImageUrl(item as Record<string, unknown>),
      }));
    })
  );

  // Collect only successful results — skip any feeds that errored
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  // Sort by publication date (newest first) and return top N
  return allItems
    .filter((item) => item.title.length > 0)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit);
}

// Pick a random template and fill in the headline + referral link.
// Truncates the headline if the total tweet would exceed 280 chars.
export function formatTweet(headline: string): string {
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];

  // Calculate max headline length to stay under 280 chars
  const overhead = template.replace("{headline}", "").length;
  const maxHeadline = 280 - overhead;

  // Truncate headline if needed, adding ellipsis
  const trimmedHeadline =
    headline.length > maxHeadline
      ? headline.slice(0, maxHeadline - 1) + "…"
      : headline;

  return template.replace("{headline}", trimmedHeadline);
}
