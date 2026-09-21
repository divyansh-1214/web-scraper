import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Apple Products — Scraper Showcase",
  description:
    "Browse the latest Apple products — iPhone, iPad, MacBook. Curated via live scraping with real-time availability.",
  keywords: ["Apple", "iPhone", "iPad", "MacBook", "Products", "Scraper"],
  openGraph: {
    title: "Apple Products — Scraper Showcase",
    description:
      "Browse the latest Apple products with live-scraped listings.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-bg text-fg antialiased">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
