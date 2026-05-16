import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

// /confirm?token=xxx — double opt-in confirmation page.
// When a subscriber clicks the link in their confirmation email,
// this page looks up their token and flips their status to 'confirmed'.
// Server component — no client JS needed for this simple flow.
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let status: "success" | "error" | "already" = "error";

  if (token) {
    try {
      // Look up the subscriber by their confirmation token
      const result = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.confirmToken, token))
        .limit(1);

      if (result.length > 0) {
        const subscriber = result[0];

        if (subscriber.status === "confirmed") {
          // Already confirmed — show a friendly message instead of an error
          status = "already";
        } else {
          // Flip to confirmed and record the timestamp
          await db
            .update(subscribers)
            .set({
              status: "confirmed",
              confirmedAt: new Date(),
            })
            .where(eq(subscribers.confirmToken, token));
          status = "success";
        }
      }
    } catch (error) {
      console.error("Confirm error:", error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        {status === "success" && (
          <>
            <h1 className="mb-4 text-4xl font-bold">You&apos;re Confirmed! 🎉</h1>
            <p className="mb-8 text-white/60">
              Welcome to the community! You&apos;ll start receiving Tesla tips,
              referral bonuses, and owner insights.
            </p>
          </>
        )}
        {status === "already" && (
          <>
            <h1 className="mb-4 text-4xl font-bold">Already Confirmed ✅</h1>
            <p className="mb-8 text-white/60">
              You&apos;re already on the list. No action needed!
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="mb-4 text-4xl font-bold">Something Went Wrong</h1>
            <p className="mb-8 text-white/60">
              This confirmation link is invalid or expired. Try signing up again.
            </p>
          </>
        )}
        <Link
          href="/"
          className="inline-block rounded-full bg-tesla-red px-8 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
