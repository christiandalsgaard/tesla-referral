import { NextResponse } from "next/server";
import { db } from "@/db";
import { emailEvents, subscribers } from "@/db/schema";
import { eq } from "drizzle-orm";

// POST /api/webhooks/resend — receives webhook events from Resend.
// Resend sends events for: delivered, opened, clicked, bounced, complained.
// We store each event in email_events for dashboard metrics.
//
// For 'complained' events (spam reports), we auto-unsubscribe the subscriber.
// This is a CAN-SPAM requirement — complaints must be honored immediately.
//
// Webhook URL to configure in Resend dashboard:
// https://your-domain.com/api/webhooks/resend
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Resend webhook payload structure:
    // { type: "email.delivered", data: { email_id, to, ... } }
    const eventType = body.type?.replace("email.", ""); // e.g., "delivered", "opened"
    const data = body.data || {};

    if (!eventType) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    // Store the event in the database for metrics
    await db.insert(emailEvents).values({
      eventType,
      resendMessageId: data.email_id || null,
      metadata: data,
    });

    // Auto-unsubscribe on complaint — CAN-SPAM compliance requirement.
    // A complaint means the recipient clicked "Report Spam" in their email client.
    if (eventType === "complained" && data.to) {
      const email = Array.isArray(data.to) ? data.to[0] : data.to;
      if (email) {
        await db
          .update(subscribers)
          .set({
            status: "unsubscribed",
            unsubscribedAt: new Date(),
          })
          .where(eq(subscribers.email, email.toLowerCase()));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
