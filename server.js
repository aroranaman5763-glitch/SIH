const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { SKILLS, INTERESTS, REWARDS, CAFE, POINTS, STORIES, storyForSkills } = require('./stories');

const PORT = process.env.PORT || 3000;
const DEVICE_TOKEN = process.env.DEVICE_TOKEN || 'demo-device-token';
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data', 'db.json');

// ---------- tiny JSON-file store ----------
const fresh = () => ({ users: {}, circles: {}, visits: [], devices: {}, pendingLink: null });
let db = fresh();
try { db = { ...fresh(), ...JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) }; } catch { /* first run */ }
function save() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db));
}
const newId = () => crypto.randomBytes(4).toString('hex');
const normCard = (c) => String(c || '').trim().toUpperCase();

// ---------- users and matching ----------
function joinCircle(user) {
  // Match on story (which comes from the shared skill), then prefer the same language.
  const open = Object.values(db.circles)
    .filter((c) => c.storyId === user.storyId && c.memberIds.length < 4)
    .sort((a, b) => sameLang(b, user) - sameLang(a, user) || a.createdAt - b.createdAt);
  let c = open[0];
  if (!c) {
    const n = Object.keys(db.circles).length;
    c = { id: newId(), name: 'Circle ' + String.fromCharCode(65 + (n % 26)), storyId: user.storyId,
      memberIds: [], present: [], status: 'open', event: { status: 'locked' }, feedback: {}, createdAt: Date.now() };
    db.circles[c.id] = c;
  }
  user.pieceIndex = c.memberIds.length;
  user.circleId = c.id;
  c.memberIds.push(user.id);
}
const sameLang = (c, u) => c.memberIds.filter((id) => db.users[id].lang === u.lang).length;

function createUser({ name, lang, skills, interests, bot = false, day = 0 }) {
  const u = { id: newId(), name: String(name || 'Friend').slice(0, 24), lang: lang === 'zh' ? 'zh' : 'en',
    skills: (skills || []).slice(0, 6), interests: (interests || []).slice(0, 6), bot, day, points: 0,
    slot: null, cardId: 'SIM-' + newId().toUpperCase(), createdAt: Date.now() };
  u.storyId = storyForSkills(u.skills);
  db.users[u.id] = u;
  joinCircle(u);
  return u;
}

function userState(u) {
  const c = db.circles[u.circleId];
  const story = STORIES[u.storyId];
  const full = c.memberIds.length === 4;
  const solved = c.status === 'solved';
  let phase = 'play';
  if (u.day >= 3) phase = !full ? 'waiting' : !solved ? 'meet' : c.event.status === 'confirmed' ? 'done' : 'solved';
  return {
    user: u,
    phase,
    story: {
      id: story.id, icon: story.icon, title: story.title, piece: story.piece, episodes: story.episodes,
      cliffhanger: story.cliffhanger, clue: story.clues[u.pieceIndex],
      // The ending stays secret until the circle solves it together.
      ...(solved ? { endingTitle: story.endingTitle, ending: story.ending, clues: story.clues, event: story.event } : {}),
    },
    circle: {
      id: c.id, name: c.name, full, status: c.status, eventStatus: c.event.status,
      members: c.memberIds.map((id) => {
        const m = db.users[id];
        return { id, name: m.name, skills: m.skills, present: c.present.includes(id), you: id === u.id };
      }),
    },
    linking: !!(db.pendingLink && db.pendingLink.userId === u.id && Date.now() < db.pendingLink.until),
  };
}

// ---------- checkpoint device state machine ----------
// The server decides what the device shows, so the ESP32 only sends taps and
// button presses and draws whatever comes back.
function dev(id) {
  return (db.devices[id] ||= { mode: 'idle', circleId: null, userId: null, flash: null });
}
function flash(d, title, text, ms = 5000) {
  d.flash = { title, text, until: Date.now() + ms };
}
function renderDevice(d) {
  const c = db.circles[d.circleId];
  const story = c && STORIES[c.storyId];
  const names = (ids) => ids.map((id) => db.users[id].name);
  let out;
  if (d.flash && Date.now() < d.flash.until) {
    out = { title: d.flash.title, lines: [d.flash.text] };
  } else if (d.mode === 'gathering' && c) {
    const waiting = c.memberIds.filter((id) => !c.present.includes(id));
    out = { title: `${c.present.length} of 4 have arrived`,
      lines: ['Here: ' + names(c.present).join(', '), 'Waiting for: ' + names(waiting).join(', ')] };
  } else if (d.mode === 'riddle' && c) {
    out = { title: 'All four are here!', lines: ['Share your clues, then answer together:', story.riddle.q.en],
      buttons: story.riddle.options };
  } else if (d.mode === 'ending' && c) {
    out = { title: story.endingTitle.en, lines: [story.ending.en, 'Tap your card to tell us how today was.'] };
  } else if (d.mode === 'feedback' && db.users[d.userId]) {
    out = { title: `How was today, ${db.users[d.userId].name}?`, lines: ['Press one button.'],
      buttons: { red: 'Not good', yellow: 'Okay', green: 'Good' } };
  } else {
    out = { title: 'Story Hunt', lines: ['Tap your card to join your story.'] };
  }
  out.mode = d.mode;
  out.buttons ||= null;
  out.speak = [out.title, ...out.lines, ...(out.buttons ? Object.entries(out.buttons).map(([k, v]) => `${k} for ${v}`) : [])].join('. ');
  return out;
}

