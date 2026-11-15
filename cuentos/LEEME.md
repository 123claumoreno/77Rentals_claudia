# Cuentos con voz, desde el celular

Esta carpeta hace videos verticales "Estilo Cuento" (y tu propio estilo, cuando lo crees) con voz de narradora o narrador.

## Configurar una sola vez (en el navegador del celular)

La clave de ElevenLabs **nunca** va en el chat ni en el repositorio (este repositorio es público). Se guarda como secreto en tu entorno de Claude:

1. Abre **claude.ai/code** en el navegador (Chrome o Safari), no en la app.
2. Debajo del cuadro de mensaje, toca el **selector de entorno** y luego el ícono de **configuración** de tu entorno.
3. En **Network secrets** (secretos de red), agrega uno:
   - **Host:** `api.elevenlabs.io`
   - **Encabezado (header):** `xi-api-key`
   - **Prefijo:** vacío
   - **Valor:** la clave que te pasaron
4. Guarda. Después de guardarla ya no se puede volver a ver, y está bien así.

## Para empezar

En la app de Claude, pestaña **Code**, abre una sesión en este repositorio y escribe:

> Quiero escoger mi voz cuentacuentos: voz de mujer, cálida, con acento colombiano.

Claude te manda una lista de voces con enlaces para escuchar (gratis). Cuando una te guste, le dices cuál.

Otros ejemplos:

> Haz un video estilo cuento de bienvenida para la familia Rodríguez, que llega el 22 de diciembre. Muéstrame primero el guion.

> Ponle voz a la bienvenida de los Rodríguez.

> Quiero crear mi propio estilo de video.

## Cómo ves los videos

Claude sube los cuadros de prueba, las pruebas de voz y los videos a la carpeta `videos/cuentos/` del repositorio y te manda el enlace. Ábrelo con la app de GitHub o el navegador.

## Créditos

La voz gasta créditos de ElevenLabs (más o menos 1 por letra). Antes de gastar, Claude te dice cuánto cuesta y espera tu "sí". Escuchar las muestras de voces es gratis.

La marca no se dice en voz alta: "77Rentals" sale en pantalla.
