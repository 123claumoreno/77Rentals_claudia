// Renders cotizacion-una-pagina.html to a single-page PDF and PNG preview.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.resolve('cotizacion-una-pagina.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  console.log('overflow:', await p.$eval('main', m => [m.scrollHeight, m.clientHeight]));
  await p.pdf({ path: 'cotizacion-una-pagina.pdf', preferCSSPageSize: true, printBackground: true });
  await (await p.$('.page')).screenshot({ path: 'preview.png' });
  await b.close();
})();
