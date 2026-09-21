import express,{ type Express, type Request, type Response} from 'express';
import cors from 'cors';
const app = express();
import { connectDB } from './lib/db.js';
import { configDotenv } from 'dotenv';
import scraperRouter from './feature/scape/scrape.routes.js';
import productRouter from './feature/product/product.routes.js';
import morgan from 'morgan';

configDotenv();
app.use(cors({
  origin: process.env.FRONTEND_URL
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use("/scrape", scraperRouter)
app.use("/product",productRouter)
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({"meeage":" you are the best broooo"})
})
const PORT = process.env.PORT;
const startServer = async () => {
  try {
    await connectDB();
    await app.listen(PORT);
    console.log(`http://localhost:${PORT}`)
  } catch (error) {
    console.error(error)
  }
}
startServer()
