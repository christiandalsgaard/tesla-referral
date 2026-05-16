"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Dashboard login form — simple password entry.
// Posts to /api/auth, which sets a cookie on success, then reloads
// the dashboard page so the layout picks up the auth cookie.
export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Reload so the server-side layout detects the new auth cookie
        router.refresh();
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold tracking-wide uppercase text-white/80">
          Command Center
        </h1>
        <p className="mb-8 text-center text-sm text-white/40">
          Enter your password to access the dashboard
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-accent px-4 py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Enter"}
          </button>
          {error && <p className="text-center text-sm text-red-400">{error}</p>}
        </form>
      </div>
    </div>
  );
}
