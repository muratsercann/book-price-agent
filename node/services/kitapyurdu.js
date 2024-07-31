const puppeteer = require("puppeteer");
module.exports = { search };

const selectors = {
  productsContainer: "#product-table",
  product: ".product-cr",
  title: ".name span",
  price: ".price-new .value",
  link: ".pr-img-link",
  author: ".author span",
  publisher: ".publisher span",
  image: ".cover img",
};

async function search(searchText, sortOption) {
  try {
    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&sort=p.price&order=DESC";
    }

    const url = `https://www.kitapyurdu.com/index.php?route=product/search&filter_name=${encodeURIComponent(
      searchText
    )}&filter_in_stock=0&filter_in_shelf=1&fuzzy=0&limit=50${sortQuery}`;

    const store = "kitapyurdu";

    const start = new Date();

    const waitSelector = ".search-page";

    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    if (waitSelector) {
      //todo msercan : check if not found...
      await page.waitForSelector(waitSelector, { timeout: 60000 });
    }
    await page.setViewport({ width: 1080, height: 1024 });
    let products = await getProducts(page);

    products = products.map((p) => ({
      ...p,
      store: store,
    }));

    await browser.close();

    const end = new Date();
    const duration = end - start; // Millisaniye cinsinden süre
    console.log(`Kitapyurdu veri çekme süresi: ${duration} ms`);
    return products;
  } catch (error) {
    console.error("Error fetching data:", error.stack);
    return error.stack;
  }
}

async function getProducts(page) {
  const products = await page.evaluate((selectors) => {
    const elements = document
      .querySelector(selectors.productsContainer)
      .querySelectorAll(selectors.product);

    if (elements.length === 0) {
      return [];
    }

    const getProduct = (el) => {
      const title = (
        el.querySelector(selectors.title)?.textContent || "No Title"
      ).trim();
      let price = (
        el.querySelector(selectors.price)?.textContent || "No Price"
      ).trim();
      if (price !== "No Price")
        price = price.replace("TL", "").replaceAll(" ", "");

      const link = (
        el.querySelector(selectors.link)?.getAttribute("href") || "#"
      ).trim();

      const writer = (
        el.querySelector(selectors.author)?.textContent.trim() || "No Writer"
      )
        .trim()
        .toLocaleUpperCase("tr-TR");

      const publisher = (
        el.querySelector(selectors.publisher)?.textContent || "No Publisher"
      )
        .trim()
        .toLocaleUpperCase("tr-TR");

      const imageSrc = (
        el.querySelector(selectors.image)?.getAttribute("src") || ""
      ).trim();

      return {
        publisher,
        title,
        writer,
        price,
        link,
        imageSrc,
      };
    };

    return Array.from(elements).map((el) => {
      const product = getProduct(el);
      return product;
    });
  }, selectors);

  return products;
}
