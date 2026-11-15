"""Soundtrack for the farewell comic, all synthesized here (nothing to license):
  1. an upbeat original 'weekend' track,
  2. ambience per panel (sea, room tone, AC, hallway, lobby, wind, jet) and little sound effects timed to what happens on screen,
  3. the narration, with the music and the ambience ducked while someone talks.
Usage: python3 make_audio.py <video_without_audio.mp4> <output.mp4>      (env AUDIO_DIR, default 'audio')"""
import sys, os, json, subprocess, wave
import numpy as np

A = os.environ.get("AUDIO_DIR", "audio")
SR = 44100
tl = json.load(open(f"{A}/timeline.json")); nar = json.load(open(f"{A}/narration.json"))
durs, total = tl["durations"], tl["total"]
CITY_T = nar.get("city_t", [3.46, 4.56, 5.49, 7.15])
starts = np.concatenate([[0], np.cumsum(durs)[:-1]])
N = int(SR * (total + 0.3))
rng = np.random.default_rng(11)
tt = lambda d: np.arange(int(SR * d)) / SR
mtof = lambda m: 440.0 * 2 ** ((m - 69) / 12)

def put(buf, start, y, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i < 0 or i >= N: return
    y = y[: N - i]
    buf[i:i + len(y), 0] += y * gain * (1 - max(0, pan)); buf[i:i + len(y), 1] += y * gain * (1 - max(0, -pan))

def norm(x): return x / (x.std() + 1e-9)
def band(x, lo, hi):
    n = len(x); X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR); m = np.ones_like(f)
    if lo: m *= np.clip((f - lo * .7) / (lo * .3 + 1e-9), 0, 1)
    if hi: m *= np.clip((hi * 1.3 - f) / (hi * .3 + 1e-9), 0, 1)
    return np.fft.irfft(X * m, n)

# ------------------------------------------------------------------ music (same groove as before)
music = np.zeros((N, 2))
def marimba(f, d=.45):
    t = tt(d); return (np.sin(2*np.pi*f*t)*np.exp(-t*7) + .35*np.sin(2*np.pi*3.9*f*t)*np.exp(-t*25) + .1*np.sin(2*np.pi*9.2*f*t)*np.exp(-t*45)) * np.minimum(1, t / .002)
def stab(f, d=.22):
    t = tt(d); return sum(a*np.sin(2*np.pi*f*k*t) for k, a in ((1, 1), (2, .45), (3, .25), (4, .12))) * np.exp(-t*16) * np.minimum(1, t / .003) * .22
def bass(f, d=.4):
    t = tt(d); return np.tanh(1.6*(np.sin(2*np.pi*f*t) + .45*np.sin(4*np.pi*f*t))) * np.exp(-t*4.5) * np.minimum(1, t / .005) * .5
def kick():
    t = tt(.28); return np.sin(2*np.pi*np.cumsum(45 + 95*np.exp(-t*30)) / SR) * np.exp(-t*13) * .9
def clap():
    t = tt(.22); n = rng.standard_normal(len(t)); y = np.zeros(len(t))
    for o in (0, .012, .026): i = int(o*SR); y[i:] += n[:len(t)-i] * np.exp(-t[:len(t)-i]*34)
    return np.diff(y, prepend=0) * .3
def hat(o=False):
    t = tt(.16 if o else .05); return np.diff(rng.standard_normal(len(t)), prepend=0) * np.exp(-t*(22 if o else 80)) * (.16 if o else .12)
def shaker():
    t = tt(.07); return np.diff(rng.standard_normal(len(t)), prepend=0) * np.exp(-t*45) * .07
def conga(f=230):
    t = tt(.2); return np.sin(2*np.pi*np.cumsum(f*(1 + .25*np.exp(-t*40))) / SR) * np.exp(-t*16) * .32
