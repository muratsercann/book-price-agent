const axios = require("axios");
const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
app.use(cors());

app.get("/api/fetch/kitapyurdu", async (req, res) => {
  try {
    const { query } = req.query; // URL parametresinden arama terimini al

    const url = `https://www.kitapyurdu.com/index.php?route=product/search&filter_name=${encodeURIComponent(
      query
    )}&filter_in_stock=0&filter_in_shelf=1&fuzzy=0&limit=100`;

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

app.get("/api/fetch/hepsiburada", async (req, res) => {
  try {
    const { query } = req.query; // URL parametresinden arama terimini al

    console.log("search query : ", query);

    const url = `https://www.hepsiburada.com/ara?q=${encodeURIComponent(
      query
    )}&siralama=azalanfiyat`;
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
    const { query } = req.query; // URL parametresinden arama terimini al

    console.log("search query : ", query);

    const url = `https://www.trendyol.com/sr?q=${encodeURIComponent(
      query
    )}&qt=${encodeURIComponent(query)}&st=${encodeURIComponent(
      query
    )}&os=1&pi=1&sst=PRICE_BY_DESC`;

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
    const { query } = req.query; // URL parametresinden arama terimini al

    console.log("dr search query : ", query);

    // const url = `https://www.amazon.com.tr/s?k=${encodeURIComponent(query)}`;
    const url = `https://www.dr.com.tr/search?q=${encodeURIComponent(
      query
    )}&redirect=search&SortOrder=1&SortType=2`;

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

app.get("/scrape", async (req, res) => {
  // const url = req.query.url; // URL'yi sorgu parametresinden al

  const url =
    "https://www.trendyol.com/sr?q=Hayvan%20%C3%87iftli%C4%9Fi&qt=Hayvan%20%C3%87iftli%C4%9Fi&st=Hayvan%20%C3%87iftli%C4%9Fi&os=1";
  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    // Sayfayı scroll yapma işlemi
    await page.evaluate(async () => {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const scrollTwice = async () => {
        const distance = window.innerHeight; // Her seferinde kaydırılacak mesafe
        const delayTime = 400; // Her kaydırma arasındaki bekleme süresi

        // İlk kaydırma
        window.scrollBy(0, distance);
        await delay(delayTime);

        // // İkinci kaydırma
        // window.scrollBy(0, distance);
        // await delay(delayTime);
      };
      await scrollTwice();
    });

    // İçeriği çek
    const content = await page.content();
    await browser.close();

    res.send(content);
  } catch (error) {
    res.status(500).send("Error occurred while scraping");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
