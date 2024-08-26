const express = require("express");
const kitapyurdu = require("./services/kitapyurdu");
const trendyol = require("./services/trendyol");
const amazon = require("./services/amazon");
const hepsiburada = require("./services/hepsiburada");
const dr = require("./services/dr");
const router = express.Router();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const { executablePath } = require("puppeteer");
const path = require("path");
const mainService = require("./services/main");

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Server is running :)" });
});

router.get("/check", async (req, res) => {
  const url = "https://bot.sannysoft.com/";
  const browser = await createBrowser();

  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: "both.jpg" });
    const screenshotPath = path.join(__dirname, "both.jpg");
    res.sendFile(screenshotPath);
  } finally {
    if (browser) browser.close();
  }
});

async function createBrowser() {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir:
      "C:\\Users\\murat\\AppData\\Local\\Google\\Chrome\\User Data\\Default",
    executablePath: executablePath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // "--disable-gpu",
      // "--disable-software-rasterizer",
    ],
  });

  return browser;
}

router.get("/test", async (req, res) => {
  const startTime = Date.now();

  const { query, sortOption } = req.query || {};

  const url_amazon = amazon.createUrl(query, sortOption);
  const url_trendyol = trendyol.createUrl(query, sortOption);
  const url_kitapyurdu = kitapyurdu.createUrl(query, sortOption);
  // const url_hepsiburada = hepsiburada.createUrl(query, sortOption);
  // const url_dr = dr.createUrl(query, sortOption);

  let browser;
  try {
    browser = await createBrowser();

    const page_amazon = await browser.newPage();
    const page_trendyol = await browser.newPage();
    const page_kitapyurdu = await browser.newPage();
    // const page_hepsiburada = await browser.newPage();
    // const page_dr = await browser.newPage();

    const [amazon_prd, trendyol_prd, kitapyurdu_prd, hepsiburada_res, dr_res] =
      await Promise.all([
        mainService.search_2(
          page_amazon,
          url_amazon,
          "amazon",
          amazon.selectors
        ),
        mainService.search_2(
          page_trendyol,
          url_trendyol,
          "trendyol",
          trendyol.selectors
        ),
        mainService.search_2(
          page_kitapyurdu,
          url_kitapyurdu,
          "kitapyurdu",
          kitapyurdu.selectors
        ),
        hepsiburada.search(query, sortOption),
        dr.fastSearch(query, sortOption),
      ]);

    let hepsiburada_prd = hepsiburada_res.ok ? hepsiburada_res.data : [];
    let dr_prd = dr_res.ok ? dr_res.data : [];

    res.status(200).json({
      products: {
        amazon: amazon_prd,
        trendyol: trendyol_prd,
        kitapyurdu: kitapyurdu_prd,
        hepsiburada: hepsiburada_prd,
        dr: dr_prd,
      },
    });
  } catch (error) {
    res.status(200).json({ error: error.stack });
  } finally {
    if (browser) await browser.close();

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`\n\n### Toplam işlem süresi: ${duration} ms ###\n\n`);
  }
});

router.get("/all", async (req, res) => {
  const { query, sortOption } = req.query || {};
  let data = [];

  // Başlangıç zamanını al
  const startTime = Date.now();

  try {
    let result = await kitapyurdu.search(query, sortOption);
    if (result.ok) {
      data.push({ store: "kitapyurdu", data: result.data });
    }

    result = await amazon.search(query, sortOption);
    if (result.ok) {
      data.push({ store: "amazon", data: result.data });
    }

    result = await trendyol.search(query, sortOption);
    if (result.ok) {
      data.push({ store: "trendyol", data: result.data });
    }

    result = await hepsiburada.search(query, sortOption);
    if (result.ok) {
      data.push({ store: "hepsiburada", data: result.data });
    }

    result = await dr.search(query, sortOption);
    if (result.ok) {
      data.push({ store: "dr", data: result.data });
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`İşlem süresi: ${duration} ms`);

    res.status(200).json({ data: data });
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

router.get("/kitapyurdu", async (req, res) => {
  const { query, sortOption } = req.query || {};
  const result = await kitapyurdu.search(query, sortOption);
  if (result.ok) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(400).json({ ...result.error });
  }
});

router.get("/trendyol", async (req, res) => {
  const { query, sortOption } = req.query || {};
  const result = await trendyol.search(query, sortOption);
  if (result.ok) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(400).json({ ...result.error });
  }
});

router.get("/hepsiburada", async (req, res) => {
  const { query, sortOption } = req.query || {};
  const result = await hepsiburada.search(query, sortOption);
  if (result.ok) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(400).json({ ...result.error });
  }
});

router.get("/amazon", async (req, res) => {
  const { query, sortOption } = req.query || {};
  const result = await amazon.search(query, sortOption);
  if (result.ok) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(400).json({ ...result.error });
  }
});

router.get("/dr", async (req, res) => {
  const { query, sortOption } = req.query || {};
  const result = await dr.fastSearch(query, sortOption);
  if (result.ok) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(400).json({ ...result.error });
  }
});

module.exports = router;
