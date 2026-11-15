// Story Hunt: the senior's app. Plain JavaScript, one clear action per screen.
const app = document.getElementById('app');
const S = {
  uid: localStorage.getItem('sh_uid'), lang: localStorage.getItem('sh_lang') || 'en',
  tab: 'story', data: null, meta: null, rd: null, err: '', note: '',
  auth: 'welcome', ob: { step: 0, name: '', phone: '', pin: '', skills: [], interests: [] }, post: null, edit: null,
};

const T = {
  en: {
    tagline: 'A story that only ends when four people meet.', start: 'Start', haveAcct: 'I already have an account', signIn: 'Sign in',
    nameQ: 'What should we call you?', namePh: 'Your first name', next: 'Next', back: 'Back', phoneQ: 'Your phone number', pinQ: 'Choose a 4-digit PIN',
    acctWhy: 'You will use these to sign in again. We never share your number.', pin: 'PIN', phone: 'Phone number',
    skillsQ: 'What are you good at?', pickSome: 'Choose one or more. We will find neighbours who share one.', interestsQ: 'What do you enjoy?', create: 'Create my account',
    cardT: 'Link your Story card', cardB: 'Your card is how the café knows you have arrived. Press the button, then tap your card on any Story Hunt device.',
    linkCard: 'Link my card', linking: 'Waiting for your card… tap it on the device now.', cancel: 'Cancel', later: 'I will do this later',
    linked: 'Card linked', cardEnds: 'Card ending', replace: 'Replace card', notLinked: 'No card linked yet',
    roleT: 'In this story, you are', roleGo: 'Begin', hello: 'Hello',
    jRead: 'Read', jMeet: 'Meet', jSolve: 'Solve', jGive: 'Give back',
    playing: 'You are playing', chapter: 'Chapter', readCh: 'Read chapter', mins: 'About 3 minutes', doneTag: 'Read', nowTag: 'Next', lockedTag: 'Locked',
    remember: 'What you remember', rememberB: 'These are yours alone. Bring them to the table.', listen: 'Listen', stop: 'Stop',
    youChoose: 'You decide', noted: 'You will remember this', aboutYou: 'Now, about you', aboutYouB: 'Your answer becomes a conversation card for your circle at the café.',
    typeHere: 'Or type your own', save: 'Save and continue', finish: 'Finish chapter',
    waitT: 'Finding the other three witnesses', waitB: 'We are matching you with three neighbours who each hold another side of this story.', found: 'found',
    meetT: 'Your circle is ready', meetB: 'Four witnesses, four different memories. Meet at the café and work out what really happened.',
    todo1: 'Link your Story card', todo2: 'Choose a time', todo3: 'Tap your card at the café', pickTime: 'When suits you?', offpeak: 'Quiet hours, 2 to 5 pm',
    arrived: 'Arrived', reading: 'Still reading', ready: 'Ready', you: 'You', hostNote: 'A Story Host will welcome your circle the first time.',
    tableT: 'At the table', tableB: 'Talk it through, then answer together on the device.', qOf: 'Question', of: 'of', hint: 'Hint',
    cards: 'Conversation cards', cardsB: 'Something to ask each other while you are here.',
    solvedT: 'You solved it together', earned: 'You earned', pts: 'points', truth: 'What really happened', finalT: 'The final chapter',
    youSaid: 'You said you would like to teach', chance: 'Here is your chance.', going: "I'll be there", goingYes: "You're going", whoGoing: 'Who is coming',
    waitNgo: 'When your circle has been, the centre confirms it and your story is complete.', with: 'with',
    doneT: 'Your story is complete', doneB: 'You found the truth, and you passed something on. A new story begins soon with the same circle.',
    circle: 'Circle', circleLock: 'You will learn who they are when you meet. Until then, they are the other three witnesses.',
    someone: 'A neighbour who shares your skill', friendsT: 'Your Story Hunt friends', played: 'played', chatT: 'Circle chat', chatPh: 'Write a message', send: 'Send',
    q1: 'See you next week!', q2: 'Thank you, everyone', q3: 'I enjoyed today',
    rewards: 'Rewards', balance: 'Your points', rewardsNote: 'Points can only be used for fitness and wellbeing.', use: 'Use', need: 'You need', more: 'more',
    vouchers: 'My vouchers', showCode: 'Show this code at the counter', history: 'Points history', noHistory: 'Solve a story or join a community hour to earn points.',
    profile: 'Profile', story: 'Story', edit: 'Edit', saveName: 'Save', stChap: 'Chapters read', stMeet: 'Meet-ups', stHours: 'Community hours', stPts: 'Points',
    badges: 'Badges', b1: 'First chapter', b2: 'Storyteller', b3: 'Met the circle', b4: 'Truth finder', b5: 'Gave back', b6: 'Card linked',
    myCard: 'My Story card', language: 'Language', textSize: 'Text size', mySkills: 'My skills', myInterests: 'My interests',
    safe: 'Story Hunt never asks for money or bank details.', signOut: 'Sign out', cliff: 'To be continued, together',
    cardWarn: 'Link your card before you go to the café.', linkNow: 'Link it now', season2: 'Next season', season2B: 'The Last Seed · coming soon',
  },
  zh: {
    tagline: '一个要四个人见面才能读完的故事。', start: '开始', haveAcct: '我已经有账户', signIn: '登录',
    nameQ: '我们怎么称呼您？', namePh: '您的名字', next: '下一步', back: '返回', phoneQ: '您的电话号码', pinQ: '设定4位数密码',
    acctWhy: '下次登录时会用到。我们绝不会分享您的号码。', pin: '密码', phone: '电话号码',
    skillsQ: '您擅长什么？', pickSome: '可选一项或多项。我们会为您找到有相同本领的邻居。', interestsQ: '您喜欢做什么？', create: '建立我的账户',
    cardT: '绑定您的故事卡', cardB: '咖啡店靠这张卡知道您到了。按下按钮，然后在任何一台故事寻宝设备上轻触您的卡。',
    linkCard: '绑定我的卡', linking: '正在等待您的卡……请现在在设备上轻触。', cancel: '取消', later: '稍后再绑定',
    linked: '卡已绑定', cardEnds: '卡号尾数', replace: '更换卡', notLinked: '还没有绑定卡',
    roleT: '在这个故事里，您是', roleGo: '开始阅读', hello: '您好',
    jRead: '阅读', jMeet: '见面', jSolve: '解谜', jGive: '回馈',
    playing: '您扮演的是', chapter: '第', readCh: '阅读第', mins: '大约3分钟', doneTag: '已读', nowTag: '下一章', lockedTag: '未开放',
    remember: '您记得的事', rememberB: '这些只有您知道。请带到见面的桌上。', listen: '朗读', stop: '停止',
    youChoose: '由您决定', noted: '您会记住这件事', aboutYou: '现在，说说您自己', aboutYouB: '您的回答会成为小组在咖啡店的聊天话题。',
    typeHere: '或者自己输入', save: '保存并继续', finish: '读完这一章',
    waitT: '正在寻找另外三位见证人', waitB: '我们正在为您配对三位邻居，他们各自知道这个故事的另一面。', found: '已找到',
    meetT: '您的小组准备好了', meetB: '四位见证人，四段不同的记忆。到咖啡店见面，一起弄清当年的真相。',
    todo1: '绑定您的故事卡', todo2: '选择时间', todo3: '在咖啡店轻触您的卡', pickTime: '什么时间方便？', offpeak: '清静时段，下午2点到5点',
    arrived: '已到', reading: '还在阅读', ready: '准备好了', you: '您', hostNote: '第一次见面时，会有一位故事主持人欢迎你们。',
    tableT: '在桌边', tableB: '大家讨论之后，一起在设备上作答。', qOf: '第', of: '题，共', hint: '提示',
    cards: '聊天话题卡', cardsB: '见面时可以互相问问。',
    solvedT: '你们一起解开了', earned: '您获得了', pts: '积分', truth: '当年的真相', finalT: '最后一章',
    youSaid: '您说过想教年轻人', chance: '机会来了。', going: '我会参加', goingYes: '您已报名', whoGoing: '谁会参加',
    waitNgo: '你们参加之后，中心会确认，您的故事就完成了。', with: '合作单位：',
    doneT: '您的故事完成了', doneB: '你们找到了真相，也把本领传了下去。同一个小组很快会开始新的故事。',
    circle: '小组', circleLock: '见面之后您才会知道他们是谁。在那之前，他们是另外三位见证人。',
    someone: '一位和您有相同本领的邻居', friendsT: '您的故事朋友', played: '扮演', chatT: '小组聊天', chatPh: '写一句话', send: '发送',
    q1: '下星期见！', q2: '谢谢大家', q3: '今天很开心',
    rewards: '奖励', balance: '您的积分', rewardsNote: '积分只能用于健身和保健。', use: '使用', need: '还差', more: '分',
    vouchers: '我的礼券', showCode: '请在柜台出示此代码', history: '积分记录', noHistory: '解开故事或参加社区活动就能获得积分。',
    profile: '我的', story: '故事', edit: '修改', saveName: '保存', stChap: '已读章节', stMeet: '见面次数', stHours: '社区服务时数', stPts: '积分',
    badges: '徽章', b1: '第一章', b2: '说书人', b3: '见到小组', b4: '找到真相', b5: '回馈社区', b6: '已绑定卡',
    myCard: '我的故事卡', language: '语言', textSize: '字体大小', mySkills: '我的本领', myInterests: '我的兴趣',
    safe: '故事寻宝绝不会要求您付款或提供银行资料。', signOut: '退出', cliff: '未完待续，一起揭晓',
    cardWarn: '去咖啡店之前，请先绑定您的卡。', linkNow: '现在绑定', season2: '下一季', season2B: '最后一粒种子 · 即将推出',
  },
};
const t = (k) => T[S.lang][k] ?? T.en[k] ?? k;
const L = (o) => (o == null ? '' : typeof o === 'string' ? o : o[S.lang] ?? o.en);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const zh = () => S.lang === 'zh';

