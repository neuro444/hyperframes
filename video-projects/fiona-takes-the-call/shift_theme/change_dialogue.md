# Changing the dialogue — a developer's step-by-step

How to give Fiona and the customer a **new conversation** — different lines,
different order, different customer — while keeping the same design.

This guide is deliberately **manual and history-preserving**: you edit files by
hand and _keep the old ones alongside the new_, so you can diff, learn the
pipeline, and switch back without re-running anything. The `tools/*.mjs` scripts
still exist and there's a copy-paste "reminder" block at the very end — but read
the steps first; the scripts don't do everything (they regenerate word lists and
`timings.json`, but the **per-bubble start times inside each frame are
hand-tuned** — see Step 5).

All paths and commands are relative to the **project root** —
`video-projects/fiona-takes-the-call`, the parent of this `shift_theme/` folder
(`cd ..` if you're in this file's directory).

---

## How dialogue flows through the project (read this first)

```
script.md ─┐
           ├─► TTS ─► .media/audio/voice/line0N.wav        (the spoken audio)
           │         .media/audio/voice/line0N.words.json  (per-word timestamps)
           │
           ├─► tools/gen-timing.mjs ──► timings.json        (schedule: when each line plays)
           │
           └─► tools/inject-words.mjs ─► compositions/frames/*.html  (fills the caption word lists)

index.html         ← the <audio id="v01"…"v13"> start times that PLAY each line
frames/03..07.html ← the visible bubble text + the per-bubble reveal times
```

Four things must agree for a line: its **audio** (`.wav`), its **word
timestamps** (`.words.json`), its **playback time** (`index.html`), and its
**visible bubble + caption reveal** (the frame). Change a line and you touch all
four. The scripts handle the middle two; you hand-edit the outer two.

**The 13 lines and where each is spoken/shown:**

| line  | speaker | frame                 | in index.html |
| ----- | ------- | --------------------- | ------------- |
| 01–03 | F,C,F   | `03-greeting.html`    | `v01`–`v03`   |
| 04–06 | C,F,C   | `04-the-order.html`   | `v04`–`v06`   |
| 07–09 | F,C,F   | `05-name-recap.html`  | `v07`–`v09`   |
| 10–11 | C,F     | `06-confirmed.html`   | `v10`–`v11`   |
| 12–13 | C,F     | `07-goodbye-end.html` | `v12`–`v13`   |

(`F` = Fiona, `C` = Customer. This grouping is defined by `frameOf()` and
`FRAME_LINES` in the tools — see Step 6 if you change the line _count_.)

---

## Step 1 — Rewrite the script (keep the old one)

Don't overwrite `script.md`. Copy it so you can compare and revert:

```bash
cp script.md script.cake-world.md      # snapshot the current dialogue as history
```

Now edit `script.md` line by line. Keep **one line per turn**, alternating
speakers, prefixed `Fiona:` / `Customer:`. The count and speaker order should
match the table above unless you're changing structure (Step 6).

`script.md` is the human source of truth. Nothing reads it automatically — it's
your reference while you regenerate the audio in Step 2 — so its job is to be
_correct and readable_, and to record what the video says.

---

## Step 2 — Regenerate the voices, one line at a time (keep the old audio)

Each line is one `.wav` + one `.words.json` in `.media/audio/voice/`. **Don't
delete the old files.** Move them into a history folder first, so a bad
regeneration is one `cp` away from being undone:

```bash
mkdir -p .media/audio/voice/_cake-world     # history bucket
cp .media/audio/voice/line*.wav .media/audio/voice/line*.words.json .media/audio/voice/_cake-world/
```

Then regenerate each changed line. The voice IDs are fixed (Marcia = Fiona,
Chill Brian = the customer); do one call per line and write **both** the `.wav`
and the `.words.json` (the `--words` flag produces the word timestamps the
captions need):

