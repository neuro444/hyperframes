# shift_theme — how to remix this video

Developer how-to guides for turning **Fiona Takes the Call** into a different
video. Each is a manual, history-preserving, line-by-line walkthrough (keep the
old files, switch back anytime) with the fast copy-paste commands and the
Studio-UI shortcuts noted at the end of each step.

Pick by how big your change is:

| Guide                                      | Use it to…                                                                                               |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| [`change_theme.md`](change_theme.md)       | Re-brand: swap **colors, fonts, logo** — same layout & script                                            |
| [`change_dialogue.md`](change_dialogue.md) | New **conversation**: rewrite the script, regen voices, retime captions                                  |
| [`change_music.md`](change_music.md)       | Swap the **music bed, sound effects, ringtone** (which folder + which line)                              |
| [`change_layout.md`](change_layout.md)     | **Structural** redesign: rearrange screens, add/remove scenes, new aspect ratio, drop the phone metaphor |

**All commands run from the project root** (`video-projects/fiona-takes-the-call`,
the parent of this folder) — `cd ..` first.

For what the video _is_, how it's built, and how to render/download it, see the
[project README](../README.md). The [Studio UI](../README.md#the-studio-ui-what-you-can-do-in-the-browser)
section there explains what you can do in the browser vs. in the files — every
guide here points back to it.

Rule of thumb across all four: **the files decide _what content exists_** (text,
colors, media, motion); **Studio is for placement, timing, muting, preview, and
download**. Reach for the guide that matches your change, and use Studio where it
notes a step is faster there.