beat = 60 / 108
CH = [[60, 64, 67], [59, 62, 67], [57, 60, 64], [57, 60, 65]]; ROOT = [48, 43, 45, 41]
MEL = [[(0, 76), (.5, 79), (1, 81), (1.5, 79), (2, 76), (3, 74), (3.5, 76)], [(0, 74), (.5, 76), (1, 79), (2, 76), (2.5, 74), (3, 71), (3.5, 74)],
       [(0, 76), (.5, 81), (1, 84), (1.5, 81), (2, 79), (3, 76), (3.5, 79)], [(0, 81), (.5, 79), (1, 77), (2, 76), (2.5, 77), (3, 79), (3.5, 81)]]
for b in range(int((total + .3) / (4 * beat)) + 1):
    t0 = b * 4 * beat; c = b % 4
    for k in range(16):
        ts = t0 + k * beat / 4
        put(music, ts, shaker(), .25, 1 if k % 2 else .7)
        if b >= 2:
            if k % 2 == 0: put(music, ts, hat(k % 4 == 2), -.25)
            if k in (0, 8) or (k == 14 and b % 2): put(music, ts, kick())
            if k in (4, 12): put(music, ts, clap(), .05)
            if k in (3, 7, 10, 15): put(music, ts, conga(210 if k in (3, 10) else 260), -.3 if k in (3, 10) else .3)
    for bp in (.5, 1.5, 2.5, 3.5):
        for m in CH[c]: put(music, t0 + bp * beat, stab(mtof(m)), -.15)
    for bp, off in ((0, 0), (1.5, 0), (2, 0), (3.5, 12 if b % 2 else 0)): put(music, t0 + bp * beat, bass(mtof(ROOT[c] + off)))
    if b >= 4:
        for bp, m in MEL[c]: put(music, t0 + bp * beat, marimba(mtof(m)), .2, .55)
fade = np.ones(N); fi, fo = int(.6 * SR), int(3.5 * SR); fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
music *= fade[:, None]; music /= max(1e-6, np.abs(music).max())

# ------------------------------------------------------------------ ambience beds
t_all = np.arange(N) / SR
def stereo(f): return np.stack([f(), f()], 1)
env = np.clip(.5 + .5*np.sin(2*np.pi*t_all/7.3 + 1.1) + .2*np.sin(2*np.pi*t_all/4.3), 0, 1) ** 2
BED = {
  "ocean": stereo(lambda: .6*norm(band(rng.standard_normal(N), 60, 900))*(.3 + .7*env) + .5*norm(band(rng.standard_normal(N), 2500, 9000))*env**1.5),
  "room":  stereo(lambda: .5*norm(band(rng.standard_normal(N), 60, 380)) + .1*np.sin(2*np.pi*100*t_all)),
  "ac":    stereo(lambda: .6*norm(band(rng.standard_normal(N), 150, 900)) + .15*np.sin(2*np.pi*120*t_all)),
  "hall":  stereo(lambda: .6*norm(band(rng.standard_normal(N), 90, 600)) + .12*np.sin(2*np.pi*60*t_all)),
  "lobby": stereo(lambda: .55*norm(band(rng.standard_normal(N), 200, 1300))*(.7 + .3*np.sin(2*np.pi*t_all/3.1 + rng.random()*6))),
  "wind":  stereo(lambda: .6*norm(band(rng.standard_normal(N), 200, 2200))*(.55 + .45*np.sin(2*np.pi*t_all/5.3 + rng.random()*6))),
  "crowd": stereo(lambda: .5*norm(band(rng.standard_normal(N), 300, 2600))*(.6 + .4*np.sin(2*np.pi*t_all*2.2 + rng.random()*6))),
  "jet":   stereo(lambda: .6*norm(band(rng.standard_normal(N), 150, 1800)) + .25*np.sin(2*np.pi*180*t_all) + .12*np.sin(2*np.pi*360*t_all)),
}
# scene -> {bed: level} or (level, (from, to)) in seconds inside the scene; jet follows a swell
SCENE_BEDS = {0: {"ocean": .5, "room": .35}, 1: {"ocean": .35, "room": .35}, 2: {"ac": (.55, (0, 2.1)), "room": .3}, 3: {"hall": .5},
              4: {"hall": .4}, 5: {"lobby": .6}, 6: {"ocean": .65, "wind": .35}, 7: {"ocean": .85}, 8: {"room": .25},
              9: {"ocean": .5, "crowd": .35}, 10: {"jet": "swell", "wind": .35}, 11: {"room": .2}}
