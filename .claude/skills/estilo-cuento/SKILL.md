---
name: estilo-cuento
description: Crea videos verticales "Estilo Cuento" de 77Rentals (cuento ilustrado a mano, acuarela, mariposas amarillas) con Remotion en este proyecto. Úsalo cuando Claudia pida un video cuento, una bienvenida personalizada para huéspedes, una historia de un apartamento, o diga "estilo cuento", "video cuento", "cuentacuento" o "bienvenida en video".
---

> En el repo de Claudia este kit es la carpeta `cuentos/`: corre todos los comandos desde ahí. Lo que ella tenga que ver u oír se sube a `videos/cuentos/` con su enlace de GitHub (ver `cuentos/CLAUDE.md`).

# Estilo Cuento · 77Rentals

Videos verticales (1080×1920, 30 fps) que parecen un libro de cuentos ilustrado a mano. Están dibujados con código: no se usan fotos.

## Cómo se ve (no cambiar sin que Claudia lo pida)
- **Trazo:** hecho a mano que "hierve" (se redibuja cada 4 frames), textura de papel, mancha de acuarela y viñeta cálida.
- **Personajes recortados:**
  - papá con sombrero tipo vueltiao
  - **mamá = el componente `Mom`** de `src/cuento/people.tsx`: vestido, pelo ondulado y sombrero opcional. Nunca uses `LOOKS.mom`, porque el diseño viejo no gustó.
  - niña, niño y un perrito dorado
- **Paleta:** acuarelas suaves más los colores de la marca: morado #8B3FA1 / #5E2370 / #3A1248 y dorado #E3B23C / #F2D58A.
- **Texto:** cada escena tiene **una frase corta** en una tarjeta crema con letra a mano (Caveat). Las palabras se encienden a ritmo de lectura.
- **Transiciones:** un enjambre de **mariposas amarillas** entre escenas, un guiño a Macondo y García Márquez.
- **Cierre:** el título, el logo, **77rentals.com**, **WhatsApp +57 304 673 6241** y "Claudia · tu anfitriona". Sin botones de Airbnb ni de Booking.

## Cómo está armado
- `src/historias/*.ts`: **cada historia es un archivo.** Contiene el reparto (quiénes salen) y una lista de escenas, cada una con su frase. Hay que registrarla en `src/historias/index.ts`.
- `src/motor/escenas.ts`: la biblioteca de escenas (ver abajo). Cada escena tiene una duración mínima porque su animación la necesita.
- `src/motor/Cuento.tsx`: el motor. Calcula la duración según el texto y agrega transiciones, tarjetas, música suave y sonidos.
- `src/story/kit.tsx` y `src/cuento/people.tsx`: los ingredientes de dibujo: `Sketch`, `ln`, `P`, `Person`, `Mom`, `Dog`, `Fly` (mariposa), `Cloud`, `Palm`, `Banner`, `hand`.
- `src/cuento/Scenes.tsx`: las escenas ya dibujadas.
- **Video final:** cada historia se convierte en `Cuento-<id>`.

### Escenas disponibles (`escena:`)
| id | qué muestra |
|---|---|
| `puerta` | Puerta morada con brillo dorado y mariposas. El número sale de `reparto.puerta` (por defecto `'717'`; con `''` no lleva número). Buen inicio. |
| `llegada` | Avión sobre el Caribe y la familia que llega en taxi con maletas. |
| `edificio` | Torre Delventto en Santa Marta, palmas y la familia entrando. Es específica de Delventto; no la uses para otros edificios. |
| `balcon` | Mamá abre el balcón: brisa, mar y cielo. Suena el mar. |
| `piscina` | Tarde de piscina con chapuzón. Con `toddler: true` se vuelve un chapuzón tranquilo. |
| `atardecer` | Cielo morado desde el rooftop. |
| `noche` | La familia duerme tranquila, con estrellas y sonidos de noche. |
| `cierre` | Tarjeta final con `reparto.title`, `reparto.checkin` (opcional), logo y contactos. Ponla siempre al final. |

