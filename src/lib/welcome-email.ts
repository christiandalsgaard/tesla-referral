import { config } from "@/lib/config";

// Builds the welcome email HTML sent immediately when someone subscribes.
// No confirmation needed — they're in. The tone is warm, personal, and
// community-focused. Includes an unsubscribe link (CAN-SPAM requirement)
// and the physical address footer.
export function buildWelcomeEmail(unsubscribeToken: string): string {
  const unsubscribeUrl = `${config.siteUrl}/unsubscribe?token=${unsubscribeToken}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, Helvetica, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #ffffff; font-size: 28px; margin: 0;">
        Welcome to the family.
      </h1>
      <div style="width: 60px; height: 3px; background: #cc0000; margin: 16px auto 0;"></div>
    </div>

    <!-- Main content -->
    <div style="background: #1a1a1a; border-radius: 12px; padding: 32px; border: 1px solid #2a2a2a;">
      <p style="color: #e0e0e0; font-size: 16px; line-height: 1.7; margin-top: 0;">
        Hey there — I'm Christian, and I'm genuinely excited you're here.
      </p>

      <p style="color: #e0e0e0; font-size: 16px; line-height: 1.7;">
        You just joined a growing community of Tesla enthusiasts who believe the
        future of driving is electric, intelligent, and just plain fun. Whether
        you already own a Tesla or you're thinking about making the switch — you're
        in the right place.
      </p>

      <p style="color: #e0e0e0; font-size: 16px; line-height: 1.7;">
        Here's what you can expect from me:
      </p>

      <ul style="color: #e0e0e0; font-size: 16px; line-height: 2; padding-left: 20px;">
        <li><strong style="color: #ffffff;">Tesla news that matters</strong> — no fluff, just the updates that actually affect you as an owner or future buyer</li>
        <li><strong style="color: #ffffff;">Real talk</strong> — honest takes on new features, software updates, and what Tesla is doing right (and wrong)</li>
        <li><strong style="color: #ffffff;">Deals and tips</strong> — price changes, tax credits, charging strategies, and ways to get more out of your Tesla</li>
        <li><strong style="color: #ffffff;">Community</strong> — you're not just a subscriber, you're part of something bigger</li>
      </ul>

      <p style="color: #e0e0e0; font-size: 16px; line-height: 1.7;">
        I promise to never spam you. Every email I send will be worth your time.
        If it's not — you can always unsubscribe with one click. No hard feelings.
      </p>

      <p style="color: #e0e0e0; font-size: 16px; line-height: 1.7;">
        In the meantime, come say hi on X. That's where I post daily Tesla news
        and where the community hangs out:
      </p>

      <!-- X follow CTA -->
      <div style="text-align: center; margin: 28px 0;">
        <a href="${config.xAccountUrl}" style="display: inline-block; padding: 14px 36px; background: #1a1a2e; color: #22d3ee; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; border: 1px solid #22d3ee;">
          Follow ${config.xHandle} on X
        </a>
      </div>

      <p style="color: #e0e0e0; font-size: 16px; line-height: 1.7; margin-bottom: 0;">
        Welcome aboard. The future is electric, and it starts now.
      </p>

      <p style="color: #ffffff; font-size: 16px; font-weight: bold; margin-bottom: 0;">
        — Christian<br>
        <span style="color: #999; font-weight: normal;">That Tesla Guy</span>
      </p>
    </div>

    <!-- Footer — CAN-SPAM required: physical address + unsubscribe link -->
    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #2a2a2a;">
      <p style="color: #666; font-size: 12px; line-height: 1.6; margin: 0;">
        ${config.companyName} &middot; ${config.physicalAddress}
      </p>
      <p style="color: #666; font-size: 12px; line-height: 1.6; margin: 8px 0 0;">
        You're receiving this because you signed up at ${config.siteUrl}
      </p>
      <p style="margin: 8px 0 0;">
        <a href="${unsubscribeUrl}" style="color: #666; font-size: 12px; text-decoration: underline;">
          Unsubscribe
        </a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}
