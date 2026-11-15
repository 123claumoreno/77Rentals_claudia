# Estilo Cuento kit: 77Rentals

This folder is a small Remotion project for making "Estilo Cuento" storybook videos for 77Rentals. It's used by Claudia Moreno, the 77Rentals host. Talk to her in Spanish, warmly and without technical jargon. Explain in plain words what you're doing and why.

- To make or edit videos, follow the **`estilo-cuento`** skill in `.claude/skills/estilo-cuento/SKILL.md`.
- To give a video a narrator voice, choose Claudia's voice or check credits, follow the **`voz-cuentacuentos`** skill. Never print, copy or ask for the ElevenLabs key, and always say how many credits something costs and wait for her yes before spending. The chosen voice is in `voz.json`.
- To create a video style of Claudia's own, follow the **`mi-estilo`** skill. Styles live in `src/estilos/`; `plantilla` is the plain starting point.
- 77Rentals manages vacation apartments in Santa Marta (Edificio Delventto, Pozos Colorados), Cartagena and Bogotá. Website: 77rentals.com. WhatsApp: +57 304 673 6241.
- Brand colours: purple #8B3FA1 / #5E2370 / #3A1248, gold #E3B23C / #F2D58A, cream #FBF7F0. The logo is `public/img/logo.jpeg`.
- Don't install new packages or upgrade versions unless Claudia asks. If something fails, explain it simply and propose a fix before doing anything big.
- Never put guests' personal data (phones, ID documents) in videos or files.

## Claudia works from her phone (Claude Code on the web)

In her repo this kit is the `cuentos/` folder. Run every command from inside `cuentos/`.

- **First thing each session:** `cd cuentos && npm install`. If rendering says it can't launch the browser, run `npx remotion browser ensure` and try again.
- **The ElevenLabs key is not in the session and that's correct.** The cloud environment has a *network secret* for `api.elevenlabs.io` that adds the key on the way out. `scripts/voz.mjs` works without it. If ElevenLabs answers 401, tell Claudia the secret is missing or wrong in claude.ai/code (environment settings); never ask her to paste the key in chat or into a file.
- **She can't open files in the session.** Everything she needs to see or hear goes to the repo:
  - preview frames (PNG), voice tests (MP3), previews and final videos (MP4) are copied to `../videos/cuentos/` (create it if needed), committed and pushed;
  - then give her the GitHub link to each file (`https://github.com/123claumoreno/77Rentals_claudia/blob/<branch>/videos/cuentos/<file>`); she opens it in the GitHub app or the browser;
  - previews at `--scale=0.5` keep files small. Delete old previews from `videos/cuentos/` when she approves the final, so the repo doesn't fill up.
- **Choosing a voice:** `node scripts/voz.mjs buscar ...` prints a list with "escuchar" links to free samples. Paste that list to her as-is so she can tap and listen.
- After she approves something, commit with a short clear message. Don't merge or delete branches unless she asks.
- **Her brand folder:** the repo root has `brand/BRAND.md` (logo `brand/logos/logo77.jpeg`, palette, fonts). The Estilo Cuento keeps its own watercolour palette, but a new style of her own (`mi-estilo`) should follow `brand/BRAND.md`.
