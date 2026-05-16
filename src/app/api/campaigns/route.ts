import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers, campaigns } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resend } from "@/lib/resend";
import { config } from "@/lib/config";
import { isAuthenticated } from "@/lib/auth";
import { renderTeslaPitchEmail } from "@/lib/render-email";

// POST /api/campaigns — triggers a campaign send to all confirmed subscribers.
// Auth-protected. Creates a campaign record, then sends the Tesla pitch email
// to each subscriber with their unique unsubscribe link.
//
// For MVP, this sends emails sequentially in batches of 50 to avoid
// hitting Resend's rate limits. For scale, this should be moved to a
// background job queue (e.g., Inngest, QStash, or Vercel Queues).
export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { subject } = await request.json();

    if (!subject || typeof subject !== "string") {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }

    // Get all confirmed subscribers — only people who double opted in
    const confirmedSubscribers = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.status, "confirmed"));

    if (confirmedSubscribers.length === 0) {
      return NextResponse.json(
        { error: "No confirmed subscribers to send to" },
        { status: 400 }
      );
    }

    // Create the campaign record as 'sending'
    const [campaign] = await db
      .insert(campaigns)
      .values({
        subject,
        templateId: "tesla-pitch",
        status: "sending",
      })
      .returning();

    let sentCount = 0;

    // Send emails in batches of 50 to respect rate limits.
    // Each email gets a unique unsubscribe URL based on the subscriber's token.
    const batchSize = 50;
    for (let i = 0; i < confirmedSubscribers.length; i += batchSize) {
      const batch = confirmedSubscribers.slice(i, i + batchSize);

      // Send each email in the batch concurrently
      const results = await Promise.allSettled(
        batch.map(async (subscriber) => {
          // Build the subscriber-specific unsubscribe URL
          const unsubscribeUrl = `${config.siteUrl}/api/unsubscribe?token=${subscriber.unsubscribeToken}`;

          // Render the React Email template to an HTML string.
          // Uses dynamic import of react-dom/server internally to avoid
          // Next.js 16's static import restriction in route handlers.
          const html = await renderTeslaPitchEmail({
            unsubscribeUrl,
            referralLink: config.referralLink,
            xAccountUrl: config.xAccountUrl,
            siteUrl: config.siteUrl,
            physicalAddress: config.physicalAddress,
            companyName: config.companyName,
          });

          // Send via Resend
          return resend.emails.send({
            // Resend requires a verified domain — use their onboarding sender
            // until a custom domain (e.g. thatteslaguy.com) is set up
            from: `Christian from ${config.companyName} <onboarding@resend.dev>`,
            to: subscriber.email,
            subject,
            html,
            // Resend headers for tracking — ties back to our campaign/subscriber IDs
            headers: {
              "X-Campaign-Id": campaign.id.toString(),
              "X-Subscriber-Id": subscriber.id.toString(),
            },
          });
        })
      );

      // Count successful sends
      sentCount += results.filter((r) => r.status === "fulfilled").length;
    }

    // Update the campaign record with the final count and status
    await db
      .update(campaigns)
      .set({
        sentCount,
        status: "sent",
        sentAt: new Date(),
      })
      .where(eq(campaigns.id, campaign.id));

    return NextResponse.json({ success: true, sentCount });
  } catch (error) {
    console.error("Campaign send error:", error);
    return NextResponse.json(
      { error: "Failed to send campaign" },
      { status: 500 }
    );
  }
}
