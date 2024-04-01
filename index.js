const express = require('express') // Adding Express
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer') // Adding Puppeteer
const fs = require('fs')
const env = require('dotenv').config().parsed

const app = express()
app.use(bodyParser.json({ extended: true }))

app.use("/screencaps", express.static('./screencaps'))

app.post('/capture', async (req, res) => {
    
  const captureConfig = req.body.captureConfig;
  const auth = req.body.auth

  //if (auth.apiKey !== env.API_KEY) {
  //  res.send(401)
  //  return
  //}

  if (!captureConfig.url) {
    res.sendStatus(400)
    return
  }

  try {
    const buffer = await capture(captureConfig)
    res.contentType('png')
    res.send(buffer)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }*
})

const sleep = m => new Promise(r => setTimeout(r, m))

async function capture(captureConfig, res) {

  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote"
    ],
    executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
  });

  let buffer;
  
  try {
    const page = await browser.newPage()
    const width = captureConfig.width || 1920
    const height = captureConfig.height || 1080

    await page.setViewport({ width, height })
    await page.goto(captureConfig.url)

    if (captureConfig.sleepBeforeCapture) {
      await sleep(config.sleepBeforeCapture)
    }

    if (captureConfig.waitForSelector) {
      await page.waitForSelector(captureConfig.waitForSelector)
    }

    buffer = await page.screenshot({
      type: 'png',
      omitBackground: true
    })
  
    page.close()  

  } catch (err) {
    console.log(`Error: ${err.message}`)
    res.send(500);
    throw err
  } finally {
    await browser.close()
  }

  return buffer
}

app.listen(7000, function() {
  console.log('Application running on port 7000.');
});
