'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '../lib/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  index?: number;
}

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null;
  const pct = Math.max(0, Math.min(5, rating)) / 5;
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} out of 5`}>
      <div className="relative w-[88px] h-3.5">
        <div className="absolute inset-0 text-fg-tertiary flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3.5">
              <path d="M8 0L9.88 6.24L16 6.24L10.88 10.08L12.76 16.32L8 12.48L3.24 16.32L5.12 10.08L0 6.24L6.12 6.24L8 0Z" />
            </svg>
          ))}
        </div>
        <div
          className="absolute inset-0 text-warning overflow-hidden flex gap-0.5"
          style={{ width: `${pct * 100}%` }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3.5 shrink-0">
              <path d="M8 0L9.88 6.24L16 6.24L10.88 10.08L12.76 16.32L8 12.48L3.24 16.32L5.12 10.08L0 6.24L6.12 6.24L8 0Z" />
            </svg>
          ))}
        </div>
      </div>
      <span className="text-xs text-fg-tertiary">{rating.toFixed(1)}</span>
    </div>
  );
}

function formatCount(n: number) {
  if (!n) return '';
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export default function ProductCard({ product, priority = false, index = 0 }: ProductCardProps) {
  const img = product.imageUrls?.[0] ?? '';
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const delayClass =
    index % 6 === 0
      ? 'apple-delay-1'
      : index % 6 === 1
      ? 'apple-delay-2'
      : index % 6 === 2
      ? 'apple-delay-3'
      : index % 6 === 3
      ? 'apple-delay-4'
      : index % 6 === 4
      ? 'apple-delay-5'
      : 'apple-delay-6';

  return (
    <a
      href={product.productUrl || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={`apple-card group block h-full flex flex-col apple-animate-in ${delayClass}`}
      aria-label={`${product.title} - Open on Flipkart`}
      style={{ contain: 'layout paint' }}
    >
      <div className="relative w-full aspect-square bg-bg-secondary overflow-hidden">
        {!imgLoaded && !imgFailed && (
          <div className="absolute inset-0 apple-skeleton m-6 rounded-[10px]" aria-hidden="true" />
        )}
        {img && !imgFailed ? (
          <img
            src={img}
            alt={product.title}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-contain p-6 transition-all duration-500 ease-out group-hover:scale-105 ${
              imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setImgFailed(true);
              setImgLoaded(true);
            }}
          />
        ) : null}
        {imgFailed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-bg-tertiary flex items-center justify-center text-fg-tertiary text-xs">
              No image
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="apple-chip" style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none' }}>
            {product.category || 'Apple'}
          </span>
          {!product.isAvailable && (
            <span
              className="apple-chip"
              style={{ background: 'rgba(255,59,48,0.92)', color: '#fff', border: 'none' }}
            >
              Unavailable
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="apple-eyebrow">Apple {product.category}</p>
          <h3 className="apple-heading text-[17px] leading-[1.25] line-clamp-2 group-hover:text-blue transition-colors">
            {product.title}
          </h3>
        </div>

        {product.specifications && product.specifications.length > 0 && (
          <ul className="text-[13px] leading-relaxed text-fg-secondary flex flex-col gap-1 line-clamp-2">
            {product.specifications.slice(0, 2).map((s, i) => (
              <li key={i} className="truncate">
                &bull; {s}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <StarRating rating={product.rating} />
          {product.ratingCount ? (
            <span className="text-xs text-fg-tertiary">
              {formatCount(product.ratingCount)} ratings
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-blue text-[15px] font-medium">
            View on Flipkart
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
            >
              <path d="M3 9L9 3M5 3H9V7" />
            </svg>
          </div>
          {product.lastScrapedAt && (
            <span className="text-[11px] text-fg-tertiary">
              {new Date(product.lastScrapedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
