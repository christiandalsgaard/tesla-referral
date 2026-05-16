import * as React from "react";

// ============================================================================
// Tesla Pitch Email Template
// ============================================================================
// This is a plain React component that renders an HTML email.
// We use inline styles throughout because email clients don't support
// external CSS or most modern CSS features. Tables and inline styles are
// the only reliable way to get consistent rendering across Gmail, Outlook,
// Apple Mail, Yahoo, etc.
//
// CAN-SPAM compliance:
// - Physical address in footer
// - Unsubscribe link in footer (unique per subscriber via unsubscribeUrl prop)
// - Identifies as promotional content
// - Accurate sender info
// ============================================================================

interface TeslaPitchEmailProps {
  unsubscribeUrl: string;
  referralLink: string;
  xAccountUrl: string;
  siteUrl: string;
  physicalAddress: string;
  companyName: string;
}

export default function TeslaPitchEmail({
  unsubscribeUrl,
  referralLink,
  xAccountUrl,
  siteUrl,
  physicalAddress,
  companyName,
}: TeslaPitchEmailProps) {
  // Shared inline styles — defined once, reused across elements
  const containerStyle: React.CSSProperties = {
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    backgroundColor: "#111111",
    color: "#e0e0e0",
  };

  const headingStyle: React.CSSProperties = {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "32px",
    marginBottom: "12px",
  };

  const paragraphStyle: React.CSSProperties = {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#cccccc",
    marginBottom: "16px",
  };

  const ctaButtonStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "14px 32px",
    backgroundColor: "#cc0000",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "50px",
    fontWeight: "bold",
    fontSize: "16px",
    textAlign: "center" as const,
  };

  const secondaryCtaStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "12px 28px",
    border: "1px solid #333333",
    color: "#22d3ee",
    textDecoration: "none",
    borderRadius: "50px",
    fontWeight: "bold",
    fontSize: "14px",
    textAlign: "center" as const,
  };

  const benefitStyle: React.CSSProperties = {
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#cccccc",
    paddingLeft: "8px",
    marginBottom: "8px",
  };

  const footerStyle: React.CSSProperties = {
    marginTop: "40px",
    padding: "24px",
    borderTop: "1px solid #222222",
    fontSize: "12px",
    color: "#666666",
    textAlign: "center" as const,
    lineHeight: "1.6",
  };

  return (
    <html>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0a0a0a" }}>
        <div style={containerStyle}>
          {/* Header with padding */}
          <div style={{ padding: "32px 24px 0 24px" }}>
            {/* Friendly personal greeting */}
            <p style={{ ...paragraphStyle, fontSize: "18px" }}>
              Hey there! 👋
            </p>

            <p style={paragraphStyle}>
              I&apos;m Christian, and I&apos;ve been a Tesla owner for years now. I&apos;m not
              going to hit you with a hard sell — I just want to share something
              that genuinely made my life better. If you&apos;ve been thinking about
              going electric, grab a coffee and let me walk you through why I
              think Tesla is the move.
            </p>

            {/* Primary CTA — above the fold */}
            <div style={{ textAlign: "center", margin: "28px 0" }}>
              <a href={referralLink} style={ctaButtonStyle}>
                🚗 Get Your Tesla + Referral Bonus →
              </a>
            </div>

            {/* ============================================================ */}
            {/* MONEY — the #1 thing people care about                       */}
            {/* ============================================================ */}
            <h2 style={headingStyle}>💰 The Money Stuff</h2>

            <div style={benefitStyle}>✅ <strong>Save $2,000+/year on gas</strong> — charging at home costs a fraction of gasoline</div>
            <div style={benefitStyle}>✅ <strong>Up to $7,500 federal tax credit</strong> — instant savings on qualifying models</div>
            <div style={benefitStyle}>✅ <strong>No oil changes</strong> — electric motors have almost no maintenance</div>
            <div style={benefitStyle}>✅ <strong>No transmission fluid, spark plugs, or timing belts</strong></div>
            <div style={benefitStyle}>✅ <strong>Brake pads last 100,000+ miles</strong> — regenerative braking does the work</div>
            <div style={benefitStyle}>✅ <strong>Insurance discounts</strong> — highest safety ratings = lower premiums for many</div>
            <div style={benefitStyle}>✅ <strong>Best resale value</strong> — Teslas hold value better than almost any other brand</div>
            <div style={benefitStyle}>✅ <strong>HOV lane access</strong> — skip traffic in many states with an EV sticker</div>
            <div style={benefitStyle}>✅ <strong>Free Supercharging promos</strong> — Tesla runs these regularly for new orders</div>
            <div style={benefitStyle}>✅ <strong>Home charging = no gas station trips</strong> — wake up to a full battery every day</div>

            {/* ============================================================ */}
            {/* PERFORMANCE                                                  */}
            {/* ============================================================ */}
            <h2 style={headingStyle}>🚀 Performance That&apos;ll Make You Grin</h2>

            <div style={benefitStyle}>✅ <strong>0-60 in as fast as 1.99 seconds</strong> — Model S Plaid is the fastest production sedan</div>
            <div style={benefitStyle}>✅ <strong>Instant torque</strong> — no turbo lag, no gear hunting, just GO</div>
            <div style={benefitStyle}>✅ <strong>Dual/tri-motor AWD</strong> — incredible traction in rain and snow</div>
            <div style={benefitStyle}>✅ <strong>Track Mode</strong> — Model 3 Performance is track-ready out of the box</div>
            <div style={benefitStyle}>✅ <strong>Low center of gravity</strong> — the battery pack makes it handle like a go-kart</div>
            <div style={benefitStyle}>✅ <strong>One-pedal driving</strong> — lift off the accelerator and regen braking slows you down</div>
            <div style={benefitStyle}>✅ <strong>Silent power</strong> — whisper quiet at any speed</div>

            {/* Mid-email CTA */}
            <div style={{ textAlign: "center", margin: "28px 0" }}>
              <a href={referralLink} style={ctaButtonStyle}>
                ⚡ Order with My Referral Link →
              </a>
            </div>

            {/* ============================================================ */}
            {/* TECHNOLOGY                                                   */}
            {/* ============================================================ */}
            <h2 style={headingStyle}>🤖 Tech That Keeps Getting Better</h2>

            <div style={benefitStyle}>✅ <strong>Over-the-air updates</strong> — your car improves while you sleep, for free</div>
            <div style={benefitStyle}>✅ <strong>Autopilot included</strong> — lane keeping, adaptive cruise, auto-steer on highways</div>
            <div style={benefitStyle}>✅ <strong>Full Self-Driving option</strong> — city street navigation, auto parking, summon</div>
            <div style={benefitStyle}>✅ <strong>15&quot; touchscreen</strong> — the most intuitive car interface ever made</div>
            <div style={benefitStyle}>✅ <strong>Phone key</strong> — your phone unlocks and starts the car automatically</div>
            <div style={benefitStyle}>✅ <strong>Tesla app</strong> — precondition, locate, lock/unlock from anywhere</div>
            <div style={benefitStyle}>✅ <strong>Voice commands</strong> — &quot;navigate to Costco&quot; or &quot;turn on heated seats&quot;</div>
            <div style={benefitStyle}>✅ <strong>Dashcam + Sentry Mode</strong> — 360° recording, always watching your car</div>
            <div style={benefitStyle}>✅ <strong>Smart Summon</strong> — your car drives to you across a parking lot</div>
            <div style={benefitStyle}>✅ <strong>Netflix, YouTube, Spotify, Steam</strong> — entertainment built right in</div>

            {/* ============================================================ */}
            {/* LIFESTYLE                                                    */}
            {/* ============================================================ */}
            <h2 style={headingStyle}>🌟 Lifestyle Game-Changers</h2>

            <div style={benefitStyle}>✅ <strong>Dog Mode</strong> — keeps your pets comfortable with climate running + screen message</div>
            <div style={benefitStyle}>✅ <strong>Camp Mode</strong> — sleep in your Tesla with AC/heat running all night</div>
            <div style={benefitStyle}>✅ <strong>Bioweapon Defense Mode</strong> — HEPA filter cleans the air in seconds (Model X/S)</div>
            <div style={benefitStyle}>✅ <strong>Frunk (front trunk)</strong> — extra storage where the engine used to be</div>
            <div style={benefitStyle}>✅ <strong>Massive cargo space</strong> — fold-flat seats for hauling anything</div>
            <div style={benefitStyle}>✅ <strong>Glass roof</strong> — panoramic views and an open feel</div>
            <div style={benefitStyle}>✅ <strong>Premium audio</strong> — immersive sound system that rivals brands costing 3x more</div>
            <div style={benefitStyle}>✅ <strong>50,000+ Superchargers</strong> — the world&apos;s largest fast-charging network</div>
            <div style={benefitStyle}>✅ <strong>Supercharger route planning</strong> — nav automatically routes through chargers</div>
            <div style={benefitStyle}>✅ <strong>Destination chargers</strong> — free charging at hotels, restaurants, and malls</div>

            {/* ============================================================ */}
            {/* SAFETY                                                       */}
            {/* ============================================================ */}
            <h2 style={headingStyle}>🛡️ Safest Cars on the Road</h2>

            <div style={benefitStyle}>✅ <strong>5-star NHTSA rating</strong> — across every category, every model</div>
            <div style={benefitStyle}>✅ <strong>Lowest rollover risk</strong> — battery weight keeps the center of gravity low</div>
            <div style={benefitStyle}>✅ <strong>No engine = massive crumple zone</strong> — front trunk absorbs impacts</div>
            <div style={benefitStyle}>✅ <strong>8 cameras + sensors</strong> — 360° awareness at all times</div>
            <div style={benefitStyle}>✅ <strong>Emergency braking</strong> — automatic collision avoidance standard on every Tesla</div>
            <div style={benefitStyle}>✅ <strong>Side collision protection</strong> — reinforced battery pack protects the cabin</div>

            {/* ============================================================ */}
            {/* ENVIRONMENT                                                  */}
            {/* ============================================================ */}
            <h2 style={headingStyle}>🌱 Good for the Planet</h2>

            <div style={benefitStyle}>✅ <strong>Zero tailpipe emissions</strong> — drive 100% guilt-free</div>
            <div style={benefitStyle}>✅ <strong>Solar + Powerwall ecosystem</strong> — power your home AND car from the sun</div>
            <div style={benefitStyle}>✅ <strong>Battery recycling program</strong> — Tesla recycles 92% of battery materials</div>
            <div style={benefitStyle}>✅ <strong>Gigafactory renewable energy</strong> — factories powered by solar and wind</div>

            {/* ============================================================ */}
            {/* RELIABILITY                                                  */}
            {/* ============================================================ */}
            <h2 style={headingStyle}>🔋 Built to Last</h2>

            <div style={benefitStyle}>✅ <strong>Battery lasts 200,000+ miles</strong> — retaining 90%+ capacity</div>
            <div style={benefitStyle}>✅ <strong>Electric motors last 500,000+ miles</strong> — almost nothing to wear out</div>
            <div style={benefitStyle}>✅ <strong>8-year / 120,000 mile battery warranty</strong> — peace of mind included</div>
            <div style={benefitStyle}>✅ <strong>Mobile service</strong> — Tesla technicians come to YOUR location for repairs</div>
            <div style={benefitStyle}>✅ <strong>Minimalist design</strong> — fewer parts = fewer things to break</div>

            {/* Final personal pitch */}
            <p style={{ ...paragraphStyle, marginTop: "28px" }}>
              Look — I could keep going, but you get the picture. Tesla isn&apos;t
              just a car, it&apos;s the future of transportation, and the future is
              already here. I wish someone had told me all this before I spent
              years driving gas cars.
            </p>

            <p style={{ ...paragraphStyle, fontWeight: "bold", color: "#ffffff" }}>
              Use my referral link below and we both get a bonus. It&apos;s a
              win-win. Seriously, you won&apos;t regret it.
            </p>

            {/* Final CTA — the big close */}
            <div style={{ textAlign: "center", margin: "32px 0" }}>
              <a href={referralLink} style={{ ...ctaButtonStyle, padding: "16px 40px", fontSize: "18px" }}>
                🚗 Yes, I Want a Tesla! →
              </a>
            </div>

            <p style={{ ...paragraphStyle, textAlign: "center" }}>
              Your friend in the Tesla community,
              <br />
              <strong style={{ color: "#ffffff" }}>Christian</strong>
            </p>

            {/* X / social follow CTA */}
            <div style={{ textAlign: "center", margin: "24px 0 16px 0" }}>
              <a href={xAccountUrl} style={secondaryCtaStyle}>
                Follow Me on X →
              </a>
            </div>

            <p style={{ ...paragraphStyle, textAlign: "center", fontSize: "14px" }}>
              I post Tesla tips, owner experiences, and deals daily.
            </p>
          </div>

          {/* ============================================================== */}
          {/* CAN-SPAM compliant footer                                      */}
          {/* ============================================================== */}
          <div style={footerStyle}>
            <p style={{ margin: "0 0 8px 0" }}>
              {companyName} &middot; {physicalAddress}
            </p>
            <p style={{ margin: "0 0 8px 0" }}>
              You received this because you signed up at{" "}
              <a href={siteUrl} style={{ color: "#666666" }}>
                {siteUrl}
              </a>
            </p>
            <p style={{ margin: 0 }}>
              <a
                href={unsubscribeUrl}
                style={{ color: "#999999", textDecoration: "underline" }}
              >
                Unsubscribe
              </a>
              {" "}&middot;{" "}
              This email contains referral links. We may receive a bonus when you purchase.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
