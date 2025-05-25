// async function getExchangeRate(currencyName, countryName, transactionType) {
async function getAnsariExchangeRate(currencyName, puppeteer) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // === STEP 1: BROWSER CONFIGURATION ===
    // Set viewport to desktop size to ensure proper page layout
    await page.setViewport({ width: 1280, height: 800 });

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

export default getAnsariExchangeRate;
