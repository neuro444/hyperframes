# Changing the music & sound — a developer's step-by-step

How to swap the **music bed**, the **UI sound effects**, and the **ringtone** —
by hand, editing `index.html` line by line, and _keeping the old audio files_ so
you can A/B them and switch back without regenerating anything.

Like the theme and dialogue guides, this is deliberately manual so you learn the
audio model. A copy-paste "reminder" block sits at the end; the `resolve.mjs`
media command still works and is mentioned there — but do the manual version
first.

All paths and commands are relative to the **project root** —
`video-projects/fiona-takes-the-call`, the parent of this `shift_theme/` folder
(`cd ..` if you're in this file's directory).

---

## The audio model (read this first)

All sound is declared as `<audio>` elements — **direct children of `#root`** in
`index.html` — each on its own **track**. The framework owns playback; you only
set _which file_, _when_ (`data-start`), _how long_ (`data-duration`), and _how
loud_ (`data-volume`). Tracks just keep layers from fighting; higher/lower
numbers don't mean louder.

| Track | Layer         | Elements (in `index.html`)                    | File(s)                            |
| ----- | ------------- | --------------------------------------------- | ---------------------------------- |
| 10    | Voice         | `v01`–`v13`                                   | `.media/audio/voice/line0N.wav`    |
| 11    | UI sound FX   | `tap`, `tick1–4`, `rtick1–4`, `chime`, `beep` | `.media/audio/sfx/sfx_00N.mp3`     |
| 12    | Ringtone      | `ring`                                        | `assets/ring-5s.mp3`               |
| 13    | **Music bed** | `bgm`                                         | `.media/audio/bgm/bgm_bed_85s.wav` |

Voice (track 10) is owned by [`change_dialogue.md`](change_dialogue.md). This
guide covers tracks 11–13.

### Which folder to drop a new file in, and which line to edit

