# Volunteer recordings for dialects

Phones can read Mandarin, Cantonese, Malay, Tamil, Hindi and English aloud by themselves. Hokkien and Teochew have no text-to-speech voices, so their audio comes from recordings made by volunteers (for example grandchildren, or a community centre's dialect group).

## File names

One file per comic panel:

```
public/audio/<voice>/<role>-<chapter>-<panel>.mp3
```

- `<voice>`: `hokkien` or `teochew` (any voice id in `VOICES` in `public/app.js` works)
- `<role>`: `prince`, `muthu`, `dara` or `seng`
- `<chapter>`: 1 to 3, `<panel>`: 1 to 4

Example: `public/audio/hokkien/muthu-1-4.mp3` is the Navigator's chapter 1, panel 4.

That makes 48 files for the full story in one dialect. Read the caption, then the speech bubble if there is one, from the Chinese text in `stories.js`.

The screens after each comic page can be recorded too: `<role>-<chapter>-choice`, `<role>-<chapter>-reply1` and `reply2`, `<role>-<chapter>-note`, `reflect-<chapter>`, and `sample` (played when someone picks the voice).

After adding recordings, run `npm run audio -- --index` so the app knows they exist.

The folders `en`, `zh`, `yue`, `ms`, `ta` and `hi` are made by `npm run audio` with Azure voices (see the main README). A human recording dropped into one of those folders with the same name also works: after `--index` it is marked "recorded", and the script never replaces it unless you run it with `--force`.

## What happens without a file

If a panel has no recording yet, the app plays Mandarin instead and tells the listener once.
