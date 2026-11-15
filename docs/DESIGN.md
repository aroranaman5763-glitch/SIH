# Story Hunt design system: comic edition

The app looks like a page from an ink-drawn comic sketchbook: aged paper, black ink borders, halftone screentone, one spot colour (seal red), ring-binder holes down the page edge and a folio number at the foot. Every rule below also has to work for seniors: big text, big touch targets, high contrast, and four scripts (Latin, Chinese, Tamil, Devanagari).

## Tokens (`public/style.css`, `:root`)

| Token | Value | Use |
|---|---|---|
| `--paper` | `#efe3c8` | Page background, with a light noise texture |
| `--panel` | `#fbf5e6` | Inside every card and panel |
| `--ink` | `#1b1510` | All borders, lines and body text (contrast 15:1 on `--panel`) |
| `--ink-2` | `#4a3f33` | Secondary text (8:1 on `--panel`) |
| `--seal` | `#b8321f` | The single spot colour: main actions, the sun, the lion |
| `--gold` | `#d9a22b` | "Now" and selected states, the listen button, the crown |
| `--good` / `--good-soft` | `#2f6b4f` / `#dcebd9` | Done, arrived, points earned |
| `--bw` | `3px` | Ink border width |
| `--pop` / `--pop-sm` | `5px 5px 0 ink` / `3px 3px 0 ink` | Hard offset shadow: things you can press, or panels that sit on the page |
| `--display` | Bangers | Latin headings only; falls back for other scripts |
| `--letter` | Comic Neue, Mukta, Mukta Malar | Captions, bubbles, buttons. Tamil pages switch to Mukta Malar and Hindi pages to Mukta |

Base size is 20px; the text-size setting moves it to 18, 20 or 23px. Buttons are at least 62px tall, and small controls at least 44px.

## Components

| Component | Class | Notes |
|---|---|---|
| Page | `.page` | Panel background, ink border, binder holes (`::before`), `.folio` number |
| Panel | `.panel` > `.cap` + `.art` + `.bubble` | Caption box overlaps the top of the art; speech bubble overlaps the bottom with its tail pointing up. Panels tilt slightly (`.t0`–`.t2`). The whole panel is a button that reads itself aloud |
| Speaking panel | `.panel.on` | Gold ring around the art, gold caption and a pulsing red dot. Only one at a time |
| Splash | `.splash` | Chapter opener: role-coloured chapter tag, title and halftone corner |
| Card | `.card` | Any non-comic content. Variants `.good`, `.warn`, `.soft` |
| Button | `.btn` | Red with ink border and hard shadow. It sinks into its shadow when pressed. Variants `.quiet`, `.gold`, `.ghost`, `.sq` (square icon) |
| Choice | `.choice` | Speech-bubble shaped answer with an A/B key |
| Memory scrap | `.scrap` | A taped, slightly rotated note for what the character remembers |
| Role card | `.rolecard` | Trading card for the role reveal, top edge in the role colour |
| Journey | `.journey` | Four-panel strip; the current step is gold and lifted |
| Voice chip | `.voice-chip` | Ear icon and current voice, on every screen; opens the sheet |
| Read and listen sheet | `.sheet` | Words on screen, voice (shows whether this phone has it), speed |

## Art (`public/art.js`)

Sixteen scenes are drawn in SVG from a few primitives (figures, palms, ships, junks, stilt houses, a gopuram, a Chinese temple gate, the lion). They share halftone, hatch and cross-hatch patterns, and one turbulence filter makes the lines wobble like ink. Only black ink, paper, seal red and gold are used. Add a scene by adding a function to `S` and naming it in a panel in `stories.js`.

## Rules

- One idea per panel: caption at most about 30 words, bubble at most about 10.
- Words never sit inside the SVG. Captions and bubbles are HTML, so they wrap, scale with the text-size setting and work in every script.
- Red is for the one main action on a screen. Gold means "now" or "selected".
- Motion is limited to the press-in on buttons, the pulse while speaking and smooth scrolling while listening, and all of it switches off with reduced motion.
