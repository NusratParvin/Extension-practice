import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(stealthPlugin());

export async function getFardanRate(currencyCode, transactionType) {
  console.log(transactionType);
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
    const rate = transactionType === "Buy" ? data.buy : data.sell;
    return {
      currency: currencyCode,
      type: transactionType,
      rate,
      timestamp: new Date().toLocaleString(),
    };
  } catch (err) {
    console.error("Fardan scraping error:", err);
    throw err;
  } finally {
    await browser.close();
  }
}
