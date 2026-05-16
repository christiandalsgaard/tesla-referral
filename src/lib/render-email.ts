import TeslaPitchEmail from "@/emails/tesla-pitch";
import React from "react";

// Renders the Tesla pitch email template to an HTML string.
// This is extracted into its own file because Next.js 16 blocks direct
// react-dom/server imports in route handlers. We use dynamic import
// of react-dom/server to work around the build-time check.
export async function renderTeslaPitchEmail(props: {
  unsubscribeUrl: string;
  referralLink: string;
  xAccountUrl: string;
  siteUrl: string;
  physicalAddress: string;
  companyName: string;
}): Promise<string> {
  // Dynamic import bypasses the Next.js static analysis that blocks
  // react-dom/server in the App Router. This is safe because route handlers
  // always run on the server.
  const { renderToStaticMarkup } = await import("react-dom/server");

  return renderToStaticMarkup(
    React.createElement(TeslaPitchEmail, props)
  );
}
