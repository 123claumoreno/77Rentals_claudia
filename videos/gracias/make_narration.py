"""Narration for the farewell comic: one clip per panel, woman's voice (Piper es_MX-claude-high, runs locally).
House rule (brand/BRAND.md): the narrator never says the brand name; the brand is shown on screen only.
Usage: python3 make_narration.py <path to es_MX-claude-high.onnx>"""
import sys, json, wave
from piper import PiperVoice, SynthesisConfig
NARR = [
 "¡Hola, Camilo! ¡Hola, familia! Esperamos que hayan disfrutado muchísimo su estadía.",
 "Hoy es nuestro día de chek aut. Recuerda que la hora máxima de salida es a las doce del mediodía.",
 "Antes de salir, recuerda dejar todas las luces, aires acondicionados y electrodomésticos apagados.",
 "Y por favor, deposita la basura en el chute de basuras del edificio antes de salir.",
 "Un último detalle: deja la llave en la caja de seguridad pegada a la puerta.",
 "Nos encantaría que nos compartieras cómo fue tu experiencia reservando y hospedándote con nosotros.",
 "¡Gracias por elegirnos! Gracias por permitirnos ser parte de sus días en Cartagena. ¡Fue un placer recibirlos!",
 "Recuerda que siempre tendremos las puertas abiertas para recibirlos nuevamente.",
 "Forma parte de nuestro plan de fidelización y disfruta de beneficios especiales por regresar y reservar directamente con nosotros.",
 "Recuerda que tenemos varias opciones de hospedaje: Cartagena, Barranquilla, Santa Marta y Bogotá siempre los están esperando.",
 "Hoy regresan a Bogotá. ¡Buen viaje, Camilo y familia! Feliz regreso a casa.",
 "No despedimos huéspedes: ¡damos la bienvenida a futuras experiencias! Escríbenos por WhatsApp.",
]
voice = PiperVoice.load(sys.argv[1])
cfg = SynthesisConfig(length_scale=0.88)
durs = []
for i, t in enumerate(NARR):
    p = f"audio/narr-{i:02d}.wav"
    with wave.open(p, "wb") as wf:
        voice.synthesize_wav(t, wf, syn_config=cfg)
    with wave.open(p) as w: durs.append(round(w.getnframes() / w.getframerate(), 2))
json.dump({"durations": durs, "text": NARR}, open("audio/narration.json", "w"), ensure_ascii=False, indent=1)
print(durs, round(sum(durs), 1))
