// Renders #post to PNG and fails loudly if any text is wider than its box.
// Usage: node render-check.js <file.html> <out.png> <width> <height>
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [src, out, w, h] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h } });
  await p.goto('file://' + path.resolve(src), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const bad = await p.evaluate(() => {
    const out = [];
    const post = document.querySelector('#post').getBoundingClientRect();
    document.querySelectorAll('#post *').forEach((e) => {
      if (e.children.length || !e.textContent.trim()) return;
      const r = document.createRange(); r.selectNodeContents(e);
      const t = r.getBoundingClientRect();
      const box = e.closest('[data-box]') || e.parentElement;
      const q = box.getBoundingClientRect();
      if (t.right > q.right + 1 || t.left < q.left - 1 || t.right > post.right || t.bottom > post.bottom)
        out.push(`${e.className || e.tagName}: "${e.textContent.trim().slice(0, 30)}" text ${Math.round(t.left)}-${Math.round(t.right)} box ${Math.round(q.left)}-${Math.round(q.right)}`);
    });
    return out;
  });
  console.log(bad.length ? 'OVERFLOW:\n' + bad.join('\n') : 'no overflow');
  await (await p.$('#post')).screenshot({ path: out });
  await b.close();
})();
