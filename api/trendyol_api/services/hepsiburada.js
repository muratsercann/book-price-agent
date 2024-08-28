const cheerio = require("cheerio");
const axios = require("axios");
const mainService = require("./main");

const selectors = {
  waitSelector: ".content-wrapper",
  productsContainer: 'ul[class^="productListContent"]',
  product: 'li[class^="productListContent"]',
  title: ['[data-test-id="product-card-name"]'],
  price: '[data-test-id="price-current-price"]',
  link: "a",
  author: ".no-author-info",
  publisher: ".prdct-desc-cntnr-ttl",
  image: "img",
};
const store = "hepsiburada";
const storeBaseUrl = "https://www.hepsiburada.com";

async function search(searchText, sortOption) {
  const startTime = Date.now();
  try {
    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&siralama=azalanfiyat";
    }

    const url = `https://www.hepsiburada.com/ara?q=${encodeURIComponent(
      searchText
    )}${sortQuery}`;

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

    const productList = $('li[class^="productListContent"]');

    if (productList.length === 0) {
      return { ok: true, data: [] };
    }

    const results = [];

    productList.each((index, el) => {
      const store = "hepsiburada";

      const title = ($(el).find(selectors.title).text() || "-").trim();

      let price = ($(el).find(selectors.price).text() || "-").trim();

      if (price !== "-") {
        price = price.replace("TL", "").replace(/\s+/g, ""); // .replaceAll() eski Node.js sürümlerinde çalışmayabilir
      }

      const link = (storeBaseUrl + ($(el).find("a").attr("href") || "")).trim();

      const writer = "-";
      const publisher = "-";

      const imageString = ($(el).find("noscript").text() || "").trim();
      const srcMatch = imageString.match(/src="([^"]+)"/);
      const imageSrc = srcMatch ? srcMatch[1] : "";

      if (price !== "-") {
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
      `${store} işlem bitiş : ${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
    );
    console.log(`--------------------------------------`);

    return { ok: true, data: results };
  } catch (error) {
    console.error("Error fetching data:", error.stack);
    return { ok: false, error: { message: error.message, stack: error.stack } };
  } finally {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`### ${store} işlem süresi: ${duration} ms`);
  }
}
async function search2(searchText, sortOption) {
  let startTime = Date.now();
  try {
    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&siralama=azalanfiyat";
    }

    const url = `https://www.hepsiburada.com/ara?q=${encodeURIComponent(
      searchText
    )}${sortQuery}`;

    let products = await mainService.search(url, store, selectors);

    return { ok: true, data: products };
  } catch (error) {
    console.error("Error fetching data:", error.stack);
    return { ok: false, error: { message: error.message, stack: error.stack } };
  } finally {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`### ${store} işlem süresi: ${duration} ms`);
  }
}

module.exports = { search, search2, selectors, store, storeBaseUrl };