const ICONS = {
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  gift: '<path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  check: '<path d="M20 6L9 17l-5-5"/>', lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  card: '<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>',
  volume: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  left: '<path d="M15 18l-6-6 6-6"/>', send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>',
};
const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;

// Illustrations, drawn in SVG so the app needs no image files.
const ART = {
  stall: `<defs><linearGradient id="a1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7c873"/><stop offset="1" stop-color="#e8734f"/></linearGradient></defs>
    <rect width="360" height="200" fill="url(#a1)"/><circle cx="286" cy="62" r="26" fill="#fff3c4" opacity=".85"/>
    <path d="M0 120h52V78h44v42h30V60h58v60h40V84h50v36h86v80H0z" fill="#8c3b2a" opacity=".55"/>
    <g fill="#ffd98a"><rect x="64" y="90" width="9" height="12"/><rect x="140" y="74" width="9" height="12"/><rect x="162" y="74" width="9" height="12"/><rect x="240" y="96" width="9" height="12"/></g>
    <rect y="160" width="360" height="40" fill="#5a2a1f"/>
    <rect x="96" y="104" width="168" height="62" rx="3" fill="#6b2f1e"/><rect x="104" y="124" width="152" height="42" fill="#f4e3c4"/>
    <path d="M86 104l14-26h160l14 26z" fill="#b5411c"/><path d="M114 78l-8 26h22l4-26zm40 0l-2 26h22l-2-26zm40 0l2 26h22l-6-26zm38 0l8 26h22l-12-26z" fill="#fff4dd"/>
    <ellipse cx="180" cy="142" rx="30" ry="7" fill="#3b3b3b"/><rect x="150" y="142" width="60" height="20" rx="5" fill="#4a4a4a"/>
    <path d="M168 132c-6-9 6-12 0-21m14 21c-6-9 6-12 0-21m14 21c-6-9 6-12 0-21" stroke="#fff" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>
    <path d="M70 70v14" stroke="#3a1a10" stroke-width="2"/><ellipse cx="70" cy="98" rx="13" ry="16" fill="#d92b1f"/><rect x="63" y="82" width="14" height="4" fill="#e9b949"/><rect x="63" y="112" width="14" height="4" fill="#e9b949"/>`,
  night: `<defs><linearGradient id="a2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16203a"/><stop offset="1" stop-color="#3b4775"/></linearGradient></defs>
    <rect width="360" height="200" fill="url(#a2)"/><circle cx="290" cy="50" r="22" fill="#f5efd0"/><circle cx="299" cy="44" r="20" fill="#1c2745"/>
    <g fill="#fff" opacity=".8"><circle cx="40" cy="30" r="1.6"/><circle cx="110" cy="52" r="1.4"/><circle cx="170" cy="24" r="1.8"/><circle cx="230" cy="62" r="1.3"/><circle cx="330" cy="100" r="1.5"/></g>
    <path d="M0 120h52V78h44v42h30V60h58v60h40V84h50v36h86v80H0z" fill="#0f1730" opacity=".8"/>
    <rect y="160" width="360" height="40" fill="#0d1326"/>
    <path d="M86 104l14-26h160l14 26z" fill="#4a2a2a"/><rect x="96" y="104" width="168" height="62" fill="#59607a"/>
    <g stroke="#3f465f" stroke-width="3"><path d="M96 114h168M96 124h168M96 134h168M96 144h168M96 154h168"/></g>
    <rect x="172" y="150" width="16" height="13" rx="2" fill="#e9b949"/><path d="M175 150v-5a5 5 0 0 1 10 0v5" stroke="#e9b949" stroke-width="3" fill="none"/>
    <path d="M70 70v10" stroke="#888" stroke-width="2"/><path d="M66 80h8" stroke="#888" stroke-width="2"/>`,
  letter: `<rect width="360" height="200" fill="#c88a55"/><g stroke="#b47843" stroke-width="2"><path d="M0 50h360M0 100h360M0 150h360"/></g>
    <g transform="rotate(-7 150 105)"><rect x="60" y="50" width="180" height="112" rx="4" fill="#d9b98a"/><path d="M60 54l90 60 90-60" stroke="#b9945f" stroke-width="3" fill="none"/></g>
    <g transform="rotate(6 250 100)"><path d="M200 44h96v104l-14-8-12 10-14-9-12 9-14-10-12 8-18-6z" fill="#fff8e6"/>
    <g stroke="#9a8a6a" stroke-width="3" stroke-linecap="round"><path d="M214 66h66M214 82h52M214 98h60M214 114h40"/></g></g>
    <path d="M92 166c22-26 46-30 66-14-18 4-26 14-20 24 14-14 34-12 44 2" stroke="#2f7d4a" stroke-width="7" fill="none" stroke-linecap="round"/>`,
  cafe: `<rect width="360" height="200" fill="#f3dcc0"/><circle cx="180" cy="104" r="76" fill="#b8763f"/><circle cx="180" cy="104" r="68" fill="#cf8f55"/>
    <g fill="#fff"><circle cx="140" cy="72" r="15"/><circle cx="222" cy="72" r="15"/><circle cx="140" cy="138" r="15"/><circle cx="222" cy="138" r="15"/></g>
    <g fill="#5a3320"><circle cx="140" cy="72" r="9"/><circle cx="222" cy="72" r="9"/><circle cx="140" cy="138" r="9"/><circle cx="222" cy="138" r="9"/></g>
    <rect x="164" y="90" width="32" height="28" rx="4" fill="#f4f4f1" stroke="#a3261a" stroke-width="3"/>
    <g><circle cx="172" cy="112" r="2.5" fill="#d7362c"/><circle cx="180" cy="112" r="2.5" fill="#f2c200"/><circle cx="188" cy="112" r="2.5" fill="#23964f"/></g>
    <g fill="#8a5a36"><circle cx="76" cy="52" r="16"/><circle cx="284" cy="52" r="16"/><circle cx="76" cy="158" r="16"/><circle cx="284" cy="158" r="16"/></g>`,
};
const art = (n, cls = '') => `<svg class="art ${cls}" viewBox="0 0 360 200" role="img" aria-label="">${ART[n]}</svg>`;

