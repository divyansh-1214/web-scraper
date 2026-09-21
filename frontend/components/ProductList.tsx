'use client';

import { useProducts } from '../hooks/useProducts';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ProductGrid from './ProductGrid';
import ScrapePanel from './ScrapePanel';
import type { Product } from '../lib/types';

interface ProductListProps {
  filterCategory?: 'iphone' | 'ipad' | 'macbook' | null;
  pageSize?: number;
  showScraper?: boolean;
  showHeader?: boolean;
  title?: string;
  description?: string;
}

export default function ProductList({
  filterCategory = null,
  pageSize = 20,
  showScraper = true,
  showHeader = true,
  title,
  description,
}: ProductListProps) {
  const { products, loading, error, hasMore, loadMore, refresh } = useProducts({
    size: pageSize,
    filterCategory,
    autoFetch: true,
  });

  const displayCategoryTitle =
    title ??
    (filterCategory
      ? `Apple ${filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)}`
      : 'All Products');

  const handleScrapeComplete = () => {
    refresh();
  };

  return (
    <div className="w-full">
      {showScraper && (
        <div className="mb-10 apple-animate-in">
          <ScrapePanel onComplete={handleScrapeComplete} />
        </div>
      )}

      {showHeader && (
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="apple-eyebrow mb-2">
              {filterCategory ? filterCategory.toUpperCase() : 'CATALOG'}
            </p>
            <h2 className="apple-heading text-3xl md:text-4xl">
              {displayCategoryTitle}
            </h2>
            {description && (
              <p className="text-[15px] text-fg-secondary mt-2 max-w-2xl">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={refresh}
            className="apple-btn apple-btn-ghost self-start md:self-auto"
            disabled={loading}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
              <path d="M1 8a7 7 0 0 1 11.6-5.3M15 8a7 7 0 0 1-11.6 5.3" strokeLinecap="round" />
              <path d="M15 1v5h-5M1 15v-5h5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refresh
          </button>
        </div>
      )}

      {error && (
        <div
          className="mb-8 p-5 rounded-[12px] border"
          style={{
            background: 'rgba(255,59,48,0.08)',
            borderColor: 'rgba(255,59,48,0.20)',
          }}
        >
          <p className="text-sm font-medium text-danger mb-1">Unable to load products</p>
          <p className="text-xs text-fg-secondary">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="mt-3 apple-btn apple-btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            Retry
          </button>
        </div>
      )}

      {loading && products.length === 0 ? (
        <LoadingState count={8} label={`Loading ${displayCategoryTitle.toLowerCase()}`} />
      ) : products.length === 0 ? (
        <EmptyState
          title={`No ${filterCategory ? filterCategory + ' ' : ''}products found`}
          description="Start a scrape to pull the latest listings from Flipkart, or check back in a moment."
          onAction={handleScrapeComplete as unknown as () => void}
        />
      ) : (
        <>
          <ProductGrid products={products as Product[]} />

          {products.length > 0 && (hasMore || loading) && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loading || !hasMore}
                className="apple-btn apple-btn-ghost"
              >
                {loading ? (
                  <>
                    <span className="apple-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Loading more…
                  </>
                ) : hasMore ? (
                  'Load More'
                ) : (
                  'End of list'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
