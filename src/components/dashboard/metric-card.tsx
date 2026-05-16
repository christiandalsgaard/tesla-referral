// Single metric card — displays a number with a label and icon.
// Uses the glow-card CSS class for the command center hover effect.
interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  // Optional accent color override — defaults to cyan/accent
  color?: string;
}

export default function MetricCard({ label, value, icon, color }: MetricCardProps) {
  return (
    <div className="glow-card rounded-xl border border-white/5 bg-white/[0.03] p-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-wider text-white/40">
          {label}
        </span>
        <span className="text-xl">{icon}</span>
      </div>
      {/* Large monospace number — tabular-nums for consistent digit width */}
      <p
        className="font-mono text-4xl font-bold tabular-nums"
        style={{ color: color || "#22d3ee" }}
      >
        {value}
      </p>
    </div>
  );
}
