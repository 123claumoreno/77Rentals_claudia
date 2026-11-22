// Renders the poster to PNG and PDF.
// Usage: node render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = __dirname;
  const out = path.resolve(dir, '../exports');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(dir, 'cartagena-fin-de-ano.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const fonts = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family));
  console.log('fonts loaded:', [...new Set(fonts)].join(', ') || 'none (fallback)');
  await p.locator('.poster').screenshot({ path: path.join(out, 'cartagena-fin-de-ano.png') });
  await p.pdf({ path: path.join(out, 'cartagena-fin-de-ano.pdf'), format: 'A4', printBackground: true });
  await b.close();
})();
