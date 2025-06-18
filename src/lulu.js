import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(stealthPlugin());

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getLuluRates(currencyCode, transactionType) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-geolocation",
      "--disable-notifications",
    ],
  });

  const page = await browser.newPage();
  // const uaeLocation = { latitude: 25.276987, longitude: 55.296249 };
  const uaeLocation = { latitude: 0.0, longitude: 0.0 };
  await page.setGeolocation(uaeLocation);
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://luluexchange.com", [
    "geolocation",
  ]);
  await page.setViewport({ width: 1280, height: 800 });

  try {
    await page.goto("https://luluexchange.com/services/currency-exchange/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.waitForSelector(".ll-convertBnr", {
      visible: true,
      timeout: 20000,
    });

    // Set AED amount to 1
    const aedInput = await page.waitForSelector("#convrtInput");
    await aedInput.click({ clickCount: 3 });
    await aedInput.type("1", { delay: 100 });
    await wait(1500);

    // Select target currency
    await page.click(".right-sect .countrDrop-1");
    await wait(1000);

    await page.evaluate((code) => {
      const items = [
        ...document.querySelectorAll(".dropdowncountry .dropdown-item"),
      ];
      const targetItem = items.find((item) => item.dataset.currency === code);
      if (targetItem) targetItem.click();
    }, currencyCode);
    await wait(2000);

    if (transactionType === "Buy") {
      // Get buy rate (AED to foreign)
      const buyRate = await page.evaluate(() => {
        const output = document.querySelector("#convrtOutput");
        return output ? parseFloat(output.value) : 0;
      });

      return {
        currency: currencyCode,
        buy: buyRate,
        timestamp: new Date().toLocaleString(),
      };
    } else {
      // Swap currencies
      await page.click(".btn-convertBnr");
      await wait(2500);

      // RESET LOGIC - Set foreign currency to 1
      const foreignInput = await page.$("#convrtOutput");
      await foreignInput.click({ clickCount: 3 });
      await foreignInput.press("Backspace");
      await foreignInput.type("1", { delay: 100 });
      await wait(2000);

      // Get sell rate (foreign to AED)
      const sellRate = await page.evaluate(() => {
        const output = document.querySelector("#convrtInput");
        return output ? parseFloat(output.value) : 0;
      });
      return {
        currency: currencyCode,
        sell: sellRate,
        timestamp: new Date().toLocaleString(),
      };
    }
  } catch (error) {
    console.error("Scraping error:", error);
    await page.screenshot({ path: `lulu-error-${Date.now()}.png` });
    throw error;
  } finally {
    await browser.close();
  }
}

// Example usage
// (async () => {
//   const cadRates = await getLuluRates("BDT");
//   console.log("CAD Rates:", cadRates);
// })();