gains = {k: np.zeros(N) for k in BED}
for i, d in enumerate(durs):
    s0 = starts[i]
    for bed, spec in SCENE_BEDS.get(i, {}).items():
        lvl, win = (spec, (0, d)) if not isinstance(spec, tuple) else spec
        a, b = s0 + (win[0] if win else 0), s0 + (win[1] if win else d)
        if spec == "swell":
            ia, ib = int(a*SR), int(min(b + .4, total)*SR); gains[bed][ia:ib] += .9 * np.hanning(ib - ia)[:len(gains[bed][ia:ib])]; continue
        ia, ib = int((a - .4)*SR), int((b + .4)*SR); ia = max(ia, 0); ib = min(ib, N)
        x = np.arange(ib - ia) / SR; w = np.clip(np.minimum(x / .5, (x[-1] - x) / .5), 0, 1); gains[bed][ia:ib] += lvl * w
ambience = sum(BED[k] * gains[k][:, None] for k in BED) * .16

# ------------------------------------------------------------------ little sound effects
def hit(kind, **k):
    r = rng
    if kind == "step":
        t = tt(.1); return (norm(band(r.standard_normal(len(t)), 80, 700))*np.exp(-t*45) + .5*np.sin(2*np.pi*75*t)*np.exp(-t*38) + .25*norm(band(r.standard_normal(len(t)), 700, 2500))*np.exp(-t*90)) * .5
    if kind == "roll":
        t = tt(k.get("d", 1.0)); e = np.minimum(1, t/.1) * np.minimum(1, (t[-1]-t)/.2); return norm(band(r.standard_normal(len(t)), 150, 1100))*(.6 + .4*np.sin(2*np.pi*15*t))*e*.25
    if kind in ("tic", "toc"):
        t = tt(.08); f = 1900 if kind == "tic" else 1400; return (np.sin(2*np.pi*f*t) * np.exp(-t*90) + .4*norm(band(r.standard_normal(len(t)), 2000, 7000))*np.exp(-t*160)) * .5
    if kind == "click":
        t = tt(.05); return norm(band(r.standard_normal(len(t)), 1200, 6000))*np.exp(-t*160)*.7 + .3*np.sin(2*np.pi*900*t)*np.exp(-t*120)
    if kind == "beep":
        t = tt(.07); return np.sin(2*np.pi*k.get("f", 1500)*t) * np.minimum(1, t/.004) * np.minimum(1, (t[-1]-t)/.01) * .35
    if kind == "ding":
        t = tt(1.0); f = k.get("f", 880); return (np.sin(2*np.pi*f*t) + .4*np.sin(2*np.pi*2.01*f*t) + .15*np.sin(2*np.pi*3.02*f*t)) * np.exp(-t*4.5) * .3
    if kind == "chime":
        out = np.zeros(int(1.4*SR)); base = k.get("f", 1318)
        for j, m in enumerate((1, 1.26, 1.5, 2)):
            t = tt(1.0); y = (np.sin(2*np.pi*base*m*t) + .3*np.sin(2*np.pi*base*m*2*t)) * np.exp(-t*5); o = int(j*.09*SR); out[o:o+len(y)] += y
        return out * .18
    if kind == "thud":
        t = tt(.3); return (norm(band(r.standard_normal(len(t)), 50, 500))*np.exp(-t*18) + np.sin(2*np.pi*70*t)*np.exp(-t*14)) * .55
    if kind == "clank":
        t = tt(.5); return sum(np.sin(2*np.pi*f*t)*np.exp(-t*d) for f, d in ((420, 12), (910, 16), (1730, 22), (2650, 30))) * .16
    if kind == "whoosh":
        d = k.get("d", 1.2); t = tt(d); e = np.sin(np.pi * t / d) ** 2; n = r.standard_normal(len(t))
        return norm(band(n, 300, 3000))*e*.3 + norm(band(n, 3000, 9000))*e**2*.12
    if kind == "splash":
        t = tt(.5); return norm(band(r.standard_normal(len(t)), 800, 7000))*np.exp(-t*7)*(.6 + .4*np.sin(2*np.pi*30*t)) * .3
    if kind == "pop":
        t = tt(.12); return (norm(band(r.standard_normal(len(t)), 300, 3000))*np.exp(-t*50)*.5 + np.sin(2*np.pi*np.cumsum(500*np.exp(-t*25))/SR)*np.exp(-t*30)*.5) * .6
    if kind == "zap":
        t = tt(.22); return (np.sin(2*np.pi*np.cumsum(1800*np.exp(-t*14))/SR)*np.exp(-t*12) + .3*norm(band(r.standard_normal(len(t)), 1500, 8000))*np.exp(-t*60)) * .3
    if kind == "drum":
        t = tt(.3); return np.sin(2*np.pi*np.cumsum(120*(1 + .6*np.exp(-t*30)))/SR)*np.exp(-t*10)*.5
