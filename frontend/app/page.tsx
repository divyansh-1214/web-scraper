'use client';

import { useCallback, useState } from 'react';
import Hero from '../components/Hero';
import ProductList from '../components/ProductList';
import CategoryTabs from '../components/CategoryTabs';
import Link from 'next/link';

const featureTiles = [
  {
    label: 'iPhone',
    eyebrow: 'The iPhone Collection',
    title: 'Titanium. So strong. So light. So Pro.',
    description:
      'Explore the latest iPhone lineup with live availability and Flipkart pricing.',
    href: '/iphone',
    bg: 'linear-gradient(180deg, #1d1d1f 0%, #000 100%)',
    fg: '#f5f5f7',
    fgSec: 'rgba(245,245,247,0.68)',
    delay: 'apple-delay-1',
  },
  {
    label: 'iPad',
    eyebrow: 'The iPad Collection',
    title: 'Lovable. Drawable. Magical.',
    description:
      'Browse iPad models from iPad to iPad Pro. Product data updated live.',
    href: '/ipad',
    bg: 'linear-gradient(180deg, #fbfbfd 0%, #eef0f3 100%)',
    fg: '#1d1d1f',
    fgSec: 'rgba(29,29,31,0.68)',
    delay: 'apple-delay-2',
  },
  {
    label: 'MacBook',
    eyebrow: 'MacBook',
    title: 'Supercharged by M-series chips.',
    description:
      'MacBook Air and MacBook Pro listings, pulled live from Flipkart.',
    href: '/macbook',
    bg: 'linear-gradient(180deg, #0a84ff 0%, #006edb 100%)',
    fg: '#ffffff',
    fgSec: 'rgba(255,255,255,0.82)',
    delay: 'apple-delay-3',
  },
];

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleScrapeComplete = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <>
      <Hero
        eyebrow="Apple Products · Live Scraper"
        title="The latest Apple lineup, curated in real time."
        subtitle="A live product catalog for iPhone, iPad, and MacBook — scraped directly from Flipkart and refreshed at the push of a button."
        onScrapeComplete={handleScrapeComplete}
      />

      <CategoryTabs />

      <section className="apple-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {featureTiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className={`apple-card group block overflow-hidden relative apple-animate-in ${tile.delay}`}
              style={{ background: tile.bg, border: 'none' }}
            >
              <div className="p-8 h-full min-h-[280px] flex flex-col">
                <p
                  className="apple-eyebrow mb-3"
                  style={{ color: tile.fgSec }}
                >
                  {tile.eyebrow}
                </p>
                <h3
                  className="apple-heading text-2xl md:text-3xl mb-4"
                  style={{ color: tile.fg }}
                >
                  {tile.title}
                </h3>
                <p className="text-[15px] leading-relaxed mb-6" style={{ color: tile.fgSec }}>
                  {tile.description}
                </p>
                <div className="mt-auto flex items-center gap-1 text-[15px] font-medium">
                  <span style={{ color: tile.fg === '#ffffff' ? '#fff' : '#0071e3' }}>
                    Shop {tile.label}
                  </span>
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                    style={{ color: tile.fg === '#ffffff' ? '#fff' : '#0071e3' }}
                  >
                    <path d="M3 9L9 3M5 3H9V7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <ProductList
          filterCategory={null}
          pageSize={12}
          showScraper
          showHeader
          title="Latest arrivals"
          description="Recently scraped products across every Apple category. Prices and availability subject to change."
          refreshKey={refreshKey}
        />
      </section>
    </>
  );
}
