const axios = require("axios");
const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
app.use(cors());

app.get("/api/fetch/kitapyurdu", async (req, res) => {
  try {
    const { query, sortOption } = req.query || {};

    console.log("Kitap yurdu query : " + query);
    console.log("Kitap yurdu sortOption : " + sortOption);

    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&sort=p.price&order=DESC";
    }

    const url = `https://www.kitapyurdu.com/index.php?route=product/search&filter_name=${encodeURIComponent(
      query
    )}&filter_in_stock=0&filter_in_shelf=1&fuzzy=0&limit=100${sortQuery}`;

    console.log("url : " + url);

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

    console.log("url : ", url);

    // Puppeteer ile tarayıcıyı başlat ve sayfayı aç
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Sayfanın HTML içeriğini al
    const htmlContent = await page.content();

    await browser.close();

    // HTML içeriğini yanıt olarak gönder
    res.send(htmlContent);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data: " + error.message);
  }
});

app.get("/api/fetch/amazon", async (req, res) => {
  try {
    const { query } = req.query; // URL parametresinden arama terimini al

    console.log("amazon search query : ", query);

    // const url = `https://www.amazon.com.tr/s?k=${encodeURIComponent(query)}`;
    const url =
      "https://www.amazon.com.tr/s?k=Kitap+Hayvan+%C3%87iftli%C4%9Fi+George+Orwell&__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2TX9HNY60R08N&sprefix=kitap+hayvan+%C3%A7iftli%C4%9Fi+george+orwell%2Caps%2C115&ref=nb_sb_noss";

    console.log("url : ", url);

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

app.get("/api/fetch/dr", async (req, res) => {
  try {
    const { query, sortOption } = req.query;

    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&SortOrder=1&SortType=2";
    }

    // const url = `https://www.amazon.com.tr/s?k=${encodeURIComponent(query)}`;
    const url = `https://www.dr.com.tr/search?q=${encodeURIComponent(
      query
    )}&redirect=search${sortQuery}`;

    console.log("D&R url : ", url);

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

app.get("/api/fetch/amazon2", async (req, res) => {
  try {
    const { query, sortOption } = req.query;

    let sortQuery = "";
    let ref = "nb_sb_noss";
    if (sortOption === "highPrice") {
      sortQuery = "s=price-desc-rank";
      ref = "sr_st_price-desc-rank";
    }

    const url = `https://www.amazon.com.tr/s?k=${query}&ref=${ref}`;

    // Puppeteer ile tarayıcıyı başlat ve sayfayı aç
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Sayfanın HTML içeriğini al
    const htmlContent = await page.content();

    await browser.close();

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
