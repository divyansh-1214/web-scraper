import express from 'express';
import cors from 'cors';
const app = express();
import { scrape } from './script.js';

app.use(cors({
  origin: "*"
}))

const getData = async () => {
  // const res = await scrape("https://www.flipkart.com/search?q=apple+watch&page=1")
  const res = await scrape("https://www.flipkart.com/search?q=macbook&page=1")
  console.log(res)
  return res
}

app.get("/", async (req: any, res: any) => {
  const html = await getData()
  res.json({ "message": "heyyy", "products": html })
})

const startServer = async () => {
  try {
    await app.listen(3000);
    console.log("http://localhost:3000/")
  } catch (error) {
    console.error(error)
  }
}
startServer()
