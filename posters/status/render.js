// Renders #poster of an HTML file to PNG at 1080x1920.
// Usage: node render.js <file.html> <out.png>
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [src, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(src), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const el = await p.$('#poster');
  const bad = await el.evaluate((s) => {
    const q = s.getBoundingClientRect();
    return [...s.querySelectorAll('*')].filter((e) => e.children.length === 0)
      .filter((e) => { const r = e.getBoundingClientRect(); return r.bottom > q.bottom - 250 || r.top < q.top + 220; })
      .map((e) => e.className || e.tagName);
  });
  if (bad.length) console.log('inside the app bars:', bad.join(', '));
  await el.screenshot({ path: out });
  await b.close();
})();
