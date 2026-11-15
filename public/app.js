// Story Hunt: the senior's app. Plain JavaScript, one screen at a time, big buttons.
const app = document.getElementById('app');
const S = {
  uid: new URLSearchParams(location.search).get('u') || localStorage.getItem('sh_uid'),
  lang: localStorage.getItem('sh_lang') || 'en',
  tab: 'story', data: null, meta: null, ep: null, note: '',
  ob: { step: 0, name: '', skills: [], interests: [] },
};

const T = {
  en: {
    tagline: 'Every story needs four people.', chooseLang: 'Choose your language', nameQ: 'What should we call you?',
    namePh: 'Your first name', next: 'Next', back: 'Back', skillsQ: 'What are you good at?', pickSome: 'Choose one or more.',
    interestsQ: 'What do you enjoy?', start: 'Start my story', hello: 'Hello', pts: 'points', listen: '🔊 Listen',
    day: 'Day', playDay: 'Play Day', puzzle: 'Play the puzzle', yourPiece: 'Your piece of the', done: 'Well done!',
    gotPiece: 'You found a piece of the', cont: 'Continue', yourClue: 'Your clue', keepClue: 'Only you have this clue. Bring it to the café.',
    waitingT: 'Finding your three neighbours', waitingB: 'We are looking for three people nearby who hold the other pieces. We will tell you when they are ready.',
    meetT: 'Time to meet your circle', meetB: 'Your three neighbours are ready. Meet at the café and put your four clues together.',
    pickTime: 'Pick a time that suits you', booked: 'See you at', bring: 'Bring your Story Hunt card and tap it on the device at the café.',
    circle: 'Your circle', here: 'Arrived', notyet: 'Not yet', you: 'You', host: 'A Story Host will be there to welcome you the first time.',
    solvedT: 'You solved it together!', allClues: 'The four clues', finalT: 'Final chapter', finalWait: 'Waiting for the centre to confirm your visit.',
    doneT: 'Your story is complete', doneB: 'You passed it on. A new story starts next week with the same circle.',
    friends: 'Friends', friendsLock: 'After you meet your circle at the café, they will appear here as friends.',
    friendsOpen: 'You met at the café. These are your Story Hunt friends.', rewards: 'Rewards', rewardsNote: 'Points can only be used for fitness and wellbeing.',
    redeem: 'Use points', need: 'Need', redeemed: 'Done! Show this screen at the counter.', me: 'Me', story: 'Story',
    card: 'My card', linkCard: 'Link my card', linking: 'Now tap your card on the café device. You have 60 seconds.',
    cardId: 'Card number', language: 'Language', signOut: 'Sign out', demoFinish: 'Demo: finish my story now',
    notYet: 'Not yet. Which one comes before?', tryAgain: 'Not that one. Try another.', pairsLeft: 'Tap two cards to find a pair.',
    earned: 'You earned', offpeak: 'Quiet hours, 2 to 5 pm', safe: 'Story Hunt never asks for money or bank details.',
  },
  zh: {
    tagline: '每个故事都需要四个人。', chooseLang: '请选择语言', nameQ: '我们怎么称呼您？',
    namePh: '您的名字', next: '下一步', back: '返回', skillsQ: '您擅长什么？', pickSome: '可以选一个或多个。',
    interestsQ: '您喜欢做什么？', start: '开始我的故事', hello: '您好', pts: '积分', listen: '🔊 朗读',
    day: '第', playDay: '开始第', puzzle: '玩小游戏', yourPiece: '您的那一片', done: '做得好！',
    gotPiece: '您找到了一片', cont: '继续', yourClue: '您的线索', keepClue: '只有您有这条线索。请带着它去咖啡店。',
    waitingT: '正在寻找三位邻居', waitingB: '我们正在附近寻找拥有其他三片的人。准备好了会通知您。',
    meetT: '该和小组见面了', meetB: '三位邻居已经准备好了。到咖啡店见面，把四条线索拼在一起。',
    pickTime: '请选一个方便的时间', booked: '到时见：', bring: '请带上您的故事卡，在咖啡店的设备上轻触。',
    circle: '您的小组', here: '已到', notyet: '未到', you: '您', host: '第一次见面时，会有一位故事主持人在场欢迎您。',
    solvedT: '你们一起解开了！', allClues: '四条线索', finalT: '最后一章', finalWait: '等待中心确认你们的到访。',
    doneT: '您的故事完成了', doneB: '你们把它传下去了。下星期同一个小组会开始新故事。',
    friends: '朋友', friendsLock: '在咖啡店和小组见面之后，他们会出现在这里。',
    friendsOpen: '你们在咖啡店见过面了。这些是您的故事朋友。', rewards: '奖励', rewardsNote: '积分只能用于健身和保健。',
    redeem: '使用积分', need: '需要', redeemed: '完成！请在柜台出示此画面。', me: '我', story: '故事',
    card: '我的卡', linkCard: '绑定我的卡', linking: '请在咖啡店的设备上轻触您的卡。您有60秒。',
    cardId: '卡号', language: '语言', signOut: '退出', demoFinish: '演示：立即完成我的故事',
    notYet: '还不是这个。哪一步在前面？', tryAgain: '不是这个，再试试。', pairsLeft: '点两张卡片，找出相同的一对。',
    earned: '您获得了', offpeak: '清静时段，下午2点到5点', safe: '故事寻宝绝不会要求您付款或提供银行资料。',
  },
};
const t = (k) => T[S.lang][k] ?? T.en[k] ?? k;
const L = (o) => (o == null ? '' : typeof o === 'string' ? o : o[S.lang] ?? o.en);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dayLabel = (n) => (S.lang === 'zh' ? `第${n}天` : `Day ${n}`);
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

