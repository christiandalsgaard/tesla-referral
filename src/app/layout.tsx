import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO metadata — optimized for social sharing when the referral link is posted.
export const metadata: Metadata = {
  title: "That Tesla Guy | Why Tesla Is the Best Car You'll Ever Own",
  description:
    "Join thousands of Tesla enthusiasts. Get exclusive insights, savings tips, and a referral bonus when you order your Tesla through my link.",
  openGraph: {
    title: "That Tesla Guy | Drive the Future",
    description:
      "Discover why Tesla owners never go back. Get a referral bonus on your order.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
