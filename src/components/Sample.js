const puppeteer = require("puppeteer");

export default function Sample() {
  (async () => {
    // Tarayıcıyı başlat
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Sayfayı yükle
    await page.goto(
      "https://www.kitapyurdu.com/index.php?route=product/search&filter_name=K%C3%BCrk%20Mantolu%20Madonna%20Sabahattin%20Ali"
    ); // Buraya hedef URL'yi koyun

    // Sayfayı scroll yapma işlemi
    await page.evaluate(async () => {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const scrollToBottom = async () => {
        const distance = 100; // Her seferinde kaydırılacak mesafe
        const delayTime = 200; // Her kaydırma arasındaki bekleme süresi

        while (
          window.innerHeight + window.scrollY <
          document.body.scrollHeight
        ) {
          window.scrollBy(0, distance);
          await delay(delayTime);
        }
      };
      await scrollToBottom();
    });

    // İçeriği çek
    const content = await page.content();
    console.log(content); // Çekilen içeriği konsola yazdır

    // Tarayıcıyı kapat
    await browser.close();
  })();
}