async function api(path, body) {
  const r = await fetch('/api' + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || r.statusText);
  return j;
}
let speaking = false;
function say(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  if (speaking) { speaking = false; return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = zh() ? 'zh-CN' : 'en-GB'; u.rate = 0.85;
  u.onend = () => { speaking = false; render(); };
  speaking = true; speechSynthesis.speak(u);
}
const hush = () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); speaking = false; };
function setData(d) {
  S.data = d; S.uid = d.user.id; S.lang = d.user.lang;
  localStorage.setItem('sh_uid', S.uid); localStorage.setItem('sh_lang', S.lang);
}
const role = (i) => S.meta.story.roles[i];
const myRole = () => role(S.data.user.roleIndex);
const initial = (name) => (zh() && /[^\x00-\x7f]/.test(name) ? name.trim().slice(-1) : (name.trim().split(' ').pop() || '?')[0].toUpperCase());
const avatar = (name, color, cls = '') => `<span class="avatar ${cls}" style="background:${color}">${esc(initial(name))}</span>`;
const roleAvatar = (r, cls = '') => avatar(L(r.name), r.color, cls);
const skillLabel = (id) => L(S.meta.skills.find((s) => s.id === id) || id);
const chTitle = (i) => (zh() ? `第${i + 1}章` : `Chapter ${i + 1}`);

