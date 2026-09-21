'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getProducts } from '../lib/api-client';
import type { Product } from '../lib/types';

interface UseProductsOptions {
  page?: number;
  size?: number;
  autoFetch?: boolean;
  filterCategory?: string | null;
}

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { page: initialPage = 1, size = 20, autoFetch = true, filterCategory = null } = options;

  const [page, setPage] = useState(initialPage);
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: autoFetch,
    error: null,
    hasMore: true,
  });

  const abortRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(
    async (pageNum: number, reset = false) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();

      await Promise.resolve();
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await getProducts(pageNum, size);
        const raw = res.data || [];
        const filtered = filterCategory
          ? raw.filter((p) => p.category.toLowerCase() === filterCategory.toLowerCase())
          : raw;

        setState((s) => ({
          products: reset ? filtered : [...s.products, ...filtered],
          loading: false,
          error: null,
          hasMore: raw.length >= size,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load products';
        setState((s) => ({ ...s, loading: false, error: message }));
      }
    },
    [size, filterCategory]
  );

  useEffect(() => {
    if (!autoFetch) return undefined;
    const timeoutId = setTimeout(() => {
      fetchProducts(page, true);
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      abortRef.current?.abort();
    };
  }, [autoFetch, page, filterCategory, fetchProducts]);

  const loadMore = useCallback(() => {
    if (state.loading || !state.hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchProducts(next, false);
  }, [page, state.loading, state.hasMore, fetchProducts]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [fetchProducts]);

  return {
    ...state,
    page,
    size,
    loadMore,
    refresh,
    setPage,
  };
}
