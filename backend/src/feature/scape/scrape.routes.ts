import express, { type Request, type Response } from "express"

const scraperRouter = express.Router();

import { scrape as scrapeService } from '../../lib/scraper/scraper.js';
import { createProduct, transformProduct } from "./scrape.servise.js";

scraperRouter.post("/", async (req: Request, res: Response) => {
  try {
    const q = req.query.q
    const page = req.query.page ?? 1;
    const scapedData = await scrapeService(`https://www.flipkart.com/search?q=${q}&page=${page}&p%5B%5D=facets.brand%255B%255D%3DApple`)
    if (scapedData.products.length === 0)
      return res.status(200).json({ message: "no products found fuck you bitch this does not work" })

    const result = scapedData.products.map((product) => {
      return transformProduct({ ...product, createdAt: new Date(), updatedAt: new Date() });
    });
    for (const product of result) {
      if (product) {
        await createProduct({ ...product, createdAt: new Date(), updatedAt: new Date() });
      }
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

scraperRouter.patch("/", async (req: Request, res: Response) => {
  try {
    const q = req.query.q
    const page = req.query.page ?? 1;
    const scapedData = await scrapeService(`https://www.flipkart.com/search?q=${q}&page=${page}`)
    if (scapedData.products.length === 0)
      return res.status(200).json({ message: "no products found fuck you bitch this does not work" })
    const result = scapedData.products.map((product) => transformProduct(product));

  } catch (error) {
    console.log("you are cooked brooo patch ")
    res.status(500).json({ message: "you got fucked broooo" })
  }
})
export default scraperRouter;
