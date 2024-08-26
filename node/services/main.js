const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const { executablePath } = require("puppeteer");

module.exports = { search, search_2 };

async function startBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    userDataDir:
      "C:\\Users\\murat\\AppData\\Local\\Google\\Chrome\\User Data\\Default", // Bu yol genellikle doğru
    executablePath: executablePath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-software-rasterizer",
    ],
  });

  return browser;
}

async function search(url, storeName, selectors) {
  let startTime = new Date();

  console.log(`--------------------------------------`);
  console.log(
    `İşlem Başlangıç : ${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()}`
  );
  console.log(`Mağaza : ${storeName}`);
  console.log(`URL Oluşturuldu : ${url}`);
  console.log(`URL'den veri çekiliyor...`);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let browser;
  for (let i = 0; i < 50; i++) {
    try {
      browser = await startBrowser();
      break;
    } catch (error) {
      await delay(50);
      continue;
    }
  }

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

    if (selectors.waitSelector) {
      await page.waitForSelector(selectors.waitSelector, { timeout: 60000 });
    }

    await page.setViewport({ width: 1080, height: 1024 });

    let products = await getProducts(page, selectors);

    products = products.filter((p) => p.price !== "");
    products = products.map((p) => ({
      ...p,
      store: storeName,
    }));

    const endTime = new Date();
    console.log(
      `${storeName} - Kitap bilgileri alındı. Toplam : ${products.length} kitap`
    );
    console.log(
      `İşlem Bitiş : ${endTime.toLocaleDateString()} ${endTime.toLocaleTimeString()}`
    );
    console.log(`--------------------------------------`);

    return products;
  } catch (error) {
    console.error(`Hata oluştu: ${error.message}`);
    return []; // Hata durumunda boş bir dizi döndürmek iyi olabilir.
  } finally {
    await browser.close();
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`### ${storeName} işlem süresi: ${duration} ms`);
  }
}

async function search_2(page, url, storeName, selectors) {
  const startTime = new Date();

  console.log(`--------------------------------------`);
  console.log(
    `İşlem Başlangıç : ${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()}`
  );
  console.log(`Mağaza : ${storeName}`);
  console.log(`URL Oluşturuldu : ${url}`);
  console.log(`URL'den veri çekiliyor...`);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

    if (selectors.waitSelector) {
      await page.waitForSelector(selectors.waitSelector, { timeout: 60000 });
    }

    await page.setViewport({ width: 1080, height: 1024 });

    let products = await getProducts(page, selectors);

    products = products.filter((p) => p.price !== "");
    products = products.map((p) => ({
      ...p,
      store: storeName,
    }));

    const endTime = new Date();
    console.log(
      `${storeName} - Kitap bilgileri alındı. Toplam : ${products.length} kitap`
    );
    console.log(
      `İşlem Bitiş : ${endTime.toLocaleDateString()} ${startTime.toLocaleTimeString()}`
    );
    console.log(`--------------------------------------`);

    return products;
  } catch (error) {
    console.error(`Hata oluştu: ${error.message}`);
    return []; // Hata durumunda boş bir dizi döndürmek iyi olabilir.
  } finally {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`### ${storeName} işlem süresi: ${duration} ms`);
  }
}

async function getProducts(page, selectors) {
  const products = await page.evaluate((selectors) => {
    const elements = document
      .querySelector(selectors.productsContainer)
      ?.querySelectorAll(selectors.product);

    if (!elements || elements.length === 0) {
      return [];
    }

    const getProduct = (el) => {
      let title = (
        el.querySelector(selectors.title[0])?.textContent || ""
      ).trim();

      if (selectors.title.length > 1) {
        title += el.querySelector(selectors.title[1])?.textContent || "";
      }

      let price = (
        el.querySelector(selectors.price[0])?.textContent || ""
      ).trim();
      if (selectors.price.length > 1) {
        price += el.querySelector(selectors.price[1])?.textContent.trim() || "";
      }
      if (price !== "") price = price.replace("TL", "").replaceAll(" ", "");

      const link = (
        el.querySelector(selectors.link)?.getAttribute("href") || "#"
      ).trim();

      const writer = (
        el.querySelector(selectors.author)?.textContent.trim() || "-"
      )
        .trim()
        .toLocaleUpperCase("tr-TR");

      const publisher = (
        el.querySelector(selectors.publisher)?.textContent || "-"
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
