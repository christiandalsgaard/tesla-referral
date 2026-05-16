import Parser from "rss-parser";

// RSS feeds focused on Tesla specifically — broader EV feeds removed
// to keep posts on-brand. Teslarati is Tesla-only; Electrek covers
// Tesla heavily alongside other EV news (filtered by keyword below).
const FEEDS = [
  "https://www.teslarati.com/feed/",              // Tesla-only news
  "https://electrek.co/feed/",                    // Heavy Tesla coverage
];

// Tesla-related keywords — headlines must match at least one to be posted.
// Keeps the feed strictly about Tesla, not general EV news.
const TESLA_KEYWORDS = [
  "tesla", "tsla", "model y", "model 3", "model s", "model x",
  "cybertruck", "roadster", "semi", "megapack", "powerwall",
  "supercharger", "autopilot", "fsd", "full self-driving",
  "gigafactory", "giga", "elon musk", "dojo", "optimus",
  "tesla bot", "tesla energy", "solar roof", "cybercab",
];

// Keyword-to-commentary mapping — matches headline keywords to a relevant
// insight that reasons about *why* the news matters for Tesla. Each entry
// has trigger words and multiple possible commentary lines so posts stay varied.
// The commentary must: (1) be a reasonable conclusion from the headline,
// and (2) paint Tesla in a positive light.
const COMMENTARY_MAP: { keywords: string[]; lines: string[] }[] = [
  {
    keywords: ["price increase", "prices up", "raises price", "price hike", "prices went up", "raises model"],
    lines: [
      "This suggests demand is strong enough for Tesla to raise prices — a sign of pricing power.",
      "Price increases usually signal demand is outpacing supply. Bullish for margins.",
      "When Tesla raises prices, it means buyers are lining up. Demand is healthy.",
    ],
  },
  {
    keywords: ["price cut", "price drop", "lowers price", "cheaper", "price reduction", "discount"],
    lines: [
      "Tesla can afford to cut prices because their manufacturing costs keep falling. Scale advantage.",
      "Lower prices mean more people can afford a Tesla — expanding the total addressable market.",
      "This is Tesla using its cost advantage to grow market share. Competitors can't match this.",
    ],
  },
  {
    keywords: ["deliveries", "delivered", "delivery numbers", "sales record", "record quarter"],
    lines: [
      "Strong deliveries show Tesla's demand story is intact despite what the bears say.",
      "Delivery numbers are the real scoreboard, and Tesla keeps putting up big numbers.",
      "More deliveries means more data for FSD and more recurring revenue from services.",
    ],
  },
  {
    keywords: ["fsd", "full self-driving", "autopilot", "self-driving", "autonomous"],
    lines: [
      "FSD is Tesla's biggest long-term value driver. Every update gets them closer to full autonomy.",
      "Autonomy is what turns Tesla from a car company into a tech platform worth trillions.",
      "Self-driving capability is the moat that no legacy automaker can replicate.",
    ],
  },
  {
    keywords: ["supercharger", "charging", "charge", "v4"],
    lines: [
      "Tesla's charging network is becoming the industry standard. That's a massive competitive moat.",
      "Owning the charging infrastructure means recurring revenue and customer lock-in.",
      "Every new Supercharger makes the Tesla ecosystem harder for competitors to match.",
    ],
  },
  {
    keywords: ["gigafactory", "giga", "factory", "production", "manufacturing"],
    lines: [
      "More production capacity means Tesla can scale faster while keeping costs down.",
      "Tesla's manufacturing innovation is their secret weapon. Nobody builds factories this fast.",
      "Vertical integration at scale — this is how Tesla maintains its cost advantage.",
    ],
  },
  {
    keywords: ["cybertruck"],
    lines: [
      "Cybertruck is opening up the most profitable segment in the US auto market for Tesla.",
      "The truck market is massive and Tesla is just getting started in this space.",
      "Cybertruck demand continues to prove the skeptics wrong.",
    ],
  },
  {
    keywords: ["model y"],
    lines: [
      "Model Y is the best-selling vehicle on the planet for a reason.",
      "Model Y continues to be Tesla's volume king and cash cow.",
      "The Model Y is Tesla's most important vehicle — high volume, high margin.",
    ],
  },
  {
    keywords: ["model 3"],
    lines: [
      "Model 3 remains one of the best-value EVs on the market.",
      "The refreshed Model 3 shows Tesla keeps improving what already works.",
      "Model 3 is the car that proved EVs could go mainstream.",
    ],
  },
  {
    keywords: ["energy", "megapack", "powerwall", "solar", "battery storage", "grid"],
    lines: [
      "Tesla Energy is becoming a massive business. This is way more than a car company.",
      "Energy storage is a trillion-dollar market and Tesla is leading the charge.",
      "Megapack and Powerwall are turning Tesla into the backbone of the clean energy grid.",
    ],
  },
  {
    keywords: ["optimus", "tesla bot", "robot", "humanoid"],
    lines: [
      "Optimus could be bigger than the car business. Tesla is thinking decades ahead.",
      "A humanoid robot that actually works would be the most valuable product ever made.",
      "Tesla's AI and manufacturing expertise make them uniquely positioned to build humanoid robots.",
    ],
  },
  {
    keywords: ["stock", "tsla", "shares", "market cap", "investor", "earnings", "revenue", "profit"],
    lines: [
      "The market is starting to price in Tesla's multiple growth vectors beyond cars.",
      "Tesla's fundamentals keep getting stronger quarter over quarter.",
      "Long-term investors understand that Tesla's best days are still ahead.",
    ],
  },
  {
    keywords: ["update", "software", "over-the-air", "ota", "firmware", "feature"],
    lines: [
      "No other car company can push software updates to millions of vehicles overnight.",
      "OTA updates mean your Tesla literally gets better while you sleep.",
      "This is why Teslas appreciate in capability over time instead of just depreciating.",
    ],
  },
  {
    keywords: ["dojo", "ai", "neural", "training", "compute"],
    lines: [
      "Tesla's AI infrastructure is what separates them from every other automaker.",
      "Custom AI hardware gives Tesla a data advantage that compounds over time.",
      "Dojo and in-house AI are key to making FSD a reality at scale.",
    ],
  },
  {
    keywords: ["semi"],
    lines: [
      "Tesla Semi is about to disrupt the $800 billion trucking industry.",
      "Electric trucking has massive fuel savings — fleet operators will switch fast.",
      "The Semi shows Tesla can dominate commercial vehicles too, not just consumer.",
    ],
  },
  {
    keywords: ["cybercab", "robotaxi", "ride-hail"],
    lines: [
      "Robotaxis could generate more revenue than car sales. This is the real endgame.",
      "A Tesla robotaxi network would be the most profitable transportation business ever built.",
      "Autonomous ride-hailing is where Tesla's AI investment really pays off.",
    ],
  },
];