async function api(path, body) {
  const r = await fetch('/api' + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || r.statusText);
  return j;
}
function say(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = S.lang === 'zh' ? 'zh-CN' : 'en-GB';
  u.rate = 0.85;
  speechSynthesis.speak(u);
}
function setData(d) {
  S.data = d; S.uid = d.user.id; S.lang = d.user.lang;
  localStorage.setItem('sh_uid', S.uid); localStorage.setItem('sh_lang', S.lang);
}

// ---------- screens ----------
function onboarding() {
  const o = S.ob;
  const dots = `<div class="steps">${[0, 1, 2, 3].map((i) => `<i class="${i <= o.step ? 'on' : ''}"></i>`).join('')}</div>`;
  const chips = (list, sel, act) => `<div class="chips">${list.map((x) =>
    `<button class="chip ${sel.includes(x.id) ? 'on' : ''}" data-a="${act}" data-v="${x.id}"><span class="ico">${x.icon}</span>${L(x)}</button>`).join('')}</div>`;
  if (o.step === 0) return `
    <div class="big-icon">🧩</div><h1 class="center">Story Hunt</h1><p class="center muted">${t('tagline')}</p>
    <div class="card"><h2>Choose your language · 请选择语言</h2>
      <button class="btn" data-a="obLang" data-v="en">English</button>
      <button class="btn" data-a="obLang" data-v="zh">中文</button></div>
    <p class="small muted center">${t('safe')}</p>`;
  if (o.step === 1) return `${dots}<h1>${t('nameQ')}</h1>
    <input type="text" id="name" maxlength="24" autocomplete="given-name" placeholder="${t('namePh')}" value="${esc(o.name)}">
    <button class="btn" data-a="obNext">${t('next')}</button><button class="btn ghost" data-a="obBack">${t('back')}</button>`;
  if (o.step === 2) return `${dots}<h1>${t('skillsQ')}</h1><p class="muted">${t('pickSome')}</p>${chips(S.meta.skills, o.skills, 'obSkill')}
    <button class="btn" data-a="obNext" ${o.skills.length ? '' : 'disabled'}>${t('next')}</button><button class="btn ghost" data-a="obBack">${t('back')}</button>`;
  return `${dots}<h1>${t('interestsQ')}</h1><p class="muted">${t('pickSome')}</p>${chips(S.meta.interests, o.interests, 'obInterest')}
    <button class="btn" data-a="obStart" ${o.interests.length ? '' : 'disabled'}>${t('start')}</button><button class="btn ghost" data-a="obBack">${t('back')}</button>`;
}

