const puppeteer = require("puppeteer");
const mainService = require("./main");
module.exports = { search };

const selectors = {
  waitSelector: ".search-page",
  productsContainer: "#product-table",
  product: ".product-cr",
  title: [".name span"],
  price: ".price-new .value",
  link: ".pr-img-link",
  author: ".author span",
  publisher: ".publisher span",
  image: ".cover img",
};

const store = "kitapyurdu";
const storeBaseUrl = "https://www.kitapyurdu.com";
async function search(searchText, sortOption) {
  try {
    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&sort=p.price&order=DESC";
    }

    const url = `https://www.kitapyurdu.com/index.php?route=product/search&filter_name=${encodeURIComponent(
      searchText
    )}&filter_in_stock=0&filter_in_shelf=1&fuzzy=0&limit=50${sortQuery}`;

    let products = await mainService.genericSearch(url, store, selectors);

    return { ok: true, data: products };
  } catch (error) {
    console.error("Error fetching data:", error.stack);
    return { ok: false, error: { message: error.message, stack: error.stack } };
  }
}
