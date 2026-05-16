import MetricCard from "./metric-card";

// Metrics grid — 2x3 layout of the key campaign numbers.
// Receives pre-computed metrics from the dashboard page.
interface MetricsGridProps {
  confirmed: number;
  pending: number;
  emailsSent: number;
  openRate: number;
  clickRate: number;
  bounces: number;
}

export default function MetricsGrid({
  confirmed,
  pending,
  emailsSent,
  openRate,
  clickRate,
  bounces,
}: MetricsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard label="Subscribers" value={confirmed} icon="👥" color="#22d3ee" />
      <MetricCard label="Pending" value={pending} icon="⏳" color="#f59e0b" />
      <MetricCard label="Emails Sent" value={emailsSent} icon="📧" color="#3b82f6" />
      <MetricCard label="Open Rate" value={`${openRate}%`} icon="👀" color="#10b981" />
      <MetricCard label="Click Rate" value={`${clickRate}%`} icon="🖱️" color="#8b5cf6" />
      <MetricCard label="Bounces" value={bounces} icon="⚠️" color="#ef4444" />
    </div>
  );
}
