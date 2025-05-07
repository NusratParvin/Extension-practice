// import { GoogleGenAI } from "@google/genai";
// import puppeteer from "puppeteer-extra";
// import stealthPlugin from "puppeteer-extra-plugin-stealth";

// const ai = new GoogleGenAI({
//   apiKey: "AIzaSyDqlChSapxHjB2mJw4UuUeTv28yHsPnoHY",
// });

// puppeteer.use(stealthPlugin());

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

import { GoogleGenAI } from "@google/genai";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDqlChSapxHjB2mJw4UuUeTv28yHsPnoHY",
});

puppeteer.use(stealthPlugin());

// async function main() {
//   console.log("Starting browser...");
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });

//   try {
//     const page = await browser.newPage();

//     // Set viewport to a common resolution
//     await page.setViewport({ width: 1366, height: 768 });

//     console.log("Navigating to Al Ansari Exchange...");
//     await page.goto("https://alansariexchange.com/", {
//       waitUntil: "load", // Wait for network activity to stop
//       timeout: 60000,
//     });

//     // Wait a bit more for any dynamic content to load
//     await new Promise((resolve) => setTimeout(resolve, 3000));

//     // Take a screenshot to see what we're dealing with
//     await page.screenshot({ path: "alansari-homepage.png" });
//     console.log("Screenshot saved as alansari-homepage.png");

//     // Look specifically for exchange rate elements on the homepage
//     console.log("Extracting exchange rates from homepage...");
//     const ratesData = await page.evaluate(() => {
//       // Function to extract text content between elements
//       const getTextBetween = (startElem, endElem) => {
//         const result = [];
//         let current = startElem;
//         while (current && current !== endElem) {
//           if (current.nodeType === Node.TEXT_NODE) {
//             result.push(current.textContent.trim());
//           } else if (current.nodeType === Node.ELEMENT_NODE) {
//             result.push(current.textContent.trim());
//           }
//           current = current.nextSibling;
//         }
//         return result.join(" ");
//       };

//       // 1. Try to find a currency rate widget or table
//       const rateContainers = [
//         // Common container classes for exchange rates on homepages
//         document.querySelector(".exchange-rates-widget"),
//         document.querySelector(".currency-rates"),
//         document.querySelector(".exchange-rates-container"),
//         document.querySelector(".live-rates"),
//         document.querySelector(".today-rates"),
//         // document.querySelector(".forex-rates"),
//         // Currency converter might contain rates
//         document.querySelector(".currency-converter"),
//         document.querySelector(".convert-calculator"),
//       ].filter(Boolean); // Remove null values

//       if (rateContainers.length > 0) {
//         return {
//           type: "containers",
//           data: rateContainers.map((container) => container.outerHTML),
//         };
//       }

//       // 2. Look for any element containing multiple currency codes together
//       const currencyCodes = [
//         "USD",
//         "EUR",
//         "GBP",
//         "INR",
//         "PKR",
//         "AED",
//         "CAD",
//         "AUD",
//         "JPY",
//       ];
//       const allElements = Array.from(
//         document.querySelectorAll("div, section, ul, table")
//       );

//       const elementsWithCurrencies = allElements.filter((el) => {
//         const text = el.textContent;
//         let count = 0;
//         for (const code of currencyCodes) {
//           if (text.includes(code)) count++;
//         }
//         return count >= 3; // Element contains at least 3 currency codes
//       });

//       if (elementsWithCurrencies.length > 0) {
//         return {
//           type: "currency_elements",
//           data: elementsWithCurrencies.map((el) => el.outerHTML),
//         };
//       }

//       // 3. Extract anything that looks like currency pairs with values
//       const extractCurrencyPairs = () => {
//         const results = [];
//         // Match patterns like "USD: 3.673" or "USD - 3.673" or just "USD 3.673"
//         const regex = /([A-Z]{3})[\s\-:]*([0-9]+\.[0-9]+)/g;
//         const text = document.body.textContent;
//         let match;

//         while ((match = regex.exec(text)) !== null) {
//           results.push({
//             code: match[1],
//             rate: match[2],
//           });
//         }

//         return results;
//       };

//       // 4. Look for tables that might contain rates
//       const tables = Array.from(document.querySelectorAll("table"));
//       const rateTables = tables.filter((table) => {
//         const text = table.textContent.toLowerCase();
//         return (
//           text.includes("rate") ||
//           text.includes("currency") ||
//           text.includes("exchange") ||
//           currencyCodes.some((code) => text.includes(code.toLowerCase()))
//         );
//       });

