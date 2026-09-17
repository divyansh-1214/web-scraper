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
  // const titile = page.locator(".l9NsEV")
  // const products = page.locator(".lvJbLV")
  // for (let i = 0; i < await products.count(); i++) {
  //   const product = products.nth(i).locator(".nZIRY7").locator(".jIjQ8S").locator("a").locator(".ZFwe0M").locator(".col").locator("RG5Slk")
  //   // const title = product?.locator("")
  //   const name = await product.textContent()
  //   console.log(name)
  //   console.log("\n")
  // }
  //
  const products = page.locator(".jIjQ8S");

  const count = await products.count();

  for (let i = 0; i < count; i++) {
    const product = products.nth(i);

    const name = await product
      .locator(".RG5Slk")
      .textContent();

    console.log(name?.trim());
  }
  await browser.close()
  return " fuck yoooooooooooooooou"
}
