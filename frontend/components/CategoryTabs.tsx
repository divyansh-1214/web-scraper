'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const categories = [
  { label: 'All', href: '/products', value: null },
  { label: 'iPhone', href: '/iphone', value: 'iphone' },
  { label: 'iPad', href: '/ipad', value: 'ipad' },
  { label: 'MacBook', href: '/macbook', value: 'macbook' },
];

interface CategoryTabsProps {
  compact?: boolean;
}

export default function CategoryTabs({ compact = false }: CategoryTabsProps) {
  const pathname = usePathname() || '';
  const activeLink =
    categories.find((c) => c.href !== '/products' && pathname.startsWith(c.href))
      ?.href ?? pathname;

  return (
    <div className={`w-full ${compact ? '' : 'border-y border-separator bg-bg/60 backdrop-blur-sm'}`}>
      <div className="apple-container flex items-center gap-1 overflow-x-auto">
        {categories.map((c) => {
          const isActive =
            c.href === activeLink ||
            (c.href === '/products' && (pathname === '/products' || pathname === '/')) ||
            (c.href !== '/products' && pathname?.startsWith(c.href));
          return (
            <Link
              key={c.href}
              href={c.href}
              className={`shrink-0 relative text-sm font-medium transition-colors ${
                compact ? 'py-2 px-3 rounded-full' : 'py-4 px-5'
              } ${
                isActive
                  ? 'text-fg'
                  : 'text-fg-secondary hover:text-fg'
              }`}
            >
              {c.label}
              {isActive && !compact && (
                <span className="absolute left-4 right-4 bottom-0 h-0.5 bg-fg rounded-full" />
              )}
              {isActive && compact && (
                <span className="absolute inset-0 rounded-full bg-bg-secondary -z-10 border border-separator" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
