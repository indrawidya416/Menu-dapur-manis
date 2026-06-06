import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = "file://" + path.join(__dirname, "dist", "index.html");
const out = (name) => path.join(__dirname, "screenshots", name);

const browser = await chromium.launch();

// Force all reveal elements visible (bypass IntersectionObserver timing for capture)
const forceVisible = async (page) => {
  await page.addStyleTag({
    content: `.reveal{opacity:1 !important;animation:none !important;transform:none !important;}`,
  });
  await page.waitForTimeout(400);
};

// ---------- Desktop ----------
const desktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await desktop.newPage();
await page.goto(file, { waitUntil: "networkidle" });
await forceVisible(page);

// hero (above the fold)
await page.screenshot({ path: out("desktop-hero.png") });

// full page
await page.screenshot({ path: out("desktop-full.png"), fullPage: true });

// section captures
const sections = [
  ["cerita", "section-cerita.png"],
  ["menu", "section-menu.png"],
  ["galeri", "section-galeri.png"],
  ["testimoni", "section-testimoni.png"],
  ["reservasi", "section-reservasi.png"],
];
for (const [id, name] of sections) {
  const el = await page.$(`#${id}`);
  if (el) {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await el.screenshot({ path: out(name) });
  }
}
await desktop.close();

// ---------- Mobile ----------
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const mpage = await mobile.newPage();
await mpage.goto(file, { waitUntil: "networkidle" });
await forceVisible(mpage);
await mpage.screenshot({ path: out("mobile-hero.png") });
await mpage.screenshot({ path: out("mobile-full.png"), fullPage: true });
await mobile.close();

await browser.close();
console.log("done");
