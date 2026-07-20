# Why HyperFrames?

## What is HyperFrames?

HyperFrames is an open-source framework that turns HTML, CSS, media, and seekable animation into deterministic video.

Instead of building a video manually in Premiere Pro or After Effects, each screen is described with familiar web technology. HyperFrames opens that composition in a controlled browser, moves its animation timeline to each exact frame, captures the frame, and encodes everything into an MP4.

```text
HTML/CSS design
      ↓
GSAP animation timeline
      ↓
HyperFrames frame capture
      ↓
FFmpeg video and audio encoding
      ↓
Final MP4
```

## Why HyperFrames was a good fit

The Fiona video is essentially an animated application interface:

- an iPhone frame
- an incoming-call UI
- conversation bubbles
- live captions
- order rows
- prices and a calculated total
- a confirmation screen
- precise voice synchronization

HTML and CSS are especially good at building this type of structured interface. GSAP is good at animating it, and HyperFrames makes those browser animations render predictably as video.

The main reasons for using HyperFrames were:

- The entire visual can be described as editable HTML.
- AI coding agents understand HTML, CSS, and JavaScript well.
- Text, colors, prices, logos, and layouts remain editable.
- Animation can be synchronized with exact voice timestamps.
- The same composition can be rendered repeatedly.
- It supports automated validation before rendering.
- There is no proprietary video-project format.
- The project can evolve into a reusable video generator.

A traditional editor would create one finished video. HyperFrames created both the video and a programmable source system capable of producing future variations.

## Technology stack

### HTML

HTML defines the visual structure:

- iPhone device shell
- status bar and Dynamic Island
- caller information
- transcript bubbles
- order cards
- call controls
- confirmation screen
- audio tracks

The master composition is `index.html`. The seven scene compositions are in `compositions/frames/`.

### CSS

CSS creates the visual identity:

- iPhone geometry
- rounded screens and controls
- brand colors
- typography
- conversation-bubble layouts
- shadows and spacing
- order receipt
- confirmation state

Each scene file contains its relevant layout and styling. The intended design rules are documented in `frame.md`.

### JavaScript

JavaScript connects content, timing, animation, and state changes. It controls when dialogue appears, updates the call timer, adds order items, counts the total to `$44.96`, draws the confirmation check, and transitions to the ended-call screen.

### GSAP

GSAP is the primary animation engine. It controls entrances, exits, opacity, movement, scale, waveform activity, button reactions, caption highlighting, order-row reveals, the total count-up, and confirmation drawing.

Normally, GSAP plays according to elapsed browser time. In HyperFrames, each GSAP timeline is paused and registered with the framework. HyperFrames moves the timeline to an exact timestamp for every captured frame. This makes the animation seekable and safe to render.

### HyperFrames runtime

HyperFrames interprets composition attributes including:

- `data-composition-id`
- `data-composition-src`
- `data-start`
- `data-duration`
- `data-track-index`
- `data-volume`

These attributes describe when each scene or media element starts, how long it lasts, and which timeline track it occupies.

### Headless Chrome

The video is rendered first as a web page. HyperFrames controls a headless Chrome browser and displays the composition at precise points in time.

At 79.26 seconds and 30 frames per second, the completed film contains approximately 2,378 captured frames. Chrome renders each one using the same HTML and CSS engine used for websites.

### FFmpeg

FFmpeg completes the media-production pipeline. It encodes the captured frames into H.264, mixes all audio tracks, produces stereo AAC audio, and writes the final MP4.

### Node.js

Node.js runs the HyperFrames CLI, timing-generation scripts, validation, preview server, and rendering orchestration.

### Text-to-speech and word alignment

The project uses two synthesized voices:

- Fiona: female AI-agent voice
- Thomas: male customer voice

Each dialogue turn has a WAV audio file and a JSON file containing word timestamps. These timestamps let the visual captions follow the speech word by word.

## HyperFrames features used in this project

### 1. Nested scene compositions

The video is divided into seven scenes:

1. Incoming call
2. Answered call
3. Greeting
4. Order placement
5. Name and recap
6. Confirmation
7. Goodbye and call end

The master `index.html` mounts them as timed sub-compositions. This keeps the 79-second video manageable and allows each screen to be designed and tested independently.

### 2. Seekable GSAP animation