// ---------- signed-out screens ----------
function welcome() {
  return `${art('stall')}<p class="eyebrow center">Story Hunt · 故事寻宝</p>
    <h1 class="center">${t('tagline')}</h1>
    <div class="row" style="margin-top:14px"><button class="btn ${S.lang === 'en' ? '' : 'quiet'}" data-a="pickLang" data-v="en">English</button>
      <button class="btn ${zh() ? '' : 'quiet'}" data-a="pickLang" data-v="zh">中文</button></div>
    <button class="btn" data-a="obBegin">${t('start')}</button>
    <button class="btn ghost" data-a="toSignIn">${t('haveAcct')}</button>
    <p class="small muted center" style="margin-top:14px">${t('safe')}</p>`;
}
function signIn() {
  return `<button class="link" data-a="toWelcome">${ic('left')} ${t('back')}</button><h1>${t('signIn')}</h1>
    <label class="field" for="phone">${t('phone')}</label><input type="tel" id="phone" inputmode="numeric" autocomplete="tel" value="${esc(S.ob.phone)}">
    <label class="field" for="pin">${t('pin')}</label><input type="password" id="pin" inputmode="numeric" maxlength="4" autocomplete="current-password" value="${esc(S.ob.pin)}">
    ${S.err ? `<div class="error">${esc(S.err)}</div>` : ''}<button class="btn" data-a="doSignIn">${t('signIn')}</button>`;
}
function onboarding() {
  const o = S.ob;
  const dots = `<div class="steps">${[1, 2, 3, 4].map((i) => `<i class="${i <= o.step ? 'on' : ''}"></i>`).join('')}</div>`;
  const chips = (list, sel, act) => `<div class="chips">${list.map((x) =>
    `<button class="chip ${sel.includes(x.id) ? 'on' : ''}" data-a="${act}" data-v="${x.id}"><span class="ico">${x.icon}</span>${L(x)}</button>`).join('')}</div>`;
  const nav = (label, act, ok = true) => `${S.err ? `<div class="error">${esc(S.err)}</div>` : ''}
    <button class="btn" data-a="${act}" ${ok ? '' : 'disabled'}>${label}</button><button class="btn ghost" data-a="obBack">${t('back')}</button>`;
  if (o.step === 1) return `${dots}<h1>${t('nameQ')}</h1>
    <input type="text" id="name" maxlength="24" autocomplete="given-name" placeholder="${t('namePh')}" value="${esc(o.name)}">${nav(t('next'), 'obNext')}`;
  if (o.step === 2) return `${dots}<h1>${t('phoneQ')}</h1><p class="muted">${t('acctWhy')}</p>
    <label class="field" for="phone">${t('phone')}</label><input type="tel" id="phone" inputmode="numeric" autocomplete="tel" value="${esc(o.phone)}">
    <label class="field" for="pin">${t('pinQ')}</label><input type="password" id="pin" inputmode="numeric" maxlength="4" autocomplete="new-password" value="${esc(o.pin)}">${nav(t('next'), 'obNext')}`;
  if (o.step === 3) return `${dots}<h1>${t('skillsQ')}</h1><p class="muted">${t('pickSome')}</p>${chips(S.meta.skills, o.skills, 'obSkill')}${nav(t('next'), 'obNext', o.skills.length > 0)}`;
  return `${dots}<h1>${t('interestsQ')}</h1>${chips(S.meta.interests, o.interests, 'obInterest')}${nav(t('create'), 'obCreate', o.interests.length > 0)}`;
}

// ---------- card linking (used after sign-up and on the profile) ----------
function cardBlock() {
  const u = S.data.user;
  if (u.cardLinked) return `<div class="row"><span class="avatar" style="background:var(--good)">${ic('check')}</span>
    <div class="grow"><b>${t('linked')}</b><br><span class="small muted">${t('cardEnds')} ${esc(u.cardTail)}</span></div>
    <button class="btn quiet small" data-a="unlink">${t('replace')}</button></div>`;
  if (S.data.linking) return `<div class="card warn pulse"><b>${ic('card')} ${t('linking')}</b></div><button class="btn quiet" data-a="cancelLink">${t('cancel')}</button>`;
  return `<p class="muted">${t('notLinked')}</p><button class="btn" data-a="link">${ic('card')} ${t('linkCard')}</button>`;
}
function postCard() {
  const u = S.data.user;
  return `<div class="steps"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></div>
    <h1>${t('cardT')}</h1><p class="muted">${t('cardB')}</p><div class="card">${cardBlock()}</div>
    <button class="btn ${u.cardLinked ? '' : 'ghost'}" data-a="postNext">${u.cardLinked ? t('next') : t('later')}</button>`;
}
function postRole() {
  const r = myRole(), st = S.meta.story;
  return `${art('stall')}<p class="eyebrow center">${L(st.setting)}</p><h1 class="center">${L(st.title)}</h1><p class="center muted">${L(st.blurb)}</p>
    <div class="card center"><p class="eyebrow">${t('roleT')}</p><div style="display:grid;place-items:center;margin:8px 0">${roleAvatar(r, 'big')}</div>
      <h2>${L(r.name)}</h2><p><b>${L(r.title)}</b></p><p class="muted">${L(r.intro)}</p></div>
    <button class="btn" data-a="postNext">${t('roleGo')}</button>`;
}

// ---------- reader ----------
function reader() {
  const r = S.rd, st = S.meta.story, ro = myRole(), ch = ro.chapters[r.ch], n = ch.pages.length;
  const total = n + 4, at = r.stage === 'pages' ? r.i + 1 : r.stage === 'choice' ? n + 1 : r.stage === 'reply' ? n + 2 : r.stage === 'note' ? n + 3 : n + 4;
  const head = `<div class="bar"><button class="link" data-a="rdExit">${ic('left')} ${L(st.title)}</button><span>${chTitle(r.ch)} · ${L(ro.name)}</span></div>
    <div class="prog"><i style="width:${Math.round((at / total) * 100)}%"></i></div>`;
  const dock = (main, act, text, canBack = true) => `<div class="dock"><div>
    ${canBack ? `<button class="btn quiet sq" data-a="rdBack" aria-label="${t('back')}">${ic('left')}</button>` : ''}
    ${text ? `<button class="btn quiet sq" data-a="say" data-v="${esc(text)}" aria-label="${t('listen')}">${ic('volume')}</button>` : ''}
    <button class="btn" data-a="${act}">${main}</button></div></div>`;
  let body;
  if (r.stage === 'pages') {
    const txt = L(ch.pages[r.i]);
    body = `${r.i === 0 ? art(['stall', 'night', 'letter'][r.ch]) + `<p class="eyebrow">${chTitle(r.ch)}</p><h2>${L(st.chapterTitles[r.ch])}</h2>` : ''}
      <p class="prose">${esc(txt)}</p>${dock(t('next'), 'rdNext', txt)}`;
  } else if (r.stage === 'choice') {
    body = `<p class="eyebrow">${t('youChoose')}</p><h2>${L(ch.choice.q)}</h2>
      ${ch.choice.options.map((o, i) => `<button class="choice" data-a="rdChoose" data-v="${i}">${L(o.label)}</button>`).join('')}
      <div class="dock"><div><button class="btn quiet sq" data-a="rdBack" aria-label="${t('back')}">${ic('left')}</button>
      <button class="btn quiet" data-a="say" data-v="${esc(L(ch.choice.q))}">${ic('volume')} ${t('listen')}</button></div></div>`;
  } else if (r.stage === 'reply') {
    const txt = L(ch.choice.options[r.choice].reply);
    body = `<p class="eyebrow">${L(ch.choice.options[r.choice].label)}</p><p class="prose">${esc(txt)}</p>${dock(t('next'), 'rdNext', txt)}`;
  } else if (r.stage === 'note') {
    const txt = L(ch.note);
    body = `<p class="eyebrow">${t('noted')}</p><h2>${t('remember')}</h2><div class="card paper"><p class="note">${esc(txt)}</p><p class="small muted">${t('rememberB')}</p></div>
      ${r.ch === 2 ? `<div class="card soft"><p class="eyebrow">${t('cliff')}</p><p>${L(st.cliffhanger)}</p></div>` : ''}${dock(t('next'), 'rdNext', txt)}`;
  } else {
    const q = S.meta.reflections[r.ch];
    body = `<p class="eyebrow">${t('aboutYou')}</p><h2>${L(q.q)}</h2><p class="muted">${t('aboutYouB')}</p>
      <div class="chips inline">${q.chips.map((c) => `<button class="chip ${r.text === L(c) ? 'on' : ''}" data-a="rdChip" data-v="${esc(L(c))}">${L(c)}</button>`).join('')}</div>
      <label class="field" for="reflect">${t('typeHere')}</label><input type="text" id="reflect" maxlength="80" value="${esc(r.text)}">
      <div class="dock"><div><button class="btn quiet sq" data-a="rdBack" aria-label="${t('back')}">${ic('left')}</button>
      <button class="btn" data-a="rdFinish">${t('finish')}</button></div></div>`;
  }
  return `<div class="reader">${head}${body}</div>`;
}

