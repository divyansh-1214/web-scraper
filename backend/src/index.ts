import express from 'express';
import cors from 'cors';
const app = express();
import { scrape } from './script.js';
import mongoose from 'mongoose';
import { connectDB } from './lib/db.js';

app.use(cors({
  origin: "*"
}))

const getData = async () => {
  // const res = await scrape("https://www.flipkart.com/search?q=apple+watch&page=1")
  // const res = await scrape("https://www.flipkart.com/search?q=macbook&page=1")
  const res = await scrape("https://www.flipkart.com/search?q=ipad&sid=tyy%2Chry&as=on&as-show=on&otracker=AS_QueryStore_OrganicAutoSuggest_2_3_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_2_3_na_na_na&as-pos=2&as-type=RECENT&suggestionId=ipad%7CTablets&requestId=2e8d653e-d5a5-4cab-afcf-6ea7d5aa6e0c&as-backfill=on")
  console.log(res)
  return res
}

app.get("/", async (req: any, res: any) => {
  setTimeout(async () => {
  const html = await getData()
  },2000)
  res.json({ "message": "heyyy" })
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
