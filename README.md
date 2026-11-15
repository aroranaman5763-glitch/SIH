# Story Hunt

A story game for seniors that only finishes when four people meet.

Each senior plays a short picture-book story on their phone and ends up holding one clue. Three neighbours hold the other clues. The four meet at a partner café, tap their cards on the checkpoint device, and solve the ending together. The ending opens a final chapter: a community event that uses the skill they share.

**Skill → story → deed.** The skill chosen at sign-up picks the story (cooking gets *The Lost Recipe*), the story is solved at the café, and it ends by passing that skill on (teaching a cooking class for children).

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
| `http://localhost:3000/device.html` | The café device simulator (same API as the real ESP32) |
| `http://localhost:3000/dashboard.html` | Coordinator, café partner and NGO partner |

Data is kept in `data/db.json`. Delete that file, or press "Reset all demo data" on the dashboard, to start clean.

## Three-minute demo

1. **App:** choose a language, enter a name, pick Cooking. Play Day 1, 2 and 3 (about 30 seconds each). You end with one clue.
2. **Dashboard:** the circle shows "Forming 1/4". Press "Demo: fill with sample seniors" (or sign up three teammates on their own phones with the same skill).
3. **App:** it now says "Time to meet your circle", with the café, a time slot and who has arrived.
4. **Device:** tap three cards. The screen shows "3 of 4 have arrived" and the app updates live.
5. **Device:** tap the fourth card. The riddle appears. A wrong button says "Not quite"; the right one reveals the ending.
6. **Device:** tap a card again and press a feedback button.
7. **App:** the ending, the four clues, new friends, and the final chapter (the community event).
8. **Dashboard:** as the NGO, press "Confirm the circle came". The app shows the story complete and the points, which can be spent on the Rewards tab.

To play as several seniors on one laptop, use a private window per person, or sign out on the Me tab.

## How the game is kept easy

- One thing to do per screen, with large text and buttons.
- A Listen button reads every story card and puzzle aloud.
- No timers, no scores, no losing. A wrong tap gives a gentle hint.
- Three familiar puzzle types: match pairs, put steps in order, find the right picture.
- English and Chinese, switchable at any time.

Stories live in `stories.js`. To add one, copy a story object and set its `skill`.

## Using real cards

1. Start the server on a laptop and connect the laptop and the ESP32 to the same phone hotspot.
2. Set the Wi-Fi name, password and the laptop's IP address at the top of `firmware/storyhunt_device/storyhunt_device.ino`, check the pin numbers, and flash it.
3. In the app, go to Me and press "Link my card", then tap a blank card on the device within 60 seconds. That card now belongs to that senior.

The firmware has not been tested on hardware yet. Keep `device.html` open as a fallback: it works the same way, and it also reads the device screen aloud through the laptop speakers.

## Device API

Every device request carries `deviceToken` (default `demo-device-token`, set `DEVICE_TOKEN` to change it) and `checkpointId`.

| Request | Body | Purpose |
|---|---|---|
| `POST /api/device/tap` | `cardId` | A card was tapped |
| `POST /api/device/button` | `button`: `red`, `yellow` or `green` | A button was pressed |
| `GET /api/device/state?checkpointId=cafe-1` | none | What the screen should show now |

Each reply has `title`, `lines`, `buttons` (labels, or `null`) and `speak`. The device only draws what it is given; all game logic is in `server.js`.

## What is real and what is demo-only

- **Real:** sign-up, matching by story skill and language, the three-day game, card taps, the four-tap unlock, the riddle, feedback, points, friends, event confirmation, rewards redemption.
- **Demo-only:** the three days can be played back to back, sample seniors can fill a circle, the café, NGO partners and rewards are fictional, and there are no accounts or passwords.