// ---------- story tab ----------
function journey(phase, c) {
  const at = { read: 0, waiting: 1, meet: c.question ? 2 : 1, giveback: 3, complete: 4 }[phase];
  return `<ol class="journey">${['jRead', 'jMeet', 'jSolve', 'jGive'].map((k, i) =>
    `<li class="${i < at ? 'done' : i === at ? 'now' : ''}"><span class="dot">${i < at ? ic('check') : i + 1}</span>${t(k)}</li>`).join('')}</ol>`;
}
function notes() {
  const u = S.data.user, list = myRole().chapters.slice(0, u.chapter);
  if (!list.length) return '';
  return `<div class="card paper"><h3>${t('remember')}</h3><p class="small muted">${t('rememberB')}</p>${list.map((c) => `<p class="note">${L(c.note)}</p>`).join('')}</div>`;
}
function seats(members) {
  return `<div class="seats">${members.map((m) => {
    const r = role(m.roleIndex);
    return `<div class="seat ${m.present ? 'here' : ''}">${roleAvatar(r)}${m.you ? t('you') : L(r.title)}<br>${m.present ? t('arrived') : m.ready ? t('ready') : t('reading')}</div>`;
  }).join('')}</div>`;
}
function storyTab() {
  const { user, phase, circle } = S.data, st = S.meta.story, ro = myRole(), cafe = S.meta.cafe;
  if (phase === 'read') {
    return `<div class="card">${art('stall', 'bleed')}<p class="eyebrow">${L(st.setting)} · ${L(st.tagline)}</p><h1>${L(st.title)}</h1>
        <div class="row" style="margin:10px 0">${roleAvatar(ro)}<div><span class="small muted">${t('playing')}</span><br><b>${L(ro.name)}</b> · ${L(ro.title)}</div></div>
        <ol class="chapters">${st.chapterTitles.map((ct, i) => `<li class="${i < user.chapter ? 'done' : i === user.chapter ? 'now' : 'locked'}">
          <span class="num">${i < user.chapter ? ic('check') : i + 1}</span><span class="grow"><b>${L(ct)}</b><br><span class="small muted">${t('mins')}</span></span>
          <span class="tag ${i < user.chapter ? 'here' : ''}">${i < user.chapter ? t('doneTag') : i === user.chapter ? t('nowTag') : t('lockedTag')}</span></li>`).join('')}</ol>
        <button class="btn" data-a="read" data-v="${user.chapter}">${ic('book')} ${zh() ? `阅读第${user.chapter + 1}章` : `Read chapter ${user.chapter + 1}`}</button></div>${notes()}`;
  }
  const cardWarn = user.cardLinked ? '' : `<div class="card warn"><b>${ic('card')} ${t('cardWarn')}</b><button class="btn" data-a="goLink">${t('linkNow')}</button></div>`;
  if (phase === 'waiting') {
    return `<div class="card center"><h2>${t('waitT')}</h2><p class="muted">${t('waitB')}</p>
      <div class="seats">${[0, 1, 2, 3].map((i) => { const m = circle.members[i]; return m
        ? `<div class="seat here">${roleAvatar(role(m.roleIndex))}${m.you ? t('you') : L(role(m.roleIndex).title)}</div>`
        : `<div class="seat pulse"><span class="avatar hidden">?</span>…</div>`; }).join('')}</div>
      <p><b>${circle.count} / 4 ${t('found')}</b></p></div>${cardWarn}${notes()}`;
  }
  if (phase === 'meet') {
    if (circle.question) {
      const q = circle.question, others = circle.members.filter((m) => !m.you && m.name);
      return `<div class="question"><p class="eyebrow">${t('tableT')} · ${zh() ? `第${q.index + 1}题，共${q.total}题` : `Question ${q.index + 1} of ${q.total}`}</p>
          <h2>${L(q.q)}</h2><p>${t('tableB')}</p>
          <div class="opts">${['red', 'yellow', 'green'].map((k) => `<div class="opt ${k}"><i></i>${L(q.options[k])}</div>`).join('')}</div>
          ${q.hint ? `<p style="margin-top:12px"><b>${t('hint')}:</b> ${L(q.hint)}</p>` : ''}</div>
        ${notes()}
        <div class="card"><h3>${t('cards')}</h3><p class="small muted">${t('cardsB')}</p><ul class="people">${others.map((m) => `<li>${avatar(m.name, m.color)}
          <span class="grow"><b>${esc(m.name)}</b><br><span class="small">${S.meta.reflections.map((rf, i) => m.reflections?.[i] ? `${L(rf.label)}: <b>${esc(L(m.reflections[i]))}</b>` : '').filter(Boolean).join('<br>')}</span></span></li>`).join('')}</ul></div>`;
    }
    const youHere = circle.members.find((m) => m.you).present;
    const counts = Object.fromEntries(cafe.slots.map((s) => [s, circle.members.filter((m) => m.slot === s).length]));
    return `<div class="card">${art('cafe', 'bleed')}<h2>${t('meetT')}</h2><p class="muted">${t('meetB')}</p>${seats(circle.members)}
        <p class="center"><b>${circle.arrived} / 4 ${t('arrived')}</b></p></div>
      <div class="card"><ul class="todo">
        <li class="${user.cardLinked ? 'done' : ''}"><span class="box">${ic('check')}</span><span class="grow"><b>${t('todo1')}</b>${user.cardLinked ? '' : `<br><button class="link" data-a="goLink">${t('linkNow')}</button>`}</span></li>
        <li class="${user.slot ? 'done' : ''}"><span class="box">${ic('check')}</span><span class="grow"><b>${t('todo2')}</b>${user.slot ? `<br><span class="small muted">${esc(user.slot)}</span>` : ''}</span></li>
        <li class="${youHere ? 'done' : ''}"><span class="box">${ic('check')}</span><span class="grow"><b>${t('todo3')}</b></span></li></ul></div>
      <div class="card"><p class="eyebrow">${ic('pin')} ${t('offpeak')}</p><h2>${L(cafe.name)}</h2><p class="muted">${L(cafe.address)}</p>
        <p><b>${t('pickTime')}</b></p><div class="row">${cafe.slots.map((s) => `<button class="btn ${user.slot === s ? '' : 'quiet'}" data-a="slot" data-v="${s}" style="flex-direction:column;gap:0">
          ${s}<span class="small" style="font-weight:600">${'●'.repeat(counts[s]) || '&nbsp;'}</span></button>`).join('')}</div>
        <p class="small muted" style="margin-top:12px">${t('hostNote')}</p></div>${notes()}`;
  }
  // giveback or complete
  const e = circle.ending, ev = circle.event, done = phase === 'complete', goingList = circle.members.filter((m) => m.rsvp);
  const teach = user.reflections?.[2];
  return `<div class="card good center"><h2>${done ? t('doneT') : t('solvedT')}</h2>${done ? `<p>${t('doneB')}</p>` : ''}
      <p><b>${t('earned')} ${S.meta.points.story + (done ? S.meta.points.event : 0)} ${t('pts')}</b></p></div>
    <p class="eyebrow">${L(e.title)}</p><div class="letter">${esc(L(e.text))}</div>
    <div class="card ${done ? 'good' : ''}"><p class="eyebrow">${t('finalT')}</p><p>${L(e.finalChapter)}</p>
      ${teach && !done ? `<p class="note">${t('youSaid')}: <b>${esc(teach)}</b>. ${t('chance')}</p>` : ''}
      <h2>${L(ev.title)}</h2><p class="muted">${t('with')} ${L(ev.partner)}</p><p>${L(ev.detail)}</p>
      ${done ? `<p><b>${ic('check')} +${S.meta.points.event} ${t('pts')}</b></p>` : `
        <button class="btn ${user.rsvp ? 'on' : ''}" data-a="rsvp">${user.rsvp ? ic('check') + ' ' + t('goingYes') : t('going')}</button>
        <p class="small muted" style="margin-top:12px"><b>${t('whoGoing')}:</b> ${goingList.length ? goingList.map((m) => esc(m.name)).join(', ') : '—'}</p>
        <p class="small muted">${t('waitNgo')}</p>`}</div>
    <div class="card"><h3>${t('truth')}</h3>${e.answers.map((a) => `<div class="kv"><span>${L(a.q)}</span><b>${L(a.a)}</b></div>`).join('')}</div>
    ${done ? `<div class="card soft"><p class="eyebrow">${t('season2')}</p><h3>${t('season2B')}</h3></div>` : ''}`;
}