function episode() {
  const e = S.ep, story = S.data.story, ep = story.episodes[e.day - 1];
  const head = `<div class="top"><b>${story.icon} ${L(story.title)}</b><span class="pill">${dayLabel(e.day)}</span></div>`;
  if (e.stage === 'cards') {
    const c = ep.cards[e.i], last = e.i === ep.cards.length - 1;
    return `${head}<div class="steps">${ep.cards.map((_, i) => `<i class="${i <= e.i ? 'on' : ''}"></i>`).join('')}</div>
      <div class="card"><div class="big-icon">${c.icon}</div><p class="story-text">${L(c.text)}</p></div>
      <button class="btn quiet" data-a="say" data-v="${esc(L(c.text))}">${t('listen')}</button>
      <button class="btn" data-a="epNext">${last ? t('puzzle') : t('next')}</button>
      <button class="btn ghost" data-a="epBack">${t('back')}</button>`;
  }
  if (e.stage === 'game') {
    const g = ep.game, st = e.g;
    let body = '';
    if (g.type === 'pairs') {
      body = `<div class="grid3">${st.deck.map((em, i) => {
        const cls = st.done.includes(i) ? 'done' : st.open.includes(i) ? 'open' : '';
        return `<button class="tile ${cls}" data-a="pair" data-v="${i}" aria-label="card ${i + 1}">${cls ? em : '?'}</button>`;
      }).join('')}</div><p class="hint">${st.done.length ? '' : t('pairsLeft')}</p>`;
    } else if (g.type === 'order') {
      body = st.order.map((idx) => {
        const pos = st.picked.indexOf(idx);
        return `<button class="orderitem ${pos >= 0 ? 'done' : ''} ${st.shake === idx ? 'shake' : ''}" data-a="order" data-v="${idx}">
          <span class="ico">${g.items[idx].icon}</span>${L(g.items[idx].text)}<span class="num">${pos >= 0 ? pos + 1 : ''}</span></button>`;
      }).join('') + `<p class="hint">${st.hint ? t('notYet') : ''}</p>`;
    } else {
      body = `<div class="grid2">${g.options.map((em, i) =>
        `<button class="tile pick ${st.wrong.includes(i) ? 'wrong' : ''}" data-a="find" data-v="${i}">${em}</button>`).join('')}</div>
        <p class="hint">${st.wrong.length ? L(g.hint) : ''}</p>`;
    }
    return `${head}<div class="card soft"><b>${L(g.prompt)}</b></div>${body}
      <button class="btn quiet" data-a="say" data-v="${esc(L(g.prompt))}">${t('listen')}</button>`;
  }
  // reward
  const lastDay = e.day === 3;
  return `${head}<div class="card good center"><div class="big-icon">🎉</div><h2>${t('done')}</h2>
      <p>${t('gotPiece')}${S.lang === 'zh' ? '' : ' '}${L(story.piece)}${S.lang === 'zh' ? '。' : '.'}</p>${pieceRow(e.day)}</div>
    ${lastDay ? `<div class="card"><p class="story-text">${L(story.cliffhanger)}</p>
      <p class="muted small">${t('yourClue')}</p><p class="clue">${L(story.clue)}</p><p class="muted">${t('keepClue')}</p></div>
      <button class="btn quiet" data-a="say" data-v="${esc(L(story.cliffhanger) + ' ' + L(story.clue))}">${t('listen')}</button>` : ''}
    <button class="btn" data-a="epDone">${t('cont')}</button>`;
}

const pieceRow = (n) => `<div class="pieces">${[1, 2, 3].map((i) => `<div class="piece ${i <= n ? 'on' : ''}">${i <= n ? '🧩' : ''}</div>`).join('')}</div>`;
const quarters = (members) => `<div class="pieces">${members.map((m) =>
  `<div class="piece ${m.you || m.present ? 'on' : 'lock'}">${m.you || m.present ? '🧩' : '🔒'}</div>`).join('')}</div>`;
