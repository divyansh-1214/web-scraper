'use client';

import { useScrape } from '../hooks/useScrape';

interface ScrapePanelProps {
  onComplete?: () => void;
  variant?: 'inline' | 'hero';
}

const presets = [
  { label: 'iPhone', query: 'iphone' },
  { label: 'iPad', query: 'ipad' },
  { label: 'MacBook', query: 'macbook' },
];

export default function ScrapePanel({ onComplete, variant = 'inline' }: ScrapePanelProps) {
  const scrape = useScrape();

  const handleRun = async (query: string) => {
    const res = await scrape.start(query, 1);
    if (res && onComplete) {
      // short delay to let mongo commit
      setTimeout(() => onComplete(), 600);
    }
  };

  const summary = scrape.summary;

  if (variant === 'hero') {
    return (
      <div className="w-full apple-animate-in apple-delay-3">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleRun('iphone')}
            disabled={scrape.running}
            className="apple-btn apple-btn-primary"
          >
            {scrape.running ? (
              <>
                <span className="apple-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Scraping…
              </>
            ) : (
              <>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M1 1h4l2.29 5.22a1 1 0 0 1-.38 1.21L5.1 9.14a6 6 0 1 0 2.11-4.07" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="13" cy="13" r="1.2" />
                </svg>
                Scrape Latest Products
              </>
            )}
          </button>
        </div>

        {scrape.error && (
          <p className="mt-4 text-sm text-danger text-center">{scrape.error}</p>
        )}

        {summary && (
          <div className="mt-8 max-w-2xl mx-auto apple-card p-6 apple-animate-in">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-fg">Scrape complete</p>
              <span className="apple-chip" style={{ background: 'rgba(48,209,88,0.16)', color: 'var(--apple-success)', border: 'none' }}>
                {summary.total} items
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold apple-heading">{summary.created}</p>
                <p className="text-xs text-fg-tertiary mt-1">New</p>
              </div>
              <div>
                <p className="text-2xl font-semibold apple-heading">{summary.updated}</p>
                <p className="text-xs text-fg-tertiary mt-1">Updated</p>
              </div>
              <div>
                <p className="text-2xl font-semibold apple-heading">{summary.available}</p>
                <p className="text-xs text-fg-tertiary mt-1">Unchanged</p>
              </div>
              <div>
                <p className="text-2xl font-semibold apple-heading text-danger">{summary.failed}</p>
                <p className="text-xs text-fg-tertiary mt-1">Failed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="apple-card p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <p className="apple-eyebrow mb-1">Live Data</p>
          <h3 className="apple-heading text-xl">Sync product catalog</h3>
          <p className="text-sm text-fg-secondary mt-1">
            Pull the latest listings from Flipkart. This may take a few seconds.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleRun('iphone')}
          disabled={scrape.running}
          className="apple-btn apple-btn-primary shrink-0"
        >
          {scrape.running ? (
            <>
              <span className="apple-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              Running…
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M1 1h4l2.29 5.22a1 1 0 0 1-.38 1.21L5.1 9.14a6 6 0 1 0 2.11-4.07" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="13" cy="13" r="1.2" />
              </svg>
              Start Scrape
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-fg-tertiary mr-1">Quick scrape:</span>
        {presets.map((p) => (
          <button
            key={p.query}
            type="button"
            onClick={() => handleRun(p.query)}
            disabled={scrape.running}
            className="apple-chip hover:text-fg hover:bg-card-hover transition-colors cursor-pointer disabled:opacity-50"
          >
            {p.label}
          </button>
        ))}
      </div>

      {scrape.error && (
        <div className="mt-5 p-4 rounded-[12px]" style={{ background: 'rgba(255,59,48,0.10)', border: '1px solid rgba(255,59,48,0.20)' }}>
          <p className="text-sm text-danger font-medium mb-1">Scrape failed</p>
          <p className="text-xs text-fg-secondary">{scrape.error}</p>
        </div>
      )}

      {summary && (
        <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-fg-tertiary">Total</p>
            <p className="text-xl font-semibold mt-0.5">{summary.total}</p>
          </div>
          <div>
            <p className="text-xs text-fg-tertiary">Created</p>
            <p className="text-xl font-semibold mt-0.5 text-success">{summary.created}</p>
          </div>
          <div>
            <p className="text-xs text-fg-tertiary">Updated</p>
            <p className="text-xl font-semibold mt-0.5 text-blue">{summary.updated}</p>
          </div>
          <div>
            <p className="text-xs text-fg-tertiary">Available</p>
            <p className="text-xl font-semibold mt-0.5 text-fg-secondary">{summary.available}</p>
          </div>
          <div>
            <p className="text-xs text-fg-tertiary">Failed</p>
            <p className="text-xl font-semibold mt-0.5 text-danger">{summary.failed}</p>
          </div>
        </div>
      )}
    </div>
  );
}
