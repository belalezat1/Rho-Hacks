import type { Metadata } from "next";
import { Bodoni_Moda, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const wordmark = Bodoni_Moda({
  variable: "--font-wordmark",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ui = Hanken_Grotesk({
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
  title: "Pilot — talk to your money like a CFO",
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
      <body className="min-h-full flex flex-col text-[15px] leading-relaxed">
        {children}
      </body>
    </html>
  );
}
