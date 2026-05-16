import { NextResponse } from "next/server";
import { getXClient } from "@/lib/x-client";
import { fetchTeslaNews, formatTweet } from "@/lib/news-fetcher";
import { config } from "@/lib/config";
import { db } from "@/db";
import { xPosts } from "@/db/schema";
import { desc } from "drizzle-orm";

// Vercel Cron calls this endpoint on a schedule (3x/day).
// Protected by CRON_SECRET so only Vercel's scheduler can trigger it.
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (not a random visitor)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch the latest Tesla/EV news from RSS feeds
    const news = await fetchTeslaNews(20);

    if (news.length === 0) {
      return NextResponse.json({ message: "No news found, skipping post" });
    }

    // 2. Check which headlines we've already posted (avoid duplicates)
    const recentPosts = await db
      .select({ headline: xPosts.headline })
      .from(xPosts)
      .orderBy(desc(xPosts.createdAt))
      .limit(50);

    const postedHeadlines = new Set(recentPosts.map((p) => p.headline));

    // 3. Find the first headline we haven't posted yet
    const freshNews = news.find((item) => !postedHeadlines.has(item.title));

    if (!freshNews) {
      return NextResponse.json({ message: "All recent news already posted, skipping" });
    }

    // 4. Format the tweet using a random template
    const tweetText = formatTweet(freshNews.title, config.referralLink);

    // 5. Post to X
    const xClient = getXClient();
    const tweet = await xClient.v2.tweet(tweetText);

    // 6. Record the post in our database so we don't repeat it
    await db.insert(xPosts).values({
      headline: freshNews.title,
      tweetText,
      tweetId: tweet.data.id,
      source: freshNews.source,
      newsLink: freshNews.link,
    });

    return NextResponse.json({
      message: "Posted successfully",
      tweetId: tweet.data.id,
      headline: freshNews.title,
    });
  } catch (error) {
    console.error("Cron post-to-x error:", error);
    return NextResponse.json(
      { error: "Failed to post", details: String(error) },
      { status: 500 }
    );
  }
}
