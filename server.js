const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { SKILLS, INTERESTS, REWARDS, CAFE, EVENTS, EVENT_DETAIL, POINTS, REFLECTIONS, STORY } = require('./stories');

const PORT = process.env.PORT || 3000;
const DEVICE_TOKEN = process.env.DEVICE_TOKEN || 'demo-device-token';
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data', 'db.json');
const COLOURS = ['#b5411c', '#7a4fa3', '#2f6b4f', '#2c5d8a', '#a0522d', '#8a5a00'];

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
const normPhone = (p) => String(p || '').replace(/\D/g, '');
const hashPin = (pin, salt) => crypto.createHash('sha256').update(salt + ':' + pin).digest('hex');
const fail = (status, msg) => Object.assign(new Error(msg), { status });
const skillName = (id) => SKILLS.find((s) => s.id === id)?.en || id;

// ---------- users and matching ----------
function award(u, pts, label) {
  u.points += pts;
  u.ledger.push({ pts, label, at: Date.now() });
}

function joinCircle(u) {
  // A circle is built around one shared skill; prefer members who read in the same language.
  const sameLang = (c) => c.memberIds.filter((id) => db.users[id].lang === u.lang).length;
  const open = Object.values(db.circles)
    .filter((c) => c.memberIds.length < 4 && u.skills.includes(c.skill))
    .sort((a, b) => sameLang(b) - sameLang(a) || a.createdAt - b.createdAt);
  let c = open[0];
  if (!c) {
    const n = Object.keys(db.circles).length;
    c = { id: newId(), name: 'Circle ' + String.fromCharCode(65 + (n % 26)), skill: u.skills[0] || 'cooking',
      memberIds: [], present: [], status: 'open', qIndex: 0, wrong: 0, event: { status: 'locked' },
      feedback: {}, messages: [], createdAt: Date.now() };
    db.circles[c.id] = c;
  }
  u.roleIndex = c.memberIds.length; // each member plays a different witness
  u.circleId = c.id;
  c.memberIds.push(u.id);
}

function createUser({ name, phone, pin, lang, skills, interests, bot = false }) {
  const salt = newId();
  const u = {
    id: newId(), name: String(name || 'Friend').trim().slice(0, 24), phone: normPhone(phone), salt, pin: hashPin(String(pin || ''), salt),
    lang: lang === 'zh' ? 'zh' : 'en', textSize: 'm', skills: (skills || []).filter((s) => SKILLS.some((x) => x.id === s)).slice(0, 6),
    interests: (interests || []).slice(0, 6), bot, chapter: 0, choices: {}, reflections: {}, points: 0, ledger: [], vouchers: [],
    slot: null, rsvp: false, cardId: null, createdAt: Date.now(),
  };
  if (!u.skills.length) u.skills = ['cooking'];
  u.color = COLOURS[Object.keys(db.users).length % COLOURS.length];
  db.users[u.id] = u;
  joinCircle(u);
  return u;
}

function publicUser(u) {
  const { pin, salt, ...rest } = u;
  return { ...rest, cardLinked: !!u.cardId, cardTail: u.cardId ? u.cardId.slice(-4) : null };
}

function userState(u) {
  const c = db.circles[u.circleId];
  const full = c.memberIds.length === 4;
  const solved = c.status === 'solved';
  const allHere = full && c.present.length === 4;
  let phase = 'read';
  if (u.chapter >= 3) phase = !full ? 'waiting' : !solved ? 'meet' : c.event.status === 'confirmed' ? 'complete' : 'giveback';
  const youHere = c.present.includes(u.id);
  const q = STORY.questions[c.qIndex];
  return {
    user: publicUser(u),
    phase,
    linking: !!(db.pendingLink && db.pendingLink.userId === u.id && Date.now() < db.pendingLink.until),
    circle: {
      id: c.id, name: c.name, skill: c.skill, full, count: c.memberIds.length, status: c.status, arrived: c.present.length,
      // The live question only reaches the phone once all four are at the table.
      question: allHere && !solved && q ? { index: c.qIndex, total: STORY.questions.length, q: q.q, options: q.options, hint: c.wrong ? q.hint : null } : null,
      solvedCount: solved ? STORY.questions.length : c.qIndex,
      ending: solved ? { title: STORY.endingTitle, text: STORY.ending, finalChapter: STORY.finalChapter,
        answers: STORY.questions.map((x) => ({ q: x.q, a: x.options[x.answer], explain: x.explain })) } : null,
      event: { status: c.event.status, ...(EVENTS[c.skill] || EVENTS.cooking), detail: EVENT_DETAIL },
      messages: solved ? c.messages.slice(-40) : [],
      members: c.memberIds.map((id) => {
        const m = db.users[id];
        // A circle-mate's real name stays hidden until they have arrived at the café.
        const revealed = id === u.id || solved || (youHere && c.present.includes(id));
        return { id, you: id === u.id, roleIndex: m.roleIndex, color: m.color, present: c.present.includes(id), slot: m.slot,
          ready: m.chapter >= 3, rsvp: m.rsvp, name: revealed ? m.name : null,
          reflections: revealed ? m.reflections : null, skills: revealed ? m.skills : null };
      }),
    },
  };
}

