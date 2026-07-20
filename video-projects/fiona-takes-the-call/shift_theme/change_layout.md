# Major redesign — new layout / structure (not just recolor)

[`change_theme.md`](change_theme.md) swaps colors, fonts, and the logo without
touching structure. This guide is for **bigger changes**: a different screen
layout, a new scene, a new aspect ratio, replacing the phone-call metaphor, or
rearranging what appears where. That means editing the **HTML structure and the
GSAP timelines** inside the frames — the real composition work.

It stays manual and history-preserving: **copy a frame before you rewrite it**,
so you keep the working version to diff against and revert to. There's no
one-command shortcut here — layout _is_ the code.

All paths and commands are relative to the **project root** —
`video-projects/fiona-takes-the-call`, the parent of this `shift_theme/` folder
(`cd ..` if you're in this file's directory).

---

## Before you touch anything: how a scene is built

Every scene is a self-contained HTML sub-composition in
`compositions/frames/NN-*.html`, mounted by `index.html`. Open
`compositions/frames/03-greeting.html` and you'll see the anatomy every frame
shares:

```
<template>                                  ← REQUIRED wrapper for a sub-composition
  <style> … @font-face, .device, .island, layout CSS … </style>
  <div id="root" data-composition-id="03-greeting" data-width="1080" data-height="1920">
    <section id="scene-03" class="clip" data-start="0" data-duration="12.46" data-track-index="1">
      <div class="device"> … the phone frame, status bar, screen content, .controls, .island … </div>
    </section>
  </div>
  <script>
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
    …the animation for this scene…
    window.__timelines["03-greeting"] = tl;     ← key MUST equal data-composition-id
  </script>
</template>
```

**Five rules you cannot break** (they cause silent blank/broken renders):

1. A sub-composition's content lives **inside `<template>`** — including its
   `<style>` and `<script>`. Anything outside the template is discarded.
2. `#root` must be a **sized box** (`data-width`/`data-height` in px) and every
   full-height child needs a resolved height, or content collapses to the corner.
3. Exactly **one** `gsap.timeline({ paused: true })` per frame, registered at
   `window.__timelines["<id>"]` where `<id>` **exactly equals** the frame's
   `data-composition-id` (no suffix).
4. Timed elements carry `class="clip"` + `data-start`/`data-duration`/`data-track-index`.
   The framework controls their visibility — don't animate `display`/`visibility`.
5. Every `id` must be unique across the **assembled** page. Inside a frame, prefix
   ids with the scene (e.g. `#gr-b1` in the greeting) so two frames never collide.

> Read [`change_theme.md`](change_theme.md) for the color/font vocabulary and, if
> you have it, the `/hyperframes-core` skill for the full composition contract
> before a big rewrite.

---

## Choose the size of the change

| You want to…                                          | Go to section |
| ----------------------------------------------------- | ------------- |
| Rearrange elements within a screen                    | **A**         |
| Add or remove a whole scene                           | **B**         |
| Change the aspect ratio (16:9, 1:1…)                  | **C**         |
| Replace the phone metaphor / restyle the device frame | **D**         |

Whichever you do, **snapshot first:**

```bash
cp -R compositions/frames compositions/frames_backup_cake-world   # history you can diff/revert to
cp index.html index.cake-world.html
```

---

## A — Rearrange a screen's layout

Work inside one frame file at a time.

1. **Edit the `<style>` block** at the top of the frame — that's where the
   positions live (`.device`, `.controls`, the bubble/header/ticket CSS). Move,
   resize, restack. Keep transformed/animated elements **block-level and sized**
   (absolute + explicit width/height) — a bare inline span won't transform
   cleanly.
2. **Edit the markup** inside `<section class="clip">` — add/move/remove the
   `<div>`s. Keep each animated element's `id` unique and scene-prefixed.
3. **Fix the timeline** in the `<script>` to match. Every `tl.fromTo("#gr-b1", …)`
   targets an id — if you renamed or removed an element, update or delete its
   tween, or the animation silently no-ops. Keep the total motion within the
   scene's `data-duration`.
4. Snapshot just that scene and eyeball it (Section E).

The static layout should read correctly **before** you worry about motion — build
the still frame first, then animate it.

---

## B — Add or remove a scene

A scene is one frame file **plus** one host slot in `index.html`. Both must agree.

### Add a scene

1. **Create the file** — copy the closest existing frame as a starting point so
   you inherit the device frame, fonts, and structure:
   ```bash
   cp compositions/frames/03-greeting.html compositions/frames/08-new-scene.html
   ```
2. **Rename its identity inside the file:** change `data-composition-id` on
   `#root`, the `id="scene-NN"` on the `.clip` section, the
   `window.__timelines["…"]` key, and every scene-prefixed element id — all to a
   new unique name (e.g. `08-new-scene`, `#ns-…`).
3. **Mount it in `index.html`.** In the _Scenes_ block (lines ~20–26) each scene
   is one host `<div>`:
   ```html
   <div
     id="host-08-new-scene"
     class="clip"
     data-composition-id="08-new-scene"
     data-composition-src="compositions/frames/08-new-scene.html"
     data-start="79.26"
     data-duration="4.0"
     data-track-index="1"
     data-width="1080"
     data-height="1920"
   ></div>
   ```
   `data-composition-id` here must **exactly match** the file's inner
   `data-composition-id`. Set `data-start` where it should begin and
   `data-duration` for its length. Scenes are hard cuts on **track 1**, so pick a
   `data-start` that follows the previous scene's end.