fx = np.zeros((N, 2))
def ev(scene, tl_, kind, gain=1.0, pan=0.0, **k):
    if scene < len(durs): put(fx, starts[scene] + tl_, hit(kind, **k), pan, gain)
def steps(scene, a, b, n, gain=.8):
    for j in range(n): ev(scene, a + (b - a) * j / max(1, n - 1) + rng.uniform(-.04, .04), "step", gain * rng.uniform(.6, 1), rng.uniform(-.4, .4))
# 0 hello: everyone walks in, sparkles
steps(0, .0, 1.0, 9, .6); ev(0, 1.15, "chime", .8, .3); ev(0, 2.5, "chime", .5, -.3, f=1568)
# 1 check-out: tic tac of the clock, steps, the kid spins
steps(1, .05, 1.0, 9, .6)
for j in range(int(durs[1] / .5) if len(durs) > 1 else 0): ev(1, .45 + j * .5, "tic" if j % 2 == 0 else "toc", .55, .35)
ev(1, 1.3, "whoosh", .5, 0, d=.7); ev(1, 2.1, "chime", .5, .3)
# 2 lights, AC and TV off
steps(2, .0, 1.1, 10, .5); ev(2, .0, "roll", .9, -.2, d=1.3); ev(2, 1.0, "beep", .8, .4, f=1700); ev(2, 1.6, "click", 1, -.5); ev(2, 2.1, "beep", .7, .3, f=1100); ev(2, 2.15, "beep", .7, .3, f=800)
ev(2, 2.3, "zap", 1, .5); ev(2, 2.4, "chime", .7, -.3); ev(2, 2.7, "chime", .7, .3, f=1760)
# 3 trash chute
ev(3, .2, "ding", .5, .5, f=1040); steps(3, .1, 1.2, 7, .6); ev(3, .0, "roll", .8, -.2, d=1.4); steps(3, .3, 1.3, 9, .4); ev(3, 1.1, "clank", 1, -.1); ev(3, 1.45, "thud", 1, -.1); ev(3, 1.75, "clank", .7, -.1); ev(3, 1.9, "chime", .8, 0)
# 4 key into the lockbox
steps(4, .0, .95, 8, .6); ev(4, 0, "roll", .8, -.2, d=1.0)
for j, f in enumerate((1400, 1650, 1900)): ev(4, 1.2 + j * .1, "beep", .8, .4, f=f)
ev(4, 1.5, "clank", .7, .4); ev(4, 1.8, "click", .8, .4); ev(4, 2.05, "click", 1, .4); ev(4, 2.15, "chime", .9, 0, f=1568)
# 5 lobby: stars as notifications
steps(5, .0, 1.0, 8, .5)
for j in range(5): ev(5, .5 + j * .4, "ding", .5, 0, f=880 * 2 ** (j * 2 / 12))
# 6 terrace: splashes
steps(6, .0, 1.2, 9, .45)
for tm in (.9, 2.0, 3.3, 4.4): ev(6, tm, "splash", .7, rng.uniform(-.6, .6))
# 7 iris to the beach and heart
ev(7, 0, "whoosh", .9, 0, d=1.3); ev(7, 1.3, "chime", .9, 0, f=1175); ev(7, 1.9, "chime", .8, 0, f=1568)
# 8 benefits card
ev(8, 0, "whoosh", .7, 0, d=.8); ev(8, .6, "pop", .6); ev(8, .85, "chime", .7, -.3, f=1568); ev(8, 1.3, "chime", .6, .3, f=1760); ev(8, 2.3, "chime", .5, -.3); ev(8, 3.4, "chime", .5, .3, f=1568)
# 9 cities by the sea, confetti, tags
steps(9, .0, 1.2, 9, .45); ev(9, 1.75, "pop", 1, .4); ev(9, 1.82, "pop", .7, .2); ev(9, 1.9, "pop", .6, .5)
for tm in CITY_T: ev(9, tm, "pop", .5, rng.uniform(-.4, .4)); ev(9, tm + .02, "chime", .35, 0, f=1760)
# 10 plane
if len(durs) > 10: ev(10, durs[10] * .5 - 1.0, "whoosh", 1.0, 0, d=2.2); ev(10, .2, "ding", .5, 0, f=1320)
# 11 closing card
ev(11, .8, "chime", .9, 0, f=1318)
for j, tm in enumerate((.3, 1.1, 1.9, 2.8, 3.6)): ev(11, tm, "pop", .4, rng.uniform(-.6, .6))
ev(11, 2.2, "chime", .7, 0, f=1760)

