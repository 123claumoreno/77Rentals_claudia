// Renders every .slide in an HTML file to PNG.
// Usage: node render-stories.js <file.html> <outDir> <prefix>
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [src, outDir, prefix] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(src), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const slides = await p.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    // Instagram covers roughly the top and bottom 250 px of a story: warn if text lands there.
    const bad = await slides[i].evaluate((s) => {
      const q = s.getBoundingClientRect();
      return [...s.querySelectorAll('*')].filter((e) => e.children.length === 0 && e.textContent.trim())
        .some((e) => { const r = e.getBoundingClientRect(); return r.bottom > q.bottom - 250 || r.top < q.top + 220; });
    });
    if (bad) console.log('slide', i + 1, 'has text inside the Instagram bars');
    await slides[i].screenshot({ path: path.join(outDir, `${prefix}-${i + 1}.png`) });
  }
  console.log(slides.length, 'slides');
  await b.close();
})();
