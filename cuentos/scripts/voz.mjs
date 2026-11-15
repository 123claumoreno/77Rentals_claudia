// La voz cuentacuentos (ElevenLabs).
// - La voz elegida y sus ajustes viven en voz.json (se guarda en el repo).
// - La CLAVE nunca va en el repo: se lee de la variable de entorno ELEVENLABS_API_KEY
//   (o, en Claude Code en la nube, del secreto de red del entorno para api.elevenlabs.io) o, en un computador, de elevenlabs.json
//   ({"apiKey": "..."}), que está en .gitignore.
//
//   node scripts/voz.mjs buscar [palabras] [--mujer|--hombre] [--colombia]
//        -> out/voces.html: muestras de voces de la biblioteca para escuchar. GRATIS (no gasta créditos).
//   node scripts/voz.mjs agregar <owner_id> <voice_id> "Nombre"
//        -> agrega esa voz a la cuenta y la deja elegida en voz.json. Gratis.
//   node scripts/voz.mjs probar "una frase corta"
//        -> out/prueba-voz.mp3 con la voz elegida. Gasta créditos (más o menos 1 por letra).
//   node scripts/voz.mjs narrar <id-historia>
//        -> solo dice cuántos créditos costaría, sin gastar nada.
//   node scripts/voz.mjs narrar <id-historia> --si
//        -> genera public/voz/<id>/s1.mp3, s2.mp3… y src/voz/<id>.json (tiempos de cada palabra).
//           Solo vuelve a generar las frases que cambiaron. --todo regenera todas.
//   node scripts/voz.mjs creditos
//        -> cuántos créditos quedan este mes (si la clave tiene permiso para verlo).
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const API = 'https://api.elevenlabs.io/v1';
const cfgPath = path.join(root, 'voz.json');
const keyPath = path.join(root, 'elevenlabs.json');

const die = (msg) => {
  console.error(`\n✋ ${msg}\n`);
  process.exit(1);
};

const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : {voz: {nombre: '', id: ''}, modelo: 'eleven_v4', ajustes: null};
const fileKey = fs.existsSync(keyPath) ? JSON.parse(fs.readFileSync(keyPath, 'utf8')).apiKey : '';
const rawKey = (process.env.ELEVENLABS_API_KEY || fileKey || '').trim();
const key = rawKey.startsWith('PEGA') ? '' : rawKey;
// No key here is normal in Claude Code on the web: the environment's network secret for
// api.elevenlabs.io adds the xi-api-key header on the way out, so the key never enters the session.
const headers = {'content-type': 'application/json', ...(key ? {'xi-api-key': key} : {})};
const explain = async (res, what) => {
  const body = (await res.text()).slice(0, 400);
  if (res.status === 401 && !key)
    die(`${what}: ElevenLabs no recibió la clave (401). Revisa en claude.ai/code > entorno > Network secrets que exista el secreto para api.elevenlabs.io con el encabezado xi-api-key.`);
  if (res.status === 401) die(`${what}: la clave no sirve o no tiene permiso para esto (401). ${body}`);
  if (res.status === 402 || /quota|credits/i.test(body)) die(`${what}: no quedan créditos suficientes este mes. ${body}`);
  die(`${what}: ElevenLabs respondió ${res.status}. ${body}`);
};
const saveCfg = () => fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + '\n');

const [cmd, ...rest] = process.argv.slice(2);
const flags = rest.filter((a) => a.startsWith('--'));
const args = rest.filter((a) => !a.startsWith('--'));

