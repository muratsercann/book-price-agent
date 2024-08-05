const mainService = require("./main");
const axios = require("axios");
const cheerio = require("cheerio");
module.exports = { search };

const selectors = {
  waitSelector: ".s-main-slot.s-result-list.s-search-results.sg-row",
  productsContainer: ".s-search-results",
  product: '[data-component-type="s-search-result"]',
  title: ['[data-cy="title-recipe"]'],
  price: [
    '[data-cy="price-recipe"] .a-price-whole',
    '[data-cy="price-recipe"] .a-price-fraction',
  ],
  link: '[data-cy="title-recipe"] h2 a',
  author: ".no-author-info",
  publisher: ".no-publisher-info",
  image: ".s-image",
};
const store = "amazon";
const storeBaseUrl = "https://www.amazon.com.tr";
async function search(searchText, sortOption) {
  try {
    let sortQuery = "";
    let ref = "nb_sb_noss";
    if (sortOption === "highPrice") {
      sortQuery = "&s=price-desc-rank";
      ref = "sr_st_price-desc-rank";
    }

    const url = `https://www.amazon.com.tr/s?k=${encodeURIComponent(
      searchText
    )}&ref=${ref}${sortQuery}`;

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
    let ref = "nb_sb_noss";
    if (sortOption === "highPrice") {
      sortQuery = "&s=price-desc-rank";
      ref = "sr_st_price-desc-rank";
    }

    const url = `https://www.amazon.com.tr/s?k=${encodeURIComponent(
      searchText
    )}&ref=${ref}${sortQuery}`;

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

    const getProduct = (el) => {
      const $el = $(el); // cheerio wrapper

      let title = ($el.find(selectors.title[0])?.text() || "").trim();

      if (selectors.title.length > 1) {
        title += $el.find(selectors.title[1])?.text() || "";
      }

      let price = ($el.find(selectors.price[0])?.text() || "").trim();
      if (selectors.price.length > 1) {
        price += $el.find(selectors.price[1])?.text().trim() || "";
      }
      if (price !== "") price = price.replace("TL", "").replaceAll(" ", "");

      const link = ($el.find(selectors.link)?.attr("href") || "#").trim();

      const writer = ($el.find(selectors.author)?.text().trim() || "-")
        .trim()
        .toLocaleUpperCase("tr-TR");

      const publisher = ($el.find(selectors.publisher)?.text() || "-")
        .trim()
        .toLocaleUpperCase("tr-TR");

      const imageSrc = ($el.find(selectors.image)?.attr("src") || "").trim();

      return {
        publisher,
        title,
        writer,
        price,
        link,
        imageSrc,
      };
    };

    productList.each((index, el) => {
      const store = "amazon";

      const prd = getProduct(el);

      if (prd?.price !== "") {
        results.push({
          ...prd,
          store: store,
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
