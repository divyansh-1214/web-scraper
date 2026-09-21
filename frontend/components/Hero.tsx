import Link from 'next/link';
import ScrapePanel from './ScrapePanel';

interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  category?: 'all' | 'iphone' | 'ipad' | 'macbook';
  showScraper?: boolean;
  onScrapeComplete?: () => void;
}

export default function Hero({
  eyebrow,
  title,
  subtitle,
  showScraper = true,
  onScrapeComplete,
}: HeroProps) {
  return (
    <section className="apple-hero relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden="true">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle at center, rgba(0,113,227,0.10), transparent 60%)',
          }}
        />
      </div>
      <div className="apple-container relative pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-3xl mx-auto text-center">
          {eyebrow && (
            <p className="apple-eyebrow mb-5 apple-animate-in">{eyebrow}</p>
          )}
          <h1 className="apple-heading text-[40px] md:text-[56px] mb-6 apple-animate-in apple-delay-1">
            {title}
          </h1>
          <p className="text-[19px] md:text-[21px] leading-relaxed text-fg-secondary max-w-2xl mx-auto mb-10 apple-animate-in apple-delay-2">
            {subtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 apple-animate-in apple-delay-2">
            <Link href="/products" className="apple-btn apple-btn-primary">
              Browse All Products
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M3 9L9 3M5 3H9V7" />
              </svg>
            </Link>
            <Link href="/iphone" className="apple-btn apple-btn-secondary">
              Shop iPhone
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M3 9L9 3M5 3H9V7" />
              </svg>
            </Link>
          </div>
          {showScraper && (
            <div className="mt-12">
              <ScrapePanel variant="hero" onComplete={onScrapeComplete} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