const peopleList = (members, showHere) => `<ul class="people">${members.map((m) => `<li>
  <span class="avatar">${esc((m.name.trim().split(' ').pop() || '?')[0])}</span>
  <span><b>${esc(m.name)}</b>${m.you ? ` (${t('you')})` : ''}<br><span class="small muted">${m.skills.map((id) => L(S.meta.skills.find((s) => s.id === id) || id)).join(' · ')}</span></span>
  ${showHere ? `<span class="tag ${m.present ? 'here' : ''}">${m.present ? t('here') : t('notyet')}</span>` : ''}</li>`).join('')}</ul>`;

function storyTab() {
  const { user, phase, story, circle } = S.data, cafe = S.meta.cafe;
  const clueCard = `<div class="card"><p class="muted small">${t('yourClue')}</p><p class="clue">${L(story.clue)}</p><p class="muted small">${t('keepClue')}</p></div>`;
  if (phase === 'play') {
    const d = user.day + 1;
    return `<div class="card"><div class="big-icon">${story.icon}</div><h1 class="center">${L(story.title)}</h1>
      <p class="muted center">${t('yourPiece')}${S.lang === 'zh' ? '' : ' '}${L(story.piece)}</p>${pieceRow(user.day)}
      <button class="btn" data-a="play" data-v="${d}">${S.lang === 'zh' ? `开始第${d}天` : `Play Day ${d}`}</button></div>`;
  }
  if (phase === 'waiting') return `<div class="card soft center"><div class="big-icon">🔎</div><h2>${t('waitingT')}</h2><p>${t('waitingB')}</p></div>${clueCard}`;
  if (phase === 'meet') return `
    <div class="card soft"><h2>${t('meetT')}</h2><p>${t('meetB')}</p>${quarters(circle.members)}</div>
    <div class="card"><div class="big-icon">☕</div><h2 class="center">${L(cafe.name)}</h2>
      <p class="center muted">${L(cafe.address)}<br>${t('offpeak')}</p>
      ${user.slot ? `<p class="center"><b>${t('booked')} ${esc(user.slot)}</b></p>` : `<p class="center"><b>${t('pickTime')}</b></p>`}
      <div class="row">${cafe.slots.map((s) => `<button class="btn ${user.slot === s ? '' : 'quiet'}" data-a="slot" data-v="${s}">${s}</button>`).join('')}</div>
      <p class="small muted" style="margin-top:12px">💳 ${t('bring')}<br>🤝 ${t('host')}</p></div>
    ${clueCard}<div class="card"><h2>${t('circle')}</h2>${peopleList(circle.members, true)}</div>`;
  // solved or done
  const ev = story.event, done = phase === 'done';
  return `
    <div class="card good center"><div class="big-icon">${done ? '🏅' : '🎉'}</div>
      <h2>${done ? t('doneT') : t('solvedT')}</h2>${done ? `<p>${t('doneB')}</p>` : ''}
      <p><b>${t('earned')} ${S.meta.points.story + (done ? S.meta.points.event : 0)} ${t('pts')}</b></p></div>
    <div class="card"><h2>${L(story.endingTitle)}</h2><p class="story-text">${L(story.ending)}</p>
      <button class="btn quiet" data-a="say" data-v="${esc(L(story.ending))}">${t('listen')}</button></div>
    <div class="card ${done ? 'good' : 'warn'}"><p class="small muted">${t('finalT')}</p><h2>${ev.icon} ${L(ev.title)}</h2>
      <p>${L(ev.partner)}</p><p>${L(ev.detail)}</p>
      <p><b>${done ? '✅ +' + S.meta.points.event + ' ' + t('pts') : '⏳ ' + t('finalWait')}</b></p></div>
    <div class="card"><h2>${t('allClues')}</h2>${story.clues.map((c, i) => `<p>🧩 <b>${esc(circle.members[i]?.name || '')}:</b> ${L(c)}</p>`).join('')}</div>`;
}

