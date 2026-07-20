---
format: 1080x1920
message: "Fiona, an AI voice agent, takes a real pickup order over the phone end-to-end — from ringtone to confirmed order"
arc: Incoming call → Answer → Greeting → Order builds → Recap & total → Confirmed → Goodbye
audience: restaurant owners / prospects evaluating AI phone agents
mode: collaborative
---

## Frame 1 — Incoming Call

- scene: Dark maroon screen (mockup 1) — gold serif "Cake World Eatery · Alpharetta" wordmark, "Fiona AI / Incoming call", kolam watermark, pulsing green Accept + red Decline, ringtone
- duration: 6s
- poster: 3s
- transition_in: cut
- status: built
- src: compositions/frames/01-incoming-call.html

Design truth: design-refs/01. Titanium iPhone device frame on beige canvas
(constant across all frames). Ambient glow behind the wordmark, Accept pulses
(sine-wave-loop + ambient-glow-bloom + spring-pop-entrance).

## Frame 2 — Answered

- scene: Tap ring lands on Accept; screen swaps to cream in-call view (mockup 2) — maroon "Fiona AI" header, mono timer starts, gold waveform, Mute/Keypad/Speaker + red end-call
- duration: 3s
- transition_in: cut
- status: built
- src: compositions/frames/02-answered.html

Design truth: design-refs/02. physics-press-reaction on the tap,
scale-swap-transition to the in-call layout; timer runs in JetBrains Mono
tabular-nums.

## Frame 3 — Greeting

- scene: Transcript bubbles land word-timed — Fiona (white card, maroon mic avatar) then Thomas (tan card, gold person avatar); waveform pulses under the active speaker
- duration: 10s
- transition_in: cut
- status: built
- voiceover: "Hi! Thank you for calling Cake World Eatery… / I'd like to place a pickup order. / Regular pickup or a cake order?"
- src: compositions/frames/03-greeting.html

The bubbles ARE the captions (discrete-text-sequence); max ~2 visible, older
lines drift up and dim.

## Frame 4 — The Order

- scene: Thomas names four dishes — each glows gold in his bubble as spoken and ticks into a compact ticket pinned under the waveform (cloche icon, "1 ×" rows)
- duration: 14s
- transition_in: cut
- status: built
- voiceover: "One Gobi Manchurian, one Samosa, one Paneer Tikka Masala and one Veg Biriyani…"
- src: compositions/frames/04-the-order.html

The proof beat: asr-keyword-glow on item names + spring-pop-entrance staggered
rows + UI tick per landing. Typographic ticket, no food photos.

## Frame 5 — Name & Recap

- scene: Screen slides to the full "Pickup Order" view (mockup 3) — Thomas Milton customer chip, four priced rows ($11.99/$4.99/$13.99/$13.99), total counts up to $44.96, green "Ready in 20–25 minutes" pill; Fiona's recap rides as a compact bubble at the bottom
- duration: 18s
- transition_in: cut
- status: built
- voiceover: "May I have the name for the order? / Thomas Milton. / …Your total is forty-four dollars and ninety-six cents… ready in twenty to twenty-five minutes."
- src: compositions/frames/05-name-recap.html

Design truth: design-refs/03. Rows check off in sync with the recap;
counting-dynamic-scale on the total (dataviz-countup adapted); ETA pill pops.

## Frame 6 — Confirmed

- scene: Cream confirmation screen (mockup 4) — big green check draws in, serif green "Order Confirmed", "Thank you, Thomas!", gold flourishes, ETA pill, brand line; chime
- duration: 8s
- transition_in: cut
- status: built
- voiceover: "Yes, everything is correct. / Perfect, Thomas. Your order is confirmed."
- src: compositions/frames/06-confirmed.html

Design truth: design-refs/04. svg-path-draw on the check ring +
spring-pop-entrance + ambient-glow-bloom; confirmation chime.

## Frame 7 — Goodbye & End

- scene: Fiona signs off; a mono `end_call()` chip blips beside the red end button, screen returns to maroon — "Call Ended · 01:0X", gold wordmark lockup holds
- duration: 9s
- transition_in: cut
- status: built
- voiceover: "Thank you for choosing Cake World Eatery, Alpharetta. Goodbye!"
- src: compositions/frames/07-goodbye-end.html

The nerd flourish: the agent hangs up itself. titlecard-reveal close — one
calm move, still hold on the brand.
