import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers, campaigns, emailEvents } from "@/db/schema";
import { eq, count, desc, sql } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

// GET /api/metrics — returns all dashboard metrics in one call.
// Protected by the simple auth cookie. Queries subscribers, campaigns,
// and email events to compute totals, rates, and recent activity.
export async function GET() {
  // Auth check — only the dashboard owner should see metrics
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Run all metric queries in parallel for speed
    const [
      confirmedCount,
      pendingCount,
      unsubscribedCount,
      totalCampaigns,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalBounced,
      recentSubscribers,
      recentEvents,
    ] = await Promise.all([
      // Subscriber counts by status
      db.select({ value: count() }).from(subscribers).where(eq(subscribers.status, "confirmed")),
      db.select({ value: count() }).from(subscribers).where(eq(subscribers.status, "pending")),
      db.select({ value: count() }).from(subscribers).where(eq(subscribers.status, "unsubscribed")),

      // Campaign count
      db.select({ value: count() }).from(campaigns),

      // Email event counts by type — used to compute open/click rates
      db.select({ value: count() }).from(emailEvents).where(eq(emailEvents.eventType, "delivered")),
      db.select({ value: count() }).from(emailEvents).where(eq(emailEvents.eventType, "opened")),
      db.select({ value: count() }).from(emailEvents).where(eq(emailEvents.eventType, "clicked")),
      db.select({ value: count() }).from(emailEvents).where(eq(emailEvents.eventType, "bounced")),

      // Recent 20 subscribers — for the activity feed
      db
        .select({
          id: subscribers.id,
          email: subscribers.email,
          status: subscribers.status,
          createdAt: subscribers.createdAt,
        })
        .from(subscribers)
        .orderBy(desc(subscribers.createdAt))
        .limit(20),

      // Recent 20 email events — for the activity feed
      db
        .select({
          id: emailEvents.id,
          eventType: emailEvents.eventType,
          createdAt: emailEvents.createdAt,
          subscriberId: emailEvents.subscriberId,
        })
        .from(emailEvents)
        .orderBy(desc(emailEvents.createdAt))
        .limit(20),
    ]);

    // Compute rates — guard against division by zero
    const delivered = totalDelivered[0].value;
    const opened = totalOpened[0].value;
    const clicked = totalClicked[0].value;

    const openRate = delivered > 0 ? Math.round((opened / delivered) * 100) : 0;
    const clickRate = delivered > 0 ? Math.round((clicked / delivered) * 100) : 0;

    // Total emails sent across all campaigns
    const sentResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${campaigns.sentCount}), 0)` })
      .from(campaigns);

    return NextResponse.json({
      subscribers: {
        confirmed: confirmedCount[0].value,
        pending: pendingCount[0].value,
        unsubscribed: unsubscribedCount[0].value,
      },
      campaigns: totalCampaigns[0].value,
      emailsSent: sentResult[0].total,
      rates: {
        open: openRate,
        click: clickRate,
      },
      bounces: totalBounced[0].value,
      recentSubscribers,
      recentEvents,
    });
  } catch (error) {
    console.error("Metrics error:", error);
    return NextResponse.json(
      { error: "Failed to load metrics" },
      { status: 500 }
    );
  }
}