/* ---------- buscar: free previews from the voice library ---------- */
const buscar = async () => {
  const q = new URLSearchParams({page_size: '40', language: 'es', use_cases: 'narrative_story'});
  if (args.length) q.set('search', args.join(' '));
  if (flags.includes('--mujer')) q.set('gender', 'female');
  if (flags.includes('--hombre')) q.set('gender', 'male');
  if (flags.includes('--colombia')) q.set('accent', 'colombian');
  const res = await fetch(`${API}/shared-voices?${q}`, {headers});
  if (!res.ok) await explain(res, 'Buscar voces');
  const {voices = []} = await res.json();
  if (!voices.length) die('No salió ninguna voz con esa búsqueda. Prueba con otras palabras o sin filtros.');
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
  const genero = {female: 'mujer', male: 'hombre', neutral: 'neutra'};
  const cards = voices
    .map(
      (v) => `<article>
  <h2>${esc(v.name)}</h2>
  <p class="meta">${esc(genero[v.gender] ?? v.gender)} · acento ${esc(v.accent)} · ${esc(v.age)} · ${esc(v.descriptive)}</p>
  <p>${esc((v.description || '').trim())}</p>
  <audio controls preload="none" src="${esc(v.preview_url)}"></audio>
  <code>node scripts/voz.mjs agregar ${esc(v.public_owner_id)} ${esc(v.voice_id)} "${esc(v.name.split(' - ')[0])}"</code>
</article>`,
    )
    .join('\n');
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Voces cuentacuentos</title><style>
body{font-family:system-ui,sans-serif;background:#fbf7f0;color:#3a1248;margin:0;padding:24px;max-width:860px;margin:auto}
h1{margin:0 0 4px}p.sub{margin:0 0 24px;color:#5e2370}
article{background:#fff;border:2px solid #e3b23c;border-radius:14px;padding:16px 18px;margin:0 0 14px}
h2{margin:0 0 4px;font-size:20px}.meta{margin:0 0 8px;color:#8b3fa1;font-size:14px}
audio{width:100%;margin:8px 0}code{display:block;font-size:12px;color:#777;word-break:break-all}
</style></head><body><h1>Voces cuentacuentos en español</h1>
<p class="sub">${voices.length} voces. Escuchar estas muestras no gasta créditos. Cuando te guste una, dile a Claude su nombre.</p>
${cards}</body></html>`;
  fs.mkdirSync(path.join(root, 'out'), {recursive: true});
  const file = path.join(root, 'out', 'voces.html');
  fs.writeFileSync(file, html);
  console.log('Voces (en el celular, cada enlace "escuchar" abre la muestra; es gratis):\n');
  voices.forEach((v, i) =>
    console.log(
      `${i + 1}. **${v.name}** (${genero[v.gender] ?? v.gender}, ${v.accent}, ${v.age}): [escuchar](${v.preview_url})\n   agregar: node scripts/voz.mjs agregar ${v.public_owner_id} ${v.voice_id} "${v.name.split(' - ')[0]}"`,
    ),
  );
  console.log(`\nPágina para escuchar: ${file}`);
};

/* ---------- agregar: add a library voice to the account and pick it ---------- */
const agregar = async () => {
  const [owner, voiceId, ...name] = args;
  if (!owner || !voiceId) die('Uso: node scripts/voz.mjs agregar <owner_id> <voice_id> "Nombre"');
  const nombre = name.join(' ') || 'Cuentacuentos';
  const mine = await fetch(`${API}/voices/${voiceId}`, {headers});
  let id = voiceId;
  if (!mine.ok) {
    const res = await fetch(`${API}/voices/add/${owner}/${voiceId}`, {method: 'POST', headers, body: JSON.stringify({new_name: nombre})});
    if (!res.ok) await explain(res, 'Agregar la voz');
    id = (await res.json()).voice_id ?? voiceId;
  }
  cfg.voz = {nombre, id};
  saveCfg();
  console.log(`Listo: la voz "${nombre}" (${id}) quedó elegida en voz.json.`);
};

/* ---------- text to speech with word timings ---------- */
const needVoice = () => {
  if (!cfg.voz?.id) die('Todavía no hay voz elegida. Primero: node scripts/voz.mjs buscar, y luego agregar.');
};
const tts = async (text, ctx = {}) => {
  const url = `${API}/text-to-speech/${cfg.voz.id}/with-timestamps?output_format=mp3_44100_128`;
  const body = {text, model_id: cfg.modelo || 'eleven_v4', ...(cfg.ajustes ? {voice_settings: cfg.ajustes} : {})};
  let res = await fetch(url, {method: 'POST', headers, body: JSON.stringify({...body, ...ctx})});
  if (!res.ok && Object.keys(ctx).length && res.status !== 401) res = await fetch(url, {method: 'POST', headers, body: JSON.stringify(body)});
  if (!res.ok) await explain(res, `Voz para "${text.slice(0, 40)}…"`);
  const j = await res.json();
  const buf = Buffer.from(j.audio_base64, 'base64');
  const al = j.alignment ?? j.normalized_alignment;
  const words = [];
  let cur = null;
  al.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) return void (cur = null);
    if (!cur) words.push((cur = {w: '', s: al.character_start_times_seconds[i], e: 0}));
    cur.w += ch;
    cur.e = al.character_end_times_seconds[i];
  });
  const palabras = words.map((w) => ({w: w.w, s: +w.s.toFixed(3), e: +w.e.toFixed(3)}));
  const dur = +Math.max(palabras.at(-1)?.e ?? 0, (buf.length * 8) / 128000).toFixed(3);
  return {buf, palabras, dur};
};

const probar = async () => {
  needVoice();
  const text = args.join(' ') || 'Dicen que detrás de esta puerta, las vacaciones empiezan solas.';
  const {buf, dur} = await tts(text);
  fs.mkdirSync(path.join(root, 'out'), {recursive: true});
  const file = path.join(root, 'out', 'prueba-voz.mp3');
  fs.writeFileSync(file, buf);
  console.log(`Prueba lista (${dur}s, unos ${text.length} créditos): ${file}`);
};

/* ---------- narrar: read a story file, voice every line ---------- */
const field = (src, name) => {
  const m = src.match(new RegExp(`\\b${name}\\s*:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)")`));
  return m ? (m[1] ?? m[2]).replace(/\\(.)/g, '$1') : undefined;
};
const leerHistoria = (id) => {
  const dir = path.join(root, 'src', 'historias');
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    if (field(src, 'id') !== id) continue;
    const escenas = [...src.matchAll(/\{\s*escena\s*:[^{}]*\}/g)].map((m) => ({texto: field(m[0], 'texto') ?? '', dicho: field(m[0], 'dicho')}));
    if (!escenas.length) die(`La historia "${id}" (${f}) no tiene escenas que yo pueda leer.`);
    return escenas;
  }
  die(`No encuentro una historia con id: '${id}' en src/historias/.`);
};

const escribirIndice = () => {
  const dir = path.join(root, 'src', 'voz');
  const ids = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
  const lines = [
    '/* Generado por scripts/voz.mjs: no lo edites a mano. Una entrada por historia narrada. */',
    "import type {LineaVoz} from '../motor/voz';",
    ...ids.map((id, i) => `import v${i} from './${id}.json';`),
    '',
    `export const VOCES: Record<string, (LineaVoz | null)[]> = {${ids.map((id, i) => `'${id}': v${i}`).join(', ')}};`,
    '',
  ];
  fs.writeFileSync(path.join(dir, 'index.ts'), lines.join('\n'));
};

const narrar = async () => {
  const id = args[0];
  if (!id) die('Uso: node scripts/voz.mjs narrar <id-historia> [--si]');
  needVoice();
  const escenas = leerHistoria(id);
  const jsonPath = path.join(root, 'src', 'voz', `${id}.json`);
  const audioDir = path.join(root, 'public', 'voz', id);
  const prev = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf8')) : [];
  const todo = flags.includes('--todo');

  const plan = escenas.map((e, i) => {
    const dicho = (e.dicho ?? e.texto).trim();
    if (!dicho) return {i, skip: true};
    const p = prev[i];
    const reuse = !todo && p && p.dicho === dicho && p.vozId === cfg.voz.id && fs.existsSync(path.join(audioDir, `s${i + 1}.mp3`));
    return {i, texto: e.texto, dicho, reuse};
  });
  for (const p of plan) {
    if (p.skip || p.reuse) continue;
    if (/(^|\D)77(\D|$)|siete siete|r[eé]ntals/i.test(p.dicho))
      die(`La escena ${p.i + 1} dice la marca en voz alta ("${p.dicho}"). La marca va solo en pantalla: agrega un dicho: '...' sin la marca.`);
  }
  const nuevas = plan.filter((p) => !p.skip && !p.reuse);
  const costo = nuevas.reduce((a, p) => a + p.dicho.length, 0);
  if (!nuevas.length) console.log('Todas las frases ya tienen voz; no hay nada que generar.');
  else {
    console.log(`Frases por narrar con la voz "${cfg.voz.nombre}":`);
    for (const p of nuevas) console.log(`  escena ${p.i + 1}: ${p.dicho}`);
    console.log(`Costo aproximado: ${costo} créditos.`);
  }
  if (nuevas.length && !flags.includes('--si')) {
    console.log('\nNo gasté nada todavía. Para generar, repite el comando con --si');
    return;
  }

  fs.mkdirSync(audioDir, {recursive: true});
  const out = [];
  for (const p of plan) {
    if (p.skip) {
      out[p.i] = null;
      continue;
    }
    if (p.reuse) {
      out[p.i] = {...prev[p.i], texto: p.texto};
      continue;
    }
    const ctx = {previous_text: plan[p.i - 1]?.dicho, next_text: plan[p.i + 1]?.dicho};
    const {buf, palabras, dur} = await tts(p.dicho, ctx);
    fs.writeFileSync(path.join(audioDir, `s${p.i + 1}.mp3`), buf);
    out[p.i] = {texto: p.texto, dicho: p.dicho, vozId: cfg.voz.id, dur, palabras};
    console.log(`escena ${p.i + 1}: ${dur}s`);
  }
  fs.mkdirSync(path.dirname(jsonPath), {recursive: true});
  fs.writeFileSync(jsonPath, JSON.stringify(out, null, 1));
  escribirIndice();
  console.log(`\nNarración lista: ${jsonPath}`);
  await creditos(true);
};

const creditos = async (quiet) => {
  const res = await fetch(`${API}/user/subscription`, {headers});
  if (!res.ok) {
    if (!quiet) console.log('Esta clave no tiene permiso para ver los créditos. Pregúntale a quien te dio la clave.');
    return;
  }
  const s = await res.json();
  console.log(`Créditos usados este mes: ${s.character_count} de ${s.character_limit}.`);
};

const cmds = {buscar, agregar, probar, narrar, creditos: () => creditos(false)};
if (!cmds[cmd]) die('Comandos: buscar, agregar, probar, narrar, creditos. Mira el comienzo de scripts/voz.mjs.');
await cmds[cmd]();
