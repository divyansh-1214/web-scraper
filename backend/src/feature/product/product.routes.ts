import express, { type Request, type Response } from "express"
import product from "../../models/product.model.js";
const productRouter = express.Router();

productRouter.get("/", async (req: Request, res: Response) => {
  try {
    const pageNum = Number(req.query.page) || 1;
    const pageSize = Number(req.query.size) || 10;
    const data = await product.find({}).sort({ createdAt: -1 }).skip(pageSize * (pageNum - 1)).limit(pageSize);
    res.status(200).json({
      "message": "heyy",
      "data": data
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ "message": "Internal server error" });
  }
})

export default productRouter;