// Fallback commentary for headlines that don't match any specific keyword group
const FALLBACK_COMMENTARY = [
  "Tesla continues to execute while the rest of the industry tries to catch up.",
  "This is another step forward in Tesla's mission to accelerate sustainable energy.",
  "Tesla keeps making moves that reinforce their position as the industry leader.",
];

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  imageUrl: string | null;
}

// Extract a real photo URL from RSS item HTML content.
// Skips tiny images, emoji/icon URLs, and SVGs to avoid posting
// garbage thumbnails. Looks for images with width params > 500px
// or large src URLs typical of featured article photos.
function extractImageUrl(item: Record<string, unknown>): string | null {
  const content = (item["content:encoded"] as string) || (item.content as string) || "";

  // Find all <img src="..."> in the HTML
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = imgRegex.exec(content)) !== null) {
    const url = match[1].replace(/&amp;/g, "&");

    // Skip tiny images, icons, emojis, tracking pixels, and SVGs
    if (url.includes("emoji")) continue;
    if (url.includes("gravatar")) continue;
    if (url.includes("avatar")) continue;
    if (url.includes("icon")) continue;
    if (url.includes(".svg")) continue;
    if (url.includes("1x1")) continue;
    if (url.includes("pixel")) continue;
    if (url.includes("badge")) continue;
    if (url.includes("logo")) continue;

    // Prefer images with width indicators suggesting a real photo
    // (WordPress/Electrek use w=XXXX params, or width attributes)
    const widthParam = url.match(/[?&]w=(\d+)/);
    if (widthParam && parseInt(widthParam[1]) < 200) continue;

    const widthAttr = match[0].match(/width=["']?(\d+)/);
    if (widthAttr && parseInt(widthAttr[1]) < 200) continue;

    // This image looks legit — return it
    return url;
  }

  return null;
}

// Pick a commentary line that actually relates to the headline content.
// Scans the headline for keyword matches against the commentary map,
// then picks a random line from the matching group. Falls back to
// generic commentary if no specific match is found.
function getCommentary(headline: string): string {
  const lower = headline.toLowerCase();

  // Find the first matching commentary group
  for (const group of COMMENTARY_MAP) {
    if (group.keywords.some((kw) => lower.includes(kw))) {
      return group.lines[Math.floor(Math.random() * group.lines.length)];
    }
  }

  // No specific match — use a generic fallback
  return FALLBACK_COMMENTARY[Math.floor(Math.random() * FALLBACK_COMMENTARY.length)];
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

// Format a tweet with headline, contextual commentary, and article link.
// Truncates the headline if the total tweet would exceed 280 chars.
export function formatTweet(headline: string, articleLink: string): string {
  // Get commentary that actually relates to this specific headline
  const commentary = getCommentary(headline);

  // Build the tweet: headline + insight + link
  const template = "{headline}\n\n{commentary}\n\n{articleLink}";

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
