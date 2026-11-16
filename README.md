# Story Hunt

A story for seniors that only ends when four people meet.

*The Lion of Singapura* is the legend of how Singapore got its name, told as a comic in four voices. In 1299 a storm, a strange beast and a prince of Chola descent gave the island its name (from the Malay Annals). Each senior plays a different witness: **the Prince** (Sang Nila Utama), **the Navigator** (Muthu, a Tamil sailor from Nagapattinam), **the Sea Girl** (Dara, of the Orang Laut) or **the Trader** (Ah Seng, from Quanzhou). Each reads that character's own three-chapter comic on their phone, or listens to it read aloud. No witness knows the whole truth. The four meet at a partner café, tap their Story cards on the checkpoint device, and answer three questions that none of them could answer alone. The ending opens a final chapter in the real world: a community hour that uses the skill the circle shares.

## Run it

```bash
npm install
```

```bash
npm start
```

Then open:

| Page | Who it is for |
|---|---|
| `http://localhost:3000/` | The senior's app (open it on a phone, or a narrow browser window) |
| `http://localhost:3000/device.html` | The café device in a browser (same API as the real ESP32) |
| `http://localhost:3000/dashboard.html` | Coordinator, café partner and NGO partner |

Data is kept in `data/db.json`. Press "Reset all demo data" on the dashboard to start clean.

## What the senior experiences

1. **Join.** Name, phone number and PIN, skills and interests, then link a Story card by tapping it on a device.
2. **Read or listen.** Three chapters as one of four characters, each a page of four ink-drawn comic panels with captions and speech bubbles. Tap any panel to hear it, or press "Listen to this page" and the panels are read one after another. Each chapter has a choice to make, ends with one thing the character remembers, and asks one question about the senior's own life.
3. **Match.** Four seniors who share a skill form a circle. Each gets a different character.
4. **Meet.** Pick a time, go to the café in quiet hours, tap the card. The device and every phone show who has arrived.
5. **Solve.** The device asks three questions. Each phone shows that person's memories and conversation cards drawn from what the others said about their own lives.
6. **Give back.** The ending reveals a letter, then offers a community hour matched to the circle's shared skill. Members reply, and the NGO confirms the visit.
7. **Reward.** Points go to fitness and wellbeing vouchers. The circle becomes friends in the app, with a group chat.

## Three-minute demo

1. **App:** Start, create an account, pick Cooking.
2. **App + device:** press "Link my card", then on the device page tap "Blank card A". The app confirms within two seconds.
3. **App:** read a chapter live. To save time, read the other two before the demo.
4. **Dashboard:** press "Demo: fill with sample seniors". The app changes to "Your circle is ready".
5. **Device:** tap the three sample seniors' cards, then your own. Watch the phone count arrivals.
6. **Device + app:** the three questions appear on both. Answer one wrongly to show the hint, then answer correctly (green, yellow, green).
7. **Device:** tap your card again and press a feedback button.
8. **App:** read the letter, press "I'll be there", open the Circle tab and send a message.
9. **Dashboard:** as the NGO, press "Confirm the circle came". Then redeem a reward in the app.

To play as several seniors on one laptop, use a private browser window for each.

## Using the real device

1. Run the server on a laptop and connect the laptop and the ESP32 to the same phone hotspot.
2. Set the Wi-Fi name, password and laptop IP address at the top of `firmware/storyhunt_device/storyhunt_device.ino`, check the pin numbers, and flash it.
3. In the app, press "Link my card" and tap a blank card on the reader.

The firmware has not been tested on hardware. Keep `device.html` open as a fallback: it shows the same screen and reads it aloud.

## Languages and read-aloud

The story text exists in English, Chinese, Malay, Tamil and Hindi (`stories.js`). The app screens are fully translated into English and Chinese, and the reading and listening screens into Tamil, Hindi and Malay; anything else falls back to English.

Tap the ear button (top right) to open **Read and listen**. There you choose the words on screen, the voice and the speed. Words and voice are separate: a senior can read in English and listen in Tamil.

| Voice | Where the sound comes from |
|---|---|
| English, 华语 Mandarin, 粵語 Cantonese, Bahasa Melayu, தமிழ், हिन्दी | Microsoft neural voices, made once into MP3 files (below). Until those exist, the phone's own text-to-speech. Cantonese reads the Chinese text. |
| 福建话 Hokkien, 潮州话 Teochew | Recordings by volunteers in `public/audio/<voice>/` (see `public/audio/README.md`). Until a page is recorded it plays Mandarin and says so. |

The app plays a file whenever `public/audio/manifest.json` lists one for that voice and that part of the story. Otherwise it uses the phone's voice, so nothing breaks while audio is missing. The sheet marks voices that have files with "★ Natural voice ready".