// ---------- circle tab ----------
function circleTab() {
  const { circle, phase } = S.data, open = phase === 'giveback' || phase === 'complete';
  if (!open) {
    return `<div class="card"><h2>${esc(circle.name)}</h2><p class="muted">${t('circleLock')}</p><ul class="people">${[0, 1, 2, 3].map((i) => {
      const m = circle.members[i];
      if (!m) return `<li><span class="avatar hidden">?</span><span class="grow muted">…</span></li>`;
      const r = role(m.roleIndex);
      return `<li>${roleAvatar(r)}<span class="grow"><b>${L(r.title)}</b>${m.you ? ` (${t('you')})` : ''}<br>
        <span class="small muted">${m.name && !m.you ? esc(m.name) : m.you ? L(r.name) : t('someone')}</span></span>
        <span class="tag ${m.present ? 'here' : ''}">${m.present ? t('arrived') : m.ready ? t('ready') : t('reading')}</span></li>`;
    }).join('')}</ul></div>`;
  }
  const me = S.data.user.id;
  return `<div class="card"><p class="eyebrow">${esc(circle.name)} · ${skillLabel(circle.skill)}</p><h2>${t('friendsT')}</h2><ul class="people">${circle.members.filter((m) => !m.you).map((m) => `<li>
      ${avatar(m.name, m.color)}<span class="grow"><b>${esc(m.name)}</b> <span class="small muted">${t('played')} ${L(role(m.roleIndex).name)}</span><br>
      <span class="small">${S.meta.reflections.map((rf, i) => m.reflections?.[i] ? `${L(rf.label)}: <b>${esc(L(m.reflections[i]))}</b>` : '').filter(Boolean).join('<br>')}</span></span></li>`).join('')}</ul></div>
    <div class="card"><h3>${t('chatT')}</h3><div class="chat">${circle.messages.map((m) => `<div class="msg ${m.userId === me ? 'me' : ''}">
      ${m.userId === me ? '' : `<b style="color:${m.color}">${esc(m.name)}</b>`}${esc(m.text)}</div>`).join('')}</div>
      <div class="chips inline">${['q1', 'q2', 'q3'].map((k) => `<button class="chip" data-a="quick" data-v="${t(k)}">${t(k)}</button>`).join('')}</div>
      <div class="row" style="margin-top:10px"><input type="text" id="chat" maxlength="200" placeholder="${t('chatPh')}" class="grow">
      <button class="btn small" data-a="sendChat" aria-label="${t('send')}" style="min-height:62px">${ic('send')}</button></div></div>`;
}

