const cheerio = require("cheerio");
const axios = require("axios");
const mainService = require("./main");
module.exports = { search, fastSearch };

const selectors = {
  waitSelector: "#search-app",
  productsContainer: ".prdct-cntnr-wrppr",
  product: ".p-card-wrppr",
  title: [".prdct-desc-cntnr-name", ".product-desc-sub-text"],
  price: [".prc-box-dscntd"],
  link: "a",
  author: ".no-author-info",
  publisher: ".prdct-desc-cntnr-ttl",
  image: "img.p-card-img",
};
const store = "trendyol";
const storeBaseUrl = "https://www.trendyol.com";

async function search(searchText, sortOption) {
  try {
    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&sst=PRICE_BY_DESC";
    }

    const url = `https://www.trendyol.com/sr?q=${encodeURIComponent(
      searchText
    )}&qt=${encodeURIComponent(searchText)}&st=${encodeURIComponent(
      searchText
    )}&os=1&pi=1${sortQuery}`;

    let products = await mainService.genericSearch(url, store, selectors);

    products = products.map((p) => ({
      ...p,
      link: `${storeBaseUrl}${p.link}`,
    }));

    return { ok: true, data: products };
  } catch (error) {
    console.error("Error fetching data:", error.stack);
    return { ok: false, error: { message: error.message, stack: error.stack } };
  }
}

async function fastSearch(searchText, sortOption) {
  try {
    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&sst=PRICE_BY_DESC";
    }

    const url = `https://www.trendyol.com/sr?q=${encodeURIComponent(
      searchText
    )}&qt=${encodeURIComponent(searchText)}&st=${encodeURIComponent(
      searchText
    )}&os=1&pi=1${sortQuery}`;

    let time = new Date();
    console.log(`--------------------------------------`);
    console.log(
      `İşlem Başlangıç : ${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
    );
    console.log("mağaza : " + store);
    console.log("url oluşturuldu : ", url);
    console.log("url'den veri çekiliyor...");

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);

    const productList = $(
      `${selectors.productsContainer} ${selectors.product}`
    );

    if (productList.length === 0) {
      return { ok: true, data: [] };
    }

    const results = [];

    productList.each((index, el) => {
      const store = "trendyol";

      const title =
        ($(el).find(selectors.title[0]).text() || "").trim() +
        ($(el).find(selectors.title[1]).text() || "").trim();
      let price = ($(el).find(selectors.price[0]).text() || "").trim();

      if (price !== "") {
        price = price.replace("TL", "").replace(/\s+/g, ""); // .replaceAll() eski Node.js sürümlerinde çalışmayabilir
      }

      const link = (
        storeBaseUrl + ($(el).find(selectors.link).attr("href") || "")
      ).trim();

      const writer = "---";
      const publisher = "---";
      const imageSrc = ($(el).find(selectors.image).attr("src") || "").trim();

      const arr = searchText?.split(" ") || [];

      if (price !== "") {
        results.push({
          store,
          publisher,
          title,
          writer,
          price,
          link,
          imageSrc,
        });
      }
    });

    time = new Date();
    console.log(
      `${store} - Kitap bilgileri alındı. Toplam : ${results?.length} kitap`
    );
    console.log(
      `İşlem Bitiş : ${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
    );
    console.log(`--------------------------------------`);

    return { ok: true, data: results };
  } catch (error) {
    console.error("Error fetching data:", error.stack);
    return { ok: false, error: { message: error.message, stack: error.stack } };
  }
}
