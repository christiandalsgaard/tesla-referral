import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/unsubscribe?token=xxx
// CAN-SPAM requires honoring unsubscribe requests immediately.
// The token is unique per subscriber (generated at signup time),
// so we can identify who to unsubscribe without requiring login.
// Redirects to /unsubscribe page with a success/error message.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/unsubscribe?status=error", request.url)
    );
  }

  try {
    // Find the subscriber by their unique unsubscribe token
    const result = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.unsubscribeToken, token))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.redirect(
        new URL("/unsubscribe?status=error", request.url)
      );
    }

    // Mark as unsubscribed with a timestamp — we keep the record for compliance
    // auditing but will never send them another email
    await db
      .update(subscribers)
      .set({
        status: "unsubscribed",
        unsubscribedAt: new Date(),
      })
      .where(eq(subscribers.unsubscribeToken, token));

    return NextResponse.redirect(
      new URL("/unsubscribe?status=success", request.url)
    );
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.redirect(
      new URL("/unsubscribe?status=error", request.url)
    );
  }
}
