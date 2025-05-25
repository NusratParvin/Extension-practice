import { GoogleGenAI } from "@google/genai";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import executablePath from "puppeteer";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDqlChSapxHjB2mJw4UuUeTv28yHsPnoHY",
});

puppeteer.use(stealthPlugin());
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
// === STEP 1: BROWSER CONFIGURATION ===
// Set viewport to desktop size to ensure proper page layout
await page.setViewport({ width: 1280, height: 800 });

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

// async function getExchangeRate(currencyName, countryName, transactionType) {
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
//     await page.click(`input.transfer_type[value="${typeValue}"]`);

//     // 3. Store initial rate for comparison
//     const initialRate = await page.$eval("#rate-note", (el) =>
//       el.textContent.trim()
//     );

//     // 4. Open currency dropdown
//     await page.click(".send-currency-flag-selected");

//     // 5. Select currency using country code
//     const countrySelector = `li a span[data-ccyname="${currencyName}"]`;
//     await page.waitForSelector(countrySelector, {
//       visible: true,
//       timeout: 15000,
//     });

//     // Click and get the expected currency code
//     // page.evaluate here instead of separate page.click + page.$eval ************/
//     const { currencyCode: expectedCurrency, rate } = await page.evaluate(
//       (selector) => {
//         const span = document.querySelector(selector);
//         const currency = span.dataset.ccyname;
//         span.closest("a").click();
//         return {
//           currencyCode: currency,
//           rate: document.querySelector("#rate-note").textContent.trim(),
//         };
//       },
//       countrySelector
//     );

//     // 6. Wait for rate update using multiple conditions
//     await page.waitForFunction(
//       ({ initial, expected }) => {
//         const currentRate = document
//           .querySelector("#rate-note")
//           .textContent.trim();
//         const currentCurrency = document
//           .querySelector("#rate-note-currency")
//           .textContent.trim();
//         return currentRate !== initial && currentCurrency === expected;
//       },
//       { timeout: 10000 },
//       { initial: initialRate, expected: expectedCurrency }
//     );

//     // 7. Get final values
//     const exchangeRate = await page.$eval("#rate-note", (el) =>
//       parseFloat(el.textContent.trim())
//     );
//     const currency = await page.$eval(
//       ".send-currency-flag-selected [data-ccyname]",
//       (el) => el.dataset.ccyname
//     );

//     return {
//       currency,
//       country: countryName,
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

//final call
// getExchangeRate("CAD", "BANGLADESH", "Buy")

// async function getExchangeRate(currencyName, countryName, transactionType) {
async function getAnsariExchangeRate(currencyName) {
  try {
    // Navigate to target page with extended timeout
    // 'networkidle2' waits until there are no more than 2 network connections for 500ms
    await page.goto("https://alansariexchange.com/service/foreign-exchange/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // === STEP 2: TRANSACTION TYPE SELECTION ===
    // Convert Buy/Sell to radio button values (B/S)
    // const typeValue = transactionType === "Buy" ? "B" : "S";
    await page.click(`input.transfer_type[value="B"]`);

    // === STEP 3: INITIAL RATE CAPTURE ===
    // Store initial rate to verify it changes after currency selection
    const initialRate = await page.$eval("#rate-note", (el) =>
      el.textContent.trim()
    );

    // === STEP 4: CURRENCY SELECTION PREPARATION ===
    // Open currency dropdown to make options visible
    await page.click(".send-currency-flag-selected");

    // === STEP 5: CURRENCY SELECTION ===
    // Wait for target currency to appear in dropdown (15s timeout)
    const countrySelector = `li a span[data-ccyname="${currencyName}"]`;
    await page.waitForSelector(countrySelector, {
      visible: true,
      timeout: 15000,
    });

    // Execute in browser context to:
    // 1. Find currency element
    // 2. Click parent anchor tag
    // 3. Capture currency code from data attribute
    const { currencyCode: expectedCurrency } = await page.evaluate(
      (selector) => {
        const span = document.querySelector(selector);
        const currency = span.dataset.ccyname;
        span.closest("a").click(); // Click parent anchor to select currency
        return { currencyCode: currency };
      },
      countrySelector
    );

    // === STEP 6: RATE UPDATE VERIFICATION ===
    // Wait until both conditions are met:
    // 1. Rate has changed from initial value
    // 2. Currency code in rate display matches selected currency
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
      { timeout: 10000 }, // 10s timeout for rate update
      { initial: initialRate, expected: expectedCurrency }
    );

    // === STEP 7: FINAL DATA EXTRACTION ===
    // Get updated exchange rate (already verified by waitForFunction)
    const exchangeRate = await page.$eval("#rate-note", (el) =>
      Number(parseFloat(el.textContent.trim()).toFixed(2))
    );

    // === REDUNDANCY REMOVED ===
    // Original code had duplicate currency lookup here - using expectedCurrency instead
    // since we already validated currency matches in waitForFunction

    return {
      currency: expectedCurrency, // Use already validated currency code
      // country: countryName,
      rate: exchangeRate,
      timestamp: new Date().toLocaleString(),
    };
  } catch (error) {
    // === ERROR HANDLING ===
    console.error("Error during scraping:");
    await page.screenshot({ path: `error-${Date.now()}.png` });
    throw error;
  } finally {
    // === CLEANUP ===
    await browser.close();
  }
}

getAnsariExchangeRate("CAD")
  .then((result) => console.log(result))
  .catch(console.error);
