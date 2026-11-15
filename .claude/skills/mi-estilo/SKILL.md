---
name: mi-estilo
description: Ayuda a Claudia a inventar y construir su propio estilo de video (distinto al Estilo Cuento), paso a paso y conversando. Úsalo cuando diga "quiero mi propio estilo", "otro estilo", "un look diferente", "algo más mío", o pida cambiar cómo se ven los videos por completo.
---

> En el repo de Claudia este kit es la carpeta `cuentos/`: corre todos los comandos desde ahí. Lo que ella tenga que ver u oír se sube a `videos/cuentos/` con su enlace de GitHub (ver `cuentos/CLAUDE.md`).

# Crear el estilo propio de Claudia

El objetivo es un estilo que sea **de ella**: que alguien vea un video y piense "esto es de Claudia". No es copiar el Estilo Cuento con otros colores. Vas despacio, conversando, y le muestras cuadros de prueba antes de construir todo.

## Paso 1. Conversar (una pregunta a la vez, en palabras sencillas)
Haz estas preguntas **de a una**, esperando cada respuesta. Ofrece 2 o 3 ejemplos concretos en cada una para que sea fácil contestar.
1. **La sensación:** cuando alguien vea tus videos, ¿qué quieres que sienta? (tranquilidad, alegría de fiesta, nostalgia, lujo sencillo, ternura…)
2. **Lo que te gusta mirar:** cosas que te encantan visualmente: revistas, carteles viejos, bordados, cerámica, postales, collages, tu ropa, tu casa, Instagram que sigues. Si tiene fotos o capturas, que las ponga en una carpeta `referencias/` y míralas.
3. **Colores:** ¿qué colores son tuyos? (Puede usar o no los de 77Rentals: morado y dorado. Si no los usa, igual el cierre lleva el logo.)
4. **Letra:** ¿escrita a mano, elegante, redonda y amigable, de máquina de escribir, de cartel?
5. **Cómo se mueve:** ¿suave y lento, con rebote y alegre, como papel recortado, como sello que se estampa?
6. **Personajes:** ¿quieres personajes (personas, animales, una mascota que sea "tuya") o solo objetos, lugares y palabras?
7. **Cómo pasa de una escena a otra:** ¿se pasa la página, se desliza, se estampa, entra un objeto que tape la pantalla (hojas, olas, confeti)?
8. **Nombre:** ponle un nombre al estilo (ej. "Estilo Postal", "Estilo Bordado").

Luego resume en 5 o 6 líneas lo que entendiste y pregúntale si está bien.

## Paso 2. La hoja de estilo
Escribe `src/estilos/<nombre>/ESTILO.md` (en español sencillo): sensación, paleta con códigos de color, letras (de Google Fonts; `@remotion/google-fonts` ya está instalado, cárgalas en `src/theme.ts` o en el estilo), formas y textura, movimiento, transición, personajes, cómo se ve el texto, y qué NO hacer.

## Paso 3. Un solo cuadro de prueba
1. Copia `src/estilos/plantilla/` a `src/estilos/<nombre>/` y renombra el componente (`Plantilla` → el nombre del estilo).
2. Cambia `ESTILO` (colores, letras) y dibuja **una sola escena** que muestre el estilo con fuerza, más la tarjeta de texto a su manera. Se dibuja con código (SVG y formas), sin fotos de internet.
3. Regístralo en `src/estilos/index.ts` (una línea) y crea una historia corta de prueba con `estilo: '<nombre>'`.
4. Renderiza un cuadro, **míralo tú primero** y después muéstraselo:
   `npx remotion still src/index.ts <Prefijo>-<id> out/<nombre>-prueba.png --frame=45 --scale=0.5`
5. Pregunta qué le gusta y qué no. Ajusta hasta que diga "¡ese es!". No sigas antes de eso.

## Paso 4. Su biblioteca de escenas
Con el look aprobado, dibuja de 4 a 6 escenas reutilizables (por ejemplo: llegada, el apartamento, el mar o la ciudad, la noche, el cierre). Cada una va en `ESCENAS_…` con su `min` (duración mínima en cuadros). Muestra un cuadro de cada una.

Reglas para todas:
- Video vertical 1080×1920. Deja un espacio limpio para el texto y no pongas nada importante en los 150 px de arriba ni en los 300 de abajo (ahí van los botones de Instagram y TikTok).
- **El cierre siempre lleva** el logo (`public/img/logo.jpeg`), 77rentals.com, WhatsApp +57 304 673 6241 y "Claudia · tu anfitriona".
- La voz funciona igual que en el Estilo Cuento si usas `vozDe`, `momentoPalabra` y `Narracion` de `src/motor/voz.ts`, como la plantilla.
- Original: inspírate en lo que le gusta a Claudia, pero no copies el diseño, los personajes ni el look de una marca, película, serie o artista concreto.

## Paso 5. Su primer video completo
Guion primero (tabla de escena + frase), aprobación, cuadros de prueba, vista previa a media resolución, voz si la quiere (skill `voz-cuentacuentos`) y video final en `out/`.

## Paso 6. Que su Claude lo recuerde
Crea `.claude/skills/estilo-<nombre>/SKILL.md` siguiendo el modelo de `estilo-cuento`: cómo se ve (lo que no se cambia sin que ella lo pida), las escenas disponibles y el flujo de trabajo. Agrega una línea en `CLAUDE.md` que diga que existe.