Every sound is just a file in a folder + one `src="…"` in `index.html`. Put the
new file next to the existing ones of its kind, keep a **new filename** (never
overwrite the old — that's your history), then change one `src`:

| To change… | Drop the new file into… | Then edit `src` on `index.html` line… |
| ---------- | ----------------------- | ------------------------------------- |
| Music bed  | `.media/audio/bgm/`     | **line 60** (`id="bgm"`)              |
| A sound FX | `.media/audio/sfx/`     | lines **44–54** (the matching `id`)   |
| Ringtone   | `assets/`               | **line 57** (`id="ring"`)             |

The `src` path is written **relative to `index.html`** — so a file at
`.media/audio/bgm/warm-piano.wav` is referenced as
`src=".media/audio/bgm/warm-piano.wav"`. Match the path to where you actually
copied the file.

The current SFX map (what each sound is):

| id         | file          | when                                | volume |
| ---------- | ------------- | ----------------------------------- | ------ |
| `tap`      | `sfx_002.mp3` | accept-call tap (4.6s)              | 0.5    |
| `tick1–4`  | `sfx_002.mp3` | each dish ticks into the order card | 0.35   |
| `rtick1–4` | `sfx_002.mp3` | each row checks off during recap    | 0.22   |
| `chime`    | `sfx_003.mp3` | "Order Confirmed" (63.09s)          | 0.7    |
| `beep`     | `sfx_004.mp3` | `end_call()` hangs up (75.71s)      | 0.8    |

---

## 1 — Swap the music bed (keep the old track)

The music bed is **one** element — `index.html` line 60:

```html
<!-- Music bed — track 13 -->
<audio
  id="bgm"
  src=".media/audio/bgm/bgm_bed_85s.wav"
  data-start="5.5"
  data-duration="73.76"
  data-track-index="13"
  data-volume="0.12"
></audio>
```

Its fade in/out is a **manual GSAP tween** in the `<script>` at the bottom
(lines 67–68) — the bed eases in when the call connects and eases out under the
end screen:

```js
tl.fromTo("#bgm", { volume: 0 }, { volume: 0.12, duration: 1.6, ease: "power1.out" }, 5.5);
tl.to("#bgm", { volume: 0, duration: 2.4, ease: "power1.in" }, 76.6);
```

### To replace it

**Add the new track as a new file — don't overwrite the old one.** That's your
history / A-B:

```bash
# drop your new bed in with a descriptive name (any local path works)
cp ~/Downloads/warm-piano-bed.wav .media/audio/bgm/bgm_warm_piano.wav
```

Then hand-edit `index.html`:

1. **Line 60 — point `src` at the new file:**
   ```html
   <audio
     id="bgm"
     src=".media/audio/bgm/bgm_warm_piano.wav"
     data-start="5.5"
     data-duration="73.76"
     data-track-index="13"
     data-volume="0.12"
   ></audio>
   ```
2. **Check the length.** The bed must be at least `data-start + data-duration`
   long (5.5 + 73.76 ≈ **79.3s**). Confirm with:
   ```bash
   ffprobe -v quiet -show_entries format=duration -of csv=p=0 .media/audio/bgm/bgm_warm_piano.wav
   ```
   If it's shorter, either loop/extend the audio, or shorten `data-duration` and
   move the fade-out earlier (next point). If it's longer, `data-duration` just
   trims it.
3. **Volume** — `data-volume="0.12"` is the _ceiling_ the fade tweens up to. A
   busier track may need `0.08`; a sparse one can take `0.16`. It must sit under
   the voices — verify by ear in `npm run dev`.
4. **Fade times (lines 67–68)** — these two numbers are hand-set, not derived. If
   you keep the same timeline they're fine as-is. If the video's total length
   changed (e.g. after a dialogue edit), move the fade-out anchor `76.6` to
   `total − ~2.6s` so it lands under the end screen, and keep the fade-in at
   `5.5` (call-connect). The `duration:` values are the fade lengths in seconds.

> **Why the fade is in code, not attributes.** `data-volume` is a single static
> level; the audible swell/duck is done by tweening `#bgm`'s volume on the
> timeline. That's why swapping the file is two edits (the `<audio>` `src` **and**
> a sanity-check of the tween), not one.

The repo already contains alternates you can try instantly — `bgm_001.wav` (17s)
and `bgm_002.wav` (85s) — point `src` at one of those to hear a different bed
with zero new files.

---

## 2 — Swap or retune the UI sound effects (track 11)

Each SFX is its own `<audio>` on track 11 (`index.html` lines 44–54). To change a
sound, drop a new file into `.media/audio/sfx/` (new name — keep the old), then
point that element's `src` at it. To change _when_ a sound fires or how loud,
edit its `data-start` / `data-volume` in place.

Examples:

```html
<!-- a softer, different confirmation chime -->
<audio
  id="chime"
  src=".media/audio/sfx/chime_soft.mp3"
  data-start="63.09"
  data-duration="0.7"
  data-track-index="11"
  data-volume="0.6"
></audio>

<!-- move the hang-up beep, make it quieter -->
<audio
  id="beep"
  src=".media/audio/sfx/sfx_004.mp3"
  data-start="75.71"
  data-duration="0.14"
  data-track-index="11"
  data-volume="0.5"
></audio>
```

- The four `tick` and four `rtick` start times are aligned to the dish-mention
  and recap cues. If you changed the dialogue, those cue times moved — read the
  updated values from `timings.json` (the `cues.items[]` / `recap_items[]` times)
  and copy them into the matching `data-start`s. See
  [`change_dialogue.md`](change_dialogue.md) Step 4.
- To **remove** a sound, delete its `<audio>` line (or add `data-hidden` to mute
  it non-destructively while keeping the line as reference).

Get a fresh SFX from the media catalog when you don't have a file:

```bash
node ~/.claude/skills/media-use/scripts/resolve.mjs --type sfx --intent "soft confirmation chime" --project .
# → resolves + freezes a new file under .media/audio/sfx/ and prints its path
```

