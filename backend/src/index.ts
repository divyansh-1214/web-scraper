import express,{ type Express, type Request, type Response} from 'express';
import cors from 'cors';
const app = express();
import { connectDB } from './lib/db.js';
import { configDotenv } from 'dotenv';
import scraperRouter from './feature/scape/scrape.routes.js';
import productRouter from './feature/scape/product/product.routes.js';

configDotenv();
app.use(cors({
  origin: "*"
}))

app.use("/scrape", scraperRouter)
app.use("/product",productRouter)
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({"meeage":" you are the best broooo"})
})

const startServer = async () => {
  try {
    await connectDB();
    await app.listen(3000);
    console.log("http://localhost:3000/")
  } catch (error) {
    console.error(error)
  }
}
startServer()
