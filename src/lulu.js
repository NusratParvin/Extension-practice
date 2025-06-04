// import puppeteer from "puppeteer-extra";
// import stealthPlugin from "puppeteer-extra-plugin-stealth";

// puppeteer.use(stealthPlugin());

// // Helper function to wait
// const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// async function getLuluRates(currencyCode) {
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });

//   const page = await browser.newPage();
//   await page.setViewport({ width: 1280, height: 800 });

//   try {
//     console.log("Navigating to Lulu Exchange...");
//     await page.goto("https://luluexchange.com/services/currency-exchange/", {
//       waitUntil: "domcontentloaded",
//       timeout: 30000,
//     });

//     console.log("Page loaded. Waiting for converter...");
//     await page.waitForSelector(".ll-convertBnr", {
//       visible: true,
//       // timeout: 15000,
//     });

//     // Set AED amount to 1
//     console.log("Setting AED amount to 1");
//     await page.type("#convrtInput", "1", { delay: 100 });
//     await wait(1000);

//     // Open target currency dropdown
//     console.log("Opening currency dropdown");
//     await page.evaluate(() => {
//       document.querySelector(".right-sect .countrDrop-1").click();
//     });

//     // Wait for dropdown to appear using a different approach
//     console.log("Waiting for dropdown items");
//     await page.waitForFunction(
//       () => {
//         const items = document.querySelectorAll(
//           ".dropdowncountry .dropdown-item"
//         );
//         return items.length > 10; // Ensure enough items are loaded
//       },
//       { timeout: 10000 }
//     );

//     // Find and select currency
//     console.log(`Selecting currency: ${currencyCode}`);
//     await page.evaluate((code) => {
//       const items = document.querySelectorAll(
//         ".dropdowncountry .dropdown-item"
//       );
//       for (const item of items) {
//         if (item.dataset.currency === code) {
//           item.click();
//           return true;
//         }
//       }
//       throw new Error(`Currency ${code} not found`);
//     }, currencyCode);

//     await wait(2000);

//     // Get buy rate (AED to foreign currency)
//     const buyRate = await page.evaluate(() => {
//       const output = document.querySelector("#convrtOutput");
//       return output ? parseFloat(output.value) : 0;
//     });

//     console.log("Buy rate:", buyRate);

//     // Click the swap button
//     console.log("Clicking swap button");
//     await page.evaluate(() => {
//       document.querySelector(".btn-convertBnr").click();
//     });
//     await wait(2000);

//     // Set foreign currency to 1
//     console.log("Setting foreign currency to 1");
//     await page.evaluate(() => {
//       const input = document.querySelector("#convrtInput");
//       if (input) {
//         input.value = "1";
//         const event = new Event("input", { bubbles: true });
//         input.dispatchEvent(event);
//       }
//     });
//     await wait(2000);

//     // Get sell rate (foreign currency to AED)
//     const sellRate = await page.evaluate(() => {
//       const output = document.querySelector(".left-sect #convrtOutput");
//       // return output ? parseFloat(output.value) : 0;
//       if (output) {
//         output.value = "1";
//         const event = new Event("output", { bubbles: true });
//         input.dispatchEvent(event);
//       }
//     });

//     console.log("Sell rate:", sellRate);

//     return {
//       currency: currencyCode,
//       buy: buyRate,
//       sell: sellRate,
//       timestamp: new Date().toISOString(),
//     };
//   } catch (error) {
//     console.error("Scraping error:", error);
//     await page.screenshot({
//       path: `lulu-error-${Date.now()}.png`,
//       fullPage: true,
//     });
//     throw error;
//   } finally {
//     await browser.close();
//   }
// }

// // Example usage
// (async () => {
//   try {
//     const cadRates = await getLuluRates("CAD");
//     console.log("CAD Rates:", cadRates);
//   } catch (error) {
//     console.error("Final Error:", error.message);
//   }
// })();

import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(stealthPlugin());

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getLuluRates(currencyCode) {
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
  const uaeLocation = { latitude: 25.276987, longitude: 55.296249 };
  // const uaeLocation = { latitude: null, longitude: null };
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

    // Get buy rate (AED to foreign)
    const buyRate = await page.evaluate(() => {
      const output = document.querySelector("#convrtOutput");
      return output ? parseFloat(output.value) : 0;
    });

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
      buy: buyRate,
      sell: sellRate,
      timestamp: new Date().toISOString(),
    };
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
