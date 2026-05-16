import siteConfig from "../../config/site.json";

// Typed site configuration — reads from config/site.json at build time.
// Contains referral link, contact info, and CAN-SPAM required fields.
export interface SiteConfig {
  referralLink: string;
  xAccountUrl: string;
  xHandle: string;
  contactEmail: string;
  siteName: string;
  siteUrl: string;
  physicalAddress: string;
  companyName: string;
}

// The siteUrl falls back to the NEXT_PUBLIC_SITE_URL env var if not set in the JSON.
// This lets Vercel's preview URLs work correctly without editing config.
export const config: SiteConfig = {
  ...siteConfig,
  siteUrl: siteConfig.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
