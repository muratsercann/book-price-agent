const mainService = require("./main");
const cheerio = require("cheerio");
const axios = require("axios");

module.exports = { search };

const selectors = {
  waitSelector: ".content-wrapper",
  productsContainer: 'ul[class^="productListContent"]',
  product: 'li[class^="productListContent"]',
  title: '[data-test-id="product-card-name"]',
  price: '[data-test-id="price-current-price"]',
  link: "a",
  author: ".no-author-info",
  publisher: ".prdct-desc-cntnr-ttl",
  image: "img",
};
const store = "hepsiburada";
const storeBaseUrl = "https://www.hepsiburada.com";

async function search(searchText, sortOption) {
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

      const title = (
        $(el).find('[data-test-id="product-card-name"]').text() || "-"
      ).trim();

      let price = (
        $(el).find('[data-test-id="price-current-price"]').text() || "-"
      ).trim();

      if (price !== "-") {
        price = price.replace("TL", "").replace(/\s+/g, ""); // .replaceAll() eski Node.js sürümlerinde çalışmayabilir
      }

      const link = (storeBaseUrl + ($(el).find("a").attr("href") || "")).trim();

      const writer = "-";
      const publisher = "-";
      const imageSrc = ($(el).find("img").attr("src") || "").trim();

      const arr = searchText?.split(" ") || [];

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
    console.log(`Kitap bilgileri alındı. Toplam : ${results?.length} kitap`);
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