//       return {
//         type: "fallback",
//         currencyPairs: extractCurrencyPairs(),
//         tables: rateTables.map((table) => table.outerHTML),
//         bodyText: document.body.innerText.substring(0, 50000), // First 50K chars of text
//       };
//     });

//     console.log(`Found data of type: ${ratesData.type}   `);
//     if (ratesData.data) {
//       console.log(
//         "Raw extracted HTML segments:\n",
//         ratesData.data.join("\n\n")
//       ); // Limit output for readability
//     }

//     // Prepare the prompt based on what we found
//     let prompt;
//     if (
//       ratesData.type === "containers" ||
//       ratesData.type === "currency_elements"
//     ) {
//       prompt = `
//           The following HTML contains currency exchange rates from Al Ansari Exchange homepage.
//           Extract all currency exchange rates and return them in this JSON format:
//           {
//             "currencies": [
//               {
//                 "country": "Country Name",
//                 "currency": "Currency Name",
//                 "code": "Currency Code",
//                 "rate": "Exchange Rate Value"
//               },
//               ...
//             ],
//             "total_count": number of currencies
//           }

//           Here are the HTML sections with exchange rates:
//           ${ratesData.data.join("\n\n")}
//         `;
//     } else {
//       // For fallback data
//       let promptContent = "";

//       if (ratesData.currencyPairs && ratesData.currencyPairs.length > 0) {
//         promptContent += `I found these currency pairs: ${JSON.stringify(
//           ratesData.currencyPairs
//         )}\n\n`;
//       }

//       if (ratesData.tables && ratesData.tables.length > 0) {
//         promptContent += `I found these tables that might contain rates: ${ratesData.tables.join(
//           "\n"
//         )}\n\n`;
//       }

//       promptContent += `Here's the text content of the page: ${ratesData.bodyText}`;

//       prompt = `
//           The following content is from Al Ansari Exchange homepage.
//           Extract all currency exchange rates and return them in this JSON format:
//           {
//             "currencies": [
//               {
//                 "country": "Country Name",
//                 "currency": "Currency Name",
//                 "code": "Currency Code",
//                 "rate": "Exchange Rate Value"
//               },
//               ...
//             ],
//             "total_count": number of currencies
//           }

//           ${promptContent}
//         `;
//     }

//     console.log("Sending prompt to Gemini...");
//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: prompt,
//     });

//     // Parse the response to ensure valid JSON
//     try {
//       const jsonText = response.text;
//       // Extract JSON if it's wrapped in markdown code blocks
//       const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/) ||
//         jsonText.match(/```\n([\s\S]*?)\n```/) || [null, jsonText];

//       const cleanedJson = jsonMatch[1].trim();
//       const data = JSON.parse(cleanedJson);
//       console.log("Successfully extracted currency data:");
//       console.log(JSON.stringify(data, null, 2));
//     } catch (err) {
//       console.error("Failed to parse JSON response:", err);
//       console.log("Raw response:", response.text);
//     }
//   } catch (error) {
//     console.error("Error during execution:", error);
//   } finally {
//     await browser.close();
//   }
// }

async function main() {
  console.log("Starting browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    console.log("Navigating to Al Ansari Exchange...");
    await page.goto("https://www.alansariexchange.com", {
      waitUntil: "networkidle2", // Wait until network is idle
      timeout: 60000,
    });

    // Wait for rate table to be available
    await page.waitForSelector("table.table", { timeout: 30000 });

    console.log("Extracting exchange rates...");

    // Extract the exchange rates directly from the exchange rates page
    const ratesData = await page.evaluate(() => {
      const currencies = [];

      // Select all rows in the exchange rate table except the header row
      const rows = Array.from(
        document.querySelectorAll("table.table tbody tr")
      );

      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll("td"));

        // Only process rows with enough cells
        if (cells.length >= 4) {
          const country = cells[0]?.textContent?.trim() || "";
          const currency = cells[1]?.textContent?.trim() || "";
          const code = cells[2]?.textContent?.trim() || "";
          const rate = cells[3]?.textContent?.trim() || null;

          currencies.push({
            country,
            currency,
            code,
            rate,
          });
        }
      });

      return {
        currencies,
        total_count: currencies.length,
      };
    });

    console.log("Exchange rates data:");
    console.log(JSON.stringify(ratesData, null, 2));

    return ratesData;
  } catch (error) {
    console.error("Error during execution:", error);
  } finally {
    await browser.close();
  }
}

// Run the script

main();
