const axios = require("axios");
const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
app.use(cors());

async function getPageHtml(url, selector = null) {
  const start = new Date();
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  //await page.setRequestInterception(true);

  // page.on("request", (request) => {
  //   const url = request.url();
  //   if (
  //     url.endsWith(".jpg") ||
  //     url.endsWith(".png") ||
  //     url.includes("/static/")
  //   ) {
  //     // Resimleri ve diğer medya dosyalarını engelle
  //     request.abort();
  //   } else {
  //     request.continue();
  //   }
  // });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

  if (selector) {
    //todo msercan : check if not found...
    await page.waitForSelector(selector, { timeout: 30000 });
  }
  // await page.goto(url, { waitUntil: "networkidle2", timeout: 2000 });
  await page.setViewport({ width: 1080, height: 1024 });

  // Sayfanın HTML içeriğini al
  const htmlContent = await page.content();
  await browser.close();

  const end = new Date();
  const duration = end - start; // Millisaniye cinsinden süre
  console.log(`Çalışma süresi: ${duration} ms`);
  return htmlContent;
}

app.get("/api/fetch/kitapyurdu", async (req, res) => {
  try {
    const { query, sortOption } = req.query || {};

    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&sort=p.price&order=DESC";
    }

    const url = `https://www.kitapyurdu.com/index.php?route=product/search&filter_name=${encodeURIComponent(
      query
    )}&filter_in_stock=0&filter_in_shelf=1&fuzzy=0&limit=100${sortQuery}`;

    //console.log("url : " + url);

    // const htmlContent = await getPageHtml(url, "#product-table");
    const htmlContent = await getPageHtml(url, ".search-page");
    // HTML içeriğini yanıt olarak gönder
    res.send(htmlContent);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data: " + error.message);
  }
});

app.get("/api/fetch/hepsiburada", async (req, res) => {
  try {
    const { query, sortOption } = req.query;

    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&siralama=azalanfiyat";
    }

    const url = `https://www.hepsiburada.com/ara?q=${encodeURIComponent(
      query
    )}${sortQuery}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data: " + error.message);
  }
});

app.get("/api/fetch/trendyol", async (req, res) => {
  try {
    const { query, sortOption } = req.query;

    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&sst=PRICE_BY_DESC";
    }

    const url = `https://www.trendyol.com/sr?q=${encodeURIComponent(
      query
    )}&qt=${encodeURIComponent(query)}&st=${encodeURIComponent(
      query
    )}&os=1&pi=1${sortQuery}`;

    //console.log("url : ", url);

    // const htmlContent = await getPageHtml(url, ".prdct-cntnr-wrppr");
    const htmlContent = await getPageHtml(url, "#search-app");

    // HTML içeriğini yanıt olarak gönder
    res.send(htmlContent);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data: " + error.message);
  }
});

app.get("/api/fetch/dr", async (req, res) => {
  try {
    const { query, sortOption } = req.query;

    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&SortOrder=1&SortType=2";
    }

    const url = `https://www.dr.com.tr/search?q=${encodeURIComponent(
      query
    )}&redirect=search${sortQuery}`;

    //console.log("D&R url : ", url);

    const htmlContent = await getPageHtml(
      url,
      "div.facet__products .prd.js-prd-item"
    );
    // HTML içeriğini yanıt olarak gönder
    res.send(htmlContent);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data: " + error.message);
  }
});

app.get("/api/fetch/amazon", async (req, res) => {
  try {
    const { query, sortOption } = req.query;

    let sortQuery = "";
    let ref = "nb_sb_noss";
    if (sortOption === "highPrice") {
      sortQuery = "&s=price-desc-rank";
      ref = "sr_st_price-desc-rank";
    }

    const url = `https://www.amazon.com.tr/s?k=${query}&ref=${ref}${sortQuery}`;

    const htmlContent = await getPageHtml(
      url,
      ".s-main-slot.s-result-list.s-search-results.sg-row"
    );
    // HTML içeriğini yanıt olarak gönder
    res.send(htmlContent);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
