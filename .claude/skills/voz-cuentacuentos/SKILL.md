---
name: voz-cuentacuentos
description: Pone voz de narrador (ElevenLabs) a los videos del kit. Úsalo cuando Claudia quiera elegir o cambiar su voz cuentacuentos, escuchar voces, probar una frase, narrar una historia, o pregunte cuántos créditos quedan. También cuando diga "ponle voz", "narración", "voz en off", "quiero mi propia voz".
---

> En el repo de Claudia este kit es la carpeta `cuentos/`: corre todos los comandos desde ahí. Lo que ella tenga que ver u oír se sube a `videos/cuentos/` con su enlace de GitHub (ver `cuentos/CLAUDE.md`).

# Voz cuentacuentos · ElevenLabs

Todo se hace con `node scripts/voz.mjs`. La voz elegida está en `voz.json`. La clave no está en ningún archivo: en la nube la pone el entorno (secreto de red para api.elevenlabs.io).

## Reglas que no se rompen
- **Nunca pidas, muestres ni guardes la clave.** Si ElevenLabs responde 401, el secreto del entorno falta o está mal: díselo a Claudia con palabras simples.
- **Los créditos son limitados y compartidos.** Antes de gastar, dile a Claudia cuántos créditos va a costar y espera su "sí". Escuchar muestras de voces (`buscar`) es gratis; `probar` y `narrar --si` gastan, más o menos 1 crédito por letra.
- **Una sola voz por video.** No generes la misma historia con dos voces para comparar: para comparar voces, usa las muestras gratis o una sola frase corta con `probar`.
- **La marca no se dice en voz.** "77Rentals" va en pantalla, nunca en la narración. El script se detiene si una frase dice "77" o "Rentals": en esa escena agrega `dicho: '...'` sin la marca.
- Primero el guion y la aprobación de Claudia, después la voz. Si una frase cambia después de narrar, esa frase vuelve a leerse a ritmo de lectura hasta que la narres otra vez (solo se regenera esa).

## 1. Elegir la voz de Claudia (una vez)
1. Pregúntale cómo se imagina a su narrador o narradora: ¿mujer u hombre? ¿joven, mamá, abuela? ¿cálida, alegre, misteriosa, pausada? ¿acento colombiano?
2. Busca y arma la página de muestras (gratis):
   `node scripts/voz.mjs buscar [palabras] [--mujer|--hombre] [--colombia]`
   Ejemplos de palabras: `cuentos`, `calida`, `abuela`, `storyteller`, `warm`. Si sale poco, quita filtros.
3. Pégale a Claudia la lista que imprime el comando, con los enlaces "escuchar" (ella los toca en el celular). Recomiéndale 3 o 4 que encajen con lo que pidió.
4. Cuando elija, agrégala (gratis). El comando exacto aparece debajo de cada voz en la página:
   `node scripts/voz.mjs agregar <owner_id> <voice_id> "Nombre"`
5. Haz una prueba corta con una frase de sus cuentos (cuesta unos 60 créditos):
   `node scripts/voz.mjs probar "Dicen que detrás de esta puerta, las vacaciones empiezan solas."`
   y súbela a `videos/cuentos/` con su enlace de GitHub para que la oiga.

Si ninguna voz de la biblioteca le gusta, ElevenLabs también permite **diseñar una voz desde una descripción** (Voice Design) en su página web. Eso se hace con la cuenta de ElevenLabs, no desde aquí: dile a Claudia que lo pida a quien le dio la clave.

### Ajustes finos (opcional)
En `voz.json`, `"ajustes"` puede ser `null` (los de la voz) o algo como
`{"stability": 0.5, "similarity_boost": 0.75, "style": 0.2, "speed": 0.95}`.
Más `stability` = más pareja; menos = más expresiva. `speed` entre 0.8 y 1.1. Cambia una cosa a la vez y prueba con `probar`.

## 2. Narrar una historia
1. Revisa las frases. Para que suenen bien, usa `dicho` en la escena cuando lo escrito y lo hablado deban ser distintos:
   `{escena: 'puerta', texto: 'Apartamento 904', dicho: 'Apartamento nueve cero cuatro'}`
   Números, fechas raras, nombres en inglés o siglas suelen necesitarlo. Si un nombre suena mal, escríbelo como se pronuncia en `dicho`.
2. Mira el costo sin gastar nada: `node scripts/voz.mjs narrar <id>`
3. Díselo a Claudia ("son unos 340 créditos") y espera su sí. Luego: `node scripts/voz.mjs narrar <id> --si`
4. El video ya usa la voz solo: cada escena dura lo que dura su frase, las palabras se encienden mientras se dicen y la música baja. Revisa 2 cuadros y haz la vista previa como siempre.
5. `node scripts/voz.mjs creditos` dice cuánto queda en el mes (si la clave tiene ese permiso).

Para un video sin voz aunque la historia esté narrada: `voz: false` en la historia.

## Si algo falla
- **401 / sin permiso:** la clave no tiene ese permiso (por ejemplo, para agregar voces). Explícalo simple y que Claudia le pida a quien le dio la clave que lo active.
- **Sin créditos:** no insistas; avisa a Claudia.
- **"No encuentro una historia":** el `id:` del archivo tiene que ser exactamente el que se pasa al comando, y cada escena tiene que estar escrita como `{escena: '...', texto: '...'}`.
