// src/try.js
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(stealthPlugin());

async function getAnsariExchangeRate(currencyCode, transactionType = "Buy") {
  // 1) Launch a new browser + page each time:
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 2) Set a “normal” desktop viewport:
    await page.setViewport({ width: 1280, height: 800 });

    // 3) Go to Ansari’s FX page:
    await page.goto("https://alansariexchange.com/service/foreign-exchange/", {
      waitUntil: "networkidle2",
    });

    // 4) Click the “Buy” or “Sell” radio button:
    //    (Ansari uses <input.transfer_type value="B"> for Buy  and value="S" for Sell)
    const typeValue = transactionType === "Buy" ? "B" : "S";
    await page.click(`input.transfer_type[value="${typeValue}"]`);
    await new Promise((r) => setTimeout(r, 500));

    // 5) Wait a short moment so that the rate-note field can update its placeholder/labels:
    //    If Puppeteer’s `page.waitForTimeout` isn’t available, you can use a bare setTimeout instead.

    // 6) Grab whatever rate is currently displayed for the default currency (typically “AED”):
    const initialRateText = await page.$eval("#rate-note", (el) =>
      el.textContent.trim()
    );

    // 7) Open the currency dropdown (the “From”–currency selector):
    await page.click(".send-currency-flag-selected");

    // 8) Wait for that dropdown to render its list of currencies:
    const itemSelector = `li a span[data-ccyname="${currencyCode}"]`;
    await page.waitForSelector(itemSelector, { visible: true, timeout: 15000 });

    // 9) Click on the span whose data-ccyname matches our target:
    const { currencyCode: expected } = await page.evaluate((sel) => {
      const span = document.querySelector(sel);
      if (!span) throw new Error(`Could not find dropdown item for ${sel}`);
      const code = span.dataset.ccyname;
      // Click its parent <a> to select this currency
      span.closest("a").click();
      return { currencyCode: code };
    }, itemSelector);

    // 10) Now wait until “#rate-note” updates to show the new currency’s rate:
    await page.waitForFunction(
      (initial, expectedCurrency) => {
        const curText = document.querySelector("#rate-note").textContent.trim();
        const curCcy = document
          .querySelector("#rate-note-currency")
          .textContent.trim();
        return curText !== initial && curCcy === expectedCurrency;
      },
      { timeout: 10000 },
      initialRateText,
      expected
    );

    // 11) Read out the final rate (rounded to 2 decimals):
    const finalRate = await page.$eval("#rate-note", (el) =>
      Number(parseFloat(el.textContent.trim()).toFixed(2))
    );

    return {
      currency: currencyCode,
      transactionType,
      rate: finalRate,
      timestamp: new Date().toLocaleString(),
    };
  } catch (err) {
    console.error("Scraping error:", err);
    await page.screenshot({ path: `error-screenshot-${Date.now()}.png` });
    throw err;
  } finally {
    await browser.close();
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Example calls (you can replace "CAD" or "BDT" with any supported code):
// ───────────────────────────────────────────────────────────────────────────────
(async () => {
  try {
    const buyCAD = await getAnsariExchangeRate("CAD", "Buy");
    console.log("Buy CAD →", buyCAD);

    const sellCAD = await getAnsariExchangeRate("CAD", "Sell");
    console.log("Sell CAD →", sellCAD);

    const buyBDT = await getAnsariExchangeRate("BDT", "Buy");
    console.log("Buy BDT →", buyBDT);
  } catch (e) {
    console.error("Fatal error in examples:", e);
  }
})();
