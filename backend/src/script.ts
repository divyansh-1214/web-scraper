import { chromium } from "playwright";

export async function scrape(url: string) {
  const browser = await chromium.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded"
  });
  const products = page.locator(".jIjQ8S");

  const count = await products.count();

  for (let i = 0; i < count; i++) {
    const product = products.nth(i);
    const name = await product.locator(".RG5Slk").textContent();
    const discription = await product.locator(".CMXw7N").textContent()
    const value = await product.locator(".DTBslk").first().textContent()
    const img = await product.locator(".lWX0_T").locator("img").getAttribute("src")
    console.log(name?.trim());
    console.log(discription?.trim());
    console.log(value?.trim())
    console.log(img?.trim())
    console.log("\n");
  }
  await browser.close()
  return " fuck yoooooooooooooooou"
}