// ---------- rewards tab ----------
function rewardsTab() {
  const u = S.data.user, rw = (id) => S.meta.rewards.find((r) => r.id === id);
  const time = (ms) => new Date(ms).toLocaleDateString(zh() ? 'zh-CN' : 'en-GB', { day: 'numeric', month: 'short' });
  return `<div class="card center"><p class="eyebrow">${t('balance')}</p><h1 style="font-size:2.6rem">${u.points}</h1><p class="muted">${t('rewardsNote')}</p></div>
    ${u.vouchers.length ? `<div class="card good"><h3>${t('vouchers')}</h3>${u.vouchers.map((v) => `<div class="kv"><span>${rw(v.rewardId).icon} ${L(rw(v.rewardId))}<br><span class="small muted">${t('showCode')}</span></span><b style="font-family:monospace;font-size:1.1rem;white-space:nowrap">${v.code}</b></div>`).join('')}</div>` : ''}
    ${S.meta.rewards.map((r) => `<div class="card"><div class="row"><span style="font-size:2rem">${r.icon}</span><div class="grow"><b>${L(r)}</b><br><span class="small muted">${r.cost} ${t('pts')}</span></div></div>
      <button class="btn ${u.points >= r.cost ? '' : 'quiet'}" data-a="redeem" data-v="${r.id}" ${u.points >= r.cost ? '' : 'disabled'}>
      ${u.points >= r.cost ? `${t('use')} ${r.cost} ${t('pts')}` : `${t('need')} ${r.cost - u.points} ${t('more')}`}</button></div>`).join('')}
    <div class="card"><h3>${t('history')}</h3>${u.ledger.length ? [...u.ledger].reverse().map((l) => `<div class="kv"><span>${esc(l.label)}<br><span class="small muted">${time(l.at)}</span></span>
      <b style="color:${l.pts > 0 ? 'var(--good)' : 'var(--muted)'}">${l.pts > 0 ? '+' : ''}${l.pts}</b></div>`).join('') : `<p class="muted">${t('noHistory')}</p>`}</div>`;
}

// ---------- profile tab ----------
function profileTab() {
  const { user, circle, phase } = S.data, solved = phase === 'giveback' || phase === 'complete', done = phase === 'complete';
  const me = circle.members.find((m) => m.you);
  const badges = [['📖', 'b1', user.chapter >= 1], ['✍️', 'b2', user.chapter >= 3], ['💳', 'b6', user.cardLinked], ['🤝', 'b3', me.present || solved], ['🔎', 'b4', solved], ['🌱', 'b5', done]];
  const chipRow = (list, sel, act) => `<div class="chips inline">${list.map((x) => `<button class="chip ${sel.includes(x.id) ? 'on' : ''}" data-a="${act}" data-v="${x.id}">${x.icon} ${L(x)}</button>`).join('')}</div>`;
  return `<div class="card center"><div style="display:grid;place-items:center">${avatar(user.name, user.color, 'big')}</div>
      ${S.edit === 'name' ? `<input type="text" id="editName" maxlength="24" value="${esc(user.name)}" style="margin-top:12px"><button class="btn" data-a="saveName">${t('saveName')}</button>`
        : `<h1 style="margin-top:10px">${esc(user.name)}</h1><button class="link" data-a="editName">${t('edit')}</button>`}
      <p class="muted small">${user.phone ? '•••• ' + esc(user.phone.slice(-4)) : ''} · ${esc(circle.name)}</p>
      <div class="stats"><div><b>${user.chapter}</b><span>${t('stChap')}</span></div><div><b>${me.present || solved ? 1 : 0}</b><span>${t('stMeet')}</span></div>
        <div><b>${done ? 1 : 0}</b><span>${t('stHours')}</span></div><div><b>${user.points}</b><span>${t('stPts')}</span></div></div></div>
    <div class="card"><h3>${t('badges')}</h3><div class="badges">${badges.map(([e, k, on]) => `<div class="badge ${on ? '' : 'off'}"><span>${e}</span>${t(k)}</div>`).join('')}</div></div>
    <div class="card" id="cardbox"><h3>${t('myCard')}</h3>${cardBlock()}</div>
    <div class="card"><h3>${t('language')}</h3><div class="row"><button class="btn ${S.lang === 'en' ? '' : 'quiet'}" data-a="lang" data-v="en">English</button>
      <button class="btn ${zh() ? '' : 'quiet'}" data-a="lang" data-v="zh">中文</button></div>
      <h3 style="margin-top:18px">${t('textSize')}</h3><div class="row">${[['s', '.9rem'], ['m', '1.1rem'], ['l', '1.4rem']].map(([k, fs]) =>
        `<button class="btn ${user.textSize === k ? '' : 'quiet'}" data-a="size" data-v="${k}" style="font-size:${fs}">${zh() ? '字' : 'Aa'}</button>`).join('')}</div></div>
    <div class="card"><h3>${t('mySkills')}</h3>${chipRow(S.meta.skills, user.skills, 'setSkill')}<h3 style="margin-top:18px">${t('myInterests')}</h3>${chipRow(S.meta.interests, user.interests, 'setInterest')}</div>
    <p class="small muted center">${t('safe')}</p><button class="btn ghost" data-a="signOut">${t('signOut')}</button>`;
}

function render() {
  document.documentElement.lang = zh() ? 'zh' : 'en';
  const size = S.data?.user.textSize || 'm';
  document.documentElement.style.fontSize = { s: '18px', m: '20px', l: '23px' }[size];
  if (!S.meta) return;
  app.className = 'phone bare';
  if (!S.data) { app.innerHTML = S.auth === 'signin' ? signIn() : S.ob.step ? onboarding() : welcome(); return; }
  if (S.post) { app.innerHTML = S.post === 'card' ? postCard() : postRole(); return; }
  if (S.rd) { app.innerHTML = reader(); return; }
  app.className = 'phone';
  const u = S.data.user, c = S.data.circle;
  const tabs = [['story', 'book', t('story')], ['circle', 'users', t('circle')], ['rewards', 'gift', t('rewards')], ['profile', 'user', t('profile')]];
  const body = { story: storyTab, circle: circleTab, rewards: rewardsTab, profile: profileTab }[S.tab]();
  const dot = { circle: c.messages.length > (S.seen || 0) && S.tab !== 'circle', profile: !u.cardLinked };
  app.innerHTML = `<div class="top"><span class="hi">${t('hello')}, ${esc(u.name)}</span><span class="pill">${ic('star')} ${u.points}</span></div>
    ${S.tab === 'story' ? journey(S.data.phase, c) : ''}${body}
    <nav class="nav"><div>${tabs.map(([id, icon, label]) => `<button class="${S.tab === id ? 'on' : ''} ${dot[id] ? 'dotty' : ''}" data-a="tab" data-v="${id}">${ic(icon)}${label}</button>`).join('')}</div></nav>`;
  if (S.tab === 'circle') S.seen = c.messages.length;
}

