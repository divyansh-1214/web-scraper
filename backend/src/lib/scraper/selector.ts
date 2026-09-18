// Flipkart's class names are build-hashed and WILL change on their next
// deploy. Keeping them in one file means a breakage is a one-file fix
// instead of a hunt through the scraper logic.
export const SELECTORS = {
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