// ---------- checkpoint device state machine ----------
// The server decides what the device shows, so the ESP32 only sends taps and
// button presses and draws whatever comes back.
const dev = (id) => (db.devices[id] ||= { mode: 'idle', circleId: null, userId: null, flash: null });
function flash(d, title, text, ms = 5000) { d.flash = { title, text, until: Date.now() + ms }; }

function renderDevice(d) {
  const c = db.circles[d.circleId];
  const names = (ids) => ids.map((id) => db.users[id].name).join(', ');
  let out;
  if (d.flash && Date.now() < d.flash.until) {
    out = { title: d.flash.title, lines: [d.flash.text] };
  } else if (d.mode === 'gathering' && c) {
    const waiting = c.memberIds.filter((id) => !c.present.includes(id));
    out = { title: `${c.present.length} of 4 have arrived`, lines: ['Here: ' + names(c.present), 'Still to come: ' + names(waiting)] };
  } else if (d.mode === 'question' && c && STORY.questions[c.qIndex]) {
    const q = STORY.questions[c.qIndex];
    out = { title: `Question ${c.qIndex + 1} of ${STORY.questions.length}`, lines: [q.q.en, 'Share what you each remember, then answer together.'],
      buttons: { red: q.options.red.en, yellow: q.options.yellow.en, green: q.options.green.en } };
  } else if (d.mode === 'ending' && c) {
    out = { title: STORY.endingTitle.en, lines: [STORY.ending.en, 'Tap your card to tell us how today was.'] };
  } else if (d.mode === 'feedback' && db.users[d.userId]) {
    out = { title: `How was today, ${db.users[d.userId].name}?`, lines: ['Press one button. Only you will see this.'],
      buttons: { red: 'Not good', yellow: 'Okay', green: 'Good' } };
  } else {
    out = { title: 'Story Hunt', lines: ['Tap your card to join your circle.'] };
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
      flash(d, 'New card', 'Open the app, go to Profile, and press Link my card. Then tap again.');
    }
    return d;
  }
  const c = db.circles[u.circleId];
  if (c.memberIds.length < 4) {
    flash(d, `Welcome, ${u.name}`, 'Your circle is still forming. The app will tell you when it is ready.');
  } else if (c.status === 'solved') {
    if (c.feedback[u.id]) flash(d, `Welcome back, ${u.name}`, 'Your next step is waiting in the app.');
    else { d.mode = 'feedback'; d.circleId = c.id; d.userId = u.id; d.flash = null; }
  } else {
    if (!c.present.includes(u.id)) {
      c.present.push(u.id);
      db.visits.push({ userId: u.id, circleId: c.id, checkpointId, at: Date.now() });
    }
    d.circleId = c.id;
    d.mode = c.present.length === 4 ? 'question' : 'gathering';
    flash(d, `Welcome, ${u.name}`, `${c.present.length} of 4 have arrived.`, 2500);
  }
  return d;
}

