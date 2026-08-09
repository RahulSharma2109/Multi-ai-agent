import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Content Opportunity Dashboard",
  description:
    "AI-powered dashboard analyzing trending YouTube videos, latest news, and discovering untapped content opportunities using multi-agent AI architecture.",
  keywords: [
    "AI",
    "Content",
    "YouTube",
    "Trending",
    "Dashboard",
    "Opportunities",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background font-sans">
        {children}
      </body>
    </html>
  );
}
