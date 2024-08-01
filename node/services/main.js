const puppeteer = require("puppeteer");
module.exports = { genericSearch };

async function genericSearch(url, storeName, selectors) {
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
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Sandbox özelliğini kapalı
  });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

  if (selectors.waitSelector) {
    //todo msercan : check if not found...
    await page.waitForSelector(selectors.waitSelector, { timeout: 30000 });
  }

  await page.setViewport({ width: 1080, height: 1024 });

  let products = await getProducts(page, selectors);

  products = products.filter((p) => p.price !== "");
  products = products.map((p) => ({
    ...p,
    store: storeName,
  }));

  await browser.close();

  time = new Date();
  console.log(
    `${storeName} - Kitap bilgileri alındı. Toplam : ${products?.length} kitap`
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
