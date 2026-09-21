interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No products yet',
  description = 'Start a scrape session to pull the latest Apple products from our data source.',
  actionLabel = 'Run Scraper',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="w-full py-24 px-6 flex flex-col items-center justify-center text-center apple-animate-in">
      <div
        className="w-20 h-20 rounded-full bg-bg-secondary flex items-center justify-center mb-6 border border-separator"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-9 h-9 text-fg-tertiary">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </div>
      <h3 className="apple-heading text-2xl mb-2">{title}</h3>
      <p className="text-[15px] text-fg-secondary max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="apple-btn apple-btn-primary"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M8 3v10M3 8h10" strokeLinecap="round" />
          </svg>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
