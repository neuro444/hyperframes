---
workflow: general-video
flow: automation
storyboard: yes
message: "Fiona, an AI voice agent, takes a real pickup order over the phone end-to-end — from ringtone to confirmed order"
destination: reels-shorts
aspect: 1080x1920
language: en
length: ~60-80s
audience: restaurant owners / prospects evaluating AI phone agents
narration: dialogue
---

## Intent

A demo of an AI phone-ordering agent, told as one continuous iPhone screen: an
incoming call from Cake World Eatery's agent Fiona, the customer answers, the
full scripted conversation plays as two voices, and the order builds up live on
screen until it locks in as confirmed. Both sides of the conversation are seen
on one screen; the live-transcript bubbles ARE the captions (speaker-labeled,
timed to the voices) — no duplicate caption rail. Tone: real, calm, quietly
impressive — the product is how effortless the call feels.

## Assets

- script.md — the verbatim dialogue (copied from repo-root dialogue.md); drives all VO and timing.
- /Users/sreekanthgopi/Desktop/Apps/hyperframes/photos/cake logo.avif — the
  Cake World Eatery logo; caller avatar on the call screen + closing
  confirmation card. Adopt into assets/.
- Food photos exist in ../../photos/ but are deliberately NOT used — user
  decision 2026-07-19: menu changes often, so the order card stays
  typographic (receipt-style ticket, no food imagery).
- design-refs/01..04-\*.png — the user's four screen mockups (incoming call,
  in-call transcript, pickup order, order confirmed). DESIGN TRUTH: maroon +
  gold + cream palette, serif typography, ornamental flourishes, kolam
  watermark, visible titanium iPhone device frame on cream canvas.

## Customizations

- Two distinct TTS voices: warm female voice for Fiona, male voice for the
  customer (Thomas). Script used verbatim.
- Full sound design: iPhone-style ringtone on the incoming call, subtle UI
  ticks as order items land in the order card, confirmation chime on
  "Order Confirmed", soft music bed under the dialogue.
- Order card builds live: items tick in as they're spoken, total $44.96,
  ends on "Order Confirmed ✓".
- Design: FINAL — the user's "new theme.png" 4-up mockup
  (design-refs/05-new-theme-4up.png) is design truth, locked 2026-07-19,
  with the red darkened per user request (#B01218 instead of the mockup's
  ~#E31B23). Black incoming/end screens, near-white in-call screens, red
  headers (spanning the status area), two-tone wordmark ("Cake World" red +
  "Eatery" white), Fiona = black avatar with red mic, Thomas = red avatar,
  black-led text (Total and "Order Confirmed" in black), red cloche icons +
  dashed dividers, green outline pills, kolam watermark, red flourish
  ornaments. Earlier explorations kept in design-options/ for reference.
  Visible iPhone device frame throughout; per-item prices
  ($11.99 + $4.99 + $13.99 + $13.99 = $44.96); "Thank you, Thomas!" close.

## Notes

- ADOPTED (2026-07-19, correcting an earlier misread): the Stitch kit
  (design-refs/stitch-chat/) IS the in-call design truth — user: "more
  iPhone-like, less red, sleek; user at top; Fiona AI Assistant; iPhone-like
  Mute/End/Speaker." In-call screens (frames 2–4): bone-white #FBF9F9, header
  = logo avatar + "Cake World Eatery" in deep red #9E0027, centered red
  waveform + "Fiona – AI Assistant" + "ACTIVE CALL · MM:SS" caps label,
  Fiona = gray bubble left / Thomas = red #BA1434 bubble right with
  timestamps, Mute / red End (labeled) / Speaker. NO app tab bar and no
  search icon — it must stay a call, not a chat app (agent decision, offer
  to revisit). Order screen (frame 5) goes white/sleek too: no red header
  band, black title, hairline dividers. Frames 1/6/7 keep the 4-up looks
  (black call screens, green confirm). LESS RED overall is the doctrine.
- Build-pass iPhone-authenticity details: status bar (9:41 / signal / Wi-Fi /
  battery) on every screen, dynamic island, iOS-style control glyphs.
- Stitch fonts: Plus Jakarta Sans (headings) + Work Sans (body) for phone UI;
  Playfair Display stays only on the black brand screens and "Order Confirmed".

- Dialogue ends with `Tool call: end_call()` — that's the agent hanging up;
  it can be a subtle nerd-flourish visual near the close, not spoken.
- Key promotable moments: incoming-call hook, each order item, the $44.96
  total, the 20–25 min pickup ETA, "Order Confirmed".
