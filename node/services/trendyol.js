const puppeteer = require("puppeteer");
const mainService = require("./main");
module.exports = { search };

const selectors = {
  waitSelector: "#search-app",
  productsContainer: ".prdct-cntnr-wrppr",
  product: ".p-card-wrppr",
  title: ".prdct-desc-cntnr-name",
  price: ".prc-box-dscntd",
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
