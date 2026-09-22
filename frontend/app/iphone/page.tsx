import Link from 'next/link';
import ProductList from '../../components/ProductList';
import CategoryTabs from '../../components/CategoryTabs';

export const metadata = {
  title: 'iPhone — Apple Products Scraper',
  description:
    'The latest iPhone listings scraped live from Flipkart. Compare titles, ratings, and availability.',
};

export default function IPhonePage() {
  return (
    <>
      <section
        className="relative overflow-hidden w-full"
        style={{ background: 'linear-gradient(180deg, #0b0b0d 0%, #000 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl opacity-60"
            style={{
              background:
                'radial-gradient(circle at center, rgba(175,82,222,0.18), transparent 60%)',
            }}
          />
        </div>
        <div className="apple-container relative py-24 md:py-32 text-center">
          <p className="apple-eyebrow mb-4" style={{ color: 'rgba(245,245,247,0.6)' }}>
            Introducing iPhone
          </p>
          <h1 className="apple-heading text-[44px] md:text-[64px] mb-5" style={{ color: '#f5f5f7' }}>
            Titanium. So Pro.
          </h1>
          <p className="text-[19px] md:text-[22px] max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: 'rgba(245,245,247,0.72)' }}>
            Live-scraped iPhone listings from Flipkart with ratings, specifications, and
            real-time availability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="#catalog" className="apple-btn apple-btn-primary">
              Shop iPhone
            </Link>
            <Link
              href="/products"
              className="text-[15px] font-medium flex items-center gap-1"
              style={{ color: '#2997ff' }}
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
          filterCategory="iPhone"
          pageSize={24}
          showScraper
          title="All iPhone Models"
          description="iPhone listings currently in the catalog. Hit the scraper to pull the latest from Flipkart with up-to-date availability."
        />
      </section>
    </>
  );
}
