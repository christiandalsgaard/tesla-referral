import Image from "next/image";
import { config } from "@/lib/config";

// All the reasons to buy a Tesla — displayed as a scannable grid of cards.
// Each benefit has a small photo, emoji icon, title, and short description.
// Images are from Unsplash (free to use), stored in public/images/benefits/.
const benefits = [
  { icon: "⚡", title: "Zero Gas Costs", desc: "Charge at home for pennies. Save $2,000+ per year versus gas.", img: "charging.jpg" },
  { icon: "🚀", title: "Insane Acceleration", desc: "0-60 mph in as little as 1.99 seconds. Nothing else compares.", img: "acceleration.jpg" },
  { icon: "🔄", title: "Over-the-Air Updates", desc: "Your car gets better over time — new features while you sleep.", img: "updates.jpg" },
  { icon: "🛡️", title: "Safest Cars Ever", desc: "Highest safety ratings from NHTSA. Lowest rollover risk of any car.", img: "safety.jpg" },
  { icon: "🌍", title: "50,000+ Superchargers", desc: "The largest fast-charging network on Earth. Road trips are easy.", img: "supercharger.jpg" },
  { icon: "🤖", title: "Autopilot & FSD", desc: "Advanced driver assistance that handles highway driving and parking.", img: "autopilot.jpg" },
  { icon: "💰", title: "Tax Credits", desc: "Up to $7,500 federal tax credit on qualifying models.", img: "tax.jpg" },
  { icon: "🔧", title: "Minimal Maintenance", desc: "No oil changes, no transmission fluid, no spark plugs. Ever.", img: "maintenance.jpg" },
  { icon: "📱", title: "Phone Is Your Key", desc: "Unlock, start, and precondition your car from the Tesla app.", img: "phone-key.jpg" },
  { icon: "🎮", title: "Gaming & Entertainment", desc: "Netflix, YouTube, Steam gaming — all built into the touchscreen.", img: "entertainment.jpg" },
  { icon: "☀️", title: "Solar + Powerwall", desc: "Complete energy ecosystem. Power your home and car from the sun.", img: "solar.jpg" },
  { icon: "🏎️", title: "Track Mode", desc: "Model 3 Performance and Model S Plaid are track-ready out of the box.", img: "track.jpg" },
  { icon: "❄️", title: "Heat Pump Efficiency", desc: "Best-in-class cold weather range thanks to heat pump technology.", img: "heatpump.jpg" },
  { icon: "🎵", title: "Premium Sound", desc: "Immersive audio system that rivals luxury brands costing 3x more.", img: "sound.jpg" },
  { icon: "📊", title: "Resale Value", desc: "Teslas hold their value better than almost any other car brand.", img: "resale.jpg" },
  { icon: "🏠", title: "Home Charging", desc: "Wake up to a full battery every morning. No more gas station stops.", img: "home-charging.jpg" },
  { icon: "🌱", title: "Zero Emissions", desc: "Drive guilt-free. No tailpipe emissions, ever.", img: "emissions.jpg" },
  { icon: "🗺️", title: "Navigation + Routing", desc: "Built-in nav that routes through Superchargers automatically.", img: "navigation.jpg" },
  { icon: "🐕", title: "Dog Mode", desc: "Keep your pets comfortable with climate control while you step away.", img: "dog.jpg" },
  { icon: "📹", title: "Sentry Mode", desc: "360° dashcam that records when someone approaches your parked car.", img: "sentry.jpg" },
  { icon: "⛺", title: "Camp Mode", desc: "Sleep comfortably in your Tesla with climate control running all night.", img: "camp.jpg" },
  { icon: "🅿️", title: "Smart Summon", desc: "Your car drives itself to you across a parking lot.", img: "summon.jpg" },
  { icon: "🔋", title: "Battery Longevity", desc: "Tesla batteries retain 90%+ capacity after 200,000 miles.", img: "battery.jpg" },
  { icon: "💎", title: "Minimalist Design", desc: "Clean, clutter-free interiors. The most modern car interior on the road.", img: "interior.jpg" },
];

export default function Benefits() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <h2 className="mb-8 text-center text-3xl font-bold sm:text-4xl">
          Why Tesla Owners{" "}
          <span className="text-tesla-red">Never Go Back</span>
        </h2>

        {/* Benefits grid — responsive 1/2/3/4 column layout */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] transition hover:border-white/10 hover:bg-white/[0.06]"
            >
              {/* Benefit image — small thumbnail at the top of each card */}
              <div className="relative h-32 w-full overflow-hidden">
                <Image
                  src={`/images/benefits/${b.img}`}
                  alt={b.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Dark gradient overlay so text below stays readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Emoji overlaid on the bottom-left of the image */}
                <span className="absolute bottom-2 left-3 text-xl">{b.icon}</span>
              </div>
              {/* Text content below the image */}
              <div className="p-4">
                <h3 className="font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm text-white/50">{b.desc}</p>
              </div>
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
