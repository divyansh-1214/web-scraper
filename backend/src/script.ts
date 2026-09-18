import { chromium,Locator } from "playwright";

export async function scrape(url: string) {
  const browser = await chromium.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded"
  });
  const products = page.locator(".nZIRY7");
  const count = await products.count();

  for (let i = 0; i < count; i++) {
    const product = products.nth(i);
    const sourceProductId = await product.locator("div").first().getAttribute("data-id");
    const title = product.locator(".RG5Slk");
    // const category
    const specifications = await product.locator(".HwRTzP").locator(".DTBslk").allTextContents()
    const imageUrls = await product.locator(".lWX0_T").locator("img").first().getAttribute("src")
    const value = await product.locator(".QiMO5r").locator("div").allTextContents()
    const rating = product.locator(".MKiFS6");
    const ratingCount = product.locator(".PvbNMB").locator("span").locator("span").first()
    const productUrl = await product.locator(".k7wcnx").getAttribute("href")
    const isAvailable = product.locator(".fRrrYo")
    console.log(sourceProductId?.trim())
    // console.log(title?.trim());
    if (await validateElement(title)) {
      console.log(await title.textContent())
    } else {
      console.log("no title found")
    }
    console.log(specifications)
    console.log(value)
    console.log(imageUrls?.trim())
    if (await rating.isVisible()) {
      console.log(await rating.textContent())
    } else {
      console.log("no rating found")
    }
    // console.log(ratingCount?.trim())
    if (await ratingCount.isVisible()) {
      console.log(await ratingCount.textContent())
    } else {
      console.log("no rating found")
    }
    console.log(`https://www.flipkart.com${productUrl?.trim()}`)
    if ((await isAvailable.isVisible())) {
      console.log("Not Available")
    } else {
      console.log("Available")
    }
    console.log("\n");
  }
  await browser.close()
  return " fuck yoooooooooooooooou"
}



async function validateElement(locator: Locator): Promise<string | null> {
  if ((await locator.count()) === 0) return null;
    const text = await locator.textContent();
    return text?.trim() ?? null;
}
