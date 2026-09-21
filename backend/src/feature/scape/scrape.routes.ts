import express, { type Request, type Response } from "express"

const scraperRouter = express.Router();

import { scrape as scrapeService } from '../../lib/scraper/scraper.js';
import { createOffer, createProduct, deleteProduct } from "./scrape.servise.js";

scraperRouter.post("/", async (req: Request, res: Response) => {
  try {
    const q = req.query.q
    const page = req.query.page ?? 1;
    const scapedData = await scrapeService(`https://www.flipkart.com/search?q=${q}&page=${page}&p%5B%5D=facets.brand%255B%255D%3DApple`)
    // const scapedData = await scrapeService(`https://www.flipkart.com/search?q=iphone&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off&as-pos=1&as-type=HISTORY`)
    if (scapedData.products.length === 0)
      return res.status(200).json({ message: "no products found scraper does not work" })

    const result = await Promise.all(scapedData.products.map(async (product) => {
      let createdProduct: any;
      try {
        createdProduct = await createProduct(product);
      } catch (error) {
        console.error("Product creation failed:", error);
        return { success: false, reason: "product_creation_failed", details: error };
      }

      if (createdProduct === null) {
        return { success: false, reason: "invalid_product_data" };
      }

      try {
        const createdOffer = await createOffer(product);
        return { success: true, createdProduct, createdOffer };
      } catch (error) {
        // Rollback: delete the product we just created
        console.error("Offer creation failed, rolling back product:", error);
        await deleteProduct(createdProduct._id);
        return { success: false, reason: "offer_creation_failed_product_rolled_back", details: error };
      }
    }));

    res.status(200).json({ result, message: "product created" })
  } catch (error) {
    res.status(500).json({ error: error })
  }
});


scraperRouter.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "ok" })
  } catch (error) {
    res.status(500).json({ message: "you got cooked broooo" })
  }
})

// scraperRouter.patch("/", async (req: Request, res: Response) => {
//   try {
//     const q = req.query.q
//     const page = req.query.page ?? 1;
//     const scapedData = await scrapeService(`https://www.flipkart.com/search?q=${q}&page=${page}`)
//     if (scapedData.products.length === 0)
//       return res.status(200).json({ message: "no products found fuck you bitch this does not work" })
//     const result = scapedData.products.map((product) => transformProduct(product));

//   } catch (error) {
//     console.log("you are cooked brooo patch ")
//     res.status(500).json({ message: "you got fucked broooo" })
//   }
// })
export default scraperRouter;
