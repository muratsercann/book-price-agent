const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const { executablePath } = require("puppeteer");
const os = require("os");
require("dotenv").config();

let browser = null;
let browserPromise = null;
let isLocked = false; // Kilit değişkeni
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const username = os.userInfo().username;

async function createBrowser() {
  try {
    return await puppeteer.launch({
      headless: process.env.HEADLESS === "true",
      userDataDir: `C:\\Users\\${username}\\AppData\\Local\\Google\\Chrome\\User Data\\Default`,
      executablePath: executablePath(),
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        // "--disable-gpu",
        // "--disable-software-rasterizer",
      ],
    });
  } catch (error) {
    console.error("Tarayıcı oluşturulurken hata oluştu:", error);
    throw error;
  }
}

async function getBrowser() {
  while (isLocked) {
    await delay(100);
  }

  if (!browserPromise) {
    browserPromise = createBrowser();
  }

  if (!browser) {
    try {
      browser = await browserPromise;
    } catch (error) {
      console.error("Tarayıcı başlatılamadı:", error);
      browserPromise = null;
      browser = null;
      throw error;
    }
  }

  // Tarayıcı kapalıysa yeni bir tane oluştur
  if (browser && (await isBrowserClosed())) {
    console.log("Tarayıcı kapalı, yeni bir tane oluşturuluyor...");
    isLocked = true; // Yeni tarayıcı oluşturulmaya başlıyor
    browserPromise = createBrowser();
    browser = await browserPromise;
    isLocked = false;
  }
  return browser;
}

// Tarayıcının açık olup olmadığını kontrol eden yardımcı fonksiyon
async function isBrowserClosed() {
  try {
    const pages = await browser.pages();
    return pages.length === 0 || !browser.connected;
  } catch (error) {
    return true;
  }
}

async function closeBrowser() {
  if (browser) {
    try {
      await browser.close();
    } catch (error) {
      console.error("Tarayıcı kapatılırken hata oluştu:", error);
    } finally {
      browser = null;
      browserPromise = null;
    }
  }
}

module.exports = { getBrowser, closeBrowser };
