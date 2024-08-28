const mainService = require("./main");

const selectors = {
  waitSelector: ".search-page",
  productsContainer: "#product-table",
  product: ".product-cr",
  title: [".name span"],
  price: [".price-new .value"],
  link: ".pr-img-link",
  author: ".author span",
  publisher: ".publisher span",
  image: ".cover img",
};

const store = "kitapyurdu";
const storeBaseUrl = "https://www.kitapyurdu.com";

function createUrl(searchText, sortOption) {
  let sortQuery = "";
  if (sortOption === "highPrice") {
    sortQuery = "&sort=p.price&order=DESC";
  }

  const url = `${storeBaseUrl}/index.php?route=product/search&filter_name=${encodeURIComponent(
    searchText
  )}&filter_in_stock=0&filter_in_shelf=1&fuzzy=0&limit=50${sortQuery}`;

  return url;
}

async function search(searchText, sortOption) {
  try {
    const url = createUrl(searchText, sortOption);
    let products = await mainService.search(url, store, selectors);
    return { ok: true, data: products };
  } catch (error) {
    console.error("Error fetching data:", error.stack);
    return { ok: false, error: { message: error.message, stack: error.stack } };
  }
}

module.exports = { search, selectors, createUrl, store, storeBaseUrl };
