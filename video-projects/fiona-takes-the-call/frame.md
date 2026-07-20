---
name: cake-world-call
source: design-refs/01..04-*.png (user's four screen mockups — design truth)
colors:
  # FINAL THEME — locked 2026-07-19 after the full picker journey:
  # IN-CALL screens follow the Stitch kit (design-refs/stitch-chat/ — "more iPhone-like,
  # less red, sleek"); BLACK brand screens (incoming/end) keep the "new theme" 4-up look
  # with the darker red. LESS RED overall is the doctrine. Do not drift.
  canvas: "#E9E5E2" # warm gray backdrop behind the device frame
  screen-dark: "#0D0D0D" # incoming-call / end screen black
  screen-light: "#FBF9F9" # in-call / order / confirmed screens — bone white (Stitch)
  red-brand:
    "#9E0027" # Stitch primary — brand name at top of call screens,
    #   "Cake World" in the dark-screen wordmark, ticket label,
    #   total value, back chevron
  red-fill:
    "#BA1434" # Stitch tint — Thomas/customer bubbles (white text),
    #   End button, waveform bars
  black: "#141414" # logo-avatar circle at top of call screens
  ink: "#1B1C1C" # headings, body, Total label, "Order Confirmed"
  gray-label: "#8A8A8A" # ACTIVE CALL status, CUSTOMER label, timestamps #A9A6A4
  bubble-gray: "#EFEDED" # Fiona bubbles (left-aligned, ink text)
  card-white: "#FFFFFF" # pickup-ticket card, soft shadow 0 8px 30px rgba(0,0,0,.07)
  hairline: "#ECE9E8" # dividers / row separators (no heavy borders)
  green: "#2E7D32" # check ring, outline pills (white fill + green border/text)
  green-accept: "#50A23F" # accept button
  red-system: "#DE4030" # decline button (reads apart from brand red)
  device: "#B9B2A7" # titanium device frame edge
  # Chrome: in-call header = logo avatar + brand name (NO app tab bar, NO search — it is
  # a CALL, not a chat app); centered red waveform + "Fiona – AI Assistant" +
  # "ACTIVE CALL · MM:SS" caps; bubbles carry SPEAKER · TIME stamps; bubble corners 24px
  # with a 4px sharp corner toward the sender; controls = Mute / red End (labeled) /
  # Speaker. Dark screens: two-tone serif wordmark, kolam watermark, flourishes.
typography:
  display: "Playfair Display" # serif — wordmark, headings, caller name, Order Confirmed
  ui: "Helvetica Neue" # resolves to embedded Inter — iOS chrome, labels, buttons
  data: "JetBrains Mono" # call timer, prices, end_call() chip; tabular-nums
  weights:
    display: 700 (900 for Order Confirmed)
    ui: 400 / 700
  scale:
    wordmark: 64px
    caller-name: 96px
    heading: 58px
    bubble-text: 40px
    ui-label: 28px
    timer: 44px
    price: 38px
    total: 64px
spacing:
  screen-padding: 56px
  bubble-radius: 28px
  card-gap: 32px
  pill-radius: 100px
components:
  device-frame: titanium iPhone (rounded 72px, dynamic island, side buttons) on canvas; screen fills it
  header-bar: maroon band, white/gold centered title, serif
  bubble: avatar circle (maroon mic = Fiona / gold person = Thomas) + name + text; white card Fiona, tan card Thomas
  waveform: gold symmetric bars, pulses under active speaker
  ticket-row: cloche icon + "1 × item" + right-aligned mono price, hairline gold divider
  pill: green-tint fill, green icon + text, 100px radius
  flourish: thin gold rule with ornamental center glyph
  watermark: kolam/mandala motif, gold at ~7% on dark, ~5% on cream
---

## Overview

The video IS a phone. Every frame lives inside one titanium iPhone device frame
on a warm beige canvas. Screens alternate two grounds: dark maroon (incoming
call — the only dark screen) and warm cream (everything after answer). Warm,
premium, South-Indian-restaurant register: serif dignity + gold ornament, never
techy or neon.

## Type register

Three voices: Playfair Display serif = the restaurant speaking (brand, names,
headings, Order Confirmed). Inter (via Helvetica Neue alias) = the phone
speaking (iOS chrome, buttons, labels). JetBrains Mono = the machine speaking
(timer, prices, `end_call()` chip). Playfair Display is a deliberate pick —
it matches the user's mockups, which are design truth; tabular-nums on all
numbers.

## Do

- Keep the device frame identical across every frame — it never moves or rescales except at open/close.
- Kolam watermark on every screen, barely-there (5–7%).
- Gold flourish dividers to separate content zones (as in mockups).
- Per-item prices right-aligned, mono: $11.99 / $4.99 / $13.99 / $13.99 → total $44.96.
- Transcript bubbles: max ~2 visible; older lines scroll up and dim.

## Don't

- No pure black / pure white — tint toward maroon or cream.
- No neon, no cyan/purple gradients, no glassmorphism — this is warm print-shop, not SaaS.
- No food photography (user decision — menu changes).
- No second caption rail — the bubbles are the captions.
