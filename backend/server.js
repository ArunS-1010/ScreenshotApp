// server.js
const express = require('express')
const puppeteer = require('puppeteer')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.post('/screenshot', async (req, res) => {
  const { urls, tab, orientation } = req.body
  const screenshots = {}

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const viewports = {
      mobile: { width: 380, height: 740 },
      tablet: { width: 768, height: 1024 },
      tv: { width: 1920, height: 1080 },
      wearOS: { width: 454, height: 454 },
    }

    if (orientation === 'landscape' && (tab === 'mobile' || tab === 'tablet')) {
      const temp = viewports[tab].width
      viewports[tab].width = viewports[tab].height
      viewports[tab].height = temp
    }

    for (const url of urls) {
      const page = await browser.newPage()
      await page.setViewport(viewports[tab])
      await page.goto(url, { waitUntil: 'networkidle2' })
      const screenshot = await page.screenshot({ encoding: 'base64' })
      screenshots[url] = { [tab]: screenshot }
      await page.close()
    }

    await browser.close()
    res.json(screenshots)
  } catch (error) {
    console.error('Error taking screenshots:', error)
    res.status(500).json({ error: 'Failed to take screenshots' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
