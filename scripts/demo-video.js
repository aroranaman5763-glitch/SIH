// Records a phone-size demo video of Story Hunt with on-screen captions.
//   node scripts/demo-video.js     ->  demo/story-hunt-demo.webm and demo/story-hunt-demo.mp4
// Starts its own server with fresh data, so it never touches data/db.json.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sh-demo-'));
process.env.DB_FILE = path.join(tmp, 'db.json');
const app = require('../server');
const { chromium } = require('playwright');

const OUT_DIR = path.join(__dirname, '..', 'demo');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// A date N days from today, in Singapore time (YYYY-MM-DD).
const dayISO = (n) => new Date(Date.now() + 8 * 3600e3 + n * 864e5).toISOString().slice(0, 10);

// Caption overlay injected into every page: navy panel, teal edge, big text.
function captions() {
  window.__cap = (title, sub = '') => {
    let el = document.getElementById('__cap');
    if (!el) {
      const st = document.createElement('style');
      st.textContent = `#__cap{position:fixed;left:12px;right:12px;top:12px;z-index:99999;background:#12324A;color:#fff;
        border:3px solid #1b1510;border-left:12px solid #1F7A72;box-shadow:4px 4px 0 #1b1510;padding:12px 14px;
        font:700 20px/1.25 "Comic Neue",system-ui,sans-serif;transition:opacity .25s;pointer-events:none}
        #__cap span{display:block;font-weight:400;font-size:15px;line-height:1.35;margin-top:4px;color:#d9ecea}
        #__end{position:fixed;inset:0;z-index:100000;background:#12324A;color:#fff;display:flex;flex-direction:column;
        align-items:center;justify-content:center;text-align:center;padding:24px;font-family:"Comic Neue",system-ui,sans-serif}
        #__end h1{font:400 64px/1 Bangers,system-ui,sans-serif;letter-spacing:.03em;color:#fff;margin:0 0 14px;text-shadow:4px 4px 0 #1F7A72}
        #__end p{font-size:21px;font-weight:700;margin:0 0 28px;color:#d9ecea}
        #__end small{font-size:16px;border-top:3px solid #1F7A72;padding-top:14px;color:#fff}`;
      document.head.appendChild(st);
      el = document.createElement('div'); el.id = '__cap';
      document.body.appendChild(el);
    }
    el.innerHTML = title ? `${title}${sub ? `<span>${sub}</span>` : ''}` : '';
    el.style.opacity = title ? 1 : 0;
  };
  window.__end = () => {
    window.__cap('');
    const el = document.createElement('div'); el.id = '__end';
    el.innerHTML = '<h1>Story Hunt</h1><p>Read a legend. Meet your circle.<br>Join in, and teach together.</p><small>Live: story-hunt-rho.vercel.app</small>';
    document.body.appendChild(el);
  };
}

