// Makes natural-sounding narration for the comic, once, as MP3 files. It uses Microsoft's neural
// voices through the free read-aloud service built into the Edge browser (via the msedge-tts
// package), so no account or key is needed. The app plays these files instead of the phone's
// robotic voice (see public/app.js, speak()).
//
//   npm run audio                  make every missing or changed clip, in every language
//   npm run audio -- --only=ta,hi  only some voices
//   npm run audio -- --dry-run     count clips and characters, make nothing
//   npm run audio -- --index       only rebuild public/audio/manifest.json (after adding volunteer recordings)
//   npm run audio -- --force       remake clips even if they are up to date (never needed for recordings)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { STORY, REFLECTIONS } = require('../stories');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'audio');
const MANIFEST = path.join(OUT, 'manifest.json');

// One narrator (captions) and one male voice (the Prince, Muthu and Ah Seng speak their own lines;
// Dara speaks in the narrator's voice). Local accents where Microsoft has them.
const VOICES = {
  en: { text: 'en', narrator: 'en-SG-LunaNeural', male: 'en-SG-WayneNeural' },
  zh: { text: 'zh', narrator: 'zh-CN-XiaoxiaoNeural', male: 'zh-CN-YunxiNeural' },
  yue: { text: 'zh', narrator: 'zh-HK-HiuMaanNeural', male: 'zh-HK-WanLungNeural' },
  ms: { text: 'ms', narrator: 'ms-MY-YasminNeural', male: 'ms-MY-OsmanNeural' },
  ta: { text: 'ta', narrator: 'ta-SG-VenbaNeural', male: 'ta-SG-AnbuNeural' },
  hi: { text: 'hi', narrator: 'hi-IN-SwaraNeural', male: 'hi-IN-MadhurNeural' },
};
const FEMALE_ROLES = ['dara'];
const RATE = '-8%';        // a little slower than normal, for older listeners
const WORKERS = 3;       // clips made at the same time

const args = process.argv.slice(2);
const flag = (n) => args.includes('--' + n);
const only = (args.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const limit = Number((args.find((a) => a.startsWith('--limit=')) || '').slice(8)) || Infinity;

// ---------- what to say: the same words the app shows (keep in step with public/app.js) ----------
const TX = (o, lang) => (o == null ? '' : typeof o === 'string' ? o : o[lang] ?? o.en);

// Each clip is a list of [speaker, text] parts; speaker is 'narrator' or 'male'.
function clipsFor(lang) {
  const clips = {};
  const voiceOf = (roleIndex) => (FEMALE_ROLES.includes(STORY.roles[roleIndex].id) ? 'narrator' : 'male');
  STORY.roles.forEach((ro) => {
    ro.chapters.forEach((ch, c) => {
      const base = `${ro.id}-${c + 1}`;
      ch.panels.forEach((p, i) => {
        const parts = [['narrator', TX(p.cap, lang)]];
        if (p.say) parts.push([voiceOf(p.say[0]), TX(p.say[1], lang)]);
        clips[`${base}-${i + 1}`] = parts;
      });
      clips[`${base}-choice`] = [['narrator', [TX(ch.choice.q, lang), ...ch.choice.options.map((o, k) => `${'AB'[k]}. ${TX(o.label, lang)}`)].join(' ')]];
      ch.choice.options.forEach((o, k) => { clips[`${base}-reply${k + 1}`] = [['narrator', `${TX(o.label, lang)}. ${TX(o.reply, lang)}`]]; });
      clips[`${base}-note`] = [['narrator', [TX(ch.note, lang), c === 2 ? TX(STORY.cliffhanger, lang) : ''].join(' ').trim()]];
    });
  });
  REFLECTIONS.forEach((r, c) => { clips[`reflect-${c + 1}`] = [['narrator', [TX(r.q, lang), ...r.chips.map((x) => TX(x, lang))].join('. ')]]; });
  clips.sample = [['narrator', `${TX(STORY.title, lang)}. ${TX(STORY.tagline, lang)}.`]];
  return clips;
}

const xml = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const hash = (v, parts) => crypto.createHash('sha1').update(JSON.stringify([v.narrator, v.male, RATE, parts])).digest('hex').slice(0, 12);

// ---------- speech ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lib;
async function say(voice, text) {
  lib ||= require('msedge-tts');
  for (let attempt = 1; ; attempt++) {
    const tts = new lib.MsEdgeTTS();
    try {
      await tts.setMetadata(voice, lib.OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      const { audioStream } = tts.toStream(xml(text), { rate: RATE });
      const chunks = [];
      // If the connection drops, the stream can go quiet without ending; a timer stops that from
      // hanging (and from Node exiting silently with nothing left to wait for).
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('timed out')), 45000);
        const finish = (fn) => (v) => { clearTimeout(timer); fn(v); };
        audioStream.on('data', (d) => chunks.push(d));
        audioStream.on('end', finish(resolve));
        audioStream.on('error', finish(reject));
        audioStream.on('close', finish(() => reject(new Error('connection closed early'))));
      });
      const mp3 = Buffer.concat(chunks);
      if (mp3.length < 2000) throw new Error(`almost no audio came back (${mp3.length} bytes)`);
      return mp3;
    } catch (e) {
      if (attempt >= 5) throw new Error(`${voice}: ${e.message || e}`);
      await sleep(1500 * attempt);
    } finally {
      tts.close();
    }
  }
}

