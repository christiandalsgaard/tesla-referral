import { config } from "@/lib/config";

// All the reasons to buy a Tesla — displayed as a scannable grid of cards.
// Each benefit has an emoji icon, title, and short description.
// The referral CTA is repeated after the grid to catch scrollers.
const benefits = [
  { icon: "⚡", title: "Zero Gas Costs", desc: "Charge at home for pennies. Save $2,000+ per year versus gas." },
  { icon: "🚀", title: "Insane Acceleration", desc: "0-60 mph in as little as 1.99 seconds. Nothing else compares." },
  { icon: "🔄", title: "Over-the-Air Updates", desc: "Your car gets better over time — new features while you sleep." },
  { icon: "🛡️", title: "Safest Cars Ever", desc: "Highest safety ratings from NHTSA. Lowest rollover risk of any car." },
  { icon: "🌍", title: "50,000+ Superchargers", desc: "The largest fast-charging network on Earth. Road trips are easy." },
  { icon: "🤖", title: "Autopilot & FSD", desc: "Advanced driver assistance that handles highway driving and parking." },
  { icon: "💰", title: "Tax Credits", desc: "Up to $7,500 federal tax credit on qualifying models." },
  { icon: "🔧", title: "Minimal Maintenance", desc: "No oil changes, no transmission fluid, no spark plugs. Ever." },
  { icon: "📱", title: "Phone Is Your Key", desc: "Unlock, start, and precondition your car from the Tesla app." },
  { icon: "🎮", title: "Gaming & Entertainment", desc: "Netflix, YouTube, Steam gaming — all built into the touchscreen." },
  { icon: "☀️", title: "Solar + Powerwall", desc: "Complete energy ecosystem. Power your home and car from the sun." },
  { icon: "🏎️", title: "Track Mode", desc: "Model 3 Performance and Model S Plaid are track-ready out of the box." },
  { icon: "❄️", title: "Heat Pump Efficiency", desc: "Best-in-class cold weather range thanks to heat pump technology." },
  { icon: "🎵", title: "Premium Sound", desc: "Immersive audio system that rivals luxury brands costing 3x more." },
  { icon: "📊", title: "Resale Value", desc: "Teslas hold their value better than almost any other car brand." },
  { icon: "🏠", title: "Home Charging", desc: "Wake up to a full battery every morning. No more gas station stops." },
  { icon: "🌱", title: "Zero Emissions", desc: "Drive guilt-free. No tailpipe emissions, ever." },
  { icon: "🗺️", title: "Navigation + Routing", desc: "Built-in nav that routes through Superchargers automatically." },
  { icon: "🐕", title: "Dog Mode", desc: "Keep your pets comfortable with climate control while you step away." },
  { icon: "📹", title: "Sentry Mode", desc: "360° dashcam that records when someone approaches your parked car." },
  { icon: "⛺", title: "Camp Mode", desc: "Sleep comfortably in your Tesla with climate control running all night." },
  { icon: "🅿️", title: "Smart Summon", desc: "Your car drives itself to you across a parking lot." },
  { icon: "🔋", title: "Battery Longevity", desc: "Tesla batteries retain 90%+ capacity after 200,000 miles." },
  { icon: "💎", title: "Minimalist Design", desc: "Clean, clutter-free interiors. The most modern car interior on the road." },
];

export default function Benefits() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
          Why Tesla Owners{" "}
          <span className="text-tesla-red">Never Go Back</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-white/50">
          Once you drive electric, everything else feels outdated. Here are just
          some of the reasons Tesla is the best car you&apos;ll ever own.
        </p>

        {/* Benefits grid — responsive 1/2/3/4 column layout */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-white/5 bg-white/[0.03] p-5 transition hover:border-white/10 hover:bg-white/[0.06]"
            >
              <span className="text-2xl">{b.icon}</span>
              <h3 className="mt-2 font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-white/50">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Repeated CTA after the grid — catches people who scrolled through benefits */}
        <div className="mt-12 text-center">
          <a
            href={config.referralLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-tesla-red px-8 py-3.5 text-lg font-semibold text-white shadow-lg shadow-tesla-red/25 transition hover:bg-red-700"
          >
            Get Your Tesla Now &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
