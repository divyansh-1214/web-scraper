import { chromium } from "playwright";

export async function scrape(url: string) {
  const browser = await chromium.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded"
  });
  const html = await page.content();
  const titile = page.locator(".l9NsEV")
  const products = page.locator(".lvJbLV")
  for (let i = 0; i < await products.count(); i++) {
    console.log(
      await products.nth(i).textContent()
    );
    console.log("\n")
  }
  await browser.close()
  return " fuck yoooooooooooooooou"
}
