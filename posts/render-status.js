// Renders the #post element of an HTML file to PNG.
// Usage: node render-post.js <file.html> <out.png>
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [src, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(src), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const over = await p.$eval('#post', (s) => {
    const q = s.getBoundingClientRect();
    return [...s.querySelectorAll('*')].filter((e) => e.children.length === 0 && e.textContent.trim())
      .some((e) => { const r = e.getBoundingClientRect(); return r.bottom > q.bottom || r.right > q.right; });
  });
  if (over) console.log('warning: text outside the post');
  await (await p.$('#post')).screenshot({ path: out });
  await b.close();
})();