function handleTap(checkpointId, cardId) {
  const d = dev(checkpointId);
  let u = Object.values(db.users).find((x) => x.cardId === cardId);
  if (!u) {
    const p = db.pendingLink;
    if (p && Date.now() < p.until && db.users[p.userId]) {
      u = db.users[p.userId];
      u.cardId = cardId;
      db.pendingLink = null;
      flash(d, 'Card linked', `Hello, ${u.name}! This card is now yours.`);
    } else {
      flash(d, 'Card not recognised', 'Open the app, go to Me, and press Link my card.');
    }
    return d;
  }
  const c = db.circles[u.circleId];
  if (c.memberIds.length < 4) {
    flash(d, `Welcome, ${u.name}`, 'Your circle is still forming. The app will tell you when it is ready.');
  } else if (c.status === 'solved') {
    d.mode = 'feedback'; d.circleId = c.id; d.userId = u.id; d.flash = null;
  } else {
    if (!c.present.includes(u.id)) {
      c.present.push(u.id);
      db.visits.push({ userId: u.id, circleId: c.id, checkpointId, at: Date.now() });
    }
    d.circleId = c.id;
    d.mode = c.present.length === 4 ? 'riddle' : 'gathering';
    flash(d, `Welcome, ${u.name}`, `${c.present.length} of 4 have arrived.`, 2500);
  }
  return d;
}

function handleButton(checkpointId, button) {
  const d = dev(checkpointId);
  const c = db.circles[d.circleId];
  if (d.mode === 'riddle' && c) {
    if (button === STORIES[c.storyId].riddle.answer) {
      c.status = 'solved'; c.solvedAt = Date.now(); c.event.status = 'open';
      c.memberIds.forEach((id) => { db.users[id].points += POINTS.story; });
      d.mode = 'ending'; d.flash = null;
    } else {
      flash(d, 'Not quite', 'Share your clues again and try once more.', 4000);
    }
  } else if (d.mode === 'feedback' && c && db.users[d.userId]) {
    c.feedback[d.userId] = { red: 'bad', yellow: 'okay', green: 'good' }[button] || 'okay';
    flash(d, `Thank you, ${db.users[d.userId].name}`, `You earned ${POINTS.story} points. Your final chapter is waiting in the app.`);
    d.mode = Object.keys(c.feedback).length >= 4 ? 'idle' : 'ending';
    d.userId = null;
  }
  return d;
}

// ---------- HTTP ----------
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const wrap = (fn) => (req, res) => {
  try { const out = fn(req, res); save(); if (out !== undefined) res.json(out); }
  catch (e) { res.status(e.status || 500).json({ error: e.message }); }
};
const fail = (status, msg) => Object.assign(new Error(msg), { status });
const getUser = (req) => db.users[req.params.id] || (() => { throw fail(404, 'User not found'); })();
const checkDevice = (req) => {
  if ((req.body.deviceToken || req.get('x-device-token')) !== DEVICE_TOKEN) throw fail(401, 'Bad device token');
};

app.get('/api/meta', (req, res) => res.json({ skills: SKILLS, interests: INTERESTS, rewards: REWARDS, cafe: CAFE, points: POINTS }));

app.post('/api/users', wrap((req) => {
  if (!String(req.body.name || '').trim()) throw fail(400, 'Name is required');
  return userState(createUser(req.body));
}));
app.get('/api/users/:id/state', wrap((req) => userState(getUser(req))));
app.post('/api/users/:id/complete-day', wrap((req) => {
  const u = getUser(req);
  u.day = Math.max(u.day, Math.min(3, Number(req.body.day) || 0));
  return userState(u);
}));
app.post('/api/users/:id/slot', wrap((req) => { const u = getUser(req); u.slot = req.body.slot; return userState(u); }));
app.post('/api/users/:id/lang', wrap((req) => { const u = getUser(req); u.lang = req.body.lang === 'zh' ? 'zh' : 'en'; return userState(u); }));
app.post('/api/users/:id/link-card', wrap((req) => {
  const u = getUser(req);
  db.pendingLink = { userId: u.id, until: Date.now() + 60000 };
  return userState(u);
}));
app.post('/api/users/:id/redeem', wrap((req) => {
  const u = getUser(req);
  const r = REWARDS.find((x) => x.id === req.body.rewardId);
  if (!r) throw fail(404, 'Reward not found');
  if (u.points < r.cost) throw fail(400, 'Not enough points');
  u.points -= r.cost;
  (u.redeemed ||= []).push({ id: r.id, at: Date.now() });
  return userState(u);
}));