```bash
TTS=~/.claude/skills/media-use/audio/scripts/heygen-tts.mjs
FIONA=05f19352e8f74b0392a8f411eba40de1     # Marcia  (female — Fiona)
CUST=d2f4f24783d04e22ab49ee8fdc3715e0      # Chill Brian (male — customer)

# line 01 is Fiona:
node "$TTS" "Hi! Thanks for calling — how can I help?" \
  -o .media/audio/voice/line01.wav \
  --voice "$FIONA" \
  --words .media/audio/voice/line01.words.json

# line 02 is the customer:
node "$TTS" "I'd like to place an order." \
  -o .media/audio/voice/line02.wav \
  --voice "$CUST" \
  --words .media/audio/voice/line02.words.json

# …repeat for every changed line (line03 … line13)
```

Only regenerate the lines you actually changed — untouched lines keep working.
List available voices with `node "$TTS" --list` if you want to change _who_
speaks.

---

## Step 3 — Rebuild the schedule from the real audio

`timings.json` is the schedule (which line plays when, and the animation cue
times). It is **generated**, never hand-edited — it's built from the _real
measured length_ of each `.wav`, so a longer/shorter line automatically reflows
the timeline. Snapshot the old one, then rebuild:

```bash
cp timings.json timings.cake-world.json     # history
node tools/gen-timing.mjs
```

`gen-timing.mjs` reads each `line0N.wav` duration with `ffprobe`, lays the lines
out with a 0.6s gap between turns and a small breath at each scene handoff, and
writes the new `timings.json`. It prints the new per-frame and per-line start/end
times — **read that output**, you'll copy some of it into Steps 4 and 5.

> The item/recap cue times (when each dish ticks into the order card, the total
> count-up, the ETA pill) are found by **searching line 4 and line 9 for
> keywords** — `manchurian`, `samosa`, `masala`, `biriyani`, `forty-four`,
> `cents`, `twenty` (see `wordGlobal(...)` near the bottom of `gen-timing.mjs`).
> If your new menu uses different dish names, update those keyword strings in
> `gen-timing.mjs` so the ticks land on the right words. This is the one place
> the tool is menu-specific.

---

## Step 4 — Update the playback times in `index.html` (line by line)

The `<audio>` elements in `index.html` are what actually **play** each line.
Their `data-start` / `data-duration` come straight from the `gen-timing.mjs`
output you just read. Open `index.html`, find the _"Voice — track 10"_ block
(around lines 28–41), and update each one to match.

Each line looks like this — update `data-start` and `data-duration` to the new
`start` and `dur` printed by `gen-timing.mjs`:

```html
<audio
  id="v01"
  src=".media/audio/voice/line01.wav"
  data-start="8.3"
  data-duration="5.17"
  data-track-index="10"
  data-volume="1"
></audio>
```

For example, if `gen-timing.mjs` printed `line01 F 8.30 → 12.90`, then
`data-start="8.30"` and `data-duration="4.60"` (end − start). Do this for `v01`
through `v13`. Also nudge the root `data-duration` on the `#root` element
(line 15) to the new `total` the script printed, and the SFX/BGM start times
(Steps in `change_music.md`) if the timeline length moved much.

> Why by hand? So you _see_ the schedule and can sanity-check it against the
> audio. If you'd rather automate this later, that's a good enhancement to
> `gen-timing.mjs` — but doing it once by hand teaches you what the numbers mean.

---

## Step 5 — Update the caption frames (visible text + reveal times)

Two things live in each caption frame (`03-greeting.html` … `07-goodbye-end.html`):

### 5a. The word-timestamp payload — regenerate, don't hand-write

Each frame has a `const WORDS = /*__WORDS__*/ {…}` blob that drives the
per-word caption reveal. **Don't edit this by hand** — it's machine-generated
from `.words.json`. Snapshot the frames, then re-inject:

```bash
mkdir -p compositions/frames/_cake-world
cp compositions/frames/*.html compositions/frames/_cake-world/    # history
node tools/inject-words.mjs
```

`inject-words.mjs` replaces the `WORDS` blob in each frame with the fresh word
lists (it maps `line01–03 → 03-greeting.html`, `04–06 → 04-the-order.html`, etc.
via its `FRAME_LINES` table). It's idempotent — safe to re-run.

### 5b. The visible bubble text + reveal times — hand-edit

This is the part the tools **don't** touch, and the part the old docs glossed
over. Each frame hard-codes:

