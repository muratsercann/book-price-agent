const mainService = require("./main");
module.exports = { search };

const selectors = {
  waitSelector: ".s-main-slot.s-result-list.s-search-results.sg-row",
  productsContainer: ".s-search-results",
  product: '[data-component-type="s-search-result"]',
  title: '[data-cy="title-recipe"]',
  price: '[data-cy="price-recipe"] .a-price-whole',
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
