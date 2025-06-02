// import puppeteer from "puppeteer-extra";
// import stealthPlugin from "puppeteer-extra-plugin-stealth";

// puppeteer.use(stealthPlugin());

// const browser = await puppeteer.launch();
// const page = await browser.newPage();

// async function getFardanRate(currencyCode) {
//   await page.goto("https://alfardanexchange.com/foreign-exchange", {
//     waitUntil: "networkidle2",
//   });

//   const selector = "#myTable tbody tr";
//   await page.waitForSelector(selector);

//   const rate = await page.evaluate((targetCode) => {
//     const rows = document.querySelectorAll("#myTable tbody tr");

//     for (const row of rows) {
//       const cells = row.querySelectorAll("td");
//       const currencyCodeCell = cells[0]?.textContent.trim();

//       if (currencyCodeCell === targetCode) {
//         const buy = cells[2].textContent.trim();
//         const sell = cells[3].textContent.trim();
//         return { buy, sell };
//       }
//     }
//     return null;
//   }, currencyCode);

//   return rate;
// }

// getFardanRate("CAD")
//   .then((rate) => console.log("rate:", rate))
//   .catch(console.error);

export async function getFardanRate(currencyCode, transactionType = "buy") {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://alfardanexchange.com/foreign-exchange", {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector("#myTable tbody tr");

    const data = await page.evaluate(
      (code, type) => {
        const rows = document.querySelectorAll("#myTable tbody tr");
        for (const row of rows) {
          const cells = row.querySelectorAll("td");
          if (cells[0]?.textContent.trim() === code) {
            const buy = parseFloat(cells[2].textContent.trim());
            const sell = parseFloat(cells[3].textContent.trim());
            return { buy, sell };
          }
        }
        return null;
      },
      currencyCode,
      transactionType
    );

    if (!data) throw new Error(`Currency ${currencyCode} not found`);
    const rate = transactionType === "buy" ? data.buy : data.sell;
    return {
      currency: currencyCode,
      type: transactionType,
      rate,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.error("Fardan scraping error:", err);
    throw err;
  } finally {
    await browser.close();
  }
}
