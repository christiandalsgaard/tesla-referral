import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resend } from "@/lib/resend";
import { config } from "@/lib/config";

// Validate email format with zod — rejects obvious garbage
const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// POST /api/subscribe
// Handles new email signups from the landing page form.
// Implements double opt-in: inserts as 'pending', sends a confirmation email.
// If the email already exists, returns a friendly message without leaking
// whether the email is in the system (privacy best practice).
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
      // Return generic success even if already exists (prevents email enumeration)
      return NextResponse.json({
        message: "Check your inbox to confirm your subscription!",
      });
    }

    // Generate unique tokens for confirmation and unsubscribe links
    const confirmToken = nanoid(32);
    const unsubscribeToken = nanoid(32);

    // Insert the new subscriber as 'pending' — they must click the confirm link
    await db.insert(subscribers).values({
      email: normalizedEmail,
      status: "pending",
      confirmToken,
      unsubscribeToken,
      source: "landing_page",
    });

    // Send the confirmation email via Resend.
    // The confirm link includes the token so we can verify ownership.
    const confirmUrl = `${config.siteUrl}/confirm?token=${confirmToken}`;

    await resend.emails.send({
      // Resend requires a verified domain — use their onboarding sender
      // until a custom domain (e.g. thatteslaguy.com) is set up
      from: `${config.companyName} <onboarding@resend.dev>`,
      to: normalizedEmail,
      subject: "Confirm your subscription — That Tesla Guy",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #111; color: #eee;">
          <h2 style="color: #fff;">Almost there! 🎉</h2>
          <p style="color: #ccc; line-height: 1.6;">
            Thanks for signing up! Click the button below to confirm your
            subscription and start getting Tesla tips, deals, and referral bonuses.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${confirmUrl}" style="display: inline-block; padding: 14px 32px; background: #cc0000; color: #fff; text-decoration: none; border-radius: 50px; font-weight: bold;">
              Confirm My Subscription
            </a>
          </div>
          <p style="color: #666; font-size: 12px;">
            If you didn't sign up, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Check your inbox to confirm your subscription!",
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
