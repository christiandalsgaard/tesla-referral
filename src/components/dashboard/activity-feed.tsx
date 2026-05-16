// Activity feed — scrollable list of recent subscriber signups.
// Terminal-style aesthetic with timestamps and status indicators.
interface Subscriber {
  id: number;
  email: string;
  status: string;
  createdAt: string;
}

interface ActivityFeedProps {
  subscribers: Subscriber[];
}

// Map subscriber status to a color dot — visual indicator
const statusColors: Record<string, string> = {
  confirmed: "#10b981",   // green
  pending: "#f59e0b",     // amber
  unsubscribed: "#ef4444", // red
};

export default function ActivityFeed({ subscribers }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40">
        Recent Activity
      </h3>

      {subscribers.length === 0 ? (
        <p className="text-sm text-white/30">No subscribers yet. Share your landing page!</p>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {subscribers.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm"
            >
              <div className="flex items-center gap-3">
                {/* Status dot */}
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: statusColors[sub.status] || "#666" }}
                />
                {/* Partially masked email for privacy */}
                <span className="font-mono text-white/70">{sub.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/30">{sub.status}</span>
                <span className="font-mono text-xs text-white/20">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
