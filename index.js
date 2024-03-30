const express = require('express')
const app = express()
const {scrapeLogic} = require('./scrapeLogic')

const PORT = process.env.PORT || 4000

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
})

app.get("/", (req, res) =>{
  res.send('puppeteer-render active')
})

app.listen(PORT, ()=>{
  console.log(`express running on ${PORT}`);
})