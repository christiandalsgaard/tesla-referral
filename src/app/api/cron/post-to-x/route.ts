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

    // 3. Find the first headline we haven't posted yet (prefer ones with images)
    const freshNews = news
      .filter((item) => !postedHeadlines.has(item.title))
      .sort((a, b) => (b.imageUrl ? 1 : 0) - (a.imageUrl ? 1 : 0))[0];

    if (!freshNews) {
      return NextResponse.json({ message: "All recent news already posted, skipping" });
    }

    // 4. Format the tweet using a random template
    const tweetText = formatTweet(freshNews.title);

    // 5. If the article has a featured image, download it and upload to X as media.
    //    This makes the tweet show a relevant image instead of the referral link card.
    const xClient = getXClient();
    let mediaId: string | undefined;

    if (freshNews.imageUrl) {
      try {
        // Download the article's featured image as a buffer
        const imgResponse = await fetch(freshNews.imageUrl);
        if (imgResponse.ok) {
          const imgBuffer = Buffer.from(await imgResponse.arrayBuffer());
          // Upload to X via the v1.1 media upload endpoint
          mediaId = await xClient.v1.uploadMedia(imgBuffer, {
            mimeType: imgResponse.headers.get("content-type") || "image/jpeg",
          });
        }
      } catch (imgError) {
        // If image upload fails, just post without it — not a dealbreaker
        console.error("Image upload failed, posting without image:", imgError);
      }
    }

    // 6. Post to X — attach media if we successfully uploaded an image
    const tweetPayload: { text: string; media?: { media_ids: string[] } } = {
      text: tweetText,
    };
    if (mediaId) {
      tweetPayload.media = { media_ids: [mediaId] };
    }

    const tweet = await xClient.v2.tweet(tweetPayload);

    // 7. Record the post in our database so we don't repeat it
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
      hasImage: !!mediaId,
    });
  } catch (error) {
    console.error("Cron post-to-x error:", error);
    return NextResponse.json(
      { error: "Failed to post", details: String(error) },
      { status: 500 }
    );
  }
}
