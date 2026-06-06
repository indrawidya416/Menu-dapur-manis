import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = "file://" + path.join(__dirname, "dist", "index.html");
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
await page.goto(file, { waitUntil: "networkidle" });
await page.addStyleTag({ content: `.reveal{opacity:1 !important;animation:none !important;transform:none !important;}` });
await page.waitForTimeout(400);
for (const id of ["testimoni","reservasi","kontak"]) {
  const dims = await page.$eval(`#${id}`, el => { const r = el.getBoundingClientRect(); return {w:Math.round(r.width),h:Math.round(r.height),top:Math.round(el.offsetTop)}; });
  console.log(id, JSON.stringify(dims));
}
await browser.close();
