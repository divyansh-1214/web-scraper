import ProductList from '../../components/ProductList';
import CategoryTabs from '../../components/CategoryTabs';

export const metadata = {
  title: 'All Products — Apple Products Scraper',
  description:
    'Browse every scraped Apple product: iPhone, iPad, and MacBook listings with live availability.',
};

export default function ProductsPage() {
  return (
    <>
      <CategoryTabs />
      <section className="apple-container py-14 md:py-20">
        <ProductList
          filterCategory={null}
          pageSize={24}
          showScraper
          title="All Products"
          description="Everything currently in the scraped catalog. Sorted by most recently added. Use the scraper to refresh the latest listings from Flipkart."
        />
      </section>
    </>
  );
}
