import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = "file://" + path.join(__dirname, "dist", "index.html");
const out = (n) => path.join(__dirname, "screenshots", n);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(file, { waitUntil: "networkidle" });
await page.addStyleTag({ content: `.reveal{opacity:1 !important;animation:none !important;transform:none !important;} header{display:none !important;}` });
await page.waitForTimeout(400);
for (const [id, name] of [["testimoni","section-testimoni.png"],["reservasi","section-reservasi.png"]]) {
  const el = await page.$(`#${id}`);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await el.boundingBox();
  await page.screenshot({ path: out(name), clip: { x:0, y:box.y, width:1440, height:box.height } });
}
await browser.close();
console.log("done");
