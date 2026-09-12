import type { Metadata } from "next";
import { IBM_Plex_Mono, Libre_Caslon_Text, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/** Rho marketing logo ≈ classic Caslon serif - soft contrast, not harsh Didone. */
const wordmark = Libre_Caslon_Text({
  variable: "--font-wordmark",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/**
 * Rho product UI ≈ soft geometric sans (Graphik / circular family).
 * Plus Jakarta Sans is the closest Google Font: open counters, even weight, not harsh.
 */
const ui = Plus_Jakarta_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Pilot: talk to your money like a CFO",
  description:
    "Talk to Pilot like a CFO. Live liquidity intelligence on Rho you can brief in minutes. Decision support, not advice.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${wordmark.variable} ${ui.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-base leading-relaxed">
        {children}
      </body>
    </html>
  );
}
