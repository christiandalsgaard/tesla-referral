import { config } from "@/lib/config";

// Landing page footer — includes CAN-SPAM required physical address,
// contact email, and links to X account.
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 px-6 py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center text-sm text-white/30">
        <div className="flex gap-6">
          <a
            href={config.xAccountUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white/60"
          >
            Follow on X
          </a>
          <a
            href={`mailto:${config.contactEmail}`}
            className="transition hover:text-white/60"
          >
            Contact
          </a>
        </div>

        <p>
          {config.companyName} &middot; {config.physicalAddress}
        </p>

        <p className="text-xs text-white/20">
          This site contains referral links. When you purchase a Tesla using my link,
          I may receive a referral bonus. This does not affect your price.
        </p>
      </div>
    </footer>
  );
}