function handleButton(checkpointId, button) {
  const d = dev(checkpointId);
  const c = db.circles[d.circleId];
  if (d.mode === 'question' && c) {
    const q = STORY.questions[c.qIndex];
    if (button === q.answer) {
      c.qIndex++; c.wrong = 0;
      if (c.qIndex >= STORY.questions.length) {
        c.status = 'solved'; c.solvedAt = Date.now(); c.event.status = 'open';
        c.memberIds.forEach((id) => award(db.users[id], POINTS.story, 'Solved The Lost Recipe with your circle'));
        d.mode = 'ending'; d.flash = null;
        flash(d, 'Correct!', q.explain.en, 3500);
      } else {
        flash(d, 'Correct!', q.explain.en, 3500);
      }
    } else {
      c.wrong++;
      flash(d, 'Not quite', q.hint.en, 4500);
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
const getUser = (req) => db.users[req.params.id] || (() => { throw fail(404, 'Account not found'); })();
const checkDevice = (req) => {
  if ((req.body.deviceToken || req.get('x-device-token')) !== DEVICE_TOKEN) throw fail(401, 'Bad device token');
};

// Static content for the app. Question answers are stripped out.
app.get('/api/meta', (req, res) => res.json({
  skills: SKILLS, interests: INTERESTS, rewards: REWARDS, cafe: CAFE, points: POINTS, reflections: REFLECTIONS,
  story: { ...STORY, questions: undefined, ending: undefined, endingTitle: undefined },
}));

app.post('/api/users', wrap((req) => {
  const b = req.body, phone = normPhone(b.phone);
  if (!String(b.name || '').trim()) throw fail(400, 'Please enter your name');
  if (phone.length < 8) throw fail(400, 'Please enter a phone number with at least 8 digits');
  if (!/^\d{4}$/.test(String(b.pin || ''))) throw fail(400, 'Please choose a 4-digit PIN');
  if (Object.values(db.users).some((u) => u.phone === phone)) throw fail(409, 'This phone number already has an account. Please sign in.');
  return userState(createUser(b));
}));
app.post('/api/login', wrap((req) => {
  const u = Object.values(db.users).find((x) => x.phone && x.phone === normPhone(req.body.phone));
  if (!u || u.pin !== hashPin(String(req.body.pin || ''), u.salt)) throw fail(401, 'Phone number or PIN is not right');
  return userState(u);
}));
app.get('/api/users/:id/state', wrap((req) => userState(getUser(req))));

app.post('/api/users/:id/profile', wrap((req) => {
  const u = getUser(req), b = req.body;
  if (b.name !== undefined && String(b.name).trim()) u.name = String(b.name).trim().slice(0, 24);
  if (b.lang) u.lang = b.lang === 'zh' ? 'zh' : 'en';
  if (['s', 'm', 'l'].includes(b.textSize)) u.textSize = b.textSize;
  if (Array.isArray(b.skills) && b.skills.length) u.skills = b.skills.filter((s) => SKILLS.some((x) => x.id === s));
  if (Array.isArray(b.interests)) u.interests = b.interests.filter((s) => INTERESTS.some((x) => x.id === s));
  return userState(u);
}));

app.post('/api/users/:id/chapter', wrap((req) => {
  const u = getUser(req), ch = Number(req.body.chapter);
  if (!(ch >= 0 && ch < 3)) throw fail(400, 'Unknown chapter');
  if (req.body.choice !== undefined) u.choices[ch] = Number(req.body.choice);
  if (req.body.reflection) u.reflections[ch] = String(req.body.reflection).trim().slice(0, 80);
  u.chapter = Math.max(u.chapter, ch + 1);
  return userState(u);
}));
app.post('/api/users/:id/slot', wrap((req) => {
  const u = getUser(req);
  if (!CAFE.slots.includes(req.body.slot)) throw fail(400, 'Unknown time');
  u.slot = req.body.slot;
  return userState(u);
}));
app.post('/api/users/:id/link-card', wrap((req) => {
  const u = getUser(req);
  db.pendingLink = { userId: u.id, until: Date.now() + 60000 };
  return userState(u);
}));
app.post('/api/users/:id/cancel-link', wrap((req) => {
  const u = getUser(req);
  if (db.pendingLink?.userId === u.id) db.pendingLink = null;
  return userState(u);
}));
app.post('/api/users/:id/unlink-card', wrap((req) => { const u = getUser(req); u.cardId = null; return userState(u); }));
app.post('/api/users/:id/rsvp', wrap((req) => {
  const u = getUser(req);
  if (db.circles[u.circleId].event.status === 'locked') throw fail(400, 'The event is not open yet');
  u.rsvp = !!req.body.going;
  return userState(u);
}));
app.post('/api/users/:id/message', wrap((req) => {
  const u = getUser(req), c = db.circles[u.circleId], text = String(req.body.text || '').trim().slice(0, 200);
  if (c.status !== 'solved') throw fail(400, 'Chat opens after your circle has met');
  if (text) c.messages.push({ id: newId(), userId: u.id, name: u.name, color: u.color, text, at: Date.now() });
  return userState(u);
}));
app.post('/api/users/:id/redeem', wrap((req) => {
  const u = getUser(req);
  const r = REWARDS.find((x) => x.id === req.body.rewardId);
  if (!r) throw fail(404, 'Reward not found');
  if (u.points < r.cost) throw fail(400, 'Not enough points yet');
  award(u, -r.cost, 'Redeemed: ' + r.en);
  u.vouchers.unshift({ id: newId(), rewardId: r.id, code: 'SH-' + crypto.randomBytes(3).toString('hex').toUpperCase(), at: Date.now() });
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
app.post('/api/device/reset', wrap((req) => { delete db.devices[req.body.checkpointId || CAFE.id]; return { ok: true }; }));

// The NGO confirms that the circle came to the community event.
app.post('/api/circles/:id/confirm-event', wrap((req) => {
  const c = db.circles[req.params.id];
  if (!c) throw fail(404, 'Circle not found');
  if (c.event.status !== 'open') throw fail(400, 'Event is not open yet');
  c.event = { status: 'confirmed', at: Date.now() };
  c.memberIds.forEach((id) => award(db.users[id], POINTS.event, 'Community hour: ' + (EVENTS[c.skill] || EVENTS.cooking).title.en));
  return { ok: true };
}));

app.get('/api/dashboard', wrap(() => {
  const circles = Object.values(db.circles).map((c) => {
    const members = c.memberIds.map((id) => db.users[id]);
    const langs = [...new Set(members.map((m) => (m.lang === 'zh' ? 'Chinese' : 'English')))];
    const ev = EVENTS[c.skill] || EVENTS.cooking;
    return {
      id: c.id, name: c.name, skill: skillName(c.skill), status: c.status, qIndex: c.qIndex, questions: STORY.questions.length,
      eventStatus: c.event.status, eventTitle: ev.title.en, eventPartner: ev.partner.en, feedback: c.feedback,
      reason: `All four share ${skillName(c.skill)} · reading in ${langs.join(' + ')}`,
      members: members.map((m) => ({ id: m.id, name: m.name, role: STORY.roles[m.roleIndex].title.en, chapter: m.chapter, slot: m.slot,
        points: m.points, cardId: m.cardId, cardLinked: !!m.cardId, bot: m.bot, present: c.present.includes(m.id), rsvp: m.rsvp,
        teach: m.reflections[2]?.en || m.reflections[2] || null })),
    };
  });
  const fb = { good: 0, okay: 0, bad: 0 };
  circles.forEach((c) => Object.values(c.feedback).forEach((v) => { fb[v]++; }));
  const users = Object.values(db.users);
  return {
    circles, feedback: fb,
    cafe: { name: CAFE.name.en, visits: db.visits.length,
      recent: db.visits.slice(-8).reverse().map((v) => ({ name: db.users[v.userId]?.name, circle: db.circles[v.circleId]?.name, at: v.at })) },
    totals: { seniors: users.filter((u) => !u.bot).length, circles: circles.length,
      solved: circles.filter((c) => c.status === 'solved').length,
      events: circles.filter((c) => c.eventStatus === 'confirmed').length,
      hours: circles.filter((c) => c.eventStatus === 'confirmed').length * 4,
      redeemed: users.reduce((a, u) => a + u.vouchers.length, 0) },
  };
}));

// Demo helpers (remove for a real pilot).
const BOTS = [['Mdm Lim', 'zh'], ['Mr Tan', 'zh'], ['Mrs Devi', 'en'], ['Mr Rahman', 'en'], ['Mdm Wong', 'zh'], ['Mr Singh', 'en']];
app.post('/api/demo/fill', wrap((req) => {
  const c = db.circles[req.body.circleId];
  if (!c) throw fail(404, 'Circle not found');
  let i = Object.keys(db.users).length;
  while (c.memberIds.length < 4) {
    const [name, lang] = BOTS[i % BOTS.length];
    const u = createUser({ name, lang, phone: '', pin: '0000', skills: [c.skill], interests: ['kopi'], bot: true });
    Object.assign(u, { chapter: 3, cardId: 'DEMO-' + newId().toUpperCase(), slot: CAFE.slots[1], rsvp: true,
      reflections: Object.fromEntries(REFLECTIONS.map((r, k) => [k, r.chips[(i + k) % r.chips.length]])) });
    i++;
  }
  return { ok: true };
}));
app.post('/api/demo/reset', wrap(() => { db = fresh(); return { ok: true }; }));

if (require.main === module) {
  app.listen(PORT, () => console.log(`Story Hunt running on http://localhost:${PORT}`));
}
module.exports = app;
