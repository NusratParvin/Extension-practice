import puppeteer from "puppeteer-extra";

import stealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(stealthPlugin);

const browser = await puppeteer.launch();
const page = await browser.newPage();

async function getLuluRate(currencyCode) {
  await page.goto("https://luluexchange.com/services/currency-exchange/", {
    waitUntil: "networkidle2",
  });

  const selector = ".owl-item .li-card";

  //ensures the page has loaded the currency cards before we try to scrape them
  await page.waitForSelector(selector, { visible: true });

  const rate = await page.evaluate((targetCode) => {
    console.log(targetCode);
  }, currencyCode);
}

console.log("rate", getLuluRate("CAD"));
