"use client";

import { useState } from "react";

// Campaign controls — the "launch" button for sending emails.
// Shows subscriber count, a subject line input, and a confirmation step
// before actually triggering the send. Styled like a mission control panel.
interface CampaignControlsProps {
  subscriberCount: number;
}

export default function CampaignControls({ subscriberCount }: CampaignControlsProps) {
  const [subject, setSubject] = useState("Your next car is waiting...");
  const [status, setStatus] = useState<"idle" | "confirm" | "sending" | "sent" | "error">("idle");
  const [result, setResult] = useState("");

  async function handleSend() {
    setStatus("sending");

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("sent");
        setResult(`Campaign sent to ${data.sentCount} subscribers!`);
      } else {
        setStatus("error");
        setResult(data.error || "Failed to send campaign");
      }
    } catch {
      setStatus("error");
      setResult("Network error");
    }
  }

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40">
        Launch Campaign
      </h3>

      {/* Subject line input */}
      <div className="mb-4">
        <label className="mb-1.5 block text-xs text-white/40">Subject Line</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
        />
      </div>

      {/* Recipient count */}
      <p className="mb-4 text-sm text-white/40">
        Recipients: <span className="font-mono text-accent">{subscriberCount}</span> confirmed subscribers
      </p>

      {/* Status-dependent buttons and messages */}
      {status === "idle" && (
        <button
          onClick={() => setStatus("confirm")}
          disabled={subscriberCount === 0}
          className="w-full rounded-lg bg-tesla-red px-6 py-3 font-bold uppercase tracking-wider text-white shadow-lg shadow-tesla-red/20 transition hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          🚀 Launch Campaign
        </button>
      )}

      {/* Confirmation step — prevents accidental sends */}
      {status === "confirm" && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-amber-400">
            ⚠️ This will send emails to {subscriberCount} subscribers. Are you sure?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleSend}
              className="flex-1 rounded-lg bg-tesla-red px-4 py-2.5 font-semibold text-white transition hover:bg-red-700"
            >
              Confirm Send
            </button>
            <button
              onClick={() => setStatus("idle")}
              className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 font-semibold text-white/60 transition hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {status === "sending" && (
        <div className="flex items-center gap-3 text-accent">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <span className="text-sm">Sending campaign...</span>
        </div>
      )}

      {status === "sent" && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
          ✅ {result}
        </div>
      )}

      {status === "error" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            ❌ {result}
          </div>
          <button
            onClick={() => setStatus("idle")}
            className="text-sm text-white/40 underline hover:text-white/60"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
