import { GoogleGenAI } from "@google/genai";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import executablePath from "puppeteer";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDqlChSapxHjB2mJw4UuUeTv28yHsPnoHY",
});

puppeteer.use(stealthPlugin());

// async function main() {
//   const browser = await puppeteer.launch({ headless: true });

//   const page = await browser.newPage();
//   await page.goto(
//     // "https://luluexchange.com"
//     "https://alansariexchange.com/",
//     {
//       waitUntil: "load",
//       timeout: 60000,
//     }
//   );

//   //   await new Promise((resolve) => setTimeout(resolve, 60000));

//   const html = await page.content();
//   const prompt = `The following HTML contains multiple currency exchange rates.
//  i need in json format the country name currency name and currency rate and total count of countries

// Here is the HTML:
//    : ${html} `;
//   //   console.log(html);

//   //   const prompt = `This is the HTML content:\n\n${html}\n\nWhich exchange rate is highest and what currency it is for?`;

//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: prompt,
//   });
//   console.log(response.text);
// }

// main();

// async function getExchangeRate(currency, country, transactionType = "Buy") {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   try {
//     // 1. Configure browser and navigate
//     await page.setViewport({ width: 1280, height: 800 });
//     await page.goto("https://alansariexchange.com/service/foreign-exchange/", {
//       waitUntil: "networkidle2",
//       timeout: 60000,
//     });

//     // 2. Select transaction type
//     const typeValue = transactionType === "Buy" ? "B" : "S";
//     await page.waitForSelector(`input.transfer_type[value="${typeValue}"]`, {
//       visible: true,
//     });
//     await page.click(`input.transfer_type[value="${typeValue}"]`);

//     // 3. Open currency dropdown
//     const dropdownOpener = ".send-currency-flag-selected";
//     await page.waitForSelector(dropdownOpener, {
//       visible: true,
//       timeout: 30000,
//     });
//     await page.click(dropdownOpener);

//     // 4. Wait for dropdown and select currency
//     await page.waitForSelector(".currency-select.send-currency", {
//       visible: true,
//     });

//     // Use proper selector for the list item
//     const currencySelector = `li a span[data-cntcode="${currency}"]`;
//     await page.waitForSelector(currencySelector, { visible: true });

//     // Click the parent anchor element properly
//     await page.evaluate((selector) => {
//       const span = document.querySelector(selector);
//       span.closest("a").click(); // Click the parent anchor
//     }, currencySelector);

//     // 5. Verify selection
//     await page.waitForFunction(
//       (currency) => {
//         const selected = document.querySelector(
//           ".send-currency-flag-selected b"
//         );
//         return selected?.textContent.includes(currency);
//       },
//       { timeout: 15000 },
//       currency
//     );

//     // Scroll and click
//     await page.evaluate((selector) => {
//       document.querySelector(selector).scrollIntoView({ behavior: "smooth" });
//     }, currencySelector);

//     // Click both the span and its parent to ensure selection
//     await page.click(currencySelector);
//     await page.click(`${currencySelector} >> xpath=..`); // Click parent anchor

//     // 6. Verify selection updated
//     await page.waitForFunction(
//       (currency) => {
//         const selected = document.querySelector(
//           ".send-currency-flag-selected b"
//         );
//         return selected?.textContent.includes(currency);
//       },
//       { timeout: 15000 },
//       currency
//     );

//     // 7. Handle amount input
//     await page.waitForSelector(".currency-send.form-control", {
//       visible: true,
//     });
//     await page.evaluate(() => {
//       const input = document.querySelector(".currency-send.form-control");
//       input.value = "";
//     });
//     await page.type(".currency-send.form-control", "1", { delay: 100 });

//     // 8. Wait for conversion
//     await page.waitForFunction(
//       () => {
//         const el = document.querySelector(".currency-receive.form-control");
//         return el && el.value !== "" && !isNaN(el.value);
//       },
//       { timeout: 20000 }
//     );

//     // 9. Get exchange rate
//     const exchangeRate = await page.$eval(
//       ".currency-receive.form-control",
//       (el) => parseFloat(el.value)
//     );

//     return {
//       currency,
//       country,
//       rate: exchangeRate,
//       timestamp: new Date().toISOString(),
//     };
//   } catch (error) {
//     console.error("Error during scraping:");
//     await page.screenshot({ path: "error-screenshot.png" });
//     throw error;
//   } finally {
//     await browser.close();
//   }
// }

async function getExchangeRate(countryCode, countryName, transactionType) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. Configure browser and navigate
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto("https://alansariexchange.com/service/foreign-exchange/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // 2. Select transaction type
    const typeValue = transactionType === "Buy" ? "B" : "S";
    await page.click(`input.transfer_type[value="${typeValue}"]`);

    // 3. Store initial rate for comparison
    const initialRate = await page.$eval("#rate-note", (el) =>
      el.textContent.trim()
    );

    // 4. Open currency dropdown
    await page.click(".send-currency-flag-selected");

    // 5. Select currency using country code
    const countrySelector = `li a span[data-ccyname="${countryCode}"]`;
    await page.waitForSelector(countrySelector, {
      visible: true,
      timeout: 15000,
    });

    // Click and get the expected currency code
    const { currencyCode: expectedCurrency, rate } = await page.evaluate(
      (selector) => {
        const span = document.querySelector(selector);
        const currency = span.dataset.ccyname;
        span.closest("a").click();
        return {
          currencyCode: currency,
          rate: document.querySelector("#rate-note").textContent.trim(),
        };
      },
      countrySelector
    );

    // 6. Wait for rate update using multiple conditions
    await page.waitForFunction(
      ({ initial, expected }) => {
        const currentRate = document
          .querySelector("#rate-note")
          .textContent.trim();
        const currentCurrency = document
          .querySelector("#rate-note-currency")
          .textContent.trim();
        return currentRate !== initial && currentCurrency === expected;
      },
      { timeout: 10000 },
      { initial: initialRate, expected: expectedCurrency }
    );

    // 7. Get final values
    const exchangeRate = await page.$eval("#rate-note", (el) =>
      parseFloat(el.textContent.trim())
    );
    const currency = await page.$eval(
      ".send-currency-flag-selected [data-ccyname]",
      (el) => el.dataset.ccyname
    );

    return {
      currency,
      country: countryName,
      rate: exchangeRate,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error during scraping:");
    await page.screenshot({ path: "error-screenshot.png" });
    throw error;
  } finally {
    await browser.close();
  }
}

// Usage example
getExchangeRate("CAD", "BANGLADESH", "Buy")
  .then((result) => console.log(result))
  .catch(console.error);
