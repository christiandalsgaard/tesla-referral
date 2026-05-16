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
  "🚗⚡ {headline}\n\nReady to go electric? Use my referral link 👇\n{referralLink}",
  "📰 {headline}\n\nThe future is electric. Get yours:\n{referralLink}",
  "⚡ Breaking EV news: {headline}\n\nOrder a Tesla today 👇\n{referralLink}",
  "🔋 {headline}\n\nJoin the EV revolution:\n{referralLink}",
  "🚀 {headline}\n\nThere's never been a better time to go electric:\n{referralLink}",
  "💡 {headline}\n\nDrive the future. Use my link:\n{referralLink}",
  "🌍 {headline}\n\nGo green, save money:\n{referralLink}",
  "⚡ {headline}\n\nWant a Tesla? Start here:\n{referralLink}",
];

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
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
export function formatTweet(headline: string, referralLink: string): string {
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];

  // Calculate max headline length to stay under 280 chars
  // (X counts t.co links as 23 chars each)
  const templateWithoutPlaceholders = template
    .replace("{headline}", "")
    .replace("{referralLink}", "");
  // Referral link counts as 23 chars (t.co shortener)
  const overhead = templateWithoutPlaceholders.length + 23;
  const maxHeadline = 280 - overhead;

  // Truncate headline if needed, adding ellipsis
  const trimmedHeadline =
    headline.length > maxHeadline
      ? headline.slice(0, maxHeadline - 1) + "…"
      : headline;

  return template
    .replace("{headline}", trimmedHeadline)
    .replace("{referralLink}", referralLink);
}
