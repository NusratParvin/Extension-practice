import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(stealthPlugin());

const browser = await puppeteer.launch();
const page = await browser.newPage();

async function getLuluRate(currencyCode) {
  await page.goto("https://luluexchange.com/services/currency-exchange/", {
    waitUntil: "networkidle2",
  });

  const selector = ".owl-item .ll-card";

  //ensures the page has loaded the currency cards before we try to scrape them
  await page.waitForSelector(selector, { visible: true });

  const rate = await page.evaluate((targetCode) => {
    const cardsArray = Array.from(
      document.querySelectorAll(".owl-item .ll-card")
    );

    const matchCard = cardsArray.find((c) =>
      c.querySelector("p")?.textContent.includes(targetCode)
    );
    if (!matchCard) return null;

    const txt = matchCard.querySelector("p").textContent.trim();

    const [, rate, code] = txt.match(/^([\d.]+)([A-Z]+)$/) || [];
    console.log(rate);
    return rate;
  }, currencyCode);

  return rate;
}

getLuluRate("AED")
  .then((rate) => console.log("rate:", rate))
  .catch(console.error);