// ---------- actions ----------
const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
const val = (id) => document.getElementById(id)?.value ?? '';
const post = async (path, body) => setData(await api(`/users/${S.uid}/${path}`, body || {}));
const A = {
  pickLang(v) { S.lang = v; localStorage.setItem('sh_lang', v); },
  obBegin() { S.ob.step = 1; S.err = ''; }, toSignIn() { S.auth = 'signin'; S.err = ''; }, toWelcome() { S.auth = 'welcome'; S.err = ''; },
  obBack() { S.ob.step--; S.err = ''; },
  obNext() {
    const o = S.ob; S.err = '';
    if (o.step === 1 && !o.name.trim()) { S.err = zh() ? '请输入您的名字' : 'Please enter your name'; return; }
    if (o.step === 2 && o.phone.replace(/\D/g, '').length < 8) { S.err = zh() ? '请输入至少8位数的电话号码' : 'Please enter a phone number with at least 8 digits'; return; }
    if (o.step === 2 && !/^\d{4}$/.test(o.pin)) { S.err = zh() ? '请设定4位数密码' : 'Please choose a 4-digit PIN'; return; }
    o.step++;
  },
  obSkill(v) { S.ob.skills = toggle(S.ob.skills, v); }, obInterest(v) { S.ob.interests = toggle(S.ob.interests, v); },
  async obCreate() {
    try { setData(await api('/users', { ...S.ob, lang: S.lang })); S.err = ''; S.post = 'card'; S.tab = 'story'; }
    catch (e) { S.err = e.message; if (/already/.test(e.message)) S.ob.step = 2; }
  },
  async doSignIn() {
    try { setData(await api('/login', { phone: S.ob.phone, pin: S.ob.pin })); S.err = ''; S.auth = 'welcome'; }
    catch (e) { S.err = e.message; }
  },
  async postNext() { if (S.post === 'card') { if (S.data.linking) await post('cancel-link'); S.post = 'role'; } else { S.post = null; A.read(0); } },
  tab(v) { S.tab = v; S.edit = null; },
  say(v) { say(v); },
  read(v) { hush(); S.rd = { ch: Number(v), i: 0, stage: 'pages', choice: null, text: '' }; },
  rdExit() { hush(); S.rd = null; },
  rdNext() {
    hush(); const r = S.rd, n = myRole().chapters[r.ch].pages.length;
    if (r.stage === 'pages') { if (r.i < n - 1) r.i++; else r.stage = 'choice'; }
    else if (r.stage === 'reply') r.stage = 'note';
    else if (r.stage === 'note') r.stage = 'reflect';
  },
  rdBack() {
    hush(); const r = S.rd;
    if (r.stage === 'pages') { if (r.i > 0) r.i--; else S.rd = null; }
    else if (r.stage === 'choice') r.stage = 'pages';
    else if (r.stage === 'reply') r.stage = 'choice';
    else if (r.stage === 'note') r.stage = 'reply';
    else r.stage = 'note';
  },
  rdChoose(v) { hush(); S.rd.choice = Number(v); S.rd.stage = 'reply'; },
  rdChip(v) { S.rd.text = v; },
  async rdFinish() {
    const r = S.rd; r.text = val('reflect').trim() || r.text;
    if (!r.text) { document.getElementById('reflect').focus(); return false; }
    await post('chapter', { chapter: r.ch, choice: r.choice, reflection: r.text });
    S.rd = null; S.tab = 'story';
  },
  slot(v) { return post('slot', { slot: v }); },
  rsvp() { return post('rsvp', { going: !S.data.user.rsvp }); },
  link() { return post('link-card'); }, cancelLink() { return post('cancel-link'); }, unlink() { return post('unlink-card'); },
  goLink() { S.tab = 'profile'; return post('link-card'); },
  redeem(v) { return post('redeem', { rewardId: v }); },
  quick(v) { return post('message', { text: v }); },
  sendChat() { const text = val('chat').trim(); return text ? post('message', { text }) : false; },
  lang(v) { return post('profile', { lang: v }); }, size(v) { return post('profile', { textSize: v }); },
  editName() { S.edit = 'name'; }, async saveName() { await post('profile', { name: val('editName') }); S.edit = null; },
  setSkill(v) { const next = toggle(S.data.user.skills, v); return next.length ? post('profile', { skills: next }) : false; },
  setInterest(v) { return post('profile', { interests: toggle(S.data.user.interests, v) }); },
  signOut() { hush(); localStorage.removeItem('sh_uid'); Object.assign(S, { uid: null, data: null, rd: null, post: null, tab: 'story', auth: 'welcome', err: '', ob: { step: 0, name: '', phone: '', pin: '', skills: [], interests: [] } }); },
};

app.addEventListener('click', async (ev) => {
  const el = ev.target.closest('[data-a]');
  if (!el || el.disabled) return;
  const a = el.dataset.a, keepScroll = ['say', 'rdChip', 'slot', 'rsvp', 'redeem', 'quick', 'sendChat', 'setSkill', 'setInterest', 'size', 'lang', 'link', 'cancelLink', 'unlink', 'obSkill', 'obInterest', 'pickLang', 'editName', 'saveName'];
  try {
    if ((await A[a](el.dataset.v)) === false) return;
    render();
    if (!keepScroll.includes(a)) window.scrollTo(0, 0);
    if (a === 'goLink') document.getElementById('cardbox')?.scrollIntoView({ block: 'center' });
  } catch (e) { S.err = e.message; alert(e.message); }
});
app.addEventListener('input', (ev) => {
  const id = ev.target.id, v = ev.target.value;
  if (id === 'name') S.ob.name = v; else if (id === 'phone') S.ob.phone = v; else if (id === 'pin') S.ob.pin = v; else if (id === 'reflect' && S.rd) S.rd.text = v;
});
app.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.target.id === 'chat') app.querySelector('[data-a=sendChat]').click(); });

// Keep every screen live: circle forming, arrivals, questions, chat, card linking.
setInterval(async () => {
  if (!S.uid || !S.data || S.rd || document.hidden) return;
  try {
    const d = await api(`/users/${S.uid}/state`);
    if (JSON.stringify(d) === JSON.stringify(S.data)) return;
    setData(d);
    const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) && document.activeElement.value;
    if (!typing) render();
  } catch { /* offline: try again next tick */ }
}, 2000);

(async function boot() {
  S.meta = await api('/meta');
  if (S.uid) { try { setData(await api(`/users/${S.uid}/state`)); } catch { S.uid = null; localStorage.removeItem('sh_uid'); } }
  render();
})();
