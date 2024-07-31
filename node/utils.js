const puppeteer = require("puppeteer");

module.exports = { getPageHtml };

async function getPageHtml(url, selector = null) {
  const start = new Date();
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  if (selector) {
    //todo msercan : check if not found...
    await page.waitForSelector(selector, { timeout: 30000 });
  }
  // await page.goto(url, { waitUntil: "networkidle2", timeout: 2000 });
  await page.setViewport({ width: 1080, height: 1024 });

  // Sayfanın HTML içeriğini al
  const htmlContent = await page.content();
  await browser.close();

  const end = new Date();
  const duration = end - start; // Millisaniye cinsinden süre
  // console.log(`Çalışma süresi: ${duration} ms`);
  return htmlContent;
}
