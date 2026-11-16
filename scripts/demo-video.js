// Records a ~90 second phone-size demo video of Story Hunt with on-screen captions.
//   node scripts/demo-video.js     ->  demo/story-hunt-demo.webm
// Starts its own server with fresh data, so it never touches data/db.json.

const fs = require('fs');
const os = require('os');
const path = require('path');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sh-demo-'));
process.env.DB_FILE = path.join(tmp, 'db.json');
const app = require('../server');
const { chromium } = require('playwright');

const OUT_DIR = path.join(__dirname, '..', 'demo');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

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
    el.innerHTML = '<h1>Story Hunt</h1><p>A story that only ends<br>when four people meet.</p><small>Live: story-hunt-rho.vercel.app</small>';
    document.body.appendChild(el);
  };
}

(async () => {
  const server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  const BASE = `http://localhost:${server.address().port}`;
  const api = async (p, body) => (await fetch(BASE + '/api' + p, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deviceToken: 'demo-device-token', checkpointId: 'cafe-1', ...body }) } : undefined)).json();

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    recordVideo: { dir: tmp, size: { width: 780, height: 1688 } },
  });
  await context.addInitScript(captions);
  const page = await context.newPage();
  const cap = (t, s) => page.evaluate(([a, b]) => window.__cap(a, b), [t, s || '']);
  const click = (sel) => page.click(sel);
  const smooth = (sel) => page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), sel);

  // 1. Cover and languages
  await page.goto(BASE + '/');
  await page.waitForSelector('.masthead');
  await page.evaluate(() => document.fonts.ready);
  await cap('A comic legend for seniors', 'Singapore + India · read it or listen to it');
  await wait(2800);
  await click('[data-a=pickLang][data-v=ta]'); await cap('Five languages', 'English · 中文 · Melayu · தமிழ் · हिन्दी');
  await wait(1800);
  await click('[data-a=pickLang][data-v=hi]'); await wait(1300);
  await click('[data-a=pickLang][data-v=en]'); await wait(900);

  // 2. Quick sign-up
  await cap('Sign up in under a minute');
  await click('[data-a=obBegin]');
  await page.type('#name', 'Mei Ling', { delay: 60 }); await click('[data-a=obNext]');
  await page.type('#phone', '91234567', { delay: 25 }); await page.type('#pin', '1234', { delay: 25 }); await click('[data-a=obNext]');
  await cap('Pick the skill you could teach', 'Neighbours who share it become your circle');
  await click('[data-a=obSkill][data-v=cooking]'); await wait(1200); await click('[data-a=obNext]');
  await click('[data-a=obInterest][data-v=kopi]'); await wait(700); await click('[data-a=obCreate]');

  // 3. Story card
  await page.waitForSelector('[data-a=link]');
  await cap('Link a Story card', 'Tapping it at the café checks you in');
  await click('[data-a=link]'); await wait(1200);
  await api('/device/tap', { cardId: 'CARD-000A' });
  await page.waitForSelector('[data-a=unlink]', { timeout: 8000 }); await wait(1300);
  await click('[data-a=postNext]');

  // 4. Role card
  await page.waitForSelector('.rolecard');
  await cap('You become one of four witnesses', 'The legend of how Singapura got its name');
  await wait(3600);
  await click('[data-a=postNext]');

  // 5. Comic page with read-aloud
  await page.waitForSelector('.panel[id=pn0]');
  await cap('Read it as a comic', 'Ink panels, captions, speech bubbles');
  await wait(2200);
  await cap('…or listen to it', 'The panel being read lights up and the page follows along');
  for (let i = 0; i < 4; i++) {
    await page.evaluate((n) => { AU.on = true; AU.i = n; paintAudio(); document.getElementById('pn' + n).scrollIntoView({ behavior: 'smooth', block: 'center' }); }, i);
    await wait(2600);
  }
  await page.evaluate(() => { stopAudio(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  await wait(700);

  // 6. Voices and dialects
  await click('.voice-chip');
  await page.waitForSelector('.sheet');
  await cap('Natural voices, even dialects', '华语 · 粵語 · Melayu · தமிழ் · हिन्दी · Hokkien · Teochew');
  await wait(1600);
  await page.evaluate(() => document.querySelector('.sheet').scrollTo({ top: 520, behavior: 'smooth' }));
  await wait(2600);
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
  await wait(3000);
  await smooth('.place');
  await cap('Meet at a partner café', 'Map, directions, and what to look for');
  await wait(3800);

  // 8. Café device
  const dash = await api('/dashboard');
  const cards = dash.circles[0].members.map((m) => m.cardId);
  await page.goto(BASE + '/device.html');
  await page.addStyleTag({ content: '.wide>h1,.wide>p{display:none}.wide{padding-top:96px}' });
  await page.uncheck('#voice');
  await cap('At the café, everyone taps in', 'The device counts who has arrived');
  for (const id of cards) {
    await page.waitForFunction((v) => [...document.querySelectorAll('#who option')].some((o) => o.value === v), id);
    await page.selectOption('#who', id);
    await click('#tap');
    await wait(1500);
  }
  await wait(1800);
  await cap('Three questions no one can answer alone', 'They compare memories, then press a button together');
  await wait(2600);
  await click('[data-b=red]');
  await cap('Wrong? A hint says whose memory to ask');
  await wait(3600);
  await cap('Right answers unlock the ending');
  for (const b of ['yellow', 'red', 'green']) { await click(`[data-b=${b}]`); await wait(b === 'green' ? 4200 : 3700); }

  // 9. Ending and rewards
  await page.goto(BASE + '/');
  await page.waitForSelector('.letter');
  await cap('Solved together', 'The ending opens a real final chapter: a community hour');
  await smooth('.letter');
  await wait(3800);
  await click('[data-a=tab][data-v=rewards]');
  await cap('Points for wellbeing', 'Tai chi, yoga, health checks, walking shoes');
  await wait(3800);
  await page.evaluate(() => window.__end());
  await wait(3500);

  const video = page.video();
  await context.close();
  await browser.close();
  server.close();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = path.join(OUT_DIR, 'story-hunt-demo.webm');
  fs.copyFileSync(await video.path(), out);
  console.log('Saved', out);
})().catch((e) => { console.error(e); process.exit(1); });
