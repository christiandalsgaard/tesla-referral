"use client";

import { useEffect, useState } from "react";
import MetricsGrid from "@/components/dashboard/metrics-grid";
import ActivityFeed from "@/components/dashboard/activity-feed";
import CampaignControls from "@/components/dashboard/campaign-controls";

// Dashboard metrics type — matches the shape returned by GET /api/metrics
interface Metrics {
  subscribers: {
    confirmed: number;
    pending: number;
    unsubscribed: number;
  };
  campaigns: number;
  emailsSent: number;
  rates: {
    open: number;
    click: number;
  };
  bounces: number;
  recentSubscribers: Array<{
    id: number;
    email: string;
    status: string;
    createdAt: string;
  }>;
  recentEvents: Array<{
    id: number;
    eventType: string;
    createdAt: string;
    subscriberId: number | null;
  }>;
}

// Dashboard page — the command center.
// Client component because it polls /api/metrics every 30 seconds
// to keep the dashboard live without requiring a page refresh.
export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch metrics on mount and every 30 seconds
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/metrics");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setMetrics(data);
        setError("");
      } catch {
        setError("Failed to load metrics");
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchMetrics();

    // Poll every 30 seconds to keep the dashboard fresh
    const interval = setInterval(fetchMetrics, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="py-20 text-center text-red-400">
        {error || "Failed to load metrics"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Metrics overview grid */}
      <MetricsGrid
        confirmed={metrics.subscribers.confirmed}
        pending={metrics.subscribers.pending}
        emailsSent={metrics.emailsSent}
        openRate={metrics.rates.open}
        clickRate={metrics.rates.click}
        bounces={metrics.bounces}
      />

      {/* Two-column layout: campaign controls + activity feed */}
      <div className="grid gap-8 lg:grid-cols-2">
        <CampaignControls subscriberCount={metrics.subscribers.confirmed} />
        <ActivityFeed subscribers={metrics.recentSubscribers} />
      </div>
    </div>
  );
}
