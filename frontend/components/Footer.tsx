import Link from 'next/link';

const columns = [
  {
    title: 'Shop and Learn',
    links: [
      { label: 'Store', href: '/' },
      { label: 'iPhone', href: '/iphone' },
      { label: 'iPad', href: '/ipad' },
      { label: 'MacBook', href: '/macbook' },
      { label: 'All Products', href: '/products' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Manage Your Products', href: '/products' },
      { label: 'Track Scrape Jobs', href: '/products' },
    ],
  },
  {
    title: 'About This Project',
    links: [
      { label: 'Data Sources', href: '/products' },
      { label: 'Privacy Notice', href: '/' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-separator mt-24">
      <div className="apple-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <p className="text-xs font-semibold tracking-wide text-fg mb-4">
              Apple Products Scraper
            </p>
            <p className="text-xs leading-relaxed text-fg-secondary max-w-[220px]">
              Live-scraped listings of the latest Apple hardware from
              Flipkart. Prices and availability may change.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold tracking-wide text-fg mb-4">
                {col.title}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-xs text-fg-secondary hover:text-fg transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="apple-divider my-8" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-fg-tertiary">
          <p>
            © {new Date().getFullYear()} Apple Products Scraper. Not affiliated
            with Apple Inc. All trademarks belong to their respective owners.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/products" className="hover:text-fg transition-colors">
              Products
            </Link>
            <span className="opacity-40">|</span>
            <Link href="/" className="hover:text-fg transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
