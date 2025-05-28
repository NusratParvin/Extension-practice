import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(stealthPlugin());

const browser = await puppeteer.launch();
const page = await browser.newPage();

async function getFardanRate(targetCode) {
  await page.goto("https://alfardanexchange.com/foreign-exchange", {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector("#myTable tbody tr");
}

getFardanRate("CAD")
  .then((rate) => console.log("rate:", rate))
  .catch(console.error);