1. **The bubble container's spoken text / labels** — search the frame for the old
   words and replace with the new line's text where it appears as static copy.
   The per-word captions come from `WORDS`, but any non-caption visible text
   (names, the ticket rows, the total) is literal in the HTML.
2. **The per-bubble reveal offsets** — near the bottom of each frame's `<script>`
   there's a block like this (from `03-greeting.html`), where the numbers are
   **local seconds within that scene**:

   ```js
   // line01 — Fiona greeting
   tl.fromTo("#gr-b1", { opacity:0, y:34, scale:0.97 }, { opacity:1, y:0, scale:1, duration:0.45 }, 0.15);
   buildLine("line01", 0.3);      // ← caption words start 0.3s into the scene

   // line02 — Thomas
   tl.to("#gr-b1", { opacity:0.55 }, 5.9);        // dim previous bubble
   tl.fromTo("#gr-b2", {…}, {…}, 5.92);           // reveal next bubble
   buildLine("line02", 6.07);     // ← caption words for line02
   ```

   These offsets (`0.3`, `5.9`, `5.92`, `6.07`, …) are **hand-tuned to where each
   line starts inside the scene**. When a line's length changes, recompute them:
   for each line, `local_start = line.start (from timings.json) − frame.start
(from timings.json)`. Update every `buildLine("lineNN", <local_start>)` and the
   matching bubble-in / previous-bubble-dim times so bubbles appear when the voice
   speaks. The `gen-timing.mjs` output gives you both numbers.

Repeat 5b for each frame whose lines changed. If you only changed _wording_ and
the durations barely moved, the old offsets are usually close enough — but always
verify in Step 7.

---

## Step 6 — Only if the line _count_ or grouping changes

If your new dialogue has more/fewer than 13 lines, or a different speaker order,
update the pipeline's structural constants (all in `tools/`):

- `tools/gen-timing.mjs`
  - `SPEAKERS` (line 7) — the F/T array; one entry per line, in order.
  - the `for (let i = 1; i <= 13; i++)` loop bound (line 18) — the line count.
  - `frameOf(n)` (line 30) — which lines belong to which frame.
- `tools/inject-words.mjs`
  - `FRAME_LINES` (lines 9–15) — the line-id → frame-file map.
- Add/remove `<audio id="vNN">` elements in `index.html` to match.
- Add/remove bubbles + their reveal blocks in the affected frame(s).

Snapshot the tools first (`cp tools/gen-timing.mjs tools/gen-timing.cake-world.mjs`)
so you keep the working 13-line version as reference.

---

## Step 7 — Validate & render

```bash
npm run check       # lint + runtime + layout + motion + contrast
npx hyperframes snapshot --at 10,25,45,62,74   # eyeball a frame per talking scene
open snapshots/
npm run dev         # scrub the whole thing live before rendering
npm run render
```

Watch for: a bubble appearing before/after its voice (fix the Step-5b offsets), a
caption word revealing at the wrong moment (re-run Step 5a), or the total voice
running past the scene (fix the Step-4 `data-duration` and the root duration).

---

## Switching back to the original dialogue

Because every step wrote to a _new_ file and moved the old ones into `_cake-world/`
history buckets, reverting is copy-only — no regeneration:

```bash
cp .media/audio/voice/_cake-world/*.wav .media/audio/voice/_cake-world/*.words.json .media/audio/voice/
cp compositions/frames/_cake-world/*.html compositions/frames/
cp timings.cake-world.json timings.json
cp script.cake-world.md script.md
# then restore the index.html voice-block start times from git, or your own snapshot
```

(If the project is under git, `git checkout -- index.html compositions/frames`
is the cleanest revert of the hand-edited files.)

---

## End-of-section command reminder (the fast path, once you know the steps)

```bash
# 1. edit script.md
# 2. regenerate changed voices (loop, see Step 2)
node tools/gen-timing.mjs        # rebuild schedule from real audio
node tools/inject-words.mjs      # refresh caption word lists
# 3. hand-update index.html voice start/durations + frame reveal offsets (Steps 4–5b)
npm run check && npm run render
```
