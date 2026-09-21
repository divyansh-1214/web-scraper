import Link from 'next/link';
import ProductList from '../../components/ProductList';
import CategoryTabs from '../../components/CategoryTabs';

export const metadata = {
  title: 'iPad — Apple Products Scraper',
  description:
    'Live iPad listings scraped from Flipkart. iPad, iPad Air, iPad Pro, and iPad mini with ratings and availability.',
};

export default function IPadPage() {
  return (
    <>
      <section
        className="relative overflow-hidden w-full bg-bg-secondary"
        style={{ background: 'linear-gradient(180deg, #fbfbfd 0%, #f0f1f4 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-3xl opacity-70"
            style={{
              background:
                'radial-gradient(circle at 50% 100%, rgba(0,113,227,0.12), transparent 60%)',
            }}
          />
        </div>
        <div className="apple-container relative py-24 md:py-32 text-center">
          <p className="apple-eyebrow mb-4" style={{ color: 'rgba(29,29,31,0.55)' }}>
            The iPad Collection
          </p>
          <h1 className="apple-heading text-[44px] md:text-[64px] mb-5 text-fg">
            Lovable. Drawable. Magical.
          </h1>
          <p className="text-[19px] md:text-[22px] max-w-2xl mx-auto mb-8 leading-relaxed text-fg-secondary">
            iPad listings scraped live from Flipkart — ratings, specs, and availability at
            a glance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="#catalog" className="apple-btn apple-btn-primary">
              Shop iPad
            </Link>
            <Link
              href="/products"
              className="apple-link"
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
          filterCategory="ipad"
          pageSize={24}
          showScraper
          title="All iPad Models"
          description="Every iPad currently in the scraped catalog. Run the scraper to pull fresh Flipkart listings including iPad, iPad Air, iPad Pro, and iPad mini."
        />
      </section>
    </>
  );
}
