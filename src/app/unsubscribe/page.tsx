import Link from "next/link";

// /unsubscribe?status=success|error — shown after clicking the unsubscribe
// link in an email. The actual unsubscribe happens in /api/unsubscribe
// which redirects here with a status query param.
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        {status === "success" ? (
          <>
            <h1 className="mb-4 text-4xl font-bold">Unsubscribed</h1>
            <p className="mb-8 text-white/60">
              You&apos;ve been removed from our mailing list. You won&apos;t receive any
              more emails from us. We&apos;re sorry to see you go!
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-4 text-4xl font-bold">Something Went Wrong</h1>
            <p className="mb-8 text-white/60">
              We couldn&apos;t process your unsubscribe request. Please try again or
              contact us directly.
            </p>
          </>
        )}
        <Link
          href="/"
          className="inline-block rounded-full border border-white/20 bg-white/5 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
