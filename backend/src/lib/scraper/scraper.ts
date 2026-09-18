import { chromium, type Browser } from "playwright";
import { SELECTORS } from "./selector.js";
import { extractProduct } from "./scraper.services.js";
import type { ScrapeResult } from "./scrape.type.js";

const NAV_TIMEOUT_MS = 30_000;
const CARD_WAIT_TIMEOUT_MS = 15_000;

export async function scrape(url: string): Promise<ScrapeResult> {
  const errors: string[] = [];
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({ headless: true });

    // Realistic UA + viewport — default headless fingerprint gets
    // flagged/blocked fast on sites with bot detection. Still not
    // stealth-plugin-grade, but cheap to add.
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      viewport: { width: 1366, height: 768 },
    });

    const page = await context.newPage();
    page.setDefaultTimeout(NAV_TIMEOUT_MS);

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });

    // domcontentloaded fires before Flipkart's client-side grid renders.
    // Wait explicitly for the first card instead of racing it.
    try {
      await page.waitForSelector(SELECTORS.productCard, { timeout: CARD_WAIT_TIMEOUT_MS });
    } catch {
      errors.push("No product cards appeared within timeout — page may be blocked, empty, or layout changed.");
      return { url, scrapedAt: new Date().toISOString(), products: [], errors };
    }

    const cards = page.locator(SELECTORS.productCard);
    const count = await cards.count();

    const products = [];
    for (let i = 0; i < count; i++) {
      const product = await extractProduct(cards.nth(i));
      if (product) {
        products.push(product);
      } else {
        errors.push(`Card at index ${i} could not be parsed — skipped.`);
      }
    }

    return { url, scrapedAt: new Date().toISOString(), products, errors };
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
    return { url, scrapedAt: new Date().toISOString(), products: [], errors };
  } finally {
    // Runs on the success path AND on thrown errors — the original
    // version only closed the browser if nothing threw, leaking a
    // Chromium process on every failure.
    await browser?.close();
  }
}
