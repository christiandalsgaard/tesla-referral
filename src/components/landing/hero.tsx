import { config } from "@/lib/config";

// Hero section — the first thing visitors see. Big bold headline, a short
// personal pitch, and two CTAs: one to the referral link (primary) and one
// that scrolls down to the email signup form (secondary).
export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
      {/* Gradient background glow behind the headline */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-tesla-red/10 blur-[120px]" />
      </div>

      {/* Small trust badge above the headline */}
      <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70">
        Trusted by Tesla owners worldwide
      </span>

      <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
        Drive the{" "}
        <span className="bg-gradient-to-r from-tesla-red to-red-400 bg-clip-text text-transparent">
          Future
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-white/60 sm:text-xl">
        I&apos;ve been driving Tesla for years, and it changed my life. Better for
        your wallet, better for the planet, and the most fun you&apos;ll ever have
        behind the wheel. Use my referral link and we both win.
      </p>

      {/* Dual CTA buttons */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <a
          href={config.referralLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-tesla-red px-8 py-3.5 text-lg font-semibold text-white shadow-lg shadow-tesla-red/25 transition hover:bg-red-700 hover:shadow-tesla-red/40"
        >
          Order Your Tesla &rarr;
        </a>
        <a
          href="#signup"
          className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-lg font-semibold text-white transition hover:bg-white/10"
        >
          Get Updates
        </a>
      </div>

      {/* Social proof line */}
      <p className="mt-8 text-sm text-white/40">
        Follow my Tesla journey &mdash;{" "}
        <a
          href={config.xAccountUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:text-white"
        >
          {config.xHandle} on X
        </a>
      </p>
    </section>
  );
}
