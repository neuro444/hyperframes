# Changing the theme — a developer's step-by-step

How to re-skin **Fiona Takes the Call** for a different brand _without touching
the animation, timing, audio, or captions_. The whole look is a small set of
colors, two fonts, and one logo — swap those and re-render.

> Everything else (the 7-scene structure, GSAP timelines, the audio mix, the
> word-timed captions) is content-independent. This guide only changes how it
> _looks_. To change what's _said_, see the "New dialogue" section of the
> [README](../README.md).

All commands run **from the project root** —
`video-projects/fiona-takes-the-call`, i.e. the parent of this `shift_theme/`
folder (`cd ..` if you opened this file's directory). Paths like
`compositions/frames/` and `frame.md` are relative to that root.

---

## The 15-second version

```bash
# 1. recolor: replace the theme hexes across every frame + the design doc
cd compositions/frames
sed -i '' \
  -e 's/#9E0027/#0E7C86/gI' \
  -e 's/#BA1434/#12A0AD/gI' \
  -e 's/#E41925/#14B8C4/gI' \
  *.html
cd ../.. && sed -i '' -e 's/#9E0027/#0E7C86/gI' -e 's/#BA1434/#12A0AD/gI' -e 's/#E41925/#14B8C4/gI' frame.md

# 2. swap the logo (keep the filename → nothing else to change)
npx hyperframes remove-background assets/your-new-logo.png -o assets/cake-logo-transparent.png

# 3. validate + render
npm run check
npm run render
```

That recolors the brand red to a teal and swaps the logo. The rest of this doc
explains **which** colors matter, so you can design a real palette instead of a
blind find/replace.

---

## Step 1 — Understand the palette (what each color does)

The design is documented in [`frame.md`](../frame.md); the frames hard-code the same
hexes. These are the **load-bearing** ones — change these and the whole video
re-brands. (Counts = how many times each appears across the 7 frames.)

### Brand / accent colors — the ones that read as "the brand"

| Hex       | Role                                                                          | Where          |
| --------- | ----------------------------------------------------------------------------- | -------------- |
| `#9E0027` | **In-call brand red** — header brand name, ticket label, total, back chevron  | frames 2–7     |
| `#BA1434` | **In-call red fill** — Thomas (customer) bubbles, End button, waveform bars   | frames 2–7     |
| `#E41925` | **Brand-screen logo red** — the "Cake World" half of the wordmark on black    | frames 1 & 7   |
| `#2E7D32` | **Confirmation green** — check ring, "Ready in 20–25 min" pill, Accept button | frames 1, 5, 6 |

> ⚠️ **There are two reds.** The bright `#E41925` on the black brand screens is a
> _different value_ from the deep `#9E0027` / `#BA1434` on the in-call screens
> (design decision — less red, more premium, once the call connects). If you
> recolor only the in-call reds, the black open/close screens keep the old brand
> color. **Recolor all three** to fully re-brand.

### Surfaces & neutrals — usually keep, tune only for a dark/light flip

| Hex                   | Role                                                                              |
| --------------------- | --------------------------------------------------------------------------------- |
| `#FBF9F9`             | In-call screen background (bone white)                                            |
| `#0D0D0D` / `#050505` | Brand / end screen black                                                          |
| `#1B1C1C`             | Ink — headings, body, Total label, "Order Confirmed"                              |
| `#EFEDED`             | Fiona (agent) bubbles — left, gray                                                |
| `#E9E5E2` / `#F5F1EA` | Warm neutral backdrop behind the device frame                                     |
| `#ECE9E8`             | Hairline dividers / row separators                                                |
| `#8A8A8A` / `#8C8A88` | Muted labels — "ACTIVE CALL", timestamps, "CUSTOMER"                              |
| `#DE4030` / `#E0524F` | iOS **system** reds — Decline / mute glyph (kept apart from brand red on purpose) |

Leave the neutrals unless you're doing a full dark↔light flip. If you _do_ flip,
you must re-check contrast (Step 4) — that's where a re-skin most often breaks.

---

## Step 2 — Recolor

Design your palette first (pick your brand's red-equivalent, its darker in-call
tint, and your green), then replace each hex everywhere it appears — both the
frames **and** `frame.md`, so the design doc stays the source of truth.

```bash
cd compositions/frames

# map: OLD → NEW. Do all three brand reds + the green in one pass.
sed -i '' \
  -e 's/#9E0027/#0E7C86/gI' \   # deep in-call brand
  -e 's/#BA1434/#12A0AD/gI' \   # in-call fill (customer bubbles, End, waveform)
  -e 's/#E41925/#14B8C4/gI' \   # bright logo red on the black screens
  -e 's/#2E7D32/#1D7A5F/gI' \   # confirmation green (optional)
  *.html

# keep frame.md in sync
cd ../..
sed -i '' \
  -e 's/#9E0027/#0E7C86/gI' -e 's/#BA1434/#12A0AD/gI' \
  -e 's/#E41925/#14B8C4/gI' -e 's/#2E7D32/#1D7A5F/gI' \
  frame.md
```

- `sed -i ''` is the **macOS** form (empty backup suffix). On Linux use `sed -i`.
- The `I` flag on each `s///` makes the match case-insensitive, so `#ba1434`
  and `#BA1434` both get replaced.
- **Don't touch** the system reds `#DE4030` / `#E0524F` — those are the iOS
  Decline/mute glyphs and should stay red even under a non-red brand.

Verify nothing was missed:

```bash
grep -rilE '#9E0027|#BA1434|#E41925' compositions/frames/*.html frame.md
# → no output means every brand hex is gone
```

---

## Step 3 — Swap the logo & (optionally) fonts

### Logo

The caller avatar and brand screens use one transparent PNG,
`assets/cake-logo-transparent.png`, referenced as
`src="assets/cake-logo-transparent.png"` in the frames. Replace it in place and
nothing else changes:

```bash
npx hyperframes remove-background assets/your-new-logo.png -o assets/cake-logo-transparent.png
```

Keep the same filename → the `<img src>` in every frame still resolves. If you'd
rather use a new filename, update the `src` in the frames that reference it
(`01-incoming-call.html`, `07-goodbye-end.html`, and the in-call header frames).

Also update the visible brand name: search the frames for **"Cake World"** /
**"Eatery"** and replace with the new name (it's split into two colored spans on
the black screens — the first span is the accent-red half).

### Fonts (optional)

Two variable fonts are embedded from `assets/fonts/` and set as `font-family`:

| Family                | File                                       | Used for                              |
| --------------------- | ------------------------------------------ | ------------------------------------- |
| **Work Sans**         | `assets/fonts/work-sans-var.woff2`         | body / bubble text, labels            |
| **Plus Jakarta Sans** | `assets/fonts/plus-jakarta-sans-var.woff2` | headings, brand name                  |
| Playfair Display      | _(not bundled — system/fallback)_          | brand wordmark, "Order Confirmed"     |
| JetBrains Mono        | _(not bundled — system/fallback)_          | call timer, prices, `end_call()` chip |

To change a font:

1. Drop the new `.woff2` into `assets/fonts/`.
2. In each frame, update the matching `@font-face { src: url("assets/fonts/…") }`
   and the `font-family: "…"` declarations.

> ⚠️ **Cloud rendering has no system fonts.** Playfair Display and JetBrains Mono
> currently rely on a fallback. If you render in the cloud (or want those exact
> faces guaranteed), bundle real `.woff2` files for them too and add `@font-face`
> blocks — don't assume an unbundled display font exists on the render machine.

---

## Do it in the Studio UI (preview live while you recolor)

The `sed` recolor is the fast path, but HyperFrames' visual editor (**Studio**)
lets you _see_ each change land. Start it and open the project:

```bash
npm run dev     # long-running; prints the URL, e.g. http://localhost:3003
```

In Studio you can:

- **Scrub the timeline** to any moment and watch the recolored frames render live
  — the fastest way to spot a color you missed on one screen.
- **Toggle elements** (eye icon) to isolate what a given color affects.
- **Download the render** from the Renders tab once it looks right.

Studio is for **placement, timing, and visual review**; the actual palette hexes
still live in the frame CSS + `frame.md`, so the recolor itself stays a text edit
(the `sed` above). Use Studio to confirm it, not to pick the colors. What each
Studio tab does in full is listed in the [README](../README.md#the-studio-ui-what-you-can-do-in-the-browser).

## Step 4 — Validate (this is where re-skins fail)

```bash
npm run check
```

`check` runs lint + a headless-browser gate: runtime errors, layout, motion, and
**WCAG AA contrast**. A recolor most commonly breaks **contrast** — e.g. a light
brand color on a white bubble, or dark text on a now-dark header. If `check`
reports contrast findings, nudge the offending color until it passes (the report
names the element and the measured ratio). The original theme passes 123/123;
your re-skin should too before you render.

Eyeball the frames as well:

```bash
npx hyperframes snapshot --at 2,10,30,50,65,75   # one frame per scene
open snapshots/
```

---

## Step 5 — Render

```bash
npm run render
# → renders/fiona-takes-the-call_<timestamp>.mp4
```

Preview live first if you want to scrub it: `npm run dev` (keep it running, open
the printed URL). Download the finished MP4 per the
[README](../README.md#downloading-the-mp4).

---

## Fastest path for repeat re-brands — freeze a recipe

If you'll re-theme this often, freeze the project as a recipe once. Then the
HyperFrames intent layer pre-fills the whole design for the next video and you
just supply the new brand + script:

```bash
node ~/.claude/skills/media-use/scripts/recipe.mjs freeze --hyperframes . --name cake-world-call
```

Next time, tell your agent **"make another cake-world-call"** with the new brand
colors, logo, and dialogue — it starts from this exact design and pipeline.

---

## Quick checklist

- [ ] Palette designed (deep in-call red, in-call fill, bright logo red, green)
- [ ] All three brand reds replaced in `compositions/frames/*.html` **and** `frame.md`
- [ ] System reds (`#DE4030` / `#E0524F`) left untouched
- [ ] `grep` confirms no old brand hexes remain
- [ ] Logo swapped (background removed, same filename or `src` updated)
- [ ] Brand name text ("Cake World" / "Eatery") updated
- [ ] Fonts swapped + `@font-face` updated (if changing type)
- [ ] `npm run check` passes (esp. contrast)
- [ ] Snapshots eyeballed
- [ ] `npm run render`
