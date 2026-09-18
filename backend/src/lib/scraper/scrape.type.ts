export interface ScrapedProduct {
  sourceProductId: string | null;
  title: string | null;
  specifications: string[];
  imageUrl: string | null;
  price: string[];
  rating: string | null;
  ratingCount: string | null;
  productUrl: string | null;
  isAvailable: boolean;
}

export interface ScrapeResult {
  url: string;
  scrapedAt: string;
  products: ScrapedProduct[];
  errors: string[];
}
