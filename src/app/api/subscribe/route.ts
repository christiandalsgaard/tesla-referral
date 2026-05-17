import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resend } from "@/lib/resend";
import { config } from "@/lib/config";
import { buildWelcomeEmail } from "@/lib/welcome-email";

// Validate email format with zod — rejects obvious garbage
const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// POST /api/subscribe
// Handles new email signups from the landing page form.
// No double opt-in — subscribers are confirmed immediately and receive
// a warm welcome email. If the email already exists, returns a generic
// success message without leaking status (privacy best practice).
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed — don't reveal status to prevent enumeration
    const existing = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      // Already in the system — return generic success without re-sending
      return NextResponse.json({
        message: "Welcome to the community! Check your inbox.",
      });
    }

    // Generate a unique unsubscribe token (CAN-SPAM requirement)
    const confirmToken = nanoid(32);
    const unsubscribeToken = nanoid(32);

    // Insert as 'confirmed' immediately — no double opt-in needed
    await db.insert(subscribers).values({
      email: normalizedEmail,
      status: "confirmed",
      confirmToken,
      unsubscribeToken,
      confirmedAt: new Date(),
      source: "landing_page",
    });

    // Send the welcome email — makes new subscribers feel like they
    // just joined something special
    await resend.emails.send({
      from: `Christian from ${config.companyName} <${config.contactEmail}>`,
      to: normalizedEmail,
      subject: "Welcome to the Tesla community — you're in!",
      html: buildWelcomeEmail(unsubscribeToken),
    });

    return NextResponse.json({
      message: "Welcome to the community! Check your inbox.",
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
