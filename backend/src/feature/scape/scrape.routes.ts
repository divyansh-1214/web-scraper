import express, { type Request, type Response } from "express"

const scraperRouter = express.Router();

import { scrape as scrapeService } from '../../lib/scraper/scraper.js';
import { createProduct, transformProduct } from "./scrape.servise.js";

scraperRouter.post("/", async (req: Request, res: Response) => {
  try {
    const scapedData = await scrapeService("https://www.flipkart.com/search?q=macbook&page=1")
    if (scapedData.products.length === 0) return res.status(200).json({ message: "no products found fuck you bitch this does not work" })
    const result = scapedData.products.map((product) => transformProduct(product));
    console.log(result)
    for (const product of result) {
      await createProduct(product)
    }
    res.status(200).json({ result, message: "product created" })
  } catch (error) {
    res.status(500).json({ error: error })
  }
});


scraperRouter.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "ok" })
  } catch (error) {
    res.status(500).json({ message: "you got fucked broooo" })
  }
})
export default scraperRouter;