### Making the natural voices (once)

```bash
npm run audio
```

This needs no account or key. It uses Microsoft's neural voices through the read-aloud service built into the Edge browser (the `msedge-tts` package), and makes about 600 clips (100 per language) into `public/audio/<voice>/`, then writes the manifest. If it stops, run it again and it carries on from where it was. After changing text in `stories.js`, run it again and only the changed clips are remade. `npm run audio -- --only=ta,hi` makes some languages only; `npm run audio -- --dry-run` counts without making anything.

That read-aloud service is meant for the Edge browser, not as a public service for apps, so it is fine for a prototype but not for the real product. For a pilot, make the same voices through an official Azure Speech account (it has a free tier); the voice names are the same.

Captions are read by a female narrator, and the Prince, Muthu and Ah Seng speak their own lines in a male voice (Singapore English and Singapore Tamil voices where Microsoft has them). The voice names are at the top of `scripts/make-audio.js`.

## Meeting point

The app shows where the circle meets: the café's name and address, a map drawn in the comic style (café, MRT, bus stop and the walking route), how to get there, what to look for on arrival, and a "Get directions" button that opens Google Maps. A short version appears while seniors are still reading, and the full one once the circle is ready. The café's details are in `CAFE` in `stories.js`. The café is a placeholder on Hill Street, below Fort Canning Hill, where the legend says Sang Nila Utama built his palace; replace it with the real partner's details and coordinates.

## Events

The Events tab has two parts:

- **What's on:** free activities posted by community groups (walks and runs, cooking, health checks, arts, music, volunteering, learning), plus classes taught by Story Hunt circles. Events that match a senior's interests come first. One tap joins.
- **Teach:** a senior plans a class in three steps (skill, date and place, name and size). Their circle friends can join as fellow teachers, and anyone can sign up to learn. Only the teachers see learners' names.

NGOs post events at `/partners.html`, which also lists who has signed up. The sample events and organisations are fictional (`EVENT_SEEDS` in `stories.js`). The partner page has no sign-in yet, so it is demo-only.

## Device API

Every device request carries `deviceToken` (default `demo-device-token`; set `DEVICE_TOKEN` to change it) and `checkpointId`.

| Request | Body | Purpose |
|---|---|---|
| `POST /api/device/tap` | `cardId` | A card was tapped |
| `POST /api/device/button` | `button`: `red`, `yellow` or `green` | A button was pressed |
| `GET /api/device/state?checkpointId=cafe-1` | none | What the screen should show now |

Each reply has `title`, `lines`, `buttons` (labels, or `null`) and `speak`. The device only draws what it is given; all logic is in `server.js`.

## Files

| File | What it holds |
|---|---|
| `stories.js` | The story, the four characters, questions, reflections, rewards, events |
| `server.js` | Accounts, matching, the device state machine, points, dashboard data |
| `public/app.js`, `public/style.css`, `public/art.js` | The senior's app, its comic styling, and the panel art (SVG, no image files) |
| `public/device.html`, `public/dashboard.html`, `public/partners.html` | Device page, partner dashboard, and the page where NGOs post events |
| `docs/WORKFLOW.md` | Flowcharts for the pitch |
| `docs/PITCH.md` | The 5-minute pitch script, slide by slide, with sources |
| `demo/story-hunt-demo.mp4`, `scripts/demo-video.js` | The 80-second demo video, and the script that records it (`node scripts/demo-video.js`) |
| `docs/DESIGN.md` | Design tokens and the comic components |

## What is real and what is demo-only

- **Real:** accounts with sign-in, card linking, four-character story, matching by shared skill, arrival tracking, the three-question unlock, feedback, points history, vouchers, circle chat, event replies and confirmation, profile editing, three text sizes, the story in five languages (English, Chinese, Malay, Tamil, Hindi) and read-aloud in eight voices (those five plus Cantonese, and Hokkien and Teochew from volunteer recordings).
- **Demo-only:** chapters can be read back to back, sample seniors can fill a circle, and the café, NGO partners and rewards are fictional. There is one story so far.
- **Not built:** unlocking when one member does not show up, and SMS verification of phone numbers.

## Hosting on Vercel

`vercel.json` serves `public/` as static files and sends every `/api/*` request to the Express app through `api/index.js`. Import the GitHub repository at [vercel.com/new](https://vercel.com/new) and deploy; no settings are needed.

On Vercel the data is kept in `/tmp`, which resets whenever Vercel starts a fresh server (after some idle time or a new deploy), and two servers running at once would not share it. That is fine for a demo: press "Reset all demo data" before showing it. For a pilot, move the data to a hosted database such as Redis from the Vercel Marketplace.
