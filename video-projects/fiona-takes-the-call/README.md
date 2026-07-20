# Fiona Takes the Call

A 79-second vertical (1080×1920) demo video for **Cake World Eatery, Alpharetta**:
an iPhone rings, the AI voice agent **Fiona** answers, takes a full pickup order
from a customer (**Thomas Milton**), reads it back with the total, and confirms —
all on one continuous phone screen, with two real voices and live-transcript
captions.

Built with [HyperFrames](https://hyperframes.heygen.com) (write HTML → render video).

**Final render:** [`renders/fiona-takes-the-call_2026-07-20_00-09-16.mp4`](renders/) — 1080×1920, H.264 + AAC, 79.3s, 5.7 MB.

---

## The video, scene by scene

| #   | Scene                          | What happens                                                                                                                              | Sound                        |
| --- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| 1   | **Incoming Call** (0–5.5s)     | Black call screen, two-tone "Cake World Eatery" wordmark, kolam watermark, pulsing green Accept; tap ripple → white flash into the call   | iPhone ringtone              |
| 2   | **Answered** (5.5–8s)          | Bone-white in-call UI: logo avatar + brand, animated waveform, "Fiona – AI Assistant", live "ACTIVE CALL" timer, Mute / red End / Speaker | tap tick, music bed fades in |
| 3   | **Greeting** (8–20.5s)         | Word-timed transcript bubbles — Fiona (gray, left) greets, Thomas (red, right) asks for a pickup                                          | two TTS voices               |
| 4   | **The Order** (20.5–38.2s)     | Thomas names four dishes; each glows in his bubble and ticks into the "PICKUP ORDER" card                                                 | voice + UI ticks per item    |
| 5   | **Name & Recap** (38.2–60.4s)  | Slides to the full Pickup Order screen; rows check off as Fiona recaps; total **counts up to $44.96**; "Ready in 20–25 min" pill          | voice + recap ticks          |
| 6   | **Confirmed** (60.4–68.9s)     | Green check ring draws in, "Order Confirmed / Thank you, Thomas!", flourish + ETA pill                                                    | confirmation chime           |
| 7   | **Goodbye & End** (68.9–79.3s) | Fiona signs off, a mono `end_call()` chip blips (the agent hangs up itself), screen returns to the black brand card "Call Ended · 01:11"  | end beep, music fades out    |

The **menu items and prices** ($11.99 + $4.99 + $13.99 + $13.99 = **$44.96**) and
all 13 dialogue lines come verbatim from [`script.md`](script.md).

---

## Design

The look is locked in [`frame.md`](frame.md) (the design system) after a full
picker journey — six color themes were explored in the local, gitignored
`design-options/` workspace before landing on the **Stitch call
interface** direction the user supplied ([`design-refs/`](design-refs/)):

- **In-call screens** (2–5): bone white `#FBF9F9`, deep brand red `#9E0027` /
  `#BA1434`, Fiona = gray bubbles left, Thomas = red bubbles right, iPhone-style
  Mute / End / Speaker controls. It reads as a **call, not a chat app** (no tab
  bar, no search).
- **Brand screens** (1, 7): black `#0D0D0D` with the logo-red wordmark and kolam
  watermark.
- **Fonts:** Plus Jakarta Sans (headings) + Work Sans (body) for the phone UI,
  Playfair Display on the brand screens (all embedded from `assets/fonts/`).
- **iPhone authenticity:** status bar (9:41 / signal / Wi-Fi / battery), dynamic
  island, titanium device frame with side buttons on every screen.

The user's real logo (`photos/cake logo.avif`) is background-removed and used as
the caller avatar.

---

## Project structure

```
index.html              → master timeline (79.26s): 7 scene sub-comps + full audio mix
compositions/frames/    → the 7 scene compositions (01…07)
frame.md                → design system (colors, fonts, chrome rules)
BRIEF.md                → the confirmed brief (intent, assets, design decisions)
STORYBOARD.md           → the 7-frame plan
script.md               → verbatim dialogue (source of truth for VO + timing)
timings.json            → schedule built from real TTS durations (see tools/)
tools/
  gen-timing.mjs        → builds timings.json from the voice files' real lengths
  inject-words.mjs      → injects per-word timestamps into the caption frames
assets/
  cake-logo-transparent.png  → logo mark (background removed) for the avatar
  fonts/                → embedded woff2 (Work Sans, Plus Jakarta Sans)
  ring-5s.mp3           → trimmed ringtone
.media/                 → resolved media (13 voice lines, SFX, 85s music bed) + manifest
snapshots/              → generated verification frames (local, gitignored)
design-options/         → generated color-theme and sketch explorations (local, gitignored)
design-refs/            → the user's source mockups (design truth)
renders/                → the finished MP4
```

**Audio tracks** in `index.html`: voice (track 10), UI sounds (11), ringtone (12),
music bed (13, ducked to 0.12 under the dialogue).

---

## Rebuild / render / download

All commands run **from this project directory**
(`video-projects/fiona-takes-the-call`).

```bash
# 1. Preview in the browser (Studio) — long-running, keep it open
npm run dev
#    → opens a local server; visit the printed URL

# 2. Validate (lint + browser gate: runtime, layout, motion, WCAG contrast)
npm run check

# 3. Render to MP4
npm run render
#    → writes renders/fiona-takes-the-call_<timestamp>.mp4
```

If you edit the dialogue or voices, regenerate timing before rendering:

```bash
node tools/gen-timing.mjs      # re-reads voice durations → timings.json
node tools/inject-words.mjs    # re-injects word timestamps into the frames
```

### Downloading the MP4

The finished file is a normal file on disk. Two ways to get it:

**A — from the terminal (always works):**

```bash
# Reveal the renders folder in Finder
open renders/

# Copy the latest render to your Desktop
cd video-projects/fiona-takes-the-call
cp "$(ls -t renders/*.mp4 | head -1)" ~/Desktop/
```

**B — one-click Download button in Studio's Renders tab** — this needs the
project to run from _outside_ this source repo (see the box below). Once it does,
open Studio → Renders tab → **Download**, and the browser saves the MP4 directly.

> **Why the in-browser Download can fail here** — `Cannot find module
'…/packages/producer/src/services/renderOrchestrator.js'`. This project lives
> **inside the HyperFrames source monorepo**. The published `hyperframes` CLI
> bundles (inlines) its renderer, but when it runs with the repo's
> `packages/producer/` in its directory ancestry, its module resolver picks up
> the repo's raw TypeScript source (`producer/src/index.ts`) instead of the
> inlined copy, then can't resolve the `.ts`→`.js` import. **It is not a problem
> with the video** — the terminal `npm run render` renders it perfectly.
>
> **Fix for a working one-click Download:** run the project from a copy placed
> outside the repo, e.g. `~/Desktop/fiona-video`:
>
> ```bash
> # one-time: copy the project's inputs out of the monorepo
> SRC=~/Desktop/Apps/hyperframes/video-projects/fiona-takes-the-call
> DEST=~/Desktop/fiona-video
> mkdir -p "$DEST"
> cp -R "$SRC"/index.html "$SRC"/compositions "$SRC"/assets "$SRC"/.media \
>       "$SRC"/hyperframes.json "$SRC"/meta.json "$SRC"/frame.md "$SRC"/timings.json "$SRC"/tools "$DEST/"
> printf '{\n  "name":"fiona-video","private":true,"type":"module",\n  "scripts":{"dev":"npx --yes hyperframes@0.7.64 preview","render":"npx --yes hyperframes@0.7.64 render"}\n}\n' > "$DEST/package.json"
>
> # then run Studio from there — Download in the Renders tab now works
> cd "$DEST" && npm run dev
> ```
>
> Verified: the render + `/api/projects/<id>/renders/file/<name>.mp4` download
> endpoint both return a valid `video/mp4` from the outside-the-repo copy.

### Share a public link (optional)

```bash
npm run publish   # uploads and returns a stable public URL (re-publish keeps the same link)
```

---

## Credits

- Voices: HeyGen TTS (Marcia = Fiona, Chill Brian = Thomas)
- Music + SFX: HeyGen audio catalog
- Framework: HyperFrames