Point the element's `src` at the printed path.

---

## 3 — Swap the ringtone (track 12)

One element — `index.html` line 57:

```html
<!-- Ringtone — track 12 -->
<audio
  id="ring"
  src="assets/ring-5s.mp3"
  data-start="0.3"
  data-duration="4.9"
  data-track-index="12"
  data-volume="0.75"
></audio>
```

The ring plays under the incoming-call screen (frame 1) and should end by the
accept tap (~5.2s). Drop a new ringtone into `assets/` (new name), point `src` at
it, and keep `data-duration` inside the 5-second incoming-call window (trim it or
shorten `data-duration` if the file is longer).

```bash
cp ~/Downloads/marimba-ring.mp3 assets/marimba-ring.mp3   # keep the old ring-5s.mp3
# then set src="assets/marimba-ring.mp3" on line 57
```

---

## Do it in the Studio UI instead (often faster for audio)

Everything above can be done by editing `index.html` by hand — but HyperFrames
ships a visual editor (**Studio**) that's genuinely better for _timing and
balance_, because you can scrub and listen while you drag. Start it and open the
project:

```bash
npm run dev     # long-running — keep it open; it prints the URL, e.g. http://localhost:3003
```

Then in Studio:

- **Timeline tab** — every `<audio>` shows as a clip on its track (voice 10, SFX
  11, ring 12, music 13). **Drag a clip** to change its `data-start`, **drag its
  edge** to trim `data-duration`, and use the **eye icon** to toggle
  `data-hidden` (mute a sound without deleting its line). Studio writes these back
  into `index.html` for you — same attributes you'd edit by hand.
- **Swap a file's `src`** — that's still a text edit (point it at the new file you
  dropped into `.media/audio/…` per the folder table above); Studio then reflects
  it on the timeline.
- The music-bed **fade** (lines 67–68) lives in the GSAP `<script>`, so it stays a
  code edit — Studio scrubbing is how you _check_ the fade, not where you set it.
- **Renders tab** — after `npm run render`, download the finished MP4 with one
  click (see the [README](../README.md#downloading-the-mp4) for the note about
  running the project from outside the source repo).

Rule of thumb: **use Studio to place and balance** (drag/trim/mute while
listening), **use the file + `src` edits** to change _what_ plays. The two are the
same underlying attributes.

## 4 — Validate & render

```bash
npm run check      # includes runtime; confirms every audio src resolves
npm run dev        # ← the real test for audio: scrub and LISTEN
npm run render     # muxes the final mix into the MP4
```

`check` catches missing files and layout/motion issues, but **balance is a
listening judgement** — always play it in `npm run dev` (or the rendered MP4)
before shipping. Listen for: music burying the voices (lower the bed's ceiling in
step 1.3), a chime that clips or feels late, the ring bleeding past the accept
tap.

---

## Switching back

Everything above added _new_ files and edited `index.html` in place, so the old
audio is untouched on disk. To revert:

- **Files:** the originals (`bgm_bed_85s.wav`, `sfx_00N.mp3`, `ring-5s.mp3`) were
  never overwritten — just point the `src`s back at them.
- **`index.html`:** restore the audio blocks. If under git,
  `git checkout -- index.html` reverts every `src` / `data-start` / fade edit at
  once. Otherwise snapshot it before you start:
  ```bash
  cp index.html index.cake-world.html      # do this FIRST, before editing
  ```

---

## End-of-section command reminder (once you know the steps)

```bash
# music bed:  add file → edit line 60 src (+ line 60 duration/volume) → check fade lines 67-68
# sfx:        add file → edit the id's src / data-start / data-volume (lines 44-54)
# ringtone:   add file → edit line 57 src (keep it inside the ~5s window)
node ~/.claude/skills/media-use/scripts/resolve.mjs --type bgm --intent "…" --project .   # if you need a fresh track
npm run check && npm run dev && npm run render
```
