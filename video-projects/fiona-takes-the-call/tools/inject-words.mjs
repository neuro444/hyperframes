#!/usr/bin/env node
// Injects per-line word timestamps into the frame files (replaces /*__WORDS__*/ null).
// Idempotent: re-running replaces the previously injected payload.
import { readFileSync, writeFileSync } from "node:fs";

const timings = JSON.parse(readFileSync("timings.json", "utf8"));
const byId = Object.fromEntries(timings.lines.map((l) => [l.id, l]));

const FRAME_LINES = {
  "compositions/frames/03-greeting.html": ["line01", "line02", "line03"],
  "compositions/frames/04-the-order.html": ["line04", "line05", "line06"],
  "compositions/frames/05-name-recap.html": ["line07", "line08", "line09"],
  "compositions/frames/06-confirmed.html": ["line10", "line11"],
  "compositions/frames/07-goodbye-end.html": ["line12", "line13"],
};

for (const [file, lineIds] of Object.entries(FRAME_LINES)) {
  const payload = {};
  for (const id of lineIds) {
    payload[id] = { words: byId[id].words.map((w) => ({ text: w.text, start: w.start, end: w.end })) };
  }
  let html = readFileSync(file, "utf8");
  const json = JSON.stringify(payload);
  const re = /const WORDS = \/\*__WORDS__\*\/ (?:null|\{.*?\});\n/s;
  if (!re.test(html)) {
    console.error(`MISSING placeholder in ${file}`);
    process.exit(1);
  }
  html = html.replace(re, `const WORDS = /*__WORDS__*/ ${json};\n`);
  writeFileSync(file, html);
  console.log(`injected ${lineIds.length} lines → ${file}`);
}