(async () => {
  const server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  const BASE = `http://localhost:${server.address().port}`;
  const api = async (p, body) => {
    const r = await fetch(BASE + '/api' + p, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deviceToken: 'demo-device-token', checkpointId: 'cafe-1', ...body }) } : undefined);
    const text = await r.text();
    try { return JSON.parse(text); } catch { throw new Error(`${body ? 'POST' : 'GET'} ${p} -> ${r.status}: ${text.slice(0, 120)}`); }
  };

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    recordVideo: { dir: tmp, size: { width: 780, height: 1688 } },
  });
  await context.addInitScript(captions);
  const page = await context.newPage();
  const cap = (t, s) => page.evaluate(([a, b]) => window.__cap(a, b), [t, s || '']);
  const click = (sel) => page.click(sel);
  const smooth = (sel, block = 'start') => page.evaluate(([s, b]) => document.querySelector(s)?.scrollIntoView({ behavior: 'smooth', block: b }), [sel, block]);
  // Scroll so an element sits just below the caption panel.
  const showAt = (sel) => page.evaluate((s) => {
    const el = typeof s === 'string' ? document.querySelector(s) : null;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: 'smooth' });
  }, sel);

  // 1. Cover and languages
  await page.goto(BASE + '/');
  await page.waitForSelector('.masthead');
  await page.evaluate(() => document.fonts.ready);
  await cap('A comic legend for seniors', 'Singapore + India · read it or listen to it');
  await wait(2000);
  await click('[data-a=pickLang][data-v=ta]'); await cap('Five languages', 'English · 中文 · Melayu · தமிழ் · हिन्दी');
  await wait(1200);
  await click('[data-a=pickLang][data-v=hi]'); await wait(800);
  await click('[data-a=pickLang][data-v=en]'); await wait(700);

  // 2. Quick sign-up
  await cap('Sign up in under a minute');
  await click('[data-a=obBegin]');
  await page.type('#name', 'Mei Ling', { delay: 55 }); await click('[data-a=obNext]');
  await page.type('#phone', '91234567', { delay: 20 }); await page.type('#pin', '1234', { delay: 20 }); await click('[data-a=obNext]');
  await cap('Pick the skill you could teach', 'Neighbours who share it become your circle');
  await click('[data-a=obSkill][data-v=cooking]'); await wait(1000); await click('[data-a=obNext]');
  await cap('…and what you enjoy', 'Events are matched to it later');
  await click('[data-a=obInterest][data-v=kopi]'); await wait(400);
  await click('[data-a=obInterest][data-v=walks]'); await wait(800); await click('[data-a=obCreate]');

  // 3. Story card
  await page.waitForSelector('[data-a=link]');
  await cap('Link a Story card', 'Tapping it at the café checks you in');
  await click('[data-a=link]'); await wait(1000);
  await api('/device/tap', { cardId: 'CARD-000A' });
  await page.waitForSelector('[data-a=unlink]', { timeout: 8000 }); await wait(1100);
  await click('[data-a=postNext]');

  // 4. Role card
  await page.waitForSelector('.rolecard');
  await cap('You become one of four witnesses', 'The legend of how Singapura got its name');
  await wait(2400);
  await click('[data-a=postNext]');

  // 5. Comic page with read-aloud
  await page.waitForSelector('.panel[id=pn0]');
  await cap('Read it as a comic', 'Ink panels, captions, speech bubbles');
  await wait(1500);
  await cap('…or listen to it', 'The panel being read lights up and the page follows along');
  for (let i = 0; i < 4; i++) {
    await page.evaluate((n) => { AU.on = true; AU.i = n; paintAudio(); document.getElementById('pn' + n).scrollIntoView({ behavior: 'smooth', block: 'center' }); }, i);
    await wait(1800);
  }
  await page.evaluate(() => { stopAudio(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  await wait(600);

  // 6. Voices and dialects
  await click('.voice-chip');
  await page.waitForSelector('.sheet');
  await cap('Natural voices, even dialects', '华语 · 粵語 · Melayu · தமிழ் · हिन्दी · Hokkien · Teochew');
  await wait(1100);
  await page.evaluate(() => document.querySelector('.sheet').scrollTo({ top: 520, behavior: 'smooth' }));
  await wait(1700);
  await click('.sheet [data-a=closeSheet].btn:not(.sq)');

  // Skip ahead: finish the chapters and fill the circle with three sample neighbours.
  const uid = await page.evaluate(() => S.uid);
  for (const ch of [0, 1, 2]) await api(`/users/${uid}/chapter`, { chapter: ch, choice: 0, reflection: 'A family recipe' });
  const st = await api(`/users/${uid}/state`);
  await api('/demo/fill', { circleId: st.circle.id });
  await page.evaluate(async () => { S.rd = null; setData(await api(`/users/${S.uid}/state`)); S.tab = 'story'; render(); window.scrollTo(0, 0); });

  // 7. Circle and meeting point
  await page.waitForSelector('.place');
  await cap('Matched into a circle of four', 'Each neighbour saw a different part of the story');
  await wait(2100);
  await smooth('.place');
  await cap('Meet at a partner café', 'Map, directions, and what to look for');
  await wait(2700);

  // 8. Café device
  const dash = await api('/dashboard');
  const members = dash.circles[0].members;
  await page.goto(BASE + '/device.html');
  await page.addStyleTag({ content: '.wide>h1,.wide>p{display:none}.wide{padding-top:96px}' });
  await page.uncheck('#voice');
  await cap('At the café, everyone taps in', 'The device counts who has arrived');
  for (const m of members) {
    await page.waitForFunction((v) => [...document.querySelectorAll('#who option')].some((o) => o.value === v), m.cardId);
    await page.selectOption('#who', m.cardId);
    await click('#tap');
    await wait(950);
  }
  await wait(1100);
  await cap('Three questions no one can answer alone', 'They compare memories, then press a button together');
  await wait(2000);
  await click('[data-b=red]');
  await cap('Wrong? A hint says whose memory to ask');
  await wait(2700);
  await cap('Right answers unlock the ending');
  for (const b of ['yellow', 'red', 'green']) { await click(`[data-b=${b}]`); await wait(b === 'green' ? 3200 : 2700); }

  // 9. Ending
  await page.goto(BASE + '/');
  await page.waitForSelector('.letter');
  await cap('Solved together', 'The ending opens a real final chapter: a community hour');
  await smooth('.letter');
  await wait(2700);

  // 10. A community group posts an event
  await page.goto(BASE + '/partners.html');
  await page.waitForSelector('#type option', { state: 'attached' });
  await page.addStyleTag({ content: '.wide{padding-top:110px}' });
  await cap('Community groups post events', 'NGOs, clubs and active ageing centres');
  await page.type('#org', 'Silver Steps Running Club', { delay: 25 });
  await page.selectOption('#type', 'move');
  await page.type('#title', 'Riverside morning walk', { delay: 35 });
  await page.fill('#date', dayISO(3)); await page.fill('#time', '07:30'); await page.fill('#spots', '30');
  await page.evaluate(() => document.getElementById('place').scrollIntoView({ behavior: 'smooth', block: 'center' }));
  await page.type('#place', 'Clarke Quay riverside', { delay: 25 });
  await page.type('#about', 'Easy pace, about 45 minutes.', { delay: 15 });
  await wait(500);
  await click('#f button[type=submit]');
  await page.waitForFunction(() => document.getElementById('list').textContent.includes('Riverside morning walk'));
  await wait(900);

  // 11. It shows up in the app, matched to what Mei Ling enjoys
  await page.goto(BASE + '/');
  await page.waitForSelector('[data-a=tab][data-v=events]');
  await click('[data-a=tab][data-v=events]');
  await cap('It appears in the app straight away', 'Picked for Mei Ling, because she enjoys short walks');
  await wait(1200);
  const walkCard = '.ev.ngo:has-text("Riverside morning walk")';
  await page.locator(walkCard).first().evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: 'smooth' }));
  await wait(1900);
  await cap('One tap to join');
  await page.locator(walkCard).first().locator('[data-a=evJoin]').click();
  await wait(500);
  await showAt('.ev .btn.on');
  await cap('One tap to join', 'Mei Ling is going');
  await wait(2000);

  // 12. Teach a class together with the circle
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await wait(500);
  await click('[data-a=evMode][data-v=teach]');
  await cap('Or teach with your circle', 'Your circle friends, now by name');
  await wait(1800);
  await click('[data-a=tcStart]');
  await cap('Plan a class in three taps', 'What, when and where');
  await wait(1200); await click('[data-a=tcNext]');
  await click('[data-a=tcDate]'); await wait(400);
  await click('[data-a=tcTime][data-v="2:00 pm"]'); await wait(400);
  await click('[data-a=tcPlace][data-v=aac]'); await wait(700);
  await click('[data-a=tcNext]'); await wait(1000);
  await click('[data-a=tcPost]');
  await wait(800);
  // A circle friend joins as a fellow teacher (in real life, from her own phone).
  const me = await page.evaluate(() => S.data);
  const cls = me.events.find((e) => e.myCircle);
  const friend = members.find((m) => m.id !== uid);
  await api(`/users/${friend.id}/events/${cls.id}/cohost`, {});
  await page.evaluate(async () => { setData(await api(`/users/${S.uid}/state`)); render(); document.getElementById('toast')?.classList.remove('show'); });
  await showAt('.ev.circle');
  await cap('Circle friends teach together', `${friend.name} joined Mei Ling as a teacher`);
  await wait(3000);

  // 13. Rewards and the end card
  await click('[data-a=tab][data-v=rewards]');
  await cap('Points for wellbeing', 'Tai chi, yoga, health checks, walking shoes');
  await wait(2300);
  await page.evaluate(() => window.__end());
  await wait(3200);

  const video = page.video();
  await context.close();
  await browser.close();
  server.close();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const webm = path.join(OUT_DIR, 'story-hunt-demo.webm');
  fs.copyFileSync(await video.path(), webm);
  console.log('Saved', webm);

  // H.264 MP4 plays everywhere (Canva, PowerPoint, phones).
  const mp4 = path.join(OUT_DIR, 'story-hunt-demo.mp4');
  const r = spawnSync(require('ffmpeg-static'), ['-y', '-i', webm, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-preset', 'medium',
    '-movflags', '+faststart', '-an', mp4], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 300000 });
  if (r.status !== 0) { console.error(String(r.stderr).slice(-800)); process.exit(1); }
  console.log('Saved', mp4);
})().catch((e) => { console.error(e); process.exit(1); });
