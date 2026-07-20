#!/usr/bin/env node
// Builds timings.json — the single source of truth for the composition schedule.
// Real TTS durations drive everything (production-loop: real duration wins).
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const SPEAKERS = ["F", "T", "F", "T", "F", "T", "F", "T", "F", "T", "F", "T", "F"];
const GAP = 0.6; // pause between turns

const dur = (p) =>
  parseFloat(
    execFileSync("ffprobe", ["-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", p])
      .toString()
      .trim(),
  );

const lines = [];
for (let i = 1; i <= 13; i++) {
  const n = String(i).padStart(2, "0");
  const wav = `.media/audio/voice/line${n}.wav`;
  const words = JSON.parse(readFileSync(`.media/audio/voice/line${n}.words.json`, "utf8"));
  lines.push({ n: i, id: `line${n}`, speaker: SPEAKERS[i - 1], src: wav, dur: dur(wav), words });
}

// Frame boundaries per STORYBOARD:
// F1 ring, F2 answered, F3 lines 1-3, F4 lines 4-6, F5 lines 7-9, F6 lines 10-11, F7 lines 12-13
const F1_END = 5.5;
const F2_END = 8.0;
let t = F2_END + 0.3;
const frameOf = (n) => (n <= 3 ? 3 : n <= 6 ? 4 : n <= 9 ? 5 : n <= 11 ? 6 : 7);
let prevFrame = 3;
const frameStart = { 1: 0, 2: F1_END, 3: F2_END };
for (const L of lines) {
  const f = frameOf(L.n);
  if (f !== prevFrame) {
    // small breath at scene handoff, frame starts at the handoff point
    t += 0.4;
    frameStart[f] = Math.round((t - 0.3) * 100) / 100;
    prevFrame = f;
  }
  L.start = Math.round(t * 100) / 100;
  L.end = Math.round((t + L.dur) * 100) / 100;
  t = L.end + GAP;
}
// tail: end_call flourish + call-ended hold
const line13 = lines[12];
const endcallChip = Math.round((line13.end + 0.4) * 100) / 100;
const endBeep = Math.round((endcallChip + 0.3) * 100) / 100;
const callEnded = Math.round((endBeep + 0.35) * 100) / 100;
const total = Math.round((callEnded + 3.2) * 100) / 100;

const frames = [
  { n: 1, id: "01-incoming-call", start: 0, end: F1_END },
  { n: 2, id: "02-answered", start: F1_END, end: F2_END },
  { n: 3, id: "03-greeting", start: F2_END, end: frameStart[4] },
  { n: 4, id: "04-the-order", start: frameStart[4], end: frameStart[5] },
  { n: 5, id: "05-name-recap", start: frameStart[5], end: frameStart[6] },
  { n: 6, id: "06-confirmed", start: frameStart[6], end: frameStart[7] },
  { n: 7, id: "07-goodbye-end", start: frameStart[7], end: total },
].map((f) => ({ ...f, dur: Math.round((f.end - f.start) * 100) / 100 }));

// word time helper: global time of a word within a line
const wordGlobal = (L, match, which = 0) => {
  const hits = L.words.filter((w) => w.text.toLowerCase().includes(match.toLowerCase()));
  const w = hits[which] ?? null;
  return w ? Math.round((L.start + w.start) * 100) / 100 : null;
};

const L4 = lines[3], L9 = lines[8];
const cues = {
  ring_start: 0.3,
  accept_tap: 4.6,
  items: [
    { name: "Gobi Manchurian", t: wordGlobal(L4, "manchurian") },
    { name: "Samosa", t: wordGlobal(L4, "samosa") },
    { name: "Paneer Tikka Masala", t: wordGlobal(L4, "masala") },
    { name: "Veg Biriyani", t: wordGlobal(L4, "biriyani") },
  ],
  recap_items: [
    { name: "Gobi Manchurian", t: wordGlobal(L9, "manchurian") },
    { name: "Samosa", t: wordGlobal(L9, "samosa") },
    { name: "Paneer Tikka Masala", t: wordGlobal(L9, "masala") },
    { name: "Veg Biriyani", t: wordGlobal(L9, "biriyani") },
  ],
  total_countup: wordGlobal(L9, "forty-four") ?? wordGlobal(L9, "forty"),
  total_done: wordGlobal(L9, "cents"),
  eta_pill: wordGlobal(L9, "twenty"),
  confirm_stamp: Math.round((lines[9].end + 0.35) * 100) / 100,
  endcall_chip: endcallChip,
  end_beep: endBeep,
  call_ended: callEnded,
};

const out = { total, frames, lines: lines.map(({ words, ...r }) => ({ ...r, words })), cues };
writeFileSync("timings.json", JSON.stringify(out, null, 2));

console.log(`total ${total}s`);
for (const f of frames) console.log(`F${f.n} ${f.id}: ${f.start} → ${f.end} (${f.dur}s)`);
for (const L of lines) console.log(`  ${L.id} ${L.speaker} ${L.start} → ${L.end}`);
console.log("cues:", JSON.stringify(cues));
