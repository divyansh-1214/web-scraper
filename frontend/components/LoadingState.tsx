interface LoadingStateProps {
  count?: number;
  label?: string;
}

export default function LoadingState({ count = 8, label = 'Loading products' }: LoadingStateProps) {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-3 mb-8">
        <div className="apple-spinner" />
        <p className="text-sm text-fg-secondary">{label}…</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="apple-card overflow-hidden flex flex-col"
            aria-hidden="true"
          >
            <div className="relative w-full aspect-square">
              <div className="apple-skeleton absolute inset-4 rounded-[10px]" />
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <div className="apple-skeleton h-3 w-1/3 rounded-full" />
                <div className="apple-skeleton h-5 w-full rounded-md" />
                <div className="apple-skeleton h-5 w-4/5 rounded-md" />
              </div>
              <div className="apple-skeleton h-3.5 w-full rounded-md" />
              <div className="flex items-center justify-between pt-1">
                <div className="apple-skeleton h-3 w-1/3 rounded-full" />
                <div className="apple-skeleton h-3 w-1/4 rounded-full" />
              </div>
              <div className="apple-skeleton h-4 w-1/3 rounded-full mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
