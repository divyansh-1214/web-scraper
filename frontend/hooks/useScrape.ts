'use client';

import { useCallback, useRef, useState } from 'react';
import { runScrape } from '../lib/api-client';
import type { ScrapeResponse, ScrapeResultItem } from '../lib/types';

export interface UseScrapeState {
  running: boolean;
  error: string | null;
  lastResult: ScrapeResponse | null;
  summary: {
    total: number;
    created: number;
    updated: number;
    available: number;
    failed: number;
  } | null;
}

function summarize(result: ScrapeResultItem[] = []) {
  let created = 0;
  let updated = 0;
  let available = 0;
  let failed = 0;
  for (const item of result) {
    if (!item.success) {
      failed++;
      continue;
    }
    if (item.createdProduct) created++;
    else if (item.changed) updated++;
    else if (item.reason === 'product_available') available++;
    else available++;
  }
  return {
    total: result.length,
    created,
    updated,
    available,
    failed,
  };
}

export function useScrape() {
  const [state, setState] = useState<UseScrapeState>({
    running: false,
    error: null,
    lastResult: null,
    summary: null,
  });
  const runningRef = useRef(false);

  const start = useCallback(async (query = 'iphone', page = 1) => {
    if (runningRef.current) return null;
    runningRef.current = true;
    setState({
      running: true,
      error: null,
      lastResult: null,
      summary: null,
    });
    try {
      const res = await runScrape(query, page);
      const summary = summarize(res.result);
      setState({
        running: false,
        error: null,
        lastResult: res,
        summary,
      });
      runningRef.current = false;
      return res;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Scrape failed';
      setState({
        running: false,
        error: message,
        lastResult: null,
        summary: null,
      });
      runningRef.current = false;
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      running: false,
      error: null,
      lastResult: null,
      summary: null,
    });
  }, []);

  return { ...state, start, reset };
}
