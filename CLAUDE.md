# 77Rentals marketing assets

Posters, videos and listing content for 77Rentals (77rentals.com): short-term
rentals in Cartagena, Santa Marta and Bogotá.

## Brand first

Before making anything, read `brand/BRAND.md` and follow it. In short:

- Logo: `brand/logos/logo77.jpeg`, the only version. Use it as it is, on a
  purple field (#3B2055) or as a rounded card. Never redraw, recolor,
  stretch, cut out or regenerate it.
- Colors: purple #341D63, gold #CBA54D, white. CSS variables are in
  `brand/colors/palette.css`.
- Fonts: Fraunces for headings, General Sans for text (`brand/fonts/`).
- No em dashes or en dashes as punctuation. Spanish uses "tú" and Colombian
  vocabulary.
- Only verified facts: no invented ratings, reviews, results or prices.
- The call to action is WhatsApp: wa.me/573046736241.

If something you need isn't in `brand/` (a transparent logo, a photo, a fact
about a unit), ask instead of making it up.

## Videos estilo cuento (`cuentos/`)

`cuentos/` is a Remotion project for storybook videos with an optional
narrator voice (ElevenLabs) and room for styles of Claudia's own. Before
working there, read `cuentos/CLAUDE.md`, then use the skills in
`.claude/skills/` (`estilo-cuento`, `voz-cuentacuentos`, `mi-estilo`).
Never ask for, print or commit the ElevenLabs key: this repo is public, and
the key reaches ElevenLabs through the cloud environment's network secret.