4. **Extend the root duration** — bump `data-duration` on `#root` in `index.html`
   (line 15) to cover the new end, and shift any later scenes' `data-start`s if
   you inserted rather than appended.
5. If the scene has dialogue, it also needs voice/timing wiring — see
   [`change_dialogue.md`](change_dialogue.md).

### Remove a scene

Delete its host `<div>` in `index.html`, delete the frame file (or move it into a
backup folder to keep as history), then **close the time gap**: reduce the root
`data-duration` and shift later scenes' `data-start`s earlier by the removed
length so there's no black hole in the timeline.

---

## C — Change the aspect ratio

The size is declared in **two places per surface** and must match everywhere.

1. **`index.html`** — `#root` `data-width`/`data-height` (line 15) and the
   `data-width`/`data-height` on **every scene host** (lines ~20–26). Also the
   `<meta name="viewport">` and the `html,body` `width`/`height` in the top
   `<style>`.
2. **Each frame** — `#root` `data-width`/`data-height`, and the CSS that assumes
   1080×1920: the `.device` box (`left/top/width/height`), the `html,body` size,
   and any hard-coded pixel positions in that frame's `<style>`.
3. **Reflow the layouts.** Going to 16:9 (1920×1080) or 1:1 (1080×1080) isn't just
   resizing the canvas — a tall phone screen won't fit a wide frame. Rework each
   scene's layout for the new proportions (Section A), and decide whether the
   phone device frame even makes sense at that ratio (a portrait phone in a
   landscape video usually wants a different composition — see Section D).

Because the numbers are repeated, change one surface, `npm run check`, then the
next — don't try to change all of them blind.

---

## D — Replace the phone metaphor / restyle the device

The "it's a phone" look is entirely the `.device` / `.island` / status-bar /
`.controls` CSS + markup repeated in each frame. To change the container concept
(e.g. a desktop app window, a plain card, no chrome at all):

1. Decide the new shell once, then apply it to **every** frame's `<style>` and the
   wrapper markup — consistency across scenes is what sells the continuity.
2. If you're dropping the phone entirely, remove `.device`/`.island`/status-bar
   markup and re-anchor the screen content to `#root` (keep `#root` sized and give
   the content a resolved height — Rule 2).
3. Keep the **scene/timeline contract** intact (`class="clip"`, one paused
   timeline per frame, the `window.__timelines` key). You're changing the _set_,
   not the _projector_.
4. This is a real design pass — it pairs naturally with a full recolor
   ([`change_theme.md`](change_theme.md)) and often a new `frame.md`. Update
   `frame.md` to describe the new system so it stays the source of truth.

For a change this large, consider treating it as a **new composition** rather than
an edit: `npx hyperframes init "video-projects/<new-name>"`, then port the pieces
you want to keep (audio, script, tools) across. That keeps this project as a clean
reference.

---

## Use the Studio UI alongside the code edits

Structure (markup + CSS + timelines) is code — Studio doesn't draw new layouts
for you — but the visual editor (**Studio**) makes the _timing and review_ half of
a redesign far faster:

```bash
npm run dev     # long-running; prints the URL, e.g. http://localhost:3003
```

What Studio helps with during a layout change:

- **Retime scenes visually** — after you add/remove a scene (Section B), open the
  **Timeline tab** and drag each scene clip / its edges to set `data-start` and
  `data-duration` instead of counting seconds by hand; Studio writes the
  attributes back into `index.html`.
- **Toggle scenes/elements** (eye icon → `data-hidden`) to preview the sequence
  without one scene, non-destructively.
- **Scrub every frame** to catch the classic breakages (top-left pile-up, blank
  scene, missing element) the moment they happen.
- **Download** the finished MP4 from the Renders tab.

You still write the new markup, CSS, and GSAP tweens in the frame files — Studio
is the **preview + retime + review** surface, not a drag-to-build page designer.
Full tab-by-tab breakdown: [README](../README.md#the-studio-ui-what-you-can-do-in-the-browser).

## E — Validate (do this after every structural edit)

Layout bugs are the ones automated checks miss most, so **look at frames**, don't
trust green checks alone:

```bash
npm run check                              # lint + runtime + layout + motion + contrast
npx hyperframes snapshot --at 3,10,25,45,62,74   # one per scene — inspect each image
open snapshots/
npm run dev                                # scrub the whole timeline live
```

Watch for the classic sub-composition failures: content piled in the top-left
(unsized `#root` or a collapsed height — Rule 2), a blank scene (mismatched
`data-composition-id` vs `window.__timelines` key — Rule 3), or a missing element
(duplicate id across frames — Rule 5). Snapshot the specific scene you edited and
confirm it looks right _before_ rendering.

```bash
npm run render     # only after checks pass and the snapshots look right
```

---

## Switching back

You copied `compositions/frames` → `compositions/frames_backup_cake-world` and
`index.html` → `index.cake-world.html` before starting, so revert is copy-only:

```bash
rm -rf compositions/frames && cp -R compositions/frames_backup_cake-world compositions/frames
cp index.cake-world.html index.html
```

Under git, `git checkout -- index.html compositions/frames` reverts the whole
structural change at once.

---

## Reminder — the order of operations for a big layout change

```text
1. cp the frames + index.html to a backup (history)
2. build the STATIC new layout first (CSS + markup) — one frame at a time
3. re-wire the timeline to the new element ids
4. keep #root sized, one paused timeline per frame, unique ids, class="clip"
5. index.html: match every scene host's size + data-start/duration + root duration
6. snapshot EACH edited scene and eyeball it
7. npm run check → npm run dev → npm run render
```