function friendsTab() {
  const { circle, phase } = S.data;
  if (phase !== 'solved' && phase !== 'done') return `<div class="card center"><div class="big-icon">🔒</div><h2>${t('friends')}</h2><p>${t('friendsLock')}</p></div>`;
  return `<div class="card good"><p>${t('friendsOpen')}</p></div><div class="card"><h2>${esc(circle.name)}</h2>${peopleList(circle.members.filter((m) => !m.you), false)}</div>`;
}
function rewardsTab() {
  const u = S.data.user;
  return `<div class="card soft center"><div class="big-icon">⭐</div><h1>${u.points} ${t('pts')}</h1><p class="muted">${t('rewardsNote')}</p></div>
    ${S.note ? `<div class="card good"><b>${esc(S.note)}</b></div>` : ''}
    ${S.meta.rewards.map((r) => `<div class="card"><h2>${r.icon} ${L(r)}</h2>
      <button class="btn ${u.points >= r.cost ? '' : 'quiet'}" data-a="redeem" data-v="${r.id}" ${u.points >= r.cost ? '' : 'disabled'}>
      ${u.points >= r.cost ? t('redeem') : t('need')} · ${r.cost} ${t('pts')}</button></div>`).join('')}`;
}
function meTab() {
  const { user, linking, phase } = S.data;
  return `<div class="card"><h1>${esc(user.name)}</h1>
      <p class="muted">${user.skills.map((id) => L(S.meta.skills.find((s) => s.id === id) || id)).join(' · ')}</p></div>
    <div class="card"><h2>💳 ${t('card')}</h2><p class="small muted">${t('cardId')}: ${esc(user.cardId)}</p>
      ${linking ? `<div class="card warn"><b>${t('linking')}</b></div>` : `<button class="btn" data-a="link">${t('linkCard')}</button>`}</div>
    <div class="card"><h2>${t('language')}</h2><div class="row">
      <button class="btn ${S.lang === 'en' ? '' : 'quiet'}" data-a="lang" data-v="en">English</button>
      <button class="btn ${S.lang === 'zh' ? '' : 'quiet'}" data-a="lang" data-v="zh">中文</button></div></div>
    <p class="small muted center">${t('safe')}</p>
    ${phase === 'play' ? `<button class="btn ghost" data-a="demoFinish">${t('demoFinish')}</button>` : ''}
    <button class="btn ghost" data-a="signOut">${t('signOut')}</button>`;
}

function render() {
  document.documentElement.lang = S.lang === 'zh' ? 'zh' : 'en';
  if (!S.meta) { app.innerHTML = ''; return; }
  if (!S.data) { app.innerHTML = onboarding(); return; }
  if (S.ep) { app.innerHTML = episode(); return; }
  const u = S.data.user;
  const tabs = [['story', '📖', t('story')], ['friends', '👥', t('friends')], ['rewards', '⭐', t('rewards')], ['me', '🙂', t('me')]];
  const body = { story: storyTab, friends: friendsTab, rewards: rewardsTab, me: meTab }[S.tab]();
  app.innerHTML = `<div class="top"><b>${t('hello')}, ${esc(u.name)}</b><span class="pill">⭐ ${u.points}</span></div>${body}
    <nav class="nav"><div>${tabs.map(([id, ico, label]) => `<button class="${S.tab === id ? 'on' : ''}" data-a="tab" data-v="${id}"><span>${ico}</span>${label}</button>`).join('')}</div></nav>`;
}

