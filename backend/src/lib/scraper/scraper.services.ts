import type { Locator } from "playwright";
import type { ScrapedProduct } from "./scrape.type.js";

// Flipkart's class names are build-hashed and WILL change on their next
// deploy. Keeping them in one file means a breakage is a one-file fix
// instead of a hunt through the scraper logic.
const SELECTORS = {
  productCard: ".nZIRY7",
  idHolder: "div", // first child div carrying data-id — fragile, see extract.ts note
  title: ".RG5Slk",
  specContainer: ".HwRTzP",
  specItem: ".DTBslk",
  imageContainer: ".lWX0_T",
  image: "img",
  priceContainer: ".QiMO5r",
  priceItem: "div",
  rating: ".MKiFS6",
  ratingCount: ".PvbNMB",
  productLink: ".k7wcnx",
  outOfStockBadge: ".fRrrYo", // presence = NOT available (inverted, name carefully)
} as const;

/**
 * Returns trimmed text, or null if the locator matches nothing.
 * Use count() (not isVisible()) for "does this optional field exist" —
 * isVisible() answers a different question (hidden-but-present elements
 * read as false, and it doesn't distinguish "missing" from "hidden").
 */
async function safeText(locator: Locator): Promise<string | null> {
  if ((await locator.count()) === 0) return null;
  const text = await locator.textContent();
  return text?.trim() ?? null;
}

async function safeAttr(locator: Locator, attr: string): Promise<string | null> {
  if ((await locator.count()) === 0) return null;
  const value = await locator.getAttribute(attr);
  return value?.trim() ?? null;
}

async function safeAllText(locator: Locator): Promise<string[]> {
  if ((await locator.count()) === 0) return [];
  const values = await locator.allTextContents();
  return values.map((v) => v.trim()).filter(Boolean);
}

/**
 * Extracts one product card. Never throws — a single malformed card
 * (ad slot, sponsored placement, layout drift) returns null instead of
 * killing the whole scrape.
 */
export async function extractProduct(card: Locator): Promise<ScrapedProduct | null> {
  try {
    const sourceProductId = await safeAttr(card.locator(SELECTORS.idHolder).first(), "data-id");
    const title = await safeText(card.locator(SELECTORS.title));
    const specifications = await safeAllText(
      card.locator(SELECTORS.specContainer).locator(SELECTORS.specItem)
    );
    const imageUrl = await safeAttr(
      card.locator(SELECTORS.imageContainer).locator(SELECTORS.image).first(),
      "src"
    );
    const price = await safeAllText(card.locator(SELECTORS.priceContainer).locator(SELECTORS.priceItem));
    const rating = await safeText(card.locator(SELECTORS.rating));
    const ratingCount = await safeText(
      card.locator(SELECTORS.ratingCount).locator("span").locator("span").first()
    );
    const relativeUrl = await safeAttr(card.locator(SELECTORS.productLink), "href");
    const productUrl = relativeUrl ? `https://www.flipkart.com${relativeUrl}` : null;

    // .fRrrYo is an "out of stock" badge — its PRESENCE means unavailable.
    const isAvailable = (await card.locator(SELECTORS.outOfStockBadge).count()) === 0;

    // A card with no title and no id is almost certainly an ad slot or
    // layout noise, not a real product — skip it rather than record junk.
    if (!title && !sourceProductId) return null;
    return {
      sourceProductId,
      title,
      specifications,
      imageUrl,
      price,
      rating,
      ratingCount,
      productUrl,
      isAvailable,
    };
  } catch (err) {
    // Any unexpected locator failure on this ONE card should not abort
    // the rest of the scrape.
    return null;
  }
}
