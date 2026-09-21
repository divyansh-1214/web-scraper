export interface Product {
  _id: string;
  source: string;
  sourceProductId: string;
  title: string;
  brand: string;
  category: 'iPhone' | 'iPad' | 'MacBook' | string;
  specifications: string[];
  imageUrls: string[];
  rating?: number;
  ratingCount: number;
  productUrl: string;
  isAvailable: boolean;
  lastScrapedAt: string | null;
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  message: string;
  data: Product[];
}

export interface ScrapeResultItem {
  success: boolean;
  sourceProductId?: string;
  reason?: string;
  changed?: boolean;
  createdProduct?: Product;
  createdOffer?: unknown;
  details?: unknown;
}

export interface ScrapeResponse {
  result?: ScrapeResultItem[];
  message: string;
}