// ---------- actions ----------
const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
function startGame() {
  const g = S.data.story.episodes[S.ep.day - 1].game;
  S.ep.stage = 'game';
  S.ep.g = g.type === 'pairs' ? { deck: shuffle([...g.items, ...g.items]), open: [], done: [], busy: false }
    : g.type === 'order' ? { order: shuffle(g.items.map((_, i) => i)), picked: [], hint: false, shake: null }
    : { wrong: [] };
}
async function winGame() {
  S.ep.stage = 'reward';
  setData(await api(`/users/${S.uid}/complete-day`, { day: S.ep.day }));
  render();
}
const A = {
  obLang(v) { S.lang = v; localStorage.setItem('sh_lang', v); S.ob.step = 1; },
  obBack() { S.ob.step--; },
  obNext() { if (S.ob.step === 1 && !S.ob.name.trim()) return document.getElementById('name').focus(); S.ob.step++; },
  obSkill(v) { S.ob.skills = toggle(S.ob.skills, v); },
  obInterest(v) { S.ob.interests = toggle(S.ob.interests, v); },
  async obStart() { setData(await api('/users', { ...S.ob, lang: S.lang })); S.tab = 'story'; },
  tab(v) { S.tab = v; S.note = ''; },
  say(v) { say(v); return false; },
  play(v) { S.ep = { day: Number(v), i: 0, stage: 'cards', g: null }; },
  epNext() { const ep = S.data.story.episodes[S.ep.day - 1]; if (S.ep.i < ep.cards.length - 1) S.ep.i++; else startGame(); },
  epBack() { if (S.ep.i > 0) S.ep.i--; else S.ep = null; },
  epDone() { S.ep = null; },
  pair(v) {
    const st = S.ep.g, i = Number(v);
    if (st.busy || st.open.includes(i) || st.done.includes(i)) return false;
    st.open.push(i);
    if (st.open.length === 2) {
      const [a, b] = st.open;
      if (st.deck[a] === st.deck[b]) {
        st.done.push(a, b); st.open = [];
        if (st.done.length === st.deck.length) setTimeout(winGame, 700);
      } else {
        st.busy = true;
        setTimeout(() => { st.open = []; st.busy = false; render(); }, 1100);
      }
    }
  },
  order(v) {
    const st = S.ep.g, i = Number(v);
    if (st.picked.includes(i)) return false;
    if (i === st.picked.length) {
      st.picked.push(i); st.hint = false; st.shake = null;
      if (st.picked.length === st.order.length) setTimeout(winGame, 700);
    } else { st.hint = true; st.shake = i; }
  },
  find(v) {
    const g = S.data.story.episodes[S.ep.day - 1].game, i = Number(v);
    if (i === g.answer) return winGame();
    if (!S.ep.g.wrong.includes(i)) S.ep.g.wrong.push(i);
  },
  async slot(v) { setData(await api(`/users/${S.uid}/slot`, { slot: v })); },
  async redeem(v) { setData(await api(`/users/${S.uid}/redeem`, { rewardId: v })); S.note = t('redeemed'); },
  async link() { setData(await api(`/users/${S.uid}/link-card`, {})); },
  async lang(v) { setData(await api(`/users/${S.uid}/lang`, { lang: v })); },
  async demoFinish() { setData(await api(`/users/${S.uid}/complete-day`, { day: 3 })); S.tab = 'story'; },
  signOut() { localStorage.removeItem('sh_uid'); S.uid = null; S.data = null; S.ob = { step: 0, name: '', skills: [], interests: [] }; history.replaceState(null, '', location.pathname); },
};

app.addEventListener('click', async (ev) => {
  const el = ev.target.closest('[data-a]');
  if (!el || el.disabled) return;
  try {
    const keep = await A[el.dataset.a](el.dataset.v);
    if (keep !== false) { render(); if (!S.ep || S.ep.stage !== 'game') window.scrollTo(0, 0); }
  } catch (e) { alert(e.message); }
});
app.addEventListener('input', (ev) => { if (ev.target.id === 'name') S.ob.name = ev.target.value; });

// Keep the meet-up screens live: who has arrived, solved, event confirmed.
setInterval(async () => {
  if (!S.uid || !S.data || S.ep || document.hidden) return;
  try {
    const d = await api(`/users/${S.uid}/state`);
    if (JSON.stringify(d) !== JSON.stringify(S.data)) { setData(d); render(); }
  } catch { /* offline: try again next tick */ }
}, 2500);

(async function boot() {
  S.meta = await api('/meta');
  if (S.uid) {
    try { setData(await api(`/users/${S.uid}/state`)); } catch { S.uid = null; localStorage.removeItem('sh_uid'); }
  }
  render();
})();
