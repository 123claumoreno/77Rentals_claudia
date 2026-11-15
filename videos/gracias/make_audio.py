"""Original upbeat 'weekend' track (synthesized here, no samples, nothing to license) + the narration, mixed with ducking.
Usage: python3 make_audio.py <video_without_audio.mp4> <output.mp4>"""
import sys, json, subprocess, wave
import numpy as np

SR = 44100
tl = json.load(open("audio/timeline.json"))
durs, narr, total = tl["durations"], tl["narr"], tl["total"]
N = int(SR * (total + 0.3))
BPM = 108
beat = 60 / BPM
rng = np.random.default_rng(7)
mtof = lambda m: 440.0 * 2 ** ((m - 69) / 12)
music = np.zeros((N, 2))

def add(y, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i < 0 or i >= N: return
    y = y[: N - i]
    music[i:i + len(y), 0] += y * gain * (1 - max(0, pan))
    music[i:i + len(y), 1] += y * gain * (1 - max(0, -pan))

def tt(d): return np.arange(int(SR * d)) / SR
def marimba(f, d=.45):
    t = tt(d); y = np.sin(2*np.pi*f*t)*np.exp(-t*7) + .35*np.sin(2*np.pi*3.9*f*t)*np.exp(-t*25) + .1*np.sin(2*np.pi*9.2*f*t)*np.exp(-t*45)
    return y * np.minimum(1, t / .002)
def stab(f, d=.22):
    t = tt(d); y = sum(a * np.sin(2*np.pi*f*k*t) for k, a in ((1, 1), (2, .45), (3, .25), (4, .12))) * np.exp(-t*16)
    return y * np.minimum(1, t / .003) * .22
def bass(f, d=.4):
    t = tt(d); y = np.tanh(1.6 * (np.sin(2*np.pi*f*t) + .45*np.sin(4*np.pi*f*t))) * np.exp(-t*4.5)
    return y * np.minimum(1, t / .005) * .5
def kick():
    t = tt(.28); ph = 2*np.pi*np.cumsum(45 + 95*np.exp(-t*30)) / SR
    return np.sin(ph) * np.exp(-t*13) * .9
def clap():
    t = tt(.22); n = rng.standard_normal(len(t)); y = np.zeros(len(t))
    for o in (0, .012, .026): i = int(o*SR); y[i:] += n[:len(t)-i] * np.exp(-(t[:len(t)-i])*34)
    return np.diff(y, prepend=0) * .3
def hat(open_=False):
    t = tt(.16 if open_ else .05); n = np.diff(rng.standard_normal(len(t)), prepend=0)
    return n * np.exp(-t*(22 if open_ else 80)) * (.16 if open_ else .12)
def shaker():
    t = tt(.07); n = np.diff(rng.standard_normal(len(t)), prepend=0)
    return n * np.exp(-t*45) * .07
def conga(f=230):
    t = tt(.2); ph = 2*np.pi*np.cumsum(f * (1 + .25*np.exp(-t*40))) / SR
    return np.sin(ph) * np.exp(-t*16) * .32

CH = [[60, 64, 67], [59, 62, 67], [57, 60, 64], [57, 60, 65]]      # C G Am F
ROOT = [48, 43, 45, 41]
MEL = [[(0, 76), (.5, 79), (1, 81), (1.5, 79), (2, 76), (3, 74), (3.5, 76)],
       [(0, 74), (.5, 76), (1, 79), (2, 76), (2.5, 74), (3, 71), (3.5, 74)],
       [(0, 76), (.5, 81), (1, 84), (1.5, 81), (2, 79), (3, 76), (3.5, 79)],
       [(0, 81), (.5, 79), (1, 77), (2, 76), (2.5, 77), (3, 79), (3.5, 81)]]
bars = int((total + 0.3) / (4 * beat)) + 1
for b in range(bars):
    t0 = b * 4 * beat; c = b % 4
    for k in range(16):                                   # 16th grid
        ts = t0 + k * beat / 4
        add(shaker(), ts, .25, 1 if k % 2 else .7)
        if b >= 2:
            if k % 2 == 0: add(hat(k % 4 == 2), ts, -.25)
            if k in (0, 8) or (k == 14 and b % 2): add(kick(), ts, 0, 1)
            if k in (4, 12): add(clap(), ts, .05)
            if k in (3, 7, 10, 15): add(conga(210 if k in (3, 10) else 260), ts, -.3 if k in (3, 10) else .3)
    for beat_pos in (.5, 1.5, 2.5, 3.5):                  # off-beat chord stabs
        for m in CH[c]: add(stab(mtof(m)), t0 + beat_pos * beat, -.15, 1)
    for bp, off in ((0, 0), (1.5, 0), (2, 0), (3.5, 12 if b % 2 else 0)):
        add(bass(mtof(ROOT[c] + off)), t0 + bp * beat, 0, 1)
    if b >= 4:                                            # marimba riff
        for bp, m in MEL[c]: add(marimba(mtof(m)), t0 + bp * beat, .2, .55)
        if b % 2: 
            for bp, m in MEL[c][:3]: add(marimba(mtof(m - 12)), t0 + (bp + .25) * beat, -.2, .22)
# tiny room: two soft echoes
e = np.zeros_like(music); d1, d2 = int(.19 * SR), int(.37 * SR)
e[d1:, 0] += music[:-d1, 1] * .22; e[d1:, 1] += music[:-d1, 0] * .22; e[d2:] += music[:-d2] * .1
music += e
fade = np.ones(N); fi, fo = int(.6 * SR), int(3.5 * SR)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
music *= fade[:, None]
music /= max(1e-6, np.abs(music).max())

# narration (one clip per panel, starts shortly after the panel slides in)
def load(p):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", p, "-ar", str(SR), "-ac", "1", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)
voice = np.zeros(N); start = 0.0
for i, d in enumerate(durs):
    y = load(f"audio/narr-{i:02d}.wav"); j = int((start + .45) * SR); y = y[: N - j]; voice[j:j + len(y)] += y; start += d
voice /= max(1e-6, np.abs(voice).max()); voice *= .92

# duck the music while she talks
env = np.convolve(np.abs(voice), np.ones(int(.12 * SR)) / int(.12 * SR), "same")
gate = (env > .02).astype(float)
duck = 1 - .62 * np.clip(np.convolve(gate, np.hanning(int(.45 * SR)) / np.hanning(int(.45 * SR)).sum(), "same") * 1.6, 0, 1)
mix = music * (.30 * duck)[:, None] + voice[:, None]
mix /= max(1.0, np.abs(mix).max() / .95)
pcm = (mix * 32767).astype(np.int16)
with wave.open("audio/mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", sys.argv[1], "-i", "audio/mix.wav", "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", sys.argv[2]], check=True)
print("mixed", round(total, 1), "s; music peak ratio", round(float(np.abs(music).max()), 2))
