import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(stealthPlugin());

const browser = await puppeteer.launch();
const page = await browser.newPage();
export browser