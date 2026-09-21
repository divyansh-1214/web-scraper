import { type Request, type Response } from "express";
import { scrape as scrapeService } from '../../lib/scraper/scraper.js';
import { createProduct, transformProduct } from "./scrape.servise.js";

const scrapeController = async (req: Request, res: Response) => {
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
}

export { scrapeController };