# ------------------------------------------------------------------ narration
def load(p):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", p, "-ar", str(SR), "-ac", "1", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)
def breath(d=.34):                  # a soft inhale: airy noise that swells and fades
    t = tt(d); e = np.sin(np.pi * (t / d) ** .8) ** 2
    return (norm(band(rng.standard_normal(len(t)), 500, 4800)) * .5 + norm(band(rng.standard_normal(len(t)), 150, 500)) * .2) * e
voice = np.zeros(N); breaths = np.zeros(N)
for i, d in enumerate(durs):
    p = next((f"{A}/narr-{i:02d}.{e}" for e in ("mp3", "wav") if os.path.exists(f"{A}/narr-{i:02d}.{e}")), None)
    if not p: continue
    y = load(p); j = int((starts[i] + .45) * SR); yy = y[: N - j]; voice[j:j + len(yy)] += yy
    # breathe in before the first words and after each long pause, like a person reading aloud
    hop = int(.02 * SR); e = np.array([np.abs(y[k:k + hop]).max() for k in range(0, len(y) - hop, hop)]); on = e > .06 * e.max()
    idx = np.where(on)[0]
    if len(idx):
        marks = [idx[0]]; k = idx[0]
        for q in range(idx[0], idx[-1]):
            if not on[q] and on[q + 1] and not on[max(q - 24, 0):q + 1].any(): marks.append(q + 1)   # speech resumes after >= .5 s of silence
        for m in marks:
            tb = starts[i] + .45 + m * .02 - .42
            if tb > starts[i] + .02: bs = breath(); k0 = int(tb * SR); breaths[k0:k0 + len(bs)] += bs[: max(0, N - k0)]
voice /= max(1e-6, np.abs(voice).max()); voice *= .92
voice = voice + breaths * .07

# ------------------------------------------------------------------ mix with ducking
env_v = np.convolve(np.abs(voice), np.ones(int(.12 * SR)) / int(.12 * SR), "same")
gate = (env_v > .02).astype(float); hw = np.hanning(int(.45 * SR)); sm = np.clip(np.convolve(gate, hw / hw.sum(), "same") * 1.6, 0, 1)
mix = music * (.27 * (1 - .62 * sm))[:, None] + ambience * (1 - .35 * sm)[:, None] + fx * (1 - .2 * sm)[:, None] * .7 + voice[:, None]
mix /= max(1.0, np.abs(mix).max() / .95)
with wave.open(f"{A}/mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", sys.argv[1], "-i", f"{A}/mix.wav", "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", sys.argv[2]], check=True)
print("mixed", round(total, 1), "s")
