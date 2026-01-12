import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "QuotePilot – Smart Quoting Engine",
  description:
    "QuotePilot is a rule-based quoting engine that helps businesses generate instant, accurate quotes using dynamic questions and pricing logic.",
  keywords: [
    "quoting engine",
    "price calculator",
    "rule based pricing",
    "instant quotes",
    "saas quoting tool",
  ],
  openGraph: {
    title: "QuotePilot – Smart Quoting Engine",
    description: "Build dynamic quote flows and pricing rules with QuotePilot.",
    url: "https://quotepilot.app",
    siteName: "QuotePilot",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QuotePilot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