Every scene owns a paused GSAP timeline. HyperFrames can ask what a scene should look like at an exact timestamp, seek GSAP to that state, render it in Chrome, and capture it. This is more reliable than recording an animation while it plays in real time.

### 3. Multi-track audio mixing

The project uses separate audio tracks:

- Track 10: dialogue
- Track 11: UI ticks, tap, chime, and hang-up beep
- Track 12: ringtone
- Track 13: background music

Separate tracks make their timing and volume independently controllable.

### 4. Word-timed captions

The conversation bubbles are also the captions:

- Fiona appears on the left.
- Thomas appears on the right.
- Words activate according to speech timestamps.
- Older messages move or dim.
- Menu items react when spoken.

This combines accessibility, dialogue, and visual storytelling in one layer without duplicating subtitles at the bottom of the screen.

### 5. TTS voices

The project uses 13 generated voice files. Separate files per turn make it possible to assign different voices, insert natural pauses, recalculate scene timing, synchronize each bubble, and replace one line without regenerating the complete conversation.

### 6. Music and sound effects

Sound design makes the interface feel physical:

- The ringtone establishes the incoming call.
- A tap marks the answer.
- UI ticks confirm order items.
- A chime rewards order confirmation.
- A hang-up beep closes the interaction.
- Background music maintains the emotional tone.

Without these sounds, the result would feel like a screen recording. Sound turns it into a designed film.

### 7. Local media provenance

The `.media` directory records the local media and where it came from. This supports repeatability, asset traceability, stable local rendering, and independence from temporary network URLs.

### 8. Design-system documentation

`frame.md` records the palette, typography, bubble styling, device geometry, order cards, confirmation treatment, and visual constraints. This prevents scenes—and the agents editing them—from drifting into different design languages.

### 9. Storyboarding

`STORYBOARD.md` defines the narrative before implementation. It records what happens in each scene, how long it lasts, which dialogue belongs there, the visual proof point, and the animation that communicates it.

This is why the final video has a coherent arc instead of feeling like disconnected UI screens.

### 10. Studio preview

HyperFrames Studio is the browser interface opened with:

```bash
npm run dev
```

Studio provides video playback, timeline scrubbing, frame stepping, scene inspection, source editing, element selection, hot reload, and nested-composition navigation.

## Why Studio matters

The MP4 is the final output, but rendering a new MP4 after every small edit is slow and inconvenient. Studio creates a much faster review loop:

```text
Edit HTML
   ↓
Studio reloads
   ↓
Seek to the affected moment
   ↓
Review before rendering another MP4
```

Studio also exposes visual problems that source code alone cannot reveal, such as late captions, clipped bubbles, overlapping controls, premature order-item reveals, low contrast, abrupt transitions, or overloaded scenes.

Studio does not replace the source files. It gives those files an interactive video-editing surface.

### 11. Automated validation

`npm run check` audits the project for invalid composition structure, JavaScript runtime errors, failed media requests, layout overflow, text overlap, motion assertions, and WCAG color contrast.

This is one of HyperFrames' strongest advantages for automated production: video correctness can be checked programmatically rather than relying entirely on someone watching every frame.

### 12. Snapshots

Snapshots capture selected moments as images. They are useful for reviewing composition, checking readability, comparing versions, making contact sheets, and debugging without rendering the complete video. They are local development artifacts and are ignored by Git.

### 13. MP4 rendering

The final render transforms the browser composition into approximately 2,378 captured frames, one H.264 video stream, one mixed AAC audio stream, and a standard MP4 playable almost anywhere.

## What produced the polished result?

HyperFrames was the production engine, but the quality came from several layers working together:

1. A clear story: incoming call to confirmed order.
2. A consistent design system.
3. Authentic iPhone details.
4. Two distinct voices.
5. Real speech durations controlling scene timing.
6. Word-synchronized captions.
7. UI reactions tied to what is being said.
8. Sound effects that give actions physical weight.
9. A calm music bed.
10. Separate scenes sharing one continuous visual identity.
11. Browser-based review in Studio.
12. Automated checks before rendering.
13. Deterministic frame capture and FFmpeg encoding.

The MP4 was not merely generated. It was assembled from a structured system in which narrative, design, animation, speech, captions, and audio all share the same deterministic timeline.