// ---------- manifest: every clip on disk, for every voice folder (generated or recorded) ----------
function readManifest() { try { return JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); } catch { return {}; } }
function writeManifest(known) {
  const out = {};
  for (const dir of fs.existsSync(OUT) ? fs.readdirSync(OUT, { withFileTypes: true }) : []) {
    if (!dir.isDirectory()) continue;
    const files = fs.readdirSync(path.join(OUT, dir.name)).filter((f) => f.endsWith('.mp3')).sort();
    if (!files.length) continue;
    out[dir.name] = {};
    for (const f of files) { const id = f.slice(0, -4); out[dir.name][id] = known[dir.name]?.[id] || 'recorded'; }
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(out, null, 1) + '\n');
  return out;
}
const summary = (m) => Object.entries(m).map(([k, v]) => `${k} ${Object.keys(v).length}`).join(', ') || 'empty';

(async function main() {
  const manifest = readManifest();
  if (flag('index')) { console.log('Manifest:', summary(writeManifest(manifest))); return; }

  const ids = only.length ? only : Object.keys(VOICES);
  const unknown = ids.filter((id) => !VOICES[id]);
  if (unknown.length) throw new Error(`No voice set for: ${unknown.join(', ')}. Choose from ${Object.keys(VOICES).join(', ')}.`);

  const jobs = [];
  for (const id of ids) {
    const v = VOICES[id];
    for (const [clip, parts] of Object.entries(clipsFor(v.text))) {
      const h = hash(v, parts), file = path.join(OUT, id, clip + '.mp3');
      // Human recordings ("recorded" in the manifest) are never replaced unless --force.
      const fresh = fs.existsSync(file) && [h, 'recorded'].includes(manifest[id]?.[clip]);
      if (flag('force') || !fresh) jobs.push({ id, clip, parts, h, file, v });
    }
  }
  jobs.splice(limit);
  const chars = jobs.reduce((n, j) => n + j.parts.reduce((m, [, s]) => m + s.length, 0), 0);
  console.log(`${jobs.length} clips to make, about ${chars.toLocaleString()} characters.`);
  if (flag('dry-run') || !jobs.length) return;

  let done = 0, failed = 0, next = 0;
  async function worker() {
    while (next < jobs.length) {
      const j = jobs[next++];
      try {
        const audio = [];
        for (const [who, text] of j.parts) audio.push(await say(j.v[who], text));
        fs.mkdirSync(path.dirname(j.file), { recursive: true });
        fs.writeFileSync(j.file, Buffer.concat(audio));
        (manifest[j.id] ||= {})[j.clip] = j.h;
        done++;
        if (done % 20 === 0) { writeManifest(manifest); console.log(`  ${done}/${jobs.length} made`); }
      } catch (e) {
        failed++;
        console.log(`  failed ${j.id}/${j.clip}: ${e.message}`);
      }
    }
  }
  const keepAlive = setInterval(() => {}, 1000); // never let Node exit while clips are still being made
  await Promise.all(Array.from({ length: WORKERS }, worker));
  clearInterval(keepAlive);
  console.log(`Made ${done}, failed ${failed}. Manifest: ${summary(writeManifest(manifest))}`);
  if (failed) { console.log('Run it again to retry the failed clips.'); process.exitCode = 1; }
})().catch((e) => { console.error('\n' + e.message); process.exit(1); });
