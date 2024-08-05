const puppeteer = require("puppeteer");
const axios = require("axios");
const cheerio = require("cheerio");
const mainService = require("./main");
module.exports = { search, fastSearch };

const selectors = {
  waitSelector: "div.facet__products .prd.js-prd-item",
  productsContainer: "div.facet__products",
  product: ".prd.js-prd-item",
  title: "",
  price: "",
  link: ".product-img a",
  author: "",
  publisher: "",
  image: ".product-img img",
};
const store = "dr";
const storeBaseUrl = "https://www.dr.com.tr/";

async function search(searchText, sortOption) {
  try {
    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&SortOrder=1&SortType=2";
    }

    const url = `https://www.dr.com.tr/search?q=${encodeURIComponent(
      searchText
    )}&redirect=search${sortQuery}`;

    let products = await searchDr(url, store, selectors);

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

async function searchDr(url, storeName, selectors) {
  let time = new Date();

  console.log(`--------------------------------------`);
  console.log(
    `İşlem Başlangıç : ${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
  );
  console.log("mağaza : " + storeName);
  console.log("url oluşturuldu : ", url);
  console.log("url'den veri çekiliyor...");

  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

  if (selectors.waitSelector) {
    //todo msercan : check if not found...
    await page.waitForSelector(selectors.waitSelector, { timeout: 90000 });
  }
  await page.setViewport({ width: 1080, height: 1024 });

  let products = await getProducts(page, selectors);

  products = products.map((p) => ({
    ...p,
    store: storeName,
  }));

  await browser.close();

  time = new Date();
  console.log(
    `${store} - Kitap bilgileri alındı. Toplam : ${products?.length} kitap`
  );
  console.log(
    `İşlem Bitiş : ${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
  );
  console.log(`--------------------------------------`);

  return products;
}

async function getProducts(page, selectors) {
  const products = await page.evaluate((selectors) => {
    const elements = document
      .querySelector(selectors.productsContainer)
      ?.querySelectorAll(selectors.product);

    if (elements.length === 0) {
      return [];
    }

    const getProduct = (el) => {
      const product_info = JSON.parse(el?.getAttribute("data-gtm") || "{}");
      const title = (product_info?.item_name || "-").trim();

      let price = (product_info?.price || "-").trim();
      if (price !== "-")
        price = price.replace("TL", "").replaceAll(" ", "").replace(".", ","); //for only dr.

      const link = (
        el.querySelector(selectors.link)?.getAttribute("href") || ""
      ).trim();

      const writer = (product_info?.author || "-")
        .trim()
        .toLocaleUpperCase("tr-TR");
      const publisher = (product_info?.publisher || "-")
        .trim()
        .toLocaleUpperCase("tr-TR");

      const imageSrc = (
        el.querySelector(selectors.image)?.getAttribute("data-src") || ""
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

async function fastSearch(searchText, sortOption) {
  try {
    let sortQuery = "";
    if (sortOption === "highPrice") {
      sortQuery = "&SortOrder=1&SortType=2";
    }

    const url = `https://www.dr.com.tr/search?q=${encodeURIComponent(
      searchText
    )}&redirect=search${sortQuery}`;

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

    let results = [];

    const getProduct = (el) => {
      const $el = $(el); // cheerio wrapper
      const product_info = JSON.parse($el.attr("data-gtm") || "{}");
      const title = (product_info?.item_name || "-").trim();

      let price = (product_info?.price || "-").trim();
      if (price !== "-")
        price = price.replace("TL", "").replaceAll(" ", "").replace(".", ","); //for only dr.

      const link = ($el.find(selectors.link)?.attr("href") || "").trim();

      const writer = (product_info?.author || "-")
        .trim()
        .toLocaleUpperCase("tr-TR");
      const publisher = (product_info?.publisher || "-")
        .trim()
        .toLocaleUpperCase("tr-TR");

      const imageSrc = (
        $el.find(selectors.image)?.attr("data-src") || ""
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

    productList.each((index, el) => {
      const store = "dr";

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

    results = results.map((p) => ({
      ...p,
      link: `${storeBaseUrl}${p.link}`,
    }));
    return { ok: true, data: results };
  } catch (error) {
    console.error("Error fetching data:", error.stack);
    return { ok: false, error: { message: error.message, stack: error.stack } };
  }
}
