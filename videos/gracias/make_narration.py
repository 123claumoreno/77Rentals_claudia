"""Narration for the farewell comic: one clip per panel, man's warm voice (Piper es_MX-ald-medium, runs locally).
House rule (brand/BRAND.md): the narrator never says the brand name; the brand is shown on screen only.
Usage: python3 make_narration.py <path to es_MX-ald-medium.onnx>"""
import sys, json, wave
from piper import PiperVoice, SynthesisConfig
NARR = [
 "¡Hola, Camilo! ¡Hola, familia! Esperamos que hayan disfrutado muchísimo su estadía.",
 "Hoy es el día de chek aut: la hora máxima de salida es a las doce del mediodía.",
 "Antes de salir, deja luces, aires y electrodomésticos apagados.",
 "Deposita la basura en el chute del edificio.",
 "Y deja la llave en la caja de seguridad de la puerta.",
 "Cuéntanos cómo fue tu experiencia reservando y hospedándote con nosotros.",
 "¡Gracias por elegirnos! Fue un placer recibirlos en Cartagena.",
 "Siempre tendremos las puertas abiertas para recibirlos de nuevo.",
 "Forma parte de nuestro plan de fidelización y disfruta de beneficios especiales por regresar y reservar directo con nosotros.",
 "Recuerda que tenemos varias opciones de hospedaje: Cartagena, Barranquilla, Santa Marta y Bogotá los están esperando.",
 "Hoy regresan a Bogotá. ¡Buen viaje, Camilo y familia!",
 "No despedimos huéspedes: ¡damos la bienvenida a futuras experiencias! Escríbenos por WhatsApp.",
]
voice = PiperVoice.load(sys.argv[1])
cfg = SynthesisConfig(length_scale=0.8)
durs = []
for i, t in enumerate(NARR):
    p = f"audio/narr-{i:02d}.wav"
    with wave.open(p, "wb") as wf:
        voice.synthesize_wav(t, wf, syn_config=cfg)
    with wave.open(p) as w: durs.append(round(w.getnframes() / w.getframerate(), 2))
def measure(t):
    with wave.open("audio/_m.wav", "wb") as wf: voice.synthesize_wav(t, wf, syn_config=cfg)
    with wave.open("audio/_m.wav") as w: return w.getnframes() / w.getframerate()
pre = measure("Recuerda que tenemos varias opciones de hospedaje:")
t = 0.45 + pre; city_t = []
for piece in ["Cartagena,", "Barranquilla,", "Santa Marta", "y Bogotá"]:
    city_t.append(round(t - 0.1, 2)); t += measure(piece)
json.dump({"durations": durs, "text": NARR, "city_t": city_t}, open("audio/narration.json", "w"), ensure_ascii=False, indent=1)
print(durs, round(sum(durs), 1))