// Device API: used by the real ESP32 and by the browser simulator alike.
app.post('/api/device/tap', wrap((req) => {
  checkDevice(req);
  return renderDevice(handleTap(req.body.checkpointId || CAFE.id, normCard(req.body.cardId)));
}));
app.post('/api/device/button', wrap((req) => {
  checkDevice(req);
  return renderDevice(handleButton(req.body.checkpointId || CAFE.id, String(req.body.button)));
}));
app.get('/api/device/state', wrap((req) => renderDevice(dev(req.query.checkpointId || CAFE.id))));
app.post('/api/device/reset', wrap((req) => { db.devices[req.body.checkpointId || CAFE.id] = undefined; return { ok: true }; }));

// NGO confirms the community event (the story's final chapter).
app.post('/api/circles/:id/confirm-event', wrap((req) => {
  const c = db.circles[req.params.id];
  if (!c) throw fail(404, 'Circle not found');
  if (c.event.status !== 'open') throw fail(400, 'Event is not open yet');
  c.event = { status: 'confirmed', at: Date.now() };
  c.memberIds.forEach((id) => { db.users[id].points += POINTS.event; });
  return { ok: true };
}));

app.get('/api/dashboard', wrap(() => {
  const label = (id) => SKILLS.find((s) => s.id === id)?.en || id;
  const circles = Object.values(db.circles).map((c) => {
    const members = c.memberIds.map((id) => db.users[id]);
    const shared = SKILLS.map((s) => s.id).filter((s) => members.every((m) => m.skills.includes(s)));
    const langs = [...new Set(members.map((m) => (m.lang === 'zh' ? 'Chinese' : 'English')))];
    const story = STORIES[c.storyId];
    return {
      id: c.id, name: c.name, story: story.title.en, status: c.status, eventStatus: c.event.status,
      eventTitle: story.event.title.en, eventPartner: story.event.partner.en, feedback: c.feedback,
      reason: `Story skill: ${label(story.skill)}` + (shared.length ? ` · all share ${shared.map(label).join(', ')}` : '') + ` · ${langs.join(' + ')}`,
      members: members.map((m) => ({ id: m.id, name: m.name, lang: m.lang, skills: m.skills.map(label), day: m.day,
        points: m.points, cardId: m.cardId, bot: m.bot, present: c.present.includes(m.id) })),
    };
  });
  const fb = { good: 0, okay: 0, bad: 0 };
  circles.forEach((c) => Object.values(c.feedback).forEach((v) => { fb[v]++; }));
  const users = Object.values(db.users);
  return {
    circles, feedback: fb,
    cafe: { name: CAFE.name.en, visits: db.visits.length,
      recent: db.visits.slice(-8).reverse().map((v) => ({ name: db.users[v.userId]?.name, at: v.at })) },
    totals: { seniors: users.filter((u) => !u.bot).length, circles: circles.length,
      solved: circles.filter((c) => c.status === 'solved').length,
      events: circles.filter((c) => c.eventStatus === 'confirmed').length,
      points: users.reduce((a, u) => a + u.points, 0) },
  };
}));

// Demo helpers (remove for a real pilot).
const BOTS = [['Mdm Lim', 'zh'], ['Mr Tan', 'zh'], ['Mrs Devi', 'en'], ['Mr Rahman', 'en'], ['Mdm Wong', 'zh'], ['Mr Singh', 'en']];
app.post('/api/demo/fill', wrap((req) => {
  const c = db.circles[req.body.circleId];
  if (!c) throw fail(404, 'Circle not found');
  const skill = STORIES[c.storyId].skill;
  let i = Object.keys(db.users).length;
  while (c.memberIds.length < 4) {
    const [name, lang] = BOTS[i++ % BOTS.length];
    createUser({ name, lang, skills: [skill], interests: ['kopi'], bot: true, day: 3 });
  }
  return { ok: true };
}));
app.post('/api/demo/reset', wrap(() => { db = fresh(); return { ok: true }; }));

if (require.main === module) {
  app.listen(PORT, () => console.log(`Story Hunt running on http://localhost:${PORT}`));
}
module.exports = app;
