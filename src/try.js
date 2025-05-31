import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(stealthPlugin());

async function getAnsariExchangeRate(currencyCode, transactionType = "Buy") {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Set viewport and navigate to page
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto("https://alansariexchange.com/service/foreign-exchange/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // === TRANSACTION TYPE SELECTION ===
    // Convert Buy/Sell to radio button values (B/S)
    const typeValue = transactionType === "Buy" ? "B" : "S";

    // Click the transaction type radio button
    await page.click(`input.transfer_type[value="${typeValue}"]`);

    // Wait briefly for UI to update
    await page.waitForTimeout(500);

    // === INITIAL RATE CAPTURE ===
    const initialRate = await page.$eval("#rate-note", (el) =>
      el.textContent.trim()
    );

    // === OPEN CURRENCY SELECTOR ===
    await page.click(".send-currency-flag-selected");

    // === SELECT CURRENCY ===
    const currencySelector = `li a span[data-ccyname="${currencyCode}"]`;
    await page.waitForSelector(currencySelector, {
      visible: true,
      timeout: 15000,
    });

    // Click currency and get expected code
    const { currencyCode: expectedCurrency } = await page.evaluate(
      (selector) => {
        const span = document.querySelector(selector);
        const currency = span.dataset.ccyname;
        span.closest("a").click();
        return { currencyCode: currency };
      },
      currencySelector
    );

    // === WAIT FOR RATE UPDATE ===
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

    // === GET FINAL RATE ===
    const exchangeRate = await page.$eval("#rate-note", (el) =>
      Number(parseFloat(el.textContent.trim()).toFixed(2))
    );

    return {
      currency: currencyCode,
      transactionType,
      rate: exchangeRate,
      timestamp: new Date().toLocaleString(),
    };
  } catch (error) {
    console.error("Scraping error:", error);
    await page.screenshot({ path: `error-${Date.now()}.png` });
    throw error;
  } finally {
    await browser.close();
  }
}

// Usage examples:
getAnsariExchangeRate("CAD", "Buy").then(console.log).catch(console.error);

getAnsariExchangeRate("EUR", "Sell").then(console.log).catch(console.error);
