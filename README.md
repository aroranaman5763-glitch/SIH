# Story Hunt

A story for seniors that only ends when four people meet.

*The Lost Recipe* is one mystery told in four voices. Each senior plays a different witness to the same event in 1975 and reads that character's own three-chapter story on their phone. No witness knows the whole truth. The four meet at a partner café, tap their Story cards on the checkpoint device, and answer three questions that none of them could answer alone. The ending opens a final chapter in the real world: a community hour that uses the skill the circle shares.

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
2. **Read.** Three chapters as one of four characters (the apprentice, the neighbour, the delivery boy, the regular customer). Each chapter has a choice to make, ends with one thing the character remembers, and asks one question about the senior's own life.
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
| `public/app.js`, `public/style.css` | The senior's app |
| `public/device.html`, `public/dashboard.html` | Device page and partner dashboard |
| `docs/WORKFLOW.md` | Flowcharts for the pitch |

## What is real and what is demo-only

- **Real:** accounts with sign-in, card linking, four-character story, matching by shared skill, arrival tracking, the three-question unlock, feedback, points history, vouchers, circle chat, event replies and confirmation, profile editing, two languages, three text sizes.
- **Demo-only:** chapters can be read back to back, sample seniors can fill a circle, and the café, NGO partners and rewards are fictional. There is one story so far.
- **Not built:** unlocking when one member does not show up, and SMS verification of phone numbers.
