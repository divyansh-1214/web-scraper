import Link from 'next/link';
import ProductList from '../../components/ProductList';
import CategoryTabs from '../../components/CategoryTabs';

export const metadata = {
  title: 'MacBook — Apple Products Scraper',
  description:
    'MacBook Air and MacBook Pro listings scraped live from Flipkart. Ratings, specs, and availability in real time.',
};

export default function MacBookPage() {
  return (
    <>
      <section
        className="relative overflow-hidden w-full"
        style={{ background: 'linear-gradient(180deg, #0071e3 0%, #0a84ff 50%, #1d1d1f 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle at center, rgba(255,255,255,0.18), transparent 60%)',
            }}
          />
        </div>
        <div className="apple-container relative py-24 md:py-32 text-center">
          <p className="apple-eyebrow mb-4" style={{ color: 'rgba(255,255,255,0.78)' }}>
            MacBook
          </p>
          <h1 className="apple-heading text-[44px] md:text-[64px] mb-5" style={{ color: '#fff' }}>
            Supercharged by M-series.
          </h1>
          <p className="text-[19px] md:text-[22px] max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
            Live MacBook Air and MacBook Pro listings from Flipkart, complete with
            ratings, specifications, and real-time availability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#catalog"
              className="apple-btn"
              style={{ background: '#ffffff', color: '#0071e3' }}
            >
              Shop MacBook
            </Link>
            <Link
              href="/products"
              className="text-[15px] font-medium flex items-center gap-1"
              style={{ color: '#fff' }}
            >
              See all products
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M3 9L9 3M5 3H9V7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <CategoryTabs />

      <section id="catalog" className="apple-container py-14 md:py-20">
        <ProductList
          filterCategory="macbook"
          pageSize={24}
          showScraper
          title="All MacBook Models"
          description="MacBook Air and MacBook Pro listings in the catalog. Run the scraper to refresh Flipkart data with the latest availability."
        />
      </section>
    </>
  );
}
