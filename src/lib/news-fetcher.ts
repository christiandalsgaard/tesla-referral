import Parser from "rss-parser";

// RSS feeds focused on Tesla specifically — broader EV feeds removed
// to keep posts on-brand. Teslarati is Tesla-only; Electrek covers
// Tesla heavily alongside other EV news (filtered by keyword below).
const FEEDS = [
  "https://www.teslarati.com/feed/",              // Tesla-only news
  "https://electrek.co/feed/",                    // Heavy Tesla coverage
];

// Templates that turn a headline into a tweet-sized post.
// {headline} is replaced with the actual news headline.
// Each template has a different vibe to keep the feed varied.
// Tesla-related keywords — headlines must match at least one to be posted.
// Keeps the feed strictly about Tesla, not general EV news.
const TESLA_KEYWORDS = [
  "tesla", "tsla", "model y", "model 3", "model s", "model x",
  "cybertruck", "roadster", "semi", "megapack", "powerwall",
  "supercharger", "autopilot", "fsd", "full self-driving",
  "gigafactory", "giga", "elon musk", "dojo", "optimus",
  "tesla bot", "tesla energy", "solar roof", "cybercab",
];

// Commentary lines that explain why the news matters for Tesla's bigger picture.
// {headline} is replaced with the article title so the commentary can reference it.
// Each one ties the news to Tesla's strategy, mission, or shareholder value.
const COMMENTARY = [
  "This is part of Tesla's long-term strategy to dominate the EV market from top to bottom.",
  "Tesla keeps pushing the boundaries while competitors play catch-up.",
  "More evidence that Tesla's vertically integrated approach is paying off.",
  "This is why Tesla remains the most compelling EV investment.",
  "Tesla's ability to move fast and iterate is what separates them from legacy automakers.",
  "This fits right into Tesla's mission to accelerate the transition to sustainable energy.",
  "Another reason Tesla owners rarely go back to gas.",
  "The Tesla ecosystem keeps getting stronger.",
  "This kind of move is what makes Tesla more than just a car company.",
  "Tesla's execution speed is unmatched in the auto industry.",
  "This is bullish for Tesla's long-term growth trajectory.",
  "Further proof that Tesla is years ahead of the competition.",
];

// Tweet templates — no emojis, includes article link and a commentary line
const TEMPLATES = [
  "{headline}\n\n{commentary}\n\n{articleLink}",
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

  // Filter to Tesla-related headlines only, sort newest first
  return allItems
    .filter((item) => {
      if (item.title.length === 0) return false;
      const lower = item.title.toLowerCase();
      return TESLA_KEYWORDS.some((kw) => lower.includes(kw));
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit);
}

// Pick a random template and fill in the headline + referral link.
// Truncates the headline if the total tweet would exceed 280 chars.
export function formatTweet(headline: string, articleLink: string): string {
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  // Pick a random commentary line to add Tesla-strategic context
  const commentary = COMMENTARY[Math.floor(Math.random() * COMMENTARY.length)];

  // Calculate max headline length to stay under 280 chars
  // X counts every URL as 23 chars (t.co shortener)
  const overhead = template
    .replace("{headline}", "")
    .replace("{commentary}", commentary)
    .replace("{articleLink}", "").length + 23;
  const maxHeadline = 280 - overhead;

  // Truncate headline if needed, adding ellipsis
  const trimmedHeadline =
    headline.length > maxHeadline
      ? headline.slice(0, maxHeadline - 1) + "…"
      : headline;

  return template
    .replace("{headline}", trimmedHeadline)
    .replace("{commentary}", commentary)
    .replace("{articleLink}", articleLink);
}
