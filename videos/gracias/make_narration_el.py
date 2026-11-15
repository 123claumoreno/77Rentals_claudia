"""Narration with ElevenLabs (the voice chosen in audio/voz.json), with human pauses between sentences.
The API key is never read here: in Claude Code on the web the environment's network secret adds it on the way out.
Usage: python3 make_narration_el.py [scene numbers...]   (no numbers = all scenes)
Writes audio/narr-XX.mp3 and updates durations and city_t in audio/narration.json. Costs ~1 credit per letter.
Env AUDIO_DIR changes the folder (default: audio)."""
import sys, os, json, base64, re, subprocess
A = os.environ.get("AUDIO_DIR", "audio")
cfg = json.load(open(f"{A}/voz.json")); nar = json.load(open(f"{A}/narration.json"))
text = nar["text"]; idxs = [int(a) for a in sys.argv[1:]] or list(range(len(text)))
brk = cfg.get("pausas", {}).get("frase", .5)
def con_pausas(t):          # a breath of silence after each sentence, like a person reading aloud
    return re.sub(r"([.!?:])\s+", lambda m: f'{m.group(1)} <break time="{brk}s" /> ', t)
def pedir(i):
    body = json.dumps({"text": con_pausas(text[i]), "model_id": cfg["modelo"], "language_code": "es", "voice_settings": cfg["ajustes"]})
    r = subprocess.run(["curl", "-sS", "-m", "120", "-X", "POST", "-H", "content-type: application/json", "-d", body,
                        f"https://api.elevenlabs.io/v1/text-to-speech/{cfg['id']}/with-timestamps?output_format=mp3_44100_128"], capture_output=True, text=True).stdout
    d = json.loads(r)
    if "audio_base64" not in d: sys.exit(f"escena {i}: {str(d)[:300]}")
    return d
for i in idxs:
    d = pedir(i)
    open(f"{A}/narr-{i:02d}.mp3", "wb").write(base64.b64decode(d["audio_base64"]))
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{A}/narr-{i:02d}.mp3"], capture_output=True, text=True).stdout)
    nar["durations"][i] = round(dur, 2)
    al = d.get("alignment") or d.get("normalized_alignment")
    if al and "Barranquilla" in text[i]:       # when each city is named, to time the tags on screen
        s = "".join(al["characters"]); ct = []
        for name in ["Cartagena,", "Barranquilla", "Santa Marta", "Bogotá"]:
            k = s.find(name if name != "Cartagena," else "Cartagena", s.find("hospedaje"))
            ct.append(round(al["character_start_times_seconds"][k] + 0.45 - 0.1, 2))
        nar["city_t"] = ct
    print(f"escena {i}: {dur:.2f} s, {len(con_pausas(text[i]))} caracteres")
json.dump(nar, open(f"{A}/narration.json", "w"), ensure_ascii=False, indent=1)