### Reparto (`reparto`)
- `kids`: lista de `{look: LOOKS.girl | LOOKS.boy, s: 0.85–1}`.
- `dog`: `true` o `false`. El perro aparece solo si es `true`.
- `toddler`: opcional, agrega un bebé.
- `title`: el título del cierre, por ejemplo "¡Bienvenidos, familia Pérez!".
- `checkin`: opcional, por ejemplo "Check-in · 20 de diciembre".
- `puerta`: el número de la puerta.

**Límite conocido:** las escenas `piscina`, `edificio` y `atardecer` siempre dibujan a la niña y al niño, sin importar `kids`. Si Claudia necesita otra familia ahí, hay que editar esa escena en `src/cuento/Scenes.tsx`, leyendo `useCast().kids` como ya lo hacen `llegada` y `cierre`.

## Flujo de trabajo (siempre en este orden)
1. **Guion primero.** Antes de tocar código, muéstrale a Claudia una tabla con escena, frase y una nota visual de 4 a 8 escenas.
   - Frases cortas, de 12 palabras como máximo, cálidas, en español de Colombia y en tono de cuento ("Dicen que…").
   - Espera su aprobación.
2. **Crea la historia** en `src/historias/<id>.ts` (copia `bienvenida.ts` o `macondo.ts`) y regístrala en `index.ts`.
3. **Prueba visual:** renderiza 2 o 3 cuadros y míralos tú mismo (lee los PNG) antes de mostrarlos:
   `npx remotion still src/index.ts Cuento-<id> out/<id>-f60.png --frame=60 --scale=0.5`
   Revisa que el texto quepa en la tarjeta, que nada se corte y que el reparto sea el correcto.
4. **Vista previa** a media resolución para que Claudia la vea:
   `npx remotion render src/index.ts Cuento-<id> out/<id>-preview.mp4 --scale=0.5`
5. **Final**, cuando ella apruebe:
   `npx remotion render src/index.ts Cuento-<id> out/<id>.mp4 --codec h264 --crf 17`
   Entrégale la ruta del archivo.
6. Para revisar a los personajes: `npx remotion still src/index.ts Elenco out/elenco.png`

**Primera vez en un computador nuevo:** corre `npm install`. Si al renderizar sale "Failed to launch the browser", corre `npx remotion browser ensure` y vuelve a intentar.

## Reglas de contenido (77Rentals)
- **No inventes datos de los apartamentos.** Si no sabes un dato, pregúntale a Claudia.
- **No pongas precios, calificaciones ni reseñas.** No digas "frente al mar" ni "vista al mar" si no es verdad. Para Macondo di "brisa del mar", no "vista al mar".
- **Bienvenidas personalizadas:** usa solo el nombre de la familia y la fecha que Claudia te dé. No pongas datos personales como teléfonos o documentos de los huéspedes.
- **Voz:** la narración es opcional y se hace con la skill `voz-cuentacuentos` (después de aprobar el guion). Sin voz, el texto va en pantalla a ritmo de lectura. La música suave (`public/music.mp3`) y los sonidos están activados; se apagan con `musica: false`, `sonidos: false` o `voz: false` en la historia.
- **Escenas nuevas:** si Claudia pide algo que no existe en la biblioteca (por ejemplo una cocina o la playa), puedes dibujar una escena nueva en `src/cuento/Scenes.tsx`:
  - usa los mismos ingredientes: `Sketch`, `ln`, la paleta `P`, `Person`, `Mom`, `Dog`, `Fly`, `Cloud`, `Palm`
  - deja el mismo margen arriba para la tarjeta (y ≈ 170–400)
  - regístrala en `src/motor/escenas.ts` con `min` y `lead`
  - muestra primero un cuadro de prueba
- **No cambies las versiones de los paquetes** (Remotion 4.0.527 exacto).
