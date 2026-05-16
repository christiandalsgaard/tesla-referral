"use client";

import { useState } from "react";

// Email signup form — client component for interactivity.
// Posts to /api/subscribe which handles validation, double opt-in, etc.
// Shows success/error states inline. The form has a consent disclosure
// explaining what they're signing up for (CAN-SPAM best practice).
export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Check your inbox to confirm your subscription!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section id="signup" className="px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
          Stay in the <span className="text-accent">Loop</span>
        </h2>
        <p className="mb-8 text-white/50">
          Get exclusive Tesla tips, referral bonuses, and owner insights
          delivered to your inbox. No spam, unsubscribe anytime.
        </p>

        {/* Show success message instead of form after successful signup */}
        {status === "success" ? (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6">
            <p className="text-lg font-semibold text-green-400">You&apos;re in! 🎉</p>
            <p className="mt-2 text-sm text-white/60">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-full bg-accent px-8 py-3.5 font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-50"
              >
                {status === "loading" ? "Joining..." : "Join Free"}
              </button>
            </div>

            {/* Consent disclosure — required for legitimate email marketing */}
            <p className="text-xs text-white/30">
              By signing up, you agree to receive occasional emails about Tesla.
              You can unsubscribe at any time with one click. We never share your email.
            </p>

            {/* Error message */}
            {status === "error" && (
              <p className="text-sm text-red-400">{message}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
