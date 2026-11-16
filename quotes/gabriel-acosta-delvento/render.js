// Renders each HTML file to PDF and PNG previews. Usage: node render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const name of ['cotizacion']) {
    const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
    await p.goto('file://' + path.resolve(name + '.html'), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const over = await p.$$eval('.page', (ps) => ps.map((pg) => pg.querySelector('main').scrollHeight > pg.querySelector('main').clientHeight));
    console.log(name, 'overflow per page:', over);
    await p.pdf({ path: name + '.pdf', preferCSSPageSize: true, printBackground: true });
    const pages = await p.$$('.page');
    for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: `${name}-${i + 1}.png` });
    await p.close();
  }
  await b.close();
})();
