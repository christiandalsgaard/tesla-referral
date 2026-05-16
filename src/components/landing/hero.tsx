import { config } from "@/lib/config";

// Hero section — compact header with headline, pitch, CTAs, and a
// prominent X follow banner.
export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-6 pb-4 text-center">
      {/* Small trust badge */}
      <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70">
        Trusted by Tesla owners worldwide
      </span>

      <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
        Drive the{" "}
        <span className="bg-gradient-to-r from-tesla-red to-red-400 bg-clip-text text-transparent">
          Future
        </span>
      </h1>

      <p className="mt-4 max-w-2xl text-lg text-white/60 sm:text-xl">
        I&apos;ve been driving Tesla for years, and it changed my life. Better for
        your wallet, better for the planet, and the most fun you&apos;ll ever have
        behind the wheel. Use my referral link and we both win.
      </p>

      {/* Dual CTA buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
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

      {/* Big prominent X follow banner */}
      <a
        href={config.xAccountUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex items-center gap-4 rounded-2xl border border-accent/20 bg-accent/5 px-8 py-5 transition hover:border-accent/40 hover:bg-accent/10"
      >
        <span className="text-lg text-white/50">Follow my Tesla journey &mdash;</span>
        {/* X logo — large and prominent */}
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-accent" aria-label="X">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span className="text-2xl font-bold text-accent sm:text-3xl">{config.xHandle}</span>
      </a>
    </section>
  );
}
