import type { ProductResponse, ScrapeResponse } from './types';

const API_BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
    : process.env.API_BASE_URL || 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message || data?.error) {
        message = data.message || String(data.error) || message;
      }
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export async function getHealth(): Promise<{ meeage: string }> {
  return request<{ meeage: string }>('/');
}

export async function getProducts(page: number, size: number): Promise<ProductResponse> {
  const p = Math.max(1, Math.floor(page));
  const s = Math.max(1, Math.min(100, Math.floor(size)));
  return request<ProductResponse>(`/product?page=${p}&size=${s}`);
}

export async function runScrape(query = 'iphone', page = 1): Promise<ScrapeResponse> {
  const q = encodeURIComponent(query || 'iphone');
  return request<ScrapeResponse>(`/scrape?q=${q}&page=${page}`, {
    method: 'POST',
  });
}

export const apiClient = {
  getHealth,
  getProducts,
  runScrape,
};
