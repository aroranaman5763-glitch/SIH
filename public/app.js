// Story Hunt: the senior's app. Plain JavaScript, one clear action per screen.
// The story is read as a vertical comic and can be read aloud in the senior's own language or dialect.
const app = document.getElementById('app');
const S = {
  uid: localStorage.getItem('sh_uid'), lang: localStorage.getItem('sh_lang') || 'en',
  voice: localStorage.getItem('sh_voice'), rate: Number(localStorage.getItem('sh_rate')) || 0.95, sheet: false,
  tab: 'story', data: null, meta: null, rd: null, err: '', note: '',
  auth: 'welcome', ob: { step: 0, name: '', phone: '', pin: '', skills: [], interests: [] }, post: null, edit: null,
};

const LANG_ORDER = ['en', 'zh', 'ms', 'ta', 'hi'];
const LANG_NAMES = { en: 'English', zh: '中文', ms: 'Bahasa Melayu', ta: 'தமிழ்', hi: 'हिन्दी' };
const LOCALE = { en: 'en-SG', zh: 'zh-CN', ms: 'ms-MY', ta: 'ta-SG', hi: 'hi-IN' };

// Read-aloud voices. `text` is the language whose words are spoken. Dialects with no
// text-to-speech voice play volunteer recordings from public/audio/<id>/ when they exist.
const VOICES = [
  { id: 'en', label: 'English', short: 'English', text: 'en', tts: ['en-SG', 'en-IN', 'en-GB', 'en-US', 'en'] },
  { id: 'zh', label: '华语 · Mandarin', short: '华语', text: 'zh', tts: ['zh-SG', 'zh-CN', 'cmn', 'zh-TW', 'zh'] },
  { id: 'yue', label: '粵語 · Cantonese', short: '粵語', text: 'zh', tts: ['zh-HK', 'yue'] },
  { id: 'ms', label: 'Bahasa Melayu', short: 'Melayu', text: 'ms', tts: ['ms-MY', 'ms-SG', 'ms', 'id-ID'] },
  { id: 'ta', label: 'தமிழ் · Tamil', short: 'தமிழ்', text: 'ta', tts: ['ta-SG', 'ta-IN', 'ta'] },
  { id: 'hi', label: 'हिन्दी · Hindi', short: 'हिन्दी', text: 'hi', tts: ['hi-IN', 'hi'] },
  { id: 'hokkien', label: '福建话 · Hokkien', short: '福建话', text: 'zh', rec: true, fallback: 'zh' },
  { id: 'teochew', label: '潮州话 · Teochew', short: '潮州话', text: 'zh', rec: true, fallback: 'zh' },
];

const T = {
  en: {
    tagline: 'A story that only ends when four people meet.', start: 'Start', haveAcct: 'I already have an account', signIn: 'Sign in',
    nameQ: 'What should we call you?', namePh: 'Your first name', next: 'Next', back: 'Back', phoneQ: 'Your phone number', pinQ: 'Choose a 4-digit PIN',
    acctWhy: 'You will use these to sign in again. We never share your number.', pin: 'PIN', phone: 'Phone number',
    skillsQ: 'What are you good at?', pickSome: 'Choose one or more. We will find neighbours who share one.', interestsQ: 'What do you enjoy?', create: 'Create my account',
    errName: 'Please enter your name', errPhone: 'Please enter a phone number with at least 8 digits', errPin: 'Please choose a 4-digit PIN',
    cardT: 'Link your Story card', cardB: 'Your card is how the café knows you have arrived. Press the button, then tap your card on any Story Hunt device.',
    linkCard: 'Link my card', linking: 'Waiting for your card… tap it on the device now.', cancel: 'Cancel', later: 'I will do this later',
    linked: 'Card linked', cardEnds: 'Card ending', replace: 'Replace card', notLinked: 'No card linked yet',
    roleT: 'In this story, you are', roleGo: 'Begin', hello: 'Hello',
    jRead: 'Read', jMeet: 'Meet', jSolve: 'Solve', jGive: 'Give back',
    playing: 'You are playing', chN: 'Chapter {n}', readChN: 'Read chapter {n}', qN: 'Question {n} of {m}', mins: 'About 3 minutes', doneTag: 'Read', nowTag: 'Next', lockedTag: 'Locked',
    remember: 'What you remember', rememberB: 'These are yours alone. Bring them to the table.', listen: 'Listen', stop: 'Stop',
    youChoose: 'You decide', noted: 'You will remember this', aboutYou: 'Now, about you', aboutYouB: 'Your answer becomes a conversation card for your circle at the café.',
    typeHere: 'Or type your own', save: 'Save and continue', finish: 'Finish chapter', whatNext: 'What happens next?',
    chooseLang: 'Choose your language', coverBurst: '4 voices · 1 legend', issue: 'No. 1', free: 'Free',
    readListen: 'Read and listen', wordsIn: 'Words on screen', voiceIn: 'Read aloud in', speed: 'Speed', slow: 'Slow', normal: 'Normal', done: 'Done',
    onPhone: 'Ready on this phone', notOnPhone: 'Not on this phone yet', recorded: 'Volunteer recordings', natural: 'Natural voice ready', recSoon: 'Volunteer recordings coming',
    noVoice: "This phone has no voice for that language yet. You can add one in your phone's settings.",
    noRec: 'No recording for this page yet, so Mandarin is playing instead.', tapPanel: 'Tap any picture to hear it.', listenPage: 'Listen to this page',
    waitT: 'Finding the other three witnesses', waitB: 'We are matching you with three neighbours who each saw another side of this story.', found: 'found',
    meetT: 'Your circle is ready', meetB: 'Four witnesses, four different memories. Meet at the café and work out what really happened.',
    todo1: 'Link your Story card', todo2: 'Choose a time', todo3: 'Tap your card at the café', pickTime: 'When suits you?', offpeak: 'Quiet hours, 2 to 5 pm',
    whereMeet: 'Where you will meet', gettingThere: 'Getting there', findIt: 'When you arrive', directions: 'Get directions',
    arrived: 'Arrived', reading: 'Still reading', ready: 'Ready', you: 'You', hostNote: 'A Story Host will welcome your circle the first time.',
    tableT: 'At the table', tableB: 'Talk it through, then answer together on the device.', hint: 'Hint',
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
    cardWarn: 'Link your card before you go to the café.', linkNow: 'Link it now', season2: 'Next legend', season2B: 'Badang the Strongman · coming soon',
  },
  zh: {
    tagline: '一个要四个人见面才能读完的故事。', start: '开始', haveAcct: '我已经有账户', signIn: '登录',
    nameQ: '我们怎么称呼您？', namePh: '您的名字', next: '下一步', back: '返回', phoneQ: '您的电话号码', pinQ: '设定4位数密码',
    acctWhy: '下次登录时会用到。我们绝不会分享您的号码。', pin: '密码', phone: '电话号码',
    skillsQ: '您擅长什么？', pickSome: '可选一项或多项。我们会为您找到有相同本领的邻居。', interestsQ: '您喜欢做什么？', create: '建立我的账户',
    errName: '请输入您的名字', errPhone: '请输入至少8位数的电话号码', errPin: '请设定4位数密码',
    cardT: '绑定您的故事卡', cardB: '咖啡店靠这张卡知道您到了。按下按钮，然后在任何一台故事寻宝设备上轻触您的卡。',
    linkCard: '绑定我的卡', linking: '正在等待您的卡……请现在在设备上轻触。', cancel: '取消', later: '稍后再绑定',
    linked: '卡已绑定', cardEnds: '卡号尾数', replace: '更换卡', notLinked: '还没有绑定卡',
    roleT: '在这个故事里，您是', roleGo: '开始阅读', hello: '您好',
    jRead: '阅读', jMeet: '见面', jSolve: '解谜', jGive: '回馈',
    playing: '您扮演的是', chN: '第{n}章', readChN: '阅读第{n}章', qN: '第{n}题，共{m}题', mins: '大约3分钟', doneTag: '已读', nowTag: '下一章', lockedTag: '未开放',
    remember: '您记得的事', rememberB: '这些只有您知道。请带到见面的桌上。', listen: '朗读', stop: '停止',
    youChoose: '由您决定', noted: '您会记住这件事', aboutYou: '现在，说说您自己', aboutYouB: '您的回答会成为小组在咖啡店的聊天话题。',
    typeHere: '或者自己输入', save: '保存并继续', finish: '读完这一章', whatNext: '接下来呢？',
    chooseLang: '选择语言', coverBurst: '四个声音 · 一段传奇', issue: '第1期', free: '免费',
    readListen: '阅读与收听', wordsIn: '屏幕文字', voiceIn: '朗读语言', speed: '语速', slow: '慢', normal: '正常', done: '完成',
    onPhone: '本机可用', notOnPhone: '本机暂无', recorded: '义工录音', natural: '自然语音已就绪', recSoon: '义工录音即将推出',
    noVoice: '这部手机还没有这种语言的语音。您可以在手机设置里添加。', noRec: '这一页还没有录音，先用华语播放。',
    tapPanel: '点一下图片，就能听。', listenPage: '收听这一页',
    waitT: '正在寻找另外三位见证人', waitB: '我们正在为您配对三位邻居，他们各自看见了这个故事的另一面。', found: '已找到',
    meetT: '您的小组准备好了', meetB: '四位见证人，四段不同的记忆。到咖啡店见面，一起弄清当年的真相。',
    todo1: '绑定您的故事卡', todo2: '选择时间', todo3: '在咖啡店轻触您的卡', pickTime: '什么时间方便？', offpeak: '清静时段，下午2点到5点',
    whereMeet: '见面地点', gettingThere: '怎么去', findIt: '到了以后', directions: '查看路线',
    arrived: '已到', reading: '还在阅读', ready: '准备好了', you: '您', hostNote: '第一次见面时，会有一位故事主持人欢迎你们。',
    tableT: '在桌边', tableB: '大家讨论之后，一起在设备上作答。', hint: '提示',
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
    cardWarn: '去咖啡店之前，请先绑定您的卡。', linkNow: '现在绑定', season2: '下一个传奇', season2B: '大力士巴当 · 即将推出',
  },
  // Tamil, Hindi and Malay cover the reading and listening screens; anything missing falls back to English.
  ta: {
    tagline: 'நான்கு பேர் சந்தித்தால் மட்டுமே முடியும் ஒரு கதை.', start: 'தொடங்குங்கள்', haveAcct: 'எனக்கு ஏற்கெனவே கணக்கு உள்ளது', signIn: 'உள்நுழைக',
    nameQ: 'உங்களை எப்படி அழைக்கலாம்?', namePh: 'உங்கள் பெயர்', next: 'அடுத்து', back: 'பின்செல்', phoneQ: 'உங்கள் தொலைபேசி எண்', pinQ: '4 இலக்க PIN தேர்ந்தெடுங்கள்',
    acctWhy: 'மீண்டும் உள்நுழைய இவை தேவை. உங்கள் எண்ணை யாரிடமும் பகிர மாட்டோம்.', phone: 'தொலைபேசி எண்',
    skillsQ: 'நீங்கள் எதில் திறமையானவர்?', pickSome: 'ஒன்று அல்லது அதற்கு மேல் தேர்ந்தெடுங்கள். அதே திறமை உள்ள அயலவர்களைக் கண்டுபிடிப்போம்.', interestsQ: 'உங்களுக்கு எது பிடிக்கும்?', create: 'என் கணக்கை உருவாக்கு',
    cardT: 'உங்கள் கதை அட்டையை இணைக்கவும்', cardB: 'நீங்கள் வந்துவிட்டதை கஃபே இந்த அட்டை மூலம் அறியும். பொத்தானை அழுத்தி, எந்த ஸ்டோரி ஹன்ட் கருவியிலும் அட்டையைத் தொடுங்கள்.',
    linkCard: 'என் அட்டையை இணை', linking: 'உங்கள் அட்டைக்காகக் காத்திருக்கிறோம்… இப்போது கருவியில் தொடுங்கள்.', cancel: 'ரத்து', later: 'பிறகு செய்கிறேன்',
    roleT: 'இந்தக் கதையில் நீங்கள்', roleGo: 'தொடங்குவோம்', hello: 'வணக்கம்',
    jRead: 'படி', jMeet: 'சந்தி', jSolve: 'தீர்', jGive: 'திருப்பிக் கொடு',
    playing: 'நீங்கள் நடிப்பது', chN: 'அத்தியாயம் {n}', readChN: 'அத்தியாயம் {n} படியுங்கள்', qN: 'கேள்வி {n} / {m}', mins: 'சுமார் 3 நிமிடம்', doneTag: 'படித்தது', nowTag: 'அடுத்தது', lockedTag: 'பூட்டியது',
    remember: 'உங்களுக்கு நினைவிருப்பது', rememberB: 'இவை உங்களுக்கு மட்டுமே தெரியும். சந்திப்புக்குக் கொண்டு வாருங்கள்.', listen: 'கேளுங்கள்', stop: 'நிறுத்து',
    youChoose: 'நீங்களே முடிவு செய்யுங்கள்', noted: 'இது உங்கள் நினைவில் இருக்கும்', aboutYou: 'இப்போது, உங்களைப் பற்றி', aboutYouB: 'உங்கள் பதில் கஃபேயில் உங்கள் குழுவுக்கு ஒரு பேச்சு அட்டையாகும்.',
    typeHere: 'அல்லது நீங்களே எழுதுங்கள்', finish: 'அத்தியாயத்தை முடி', whatNext: 'அடுத்து என்ன?',
    chooseLang: 'உங்கள் மொழியைத் தேர்ந்தெடுங்கள்', coverBurst: '4 குரல்கள் · 1 புராணம்', issue: 'இதழ் 1', free: 'இலவசம்',
    readListen: 'படிக்க, கேட்க', wordsIn: 'திரையில் எழுத்து', voiceIn: 'சத்தமாகப் படிக்கும் மொழி', speed: 'வேகம்', slow: 'மெதுவாக', normal: 'சாதாரணம்', done: 'முடிந்தது',
    onPhone: 'இந்த போனில் உள்ளது', notOnPhone: 'இந்த போனில் இன்னும் இல்லை', recorded: 'தன்னார்வலர் பதிவுகள்', natural: 'இயல்பான குரல் தயார்', recSoon: 'தன்னார்வலர் பதிவுகள் விரைவில்',
    noVoice: 'இந்த போனில் அந்த மொழிக்கான குரல் இன்னும் இல்லை. போன் அமைப்புகளில் சேர்க்கலாம்.', noRec: 'இந்தப் பக்கத்துக்கு இன்னும் பதிவு இல்லை; அதனால் மாண்டரின் ஒலிக்கிறது.',
    tapPanel: 'எந்தப் படத்தையும் தொட்டால் கேட்கலாம்.', listenPage: 'பக்கத்தைக் கேளுங்கள்',
    whereMeet: 'சந்திக்கும் இடம்', gettingThere: 'எப்படிச் செல்வது', findIt: 'வந்து சேர்ந்ததும்', directions: 'வழி காட்டு', pickTime: 'எந்த நேரம் வசதி?', offpeak: 'அமைதியான நேரம், மதியம் 2 முதல் 5 வரை',
    story: 'கதை', circle: 'குழு', rewards: 'பரிசுகள்', profile: 'சுயவிவரம்', language: 'மொழி', textSize: 'எழுத்தின் அளவு',
    safe: 'ஸ்டோரி ஹன்ட் ஒருபோதும் பணமோ வங்கி விவரங்களோ கேட்காது.', signOut: 'வெளியேறு', cliff: 'தொடரும் — ஒன்றாக',
    season2: 'அடுத்த புராணம்', season2B: 'பலசாலி பாடாங் · விரைவில்',
  },
  hi: {
    tagline: 'एक कहानी जो तभी पूरी होती है जब चार लोग मिलते हैं।', start: 'शुरू करें', haveAcct: 'मेरा खाता पहले से है', signIn: 'साइन इन करें',
    nameQ: 'हम आपको क्या कहकर बुलाएँ?', namePh: 'आपका नाम', next: 'आगे', back: 'पीछे', phoneQ: 'आपका फ़ोन नंबर', pinQ: '4 अंकों का PIN चुनें',
    acctWhy: 'दोबारा साइन इन करने के लिए इनकी ज़रूरत होगी। हम आपका नंबर किसी को नहीं देते।', phone: 'फ़ोन नंबर',
    skillsQ: 'आप किस काम में माहिर हैं?', pickSome: 'एक या ज़्यादा चुनें। हम ऐसे पड़ोसी ढूँढेंगे जिनका हुनर आपसे मिलता हो।', interestsQ: 'आपको क्या पसंद है?', create: 'मेरा खाता बनाएँ',
    cardT: 'अपना स्टोरी कार्ड जोड़ें', cardB: 'इसी कार्ड से कैफ़े को पता चलता है कि आप आ गए हैं। बटन दबाएँ, फिर किसी भी स्टोरी हंट डिवाइस पर कार्ड छुआएँ।',
    linkCard: 'मेरा कार्ड जोड़ें', linking: 'आपके कार्ड का इंतज़ार है… अभी डिवाइस पर छुआएँ।', cancel: 'रद्द करें', later: 'बाद में करूँगा',
    roleT: 'इस कहानी में आप हैं', roleGo: 'शुरू करें', hello: 'नमस्ते',
    jRead: 'पढ़ें', jMeet: 'मिलें', jSolve: 'सुलझाएँ', jGive: 'लौटाएँ',
    playing: 'आपका किरदार', chN: 'अध्याय {n}', readChN: 'अध्याय {n} पढ़ें', qN: 'प्रश्न {n} / {m}', mins: 'लगभग 3 मिनट', doneTag: 'पढ़ा', nowTag: 'अगला', lockedTag: 'बंद',
    remember: 'आपको क्या याद है', rememberB: 'ये बातें सिर्फ़ आप जानते हैं। मुलाक़ात में साथ लाइए।', listen: 'सुनें', stop: 'रोकें',
    youChoose: 'आप तय करें', noted: 'यह आपको याद रहेगा', aboutYou: 'अब, आपके बारे में', aboutYouB: 'आपका जवाब कैफ़े में आपके समूह के लिए बातचीत का कार्ड बनेगा।',
    typeHere: 'या ख़ुद लिखें', finish: 'अध्याय पूरा करें', whatNext: 'आगे क्या होगा?',
    chooseLang: 'अपनी भाषा चुनें', coverBurst: '4 आवाज़ें · 1 किंवदंती', issue: 'अंक 1', free: 'मुफ़्त',
    readListen: 'पढ़ें और सुनें', wordsIn: 'स्क्रीन पर शब्द', voiceIn: 'ज़ोर से पढ़ने की भाषा', speed: 'गति', slow: 'धीमा', normal: 'सामान्य', done: 'हो गया',
    onPhone: 'इस फ़ोन पर उपलब्ध', notOnPhone: 'इस फ़ोन पर अभी नहीं', recorded: 'स्वयंसेवकों की रिकॉर्डिंग', natural: 'स्वाभाविक आवाज़ तैयार', recSoon: 'स्वयंसेवकों की रिकॉर्डिंग जल्द',
    noVoice: 'इस फ़ोन में अभी उस भाषा की आवाज़ नहीं है। आप फ़ोन की सेटिंग में जोड़ सकते हैं।', noRec: 'इस पन्ने की रिकॉर्डिंग अभी नहीं है, इसलिए मंदारिन में सुनाया जा रहा है।',
    tapPanel: 'किसी भी चित्र को छूकर सुनें।', listenPage: 'यह पन्ना सुनें',
    whereMeet: 'मिलने की जगह', gettingThere: 'कैसे पहुँचें', findIt: 'पहुँचने पर', directions: 'रास्ता देखें', pickTime: 'कौन-सा समय ठीक रहेगा?', offpeak: 'शांत समय, दोपहर 2 से 5 बजे',
    story: 'कहानी', circle: 'समूह', rewards: 'इनाम', profile: 'प्रोफ़ाइल', language: 'भाषा', textSize: 'अक्षरों का आकार',
    safe: 'स्टोरी हंट कभी पैसे या बैंक की जानकारी नहीं माँगता।', signOut: 'साइन आउट', cliff: 'आगे की कहानी — साथ मिलकर',
    season2: 'अगली किंवदंती', season2B: 'बलवान बादांग · जल्द आ रहा है',
  },
  ms: {
    tagline: 'Sebuah cerita yang hanya tamat apabila empat orang bertemu.', start: 'Mula', haveAcct: 'Saya sudah ada akaun', signIn: 'Log masuk',
    nameQ: 'Apa panggilan anda?', namePh: 'Nama anda', next: 'Seterusnya', back: 'Kembali', phoneQ: 'Nombor telefon anda', pinQ: 'Pilih PIN 4 digit',
    acctWhy: 'Anda perlukan ini untuk log masuk semula. Kami tidak akan berkongsi nombor anda.', phone: 'Nombor telefon',
    skillsQ: 'Apakah kepandaian anda?', pickSome: 'Pilih satu atau lebih. Kami akan cari jiran yang berkongsi kepandaian yang sama.', interestsQ: 'Apa yang anda suka?', create: 'Buat akaun saya',
    cardT: 'Pautkan Kad Cerita anda', cardB: 'Kad ini memberitahu kafe bahawa anda sudah tiba. Tekan butang, kemudian sentuh kad anda pada mana-mana peranti Story Hunt.',
    linkCard: 'Pautkan kad saya', linking: 'Menunggu kad anda… sentuh pada peranti sekarang.', cancel: 'Batal', later: 'Nanti sahaja',
    roleT: 'Dalam cerita ini, anda ialah', roleGo: 'Mula', hello: 'Salam',
    jRead: 'Baca', jMeet: 'Jumpa', jSolve: 'Selesai', jGive: 'Beri balik',
    playing: 'Watak anda', chN: 'Bab {n}', readChN: 'Baca bab {n}', qN: 'Soalan {n} daripada {m}', mins: 'Kira-kira 3 minit', doneTag: 'Dibaca', nowTag: 'Seterusnya', lockedTag: 'Berkunci',
    remember: 'Apa yang anda ingat', rememberB: 'Hanya anda yang tahu. Bawalah ke meja pertemuan.', listen: 'Dengar', stop: 'Henti',
    youChoose: 'Anda yang tentukan', noted: 'Anda akan ingat ini', aboutYou: 'Sekarang, tentang anda', aboutYouB: 'Jawapan anda menjadi kad perbualan untuk kumpulan anda di kafe.',
    typeHere: 'Atau taip sendiri', finish: 'Tamatkan bab', whatNext: 'Apa seterusnya?',
    chooseLang: 'Pilih bahasa anda', coverBurst: '4 suara · 1 lagenda', issue: 'Bil. 1', free: 'Percuma',
    readListen: 'Baca dan dengar', wordsIn: 'Tulisan di skrin', voiceIn: 'Dibacakan dalam', speed: 'Kelajuan', slow: 'Perlahan', normal: 'Biasa', done: 'Selesai',
    onPhone: 'Ada di telefon ini', notOnPhone: 'Belum ada di telefon ini', recorded: 'Rakaman sukarelawan', natural: 'Suara semula jadi sedia', recSoon: 'Rakaman sukarelawan akan datang',
    noVoice: 'Telefon ini belum ada suara untuk bahasa itu. Anda boleh menambahnya dalam tetapan telefon.', noRec: 'Belum ada rakaman untuk halaman ini, jadi bahasa Mandarin dimainkan.',
    tapPanel: 'Sentuh mana-mana gambar untuk mendengarnya.', listenPage: 'Dengar halaman ini',
    whereMeet: 'Tempat pertemuan', gettingThere: 'Cara ke sana', findIt: 'Bila anda tiba', directions: 'Dapatkan arah', pickTime: 'Bila masa yang sesuai?', offpeak: 'Waktu tenang, 2 hingga 5 petang',
    story: 'Cerita', circle: 'Kumpulan', rewards: 'Ganjaran', profile: 'Profil', language: 'Bahasa', textSize: 'Saiz tulisan',
    safe: 'Story Hunt tidak akan meminta wang atau butiran bank.', signOut: 'Log keluar', cliff: 'Bersambung — bersama-sama',
    season2: 'Lagenda seterusnya', season2B: 'Badang si Kuat · akan datang',
  },
};
const t = (k) => T[S.lang]?.[k] ?? T.en[k] ?? k;
const fmt = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k]);
const TX = (o, lang) => (o == null ? '' : typeof o === 'string' ? o : o[lang] ?? o.en);
const L = (o) => TX(o, S.lang);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ICONS = {
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  gift: '<path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  check: '<path d="M20 6L9 17l-5-5"/>', lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  card: '<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>',
  play: '<path d="M7 4l13 8-13 8z" fill="currentColor"/>', stop: '<rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor"/>',
  ear: '<path d="M6 8.5a6 6 0 1 1 12 0c0 6-6 5.5-6 10a3 3 0 0 1-6 0"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2 2.5-2 4"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  left: '<path d="M15 18l-6-6 6-6"/>', right: '<path d="M9 18l6-6-6-6"/>', x: '<path d="M18 6L6 18M6 6l12 12"/>',
  send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>',
};
const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
const scene = (n, label = '') => window.ART.scene(n, esc(label));

async function api(path, body) {
  const r = await fetch('/api' + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || r.statusText);
  return j;
}
function setData(d) {
  S.data = d; S.uid = d.user.id; S.lang = d.user.lang;
  localStorage.setItem('sh_uid', S.uid); localStorage.setItem('sh_lang', S.lang);
}
const role = (i) => S.meta.story.roles[i];
const myRole = () => role(S.data.user.roleIndex);
const initial = (name) => {
  const n = String(name || '?').trim();
  if (/[㐀-鿿]/.test(n)) return n.slice(-1);
  if (/[^\x00-\x7f]/.test(n)) return Array.from(n)[0];
  return (n.split(' ').pop() || '?')[0].toUpperCase();
};
const avatar = (name, color, cls = '') => `<span class="avatar ${cls}" style="--c:${color}">${esc(initial(name))}</span>`;
const roleAvatar = (r, cls = '') => avatar(L(r.name), r.color, cls);
const skillLabel = (id) => L(S.meta.skills.find((s) => s.id === id) || id);

// ---------- read aloud ----------
const AU = { on: false, i: -1, tok: 0, el: null, warned: {} };
const synth = () => ('speechSynthesis' in window ? window.speechSynthesis : null);
const voiceDef = () => VOICES.find((v) => v.id === S.voice) || VOICES.find((v) => v.id === S.lang) || VOICES[0];
function sysVoice(v) {
  const list = synth()?.getVoices() || [];
  for (const tag of v.tts || []) {
    const m = list.find((x) => x.lang.replace('_', '-').toLowerCase().startsWith(tag.toLowerCase()));
    if (m) return m;
  }
  return null;
}
function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.append(el); }
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 5000);
}
function paintAudio() {
  document.querySelectorAll('.panel[id^=pn]').forEach((el) => el.classList.toggle('on', AU.on && el.id === 'pn' + AU.i));
  document.querySelectorAll('[data-listen]').forEach((el) => {
    el.innerHTML = `${ic(AU.on ? 'stop' : 'play')} ${AU.on ? t('stop') : t(el.dataset.listen)}`;
    el.classList.toggle('playing', AU.on);
  });
}
function stopAudio() {
  AU.tok++; AU.on = false; AU.i = -1;
  synth()?.cancel();
  if (AU.el) { AU.el.pause(); AU.el = null; }
  paintAudio();
}
function tts(v, text, done) {
  const sy = synth();
  if (!sy) { toast(t('noVoice')); done(); return; }
  const u = new SpeechSynthesisUtterance(text), m = sysVoice(v), tok = AU.tok;
  if (!m && !AU.warned[v.id]) { AU.warned[v.id] = 1; toast(t('noVoice')); }
  if (m) u.voice = m;
  u.lang = m ? m.lang : v.tts[0]; u.rate = S.rate;
  u.onend = () => { if (tok === AU.tok) done(); };
  u.onerror = () => { if (tok === AU.tok) done(); };
  sy.speak(u);
}
// Natural voices: public/audio/manifest.json lists the clips made by scripts/make-audio.js
// (Azure neural voices) or recorded by volunteers. A clip that exists is played as a file;
// otherwise the phone's own voice reads the text.
const hasClip = (voiceId, clip) => !!(clip && S.audio?.[voiceId]?.[clip]);
const hasNatural = (voiceId) => !!S.audio?.[voiceId] && Object.keys(S.audio[voiceId]).length > 0;
// Speak one piece of text in the chosen voice. `textFor(lang)` returns the words in that language;
// `clip` names the matching audio file, for example "muthu-1-3".
function speak(textFor, clip, done) {
  const v = voiceDef(), tok = AU.tok;
  const fb = v.rec ? VOICES.find((x) => x.id === v.fallback) : v;
  let fellBack = false;
  const fallback = () => {
    if (fellBack || tok !== AU.tok) return;
    fellBack = true;
    if (v.rec && !AU.warned.rec) { AU.warned.rec = 1; toast(t('noRec')); }
    if (hasClip(fb.id, clip) && fb !== v) playFile(fb.id, clip, tok, done, () => tts(fb, textFor(fb.text), done));
    else tts(fb, textFor(fb.text), done);
  };
  if (hasClip(v.id, clip)) playFile(v.id, clip, tok, done, fallback);
  else fallback();
}
function playFile(voiceId, clip, tok, done, onFail) {
  const a = new Audio(`audio/${voiceId}/${clip}.mp3`);
  let failed = false;
  const fail = () => { if (!failed && tok === AU.tok) { failed = true; onFail(); } };
  AU.el = a; a.playbackRate = S.rate < 0.9 ? 0.85 : 1;
  a.onended = () => { if (tok === AU.tok) done(); };
  a.onerror = fail;
  a.play().catch(fail);
}
const panelText = (p, lang) => [TX(p.cap, lang), p.say ? `${TX(role(p.say[0]).name, lang)}: ${TX(p.say[1], lang)}` : ''].filter(Boolean).join(' ');
function playPanel(i, chain) {
  const ro = myRole(), p = ro.chapters[S.rd.ch].panels[i];
  if (!p) { stopAudio(); return; }
  AU.on = true; AU.i = i; paintAudio();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('pn' + i)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  speak((lang) => panelText(p, lang), `${ro.id}-${S.rd.ch + 1}-${i + 1}`,
    () => (chain ? playPanel(i + 1, true) : stopAudio()));
}
// Audio file names for the screens after the comic page (kept in step with scripts/make-audio.js).
function stageClip() {
  const r = S.rd, base = `${myRole().id}-${r.ch + 1}`;
  return { choice: `${base}-choice`, reply: `${base}-reply${r.choice + 1}`, note: `${base}-note`, reflect: `reflect-${r.ch + 1}` }[r.stage];
}
function stageText(lang) {
  const r = S.rd, ch = myRole().chapters[r.ch];
  if (r.stage === 'choice') return [TX(ch.choice.q, lang), ...ch.choice.options.map((o, i) => `${'AB'[i]}. ${TX(o.label, lang)}`)].join(' ');
  if (r.stage === 'reply') return `${TX(ch.choice.options[r.choice].label, lang)}. ${TX(ch.choice.options[r.choice].reply, lang)}`;
  if (r.stage === 'note') return [TX(ch.note, lang), r.ch === 2 ? TX(S.meta.story.cliffhanger, lang) : ''].join(' ');
  const q = S.meta.reflections[r.ch];
  return [TX(q.q, lang), ...q.chips.map((c) => TX(c, lang))].join('. ');
}

// The "Read and listen" sheet: words on screen, voice (including dialects) and speed.
function sheet() {
  const cur = voiceDef();
  const row = (v) => {
    const nat = hasNatural(v.id), ok = !v.rec && !!sysVoice(v);
    const [cls, label] = nat ? ['nat', v.rec ? t('recorded') : t('natural')] : v.rec ? ['rec', t('recSoon')] : ok ? ['ok', t('onPhone')] : ['no', t('notOnPhone')];
    return `<button class="vrow ${cur.id === v.id ? 'on' : ''}" data-a="pickVoice" data-v="${v.id}" aria-pressed="${cur.id === v.id}">
      <span class="grow"><b>${esc(v.label)}</b><br><span class="vtag ${cls}">${nat ? '★ ' : ''}${label}</span></span>
      <span class="tick">${cur.id === v.id ? ic('check') : ''}</span></button>`;
  };
  return `<div class="scrim" data-a="closeSheet"></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetT">
      <div class="sheet-head"><h2 id="sheetT" tabindex="-1">${ic('ear')} ${t('readListen')}</h2>
        <button class="btn quiet sq" data-a="closeSheet" aria-label="${t('done')}">${ic('x')}</button></div>
      <h3>${t('wordsIn')}</h3>
      <div class="langs">${LANG_ORDER.map((l) => `<button class="chip ${S.lang === l ? 'on' : ''}" data-a="readLang" data-v="${l}" lang="${l}" aria-pressed="${S.lang === l}">${LANG_NAMES[l]}</button>`).join('')}</div>
      <h3>${t('voiceIn')}</h3><div class="vlist">${VOICES.map(row).join('')}</div>
      <h3>${t('speed')}</h3><div class="row">${[[0.75, 'slow'], [0.95, 'normal']].map(([r, k]) =>
        `<button class="btn ${S.rate === r ? '' : 'quiet'}" data-a="rate" data-v="${r}" aria-pressed="${S.rate === r}">${t(k)}</button>`).join('')}</div>
      <button class="btn" data-a="closeSheet">${t('done')}</button>
    </div>`;
}
const voiceChip = () => `<button class="voice-chip" data-a="sheet" aria-label="${t('readListen')}">${ic('ear')} ${esc(voiceDef().short)}</button>`;

// ---------- signed-out screens ----------
function welcome() {
  return `<div class="cover">
      <div class="cover-top"><span>${t('issue')}</span><span class="price">${t('free')}</span></div>
      <h1 class="masthead">Story Hunt</h1>
      <p class="cover-sub">故事寻宝 · Buru Cerita · கதை வேட்டை · कहानी की खोज</p>
      <div class="cover-art">${scene('beast')}<span class="burst">${t('coverBurst')}</span></div>
      <p class="cover-tag">${t('tagline')}</p>
    </div>
    <h2 class="center">${t('chooseLang')}</h2>
    <div class="langs big">${LANG_ORDER.map((l) => `<button class="chip ${S.lang === l ? 'on' : ''}" data-a="pickLang" data-v="${l}" lang="${l}" aria-pressed="${S.lang === l}">${LANG_NAMES[l]}</button>`).join('')}</div>
    <button class="btn" data-a="obBegin">${t('start')}</button>
    <button class="btn ghost" data-a="toSignIn">${t('haveAcct')}</button>
    <p class="small muted center" style="margin-top:14px">${t('safe')}</p>`;
}
function signIn() {
  return `<button class="link" data-a="toWelcome">${ic('left')} ${t('back')}</button><h1>${t('signIn')}</h1>
    <label class="field" for="phone">${t('phone')}</label><input type="tel" id="phone" inputmode="numeric" autocomplete="tel" value="${esc(S.ob.phone)}">
    <label class="field" for="pin">${t('pin')}</label><input type="password" id="pin" inputmode="numeric" maxlength="4" autocomplete="current-password" value="${esc(S.ob.pin)}">
    ${S.err ? `<div class="error" role="alert">${esc(S.err)}</div>` : ''}<button class="btn" data-a="doSignIn">${t('signIn')}</button>`;
}
function onboarding() {
  const o = S.ob;
  const dots = `<div class="steps" aria-hidden="true">${[1, 2, 3, 4].map((i) => `<i class="${i <= o.step ? 'on' : ''}"></i>`).join('')}</div>`;
  const chips = (list, sel, act) => `<div class="chips">${list.map((x) =>
    `<button class="chip ${sel.includes(x.id) ? 'on' : ''}" data-a="${act}" data-v="${x.id}" aria-pressed="${sel.includes(x.id)}"><span class="ico">${x.icon}</span>${L(x)}</button>`).join('')}</div>`;
  const nav = (label, act, ok = true) => `${S.err ? `<div class="error" role="alert">${esc(S.err)}</div>` : ''}
    <button class="btn" data-a="${act}" ${ok ? '' : 'disabled'}>${label}</button><button class="btn ghost" data-a="obBack">${t('back')}</button>`;
  if (o.step === 1) return `${dots}<h1>${t('nameQ')}</h1>
    <input type="text" id="name" maxlength="24" autocomplete="given-name" placeholder="${t('namePh')}" aria-label="${t('namePh')}" value="${esc(o.name)}">${nav(t('next'), 'obNext')}`;
  if (o.step === 2) return `${dots}<h1>${t('phoneQ')}</h1><p class="muted">${t('acctWhy')}</p>
    <label class="field" for="phone">${t('phone')}</label><input type="tel" id="phone" inputmode="numeric" autocomplete="tel" value="${esc(o.phone)}">
    <label class="field" for="pin">${t('pinQ')}</label><input type="password" id="pin" inputmode="numeric" maxlength="4" autocomplete="new-password" value="${esc(o.pin)}">${nav(t('next'), 'obNext')}`;
  if (o.step === 3) return `${dots}<h1>${t('skillsQ')}</h1><p class="muted">${t('pickSome')}</p>${chips(S.meta.skills, o.skills, 'obSkill')}${nav(t('next'), 'obNext', o.skills.length > 0)}`;
  return `${dots}<h1>${t('interestsQ')}</h1>${chips(S.meta.interests, o.interests, 'obInterest')}${nav(t('create'), 'obCreate', o.interests.length > 0)}`;
}

// ---------- card linking (used after sign-up and on the profile) ----------
function cardBlock() {
  const u = S.data.user;
  if (u.cardLinked) return `<div class="row"><span class="avatar" style="--c:var(--good)">${ic('check')}</span>
    <div class="grow"><b>${t('linked')}</b><br><span class="small muted">${t('cardEnds')} ${esc(u.cardTail)}</span></div>
    <button class="btn quiet small" data-a="unlink">${t('replace')}</button></div>`;
  if (S.data.linking) return `<div class="card warn pulse"><b>${ic('card')} ${t('linking')}</b></div><button class="btn quiet" data-a="cancelLink">${t('cancel')}</button>`;
  return `<p class="muted">${t('notLinked')}</p><button class="btn" data-a="link">${ic('card')} ${t('linkCard')}</button>`;
}
function postCard() {
  const u = S.data.user;
  return `<div class="steps" aria-hidden="true"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></div>
    <h1>${t('cardT')}</h1><p class="muted">${t('cardB')}</p><div class="card">${cardBlock()}</div>
    <button class="btn ${u.cardLinked ? '' : 'ghost'}" data-a="postNext">${u.cardLinked ? t('next') : t('later')}</button>`;
}
function postRole() {
  const r = myRole(), st = S.meta.story;
  return `<p class="eyebrow center">${L(st.setting)}</p><h1 class="center">${L(st.title)}</h1><p class="center muted">${L(st.blurb)}</p>
    <div class="rolecard" style="--c:${r.color}">
      <div class="rc-top"><span>${t('roleT')}</span><span class="rc-no">${S.data.user.roleIndex + 1} / 4</span></div>
      <div class="rc-art">${scene(r.portrait, L(r.title))}</div>
      <h2>${L(r.name)}</h2><p class="rc-title">${L(r.title)}</p><p>${L(r.intro)}</p>
    </div>
    <button class="btn" data-a="postNext">${t('roleGo')}</button>`;
}

// ---------- reader: a vertical comic page per chapter ----------
function panelHTML(p, i) {
  const who = p.say ? role(p.say[0]) : null;
  return `<figure class="panel t${i % 3}" id="pn${i}" data-a="sayPanel" data-v="${i}" role="button" tabindex="0" aria-label="${t('listen')}: ${esc(L(p.cap))}">
      <figcaption class="cap">${esc(L(p.cap))}</figcaption>
      <div class="art">${scene(p.scene)}</div>
      ${who ? `<div class="bubble ${i % 2 ? 'left' : 'right'}"><b style="color:${who.color}">${esc(L(who.name))}</b>${esc(L(p.say[1]))}</div>` : ''}
    </figure>`;
}
function reader() {
  const r = S.rd, st = S.meta.story, ro = myRole(), ch = ro.chapters[r.ch];
  const stages = ['pages', 'choice', 'reply', 'note', 'reflect'], at = stages.indexOf(r.stage) + 1;
  const head = `<header class="rd-bar"><button class="link" data-a="rdExit">${ic('left')} ${t('story')}</button>${voiceChip()}</header>
    <div class="prog" aria-hidden="true">${stages.map((_, i) => `<i class="${i < at ? 'on' : ''}"></i>`).join('')}</div>`;
  const listenBtn = (act, key) => `<button class="btn gold" data-a="${act}" data-listen="${key}">${ic(AU.on ? 'stop' : 'play')} ${AU.on ? t('stop') : t(key)}</button>`;
  const dock = (inner) => `<div class="dock"><div><button class="btn quiet sq" data-a="rdBack" aria-label="${t('back')}">${ic('left')}</button>${inner}</div></div>`;
  const nextBtn = `<button class="btn sq" data-a="rdNext" aria-label="${t('next')}">${ic('right')}</button>`;
  let body;
  if (r.stage === 'pages') {
    const folio = 140 + S.data.user.roleIndex * 12 + r.ch * 4;
    body = `<section class="page">
        <div class="splash" style="--c:${ro.color}"><span class="ch">${fmt(t('chN'), { n: r.ch + 1 })}</span><h1>${L(st.chapterTitles[r.ch])}</h1>
          <span class="who">${L(ro.name)} · ${L(ro.title)}</span></div>
        <p class="tip">${ic('ear')} ${t('tapPanel')}</p>
        ${ch.panels.map(panelHTML).join('')}
        <p class="tbc">${t('whatNext')}</p><span class="folio">${folio}</span>
      </section>${dock(listenBtn('listenAll', 'listenPage') + nextBtn)}`;
  } else if (r.stage === 'choice') {
    body = `<section class="page"><div class="panel decide"><p class="eyebrow">${t('youChoose')}</p><h2>${L(ch.choice.q)}</h2></div>
        ${ch.choice.options.map((o, i) => `<button class="choice" data-a="rdChoose" data-v="${i}"><span class="key">${'AB'[i]}</span><span>${L(o.label)}</span></button>`).join('')}
      </section>${dock(listenBtn('sayStage', 'listen'))}`;
  } else if (r.stage === 'reply') {
    const o = ch.choice.options[r.choice];
    body = `<section class="page"><div class="panel plain"><p class="eyebrow">${L(o.label)}</p><p class="prose">${esc(L(o.reply))}</p></div></section>
      ${dock(listenBtn('sayStage', 'listen') + nextBtn)}`;
  } else if (r.stage === 'note') {
    body = `<section class="page"><p class="eyebrow">${t('noted')}</p><h2>${t('remember')}</h2>
        <div class="scrap"><p class="note">${esc(L(ch.note))}</p><p class="small muted">${t('rememberB')}</p></div>
        ${r.ch === 2 ? `<div class="panel plain dark"><p class="eyebrow">${t('cliff')}</p><p>${L(st.cliffhanger)}</p></div>` : ''}
      </section>${dock(listenBtn('sayStage', 'listen') + nextBtn)}`;
  } else {
    const q = S.meta.reflections[r.ch];
    body = `<section class="page"><p class="eyebrow">${t('aboutYou')}</p><h2>${L(q.q)}</h2><p class="muted">${t('aboutYouB')}</p>
        <div class="chips inline">${q.chips.map((c) => `<button class="chip ${r.text === L(c) ? 'on' : ''}" data-a="rdChip" data-v="${esc(L(c))}">${L(c)}</button>`).join('')}</div>
        <label class="field" for="reflect">${t('typeHere')}</label><input type="text" id="reflect" maxlength="80" value="${esc(r.text)}">
      </section>${dock(listenBtn('sayStage', 'listen') + `<button class="btn" data-a="rdFinish">${t('finish')}</button>`)}`;
  }
  return `<div class="reader">${head}${body}</div>`;
}

// ---------- story tab ----------
function journey(phase, c) {
  const at = { read: 0, waiting: 1, meet: c.question ? 2 : 1, giveback: 3, complete: 4 }[phase];
  return `<ol class="journey">${['jRead', 'jMeet', 'jSolve', 'jGive'].map((k, i) =>
    `<li class="${i < at ? 'done' : i === at ? 'now' : ''}" ${i === at ? 'aria-current="step"' : ''}><span class="dot">${i < at ? ic('check') : i + 1}</span>${t(k)}</li>`).join('')}</ol>`;
}
function notes() {
  const u = S.data.user, list = myRole().chapters.slice(0, u.chapter);
  if (!list.length) return '';
  return `<div class="scrap"><h3>${t('remember')}</h3><p class="small muted">${t('rememberB')}</p>${list.map((c) => `<p class="note">${L(c.note)}</p>`).join('')}</div>`;
}
function seats(members) {
  return `<div class="seats">${members.map((m) => {
    const r = role(m.roleIndex);
    return `<div class="seat ${m.present ? 'here' : ''}">${roleAvatar(r)}${m.you ? t('you') : L(r.title)}<br>${m.present ? t('arrived') : m.ready ? t('ready') : t('reading')}</div>`;
  }).join('')}</div>`;
}
// Where the circle meets. `full` adds the map, how to get there and what to look for.
function meetPlace(full) {
  const c = S.meta.cafe, maps = `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`;
  return `<div class="card place">${full ? `<div class="bleed map">${scene('map', L(c.name))}</div>` : ''}
      <p class="eyebrow">${ic('pin')} ${t('whereMeet')}</p>
      <h2>${L(c.name)}</h2><p class="muted">${L(c.address)}</p>
      ${full ? `<h3>${t('gettingThere')}</h3><ul class="dirs">
          <li><span class="mk pin">1</span><span>${L(c.name)}</span></li>
          ${c.directions.map((d) => `<li><span class="mk">${d.mark || d.icon}</span><span>${d.mark ? d.icon + ' ' : ''}${L(d)}</span></li>`).join('')}</ul>
        <h3>${t('findIt')}</h3><p>${L(c.find)}</p>` : ''}
      <p class="legend-note">${L(c.legend)}</p>
      <a class="btn quiet" href="${maps}" target="_blank" rel="noopener">${ic('pin')} ${t('directions')}</a></div>`;
}
function storyTab() {
  const { user, phase, circle } = S.data, st = S.meta.story, ro = myRole(), cafe = S.meta.cafe;
  if (phase === 'read') {
    return `<div class="card issue"><div class="issue-art">${scene('beast')}<span class="issue-no">${t('issue')}</span></div>
        <p class="eyebrow">${L(st.setting)} · ${L(st.tagline)}</p><h1>${L(st.title)}</h1>
        <div class="row" style="margin:10px 0">${roleAvatar(ro)}<div><span class="small muted">${t('playing')}</span><br><b>${L(ro.name)}</b> · ${L(ro.title)}</div></div>
        <ol class="chapters">${st.chapterTitles.map((ct, i) => `<li class="${i < user.chapter ? 'done' : i === user.chapter ? 'now' : 'locked'}">
          <span class="thumb">${scene(ro.chapters[i].panels[0].scene)}</span>
          <span class="grow"><span class="small muted">${fmt(t('chN'), { n: i + 1 })} · ${t('mins')}</span><br><b>${L(ct)}</b></span>
          <span class="tag ${i < user.chapter ? 'here' : ''}">${i < user.chapter ? t('doneTag') : i === user.chapter ? t('nowTag') : t('lockedTag')}</span></li>`).join('')}</ol>
        <button class="btn" data-a="read" data-v="${user.chapter}">${ic('book')} ${fmt(t('readChN'), { n: user.chapter + 1 })}</button></div>${notes()}${meetPlace(false)}`;
  }
  const cardWarn = user.cardLinked ? '' : `<div class="card warn"><b>${ic('card')} ${t('cardWarn')}</b><button class="btn" data-a="goLink">${t('linkNow')}</button></div>`;
  if (phase === 'waiting') {
    return `<div class="card center"><h2>${t('waitT')}</h2><p class="muted">${t('waitB')}</p>
      <div class="seats">${[0, 1, 2, 3].map((i) => { const m = circle.members[i]; return m
        ? `<div class="seat here">${roleAvatar(role(m.roleIndex))}${m.you ? t('you') : L(role(m.roleIndex).title)}</div>`
        : `<div class="seat pulse"><span class="avatar hidden">?</span>…</div>`; }).join('')}</div>
      <p><b>${circle.count} / 4 ${t('found')}</b></p></div>${cardWarn}${meetPlace(false)}${notes()}`;
  }
  if (phase === 'meet') {
    if (circle.question) {
      const q = circle.question, others = circle.members.filter((m) => !m.you && m.name);
      return `<div class="question"><p class="eyebrow">${t('tableT')} · ${fmt(t('qN'), { n: q.index + 1, m: q.total })}</p>
          <h2>${L(q.q)}</h2><p>${t('tableB')}</p>
          <div class="opts">${['red', 'yellow', 'green'].map((k) => `<div class="opt ${k}"><i></i>${L(q.options[k])}</div>`).join('')}</div>
          ${q.hint ? `<p style="margin-top:12px"><b>${t('hint')}:</b> ${L(q.hint)}</p>` : ''}</div>
        ${notes()}
        <div class="card"><h3>${t('cards')}</h3><p class="small muted">${t('cardsB')}</p><ul class="people">${others.map((m) => `<li>${avatar(m.name, m.color)}
          <span class="grow"><b>${esc(m.name)}</b><br><span class="small">${S.meta.reflections.map((rf, i) => m.reflections?.[i] ? `${L(rf.label)}: <b>${esc(L(m.reflections[i]))}</b>` : '').filter(Boolean).join('<br>')}</span></span></li>`).join('')}</ul></div>`;
    }
    const youHere = circle.members.find((m) => m.you).present;
    const counts = Object.fromEntries(cafe.slots.map((s) => [s, circle.members.filter((m) => m.slot === s).length]));
    return `<div class="card"><div class="bleed">${scene('cafe')}</div><h2>${t('meetT')}</h2><p class="muted">${t('meetB')}</p>${seats(circle.members)}
        <p class="center"><b>${circle.arrived} / 4 ${t('arrived')}</b></p></div>
      <div class="card"><ul class="todo">
        <li class="${user.cardLinked ? 'done' : ''}"><span class="box">${ic('check')}</span><span class="grow"><b>${t('todo1')}</b>${user.cardLinked ? '' : `<br><button class="link" data-a="goLink">${t('linkNow')}</button>`}</span></li>
        <li class="${user.slot ? 'done' : ''}"><span class="box">${ic('check')}</span><span class="grow"><b>${t('todo2')}</b>${user.slot ? `<br><span class="small muted">${esc(user.slot)}</span>` : ''}</span></li>
        <li class="${youHere ? 'done' : ''}"><span class="box">${ic('check')}</span><span class="grow"><b>${t('todo3')}</b></span></li></ul></div>
      ${meetPlace(true)}
      <div class="card"><p class="eyebrow">${t('offpeak')}</p><h2>${t('pickTime')}</h2><div class="row">${cafe.slots.map((s) => `<button class="btn ${user.slot === s ? '' : 'quiet'}" data-a="slot" data-v="${s}" style="flex-direction:column;gap:0">
          ${s}<span class="small" style="font-weight:600">${'●'.repeat(counts[s]) || '&nbsp;'}</span></button>`).join('')}</div>
        <p class="small muted" style="margin-top:12px">${t('hostNote')}</p></div>${notes()}`;
  }
  // giveback or complete
  const e = circle.ending, ev = circle.event, done = phase === 'complete', goingList = circle.members.filter((m) => m.rsvp);
  const teach = user.reflections?.[2];
  return `<div class="card good center"><h2>${done ? t('doneT') : t('solvedT')}</h2>${done ? `<p>${t('doneB')}</p>` : ''}
      <p><b>${t('earned')} ${S.meta.points.story + (done ? S.meta.points.event : 0)} ${t('pts')}</b></p></div>
    <div class="card"><div class="bleed">${scene('proclaim')}</div><p class="eyebrow">${L(e.title)}</p><div class="letter">${esc(L(e.text))}</div></div>
    <div class="card ${done ? 'good' : ''}"><p class="eyebrow">${t('finalT')}</p><p>${L(e.finalChapter)}</p>
      ${teach && !done ? `<p class="note">${t('youSaid')}: <b>${esc(L(teach))}</b>. ${t('chance')}</p>` : ''}
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
      <div class="row" style="margin-top:10px"><input type="text" id="chat" maxlength="200" placeholder="${t('chatPh')}" aria-label="${t('chatPh')}" class="grow">
      <button class="btn small" data-a="sendChat" aria-label="${t('send')}" style="min-height:62px">${ic('send')}</button></div></div>`;
}

// ---------- rewards tab ----------
function rewardsTab() {
  const u = S.data.user, rw = (id) => S.meta.rewards.find((r) => r.id === id);
  const time = (ms) => new Date(ms).toLocaleDateString(LOCALE[S.lang] || 'en-SG', { day: 'numeric', month: 'short' });
  return `<div class="card center points"><p class="eyebrow">${t('balance')}</p><p class="big-num">${u.points}</p><p class="muted">${t('rewardsNote')}</p></div>
    ${u.vouchers.length ? `<div class="card good"><h3>${t('vouchers')}</h3>${u.vouchers.map((v) => `<div class="kv"><span>${rw(v.rewardId).icon} ${L(rw(v.rewardId))}<br><span class="small muted">${t('showCode')}</span></span><b class="code">${v.code}</b></div>`).join('')}</div>` : ''}
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
  const chipRow = (list, sel, act) => `<div class="chips inline">${list.map((x) => `<button class="chip ${sel.includes(x.id) ? 'on' : ''}" data-a="${act}" data-v="${x.id}" aria-pressed="${sel.includes(x.id)}">${x.icon} ${L(x)}</button>`).join('')}</div>`;
  const glyph = { zh: '字', ta: 'அ', hi: 'अ' }[S.lang] || 'Aa';
  return `<div class="card center"><div style="display:grid;place-items:center">${avatar(user.name, user.color, 'big')}</div>
      ${S.edit === 'name' ? `<input type="text" id="editName" maxlength="24" value="${esc(user.name)}" aria-label="${t('namePh')}" style="margin-top:12px"><button class="btn" data-a="saveName">${t('saveName')}</button>`
        : `<h1 style="margin-top:10px">${esc(user.name)}</h1><button class="link" data-a="editName">${t('edit')}</button>`}
      <p class="muted small">${user.phone ? '•••• ' + esc(user.phone.slice(-4)) : ''} · ${esc(circle.name)}</p>
      <div class="stats"><div><b>${user.chapter}</b><span>${t('stChap')}</span></div><div><b>${me.present || solved ? 1 : 0}</b><span>${t('stMeet')}</span></div>
        <div><b>${done ? 1 : 0}</b><span>${t('stHours')}</span></div><div><b>${user.points}</b><span>${t('stPts')}</span></div></div></div>
    <div class="card"><h3>${t('badges')}</h3><div class="badges">${badges.map(([e, k, on]) => `<div class="badge ${on ? '' : 'off'}"><span>${e}</span>${t(k)}</div>`).join('')}</div></div>
    <div class="card" id="cardbox"><h3>${t('myCard')}</h3>${cardBlock()}</div>
    <div class="card"><h3>${ic('ear')} ${t('readListen')}</h3>
      <div class="kv"><span>${t('wordsIn')}</span><b>${LANG_NAMES[S.lang]}</b></div><div class="kv"><span>${t('voiceIn')}</span><b>${esc(voiceDef().label)}</b></div>
      <button class="btn quiet" data-a="sheet">${t('edit')}</button>
      <h3 style="margin-top:18px">${t('textSize')}</h3><div class="row">${[['s', '.9rem'], ['m', '1.1rem'], ['l', '1.4rem']].map(([k, fs]) =>
        `<button class="btn ${user.textSize === k ? '' : 'quiet'}" data-a="size" data-v="${k}" style="font-size:${fs}" aria-pressed="${user.textSize === k}">${glyph}</button>`).join('')}</div></div>
    <div class="card"><h3>${t('mySkills')}</h3>${chipRow(S.meta.skills, user.skills, 'setSkill')}<h3 style="margin-top:18px">${t('myInterests')}</h3>${chipRow(S.meta.interests, user.interests, 'setInterest')}</div>
    <p class="small muted center">${t('safe')}</p><button class="btn ghost" data-a="signOut">${t('signOut')}</button>`;
}

function render() {
  document.documentElement.lang = S.lang;
  const size = S.data?.user.textSize || 'm';
  document.documentElement.style.fontSize = { s: '18px', m: '20px', l: '23px' }[size];
  if (!S.meta) return;
  const overlay = S.sheet ? sheet() : '';
  app.className = 'phone bare';
  if (!S.data) { app.innerHTML = (S.auth === 'signin' ? signIn() : S.ob.step ? onboarding() : welcome()) + overlay; return; }
  if (S.post) { app.innerHTML = (S.post === 'card' ? postCard() : postRole()) + overlay; return; }
  if (S.rd) { app.innerHTML = reader() + overlay; paintAudio(); return; }
  app.className = 'phone';
  const u = S.data.user, c = S.data.circle;
  const tabs = [['story', 'book', t('story')], ['circle', 'users', t('circle')], ['rewards', 'gift', t('rewards')], ['profile', 'user', t('profile')]];
  const body = { story: storyTab, circle: circleTab, rewards: rewardsTab, profile: profileTab }[S.tab]();
  const dot = { circle: c.messages.length > (S.seen || 0) && S.tab !== 'circle', profile: !u.cardLinked };
  app.innerHTML = `<div class="top"><span class="hi">${t('hello')}, ${esc(u.name)}</span><span class="row" style="gap:8px">${voiceChip()}<span class="pill">${ic('star')} ${u.points}</span></span></div>
    ${S.tab === 'story' ? journey(S.data.phase, c) : ''}${body}
    <nav class="nav"><div>${tabs.map(([id, icon, label]) => `<button class="${S.tab === id ? 'on' : ''} ${dot[id] ? 'dotty' : ''}" data-a="tab" data-v="${id}" ${S.tab === id ? 'aria-current="page"' : ''}>${ic(icon)}${label}</button>`).join('')}</div></nav>${overlay}`;
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
    if (o.step === 1 && !o.name.trim()) { S.err = t('errName'); return; }
    if (o.step === 2 && o.phone.replace(/\D/g, '').length < 8) { S.err = t('errPhone'); return; }
    if (o.step === 2 && !/^\d{4}$/.test(o.pin)) { S.err = t('errPin'); return; }
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
  read(v) { stopAudio(); S.rd = { ch: Number(v), stage: 'pages', choice: null, text: '' }; },
  rdExit() { stopAudio(); S.rd = null; },
  rdNext() {
    stopAudio(); const r = S.rd;
    r.stage = { pages: 'choice', reply: 'note', note: 'reflect' }[r.stage] || r.stage;
  },
  rdBack() {
    stopAudio(); const r = S.rd;
    if (r.stage === 'pages') S.rd = null;
    else r.stage = { choice: 'pages', reply: 'choice', note: 'reply', reflect: 'note' }[r.stage];
  },
  rdChoose(v) { stopAudio(); S.rd.choice = Number(v); S.rd.stage = 'reply'; },
  rdChip(v) { S.rd.text = v; },
  async rdFinish() {
    const r = S.rd; r.text = val('reflect').trim() || r.text;
    if (!r.text) { document.getElementById('reflect').focus(); return false; }
    stopAudio();
    await post('chapter', { chapter: r.ch, choice: r.choice, reflection: r.text });
    S.rd = null; S.tab = 'story';
  },
  // Listening
  listenAll() { const was = AU.on; stopAudio(); if (!was) playPanel(0, true); return false; },
  sayPanel(v) { const i = Number(v), was = AU.on && AU.i === i; stopAudio(); if (!was) playPanel(i, false); return false; },
  sayStage() { const was = AU.on; stopAudio(); if (!was) { AU.on = true; paintAudio(); speak(stageText, stageClip(), stopAudio); } return false; },
  sheet() { S.sheet = true; }, closeSheet() { S.sheet = false; },
  pickVoice(v) {
    S.voice = v; localStorage.setItem('sh_voice', v); stopAudio();
    const st = S.meta.story;
    AU.on = true; speak((lang) => `${TX(st.title, lang)}. ${TX(st.tagline, lang)}.`, 'sample', stopAudio);
  },
  async readLang(v) { if (S.data) await post('profile', { lang: v }); else A.pickLang(v); },
  rate(v) { S.rate = Number(v); localStorage.setItem('sh_rate', v); },
  slot(v) { return post('slot', { slot: v }); },
  rsvp() { return post('rsvp', { going: !S.data.user.rsvp }); },
  link() { return post('link-card'); }, cancelLink() { return post('cancel-link'); }, unlink() { return post('unlink-card'); },
  goLink() { S.tab = 'profile'; return post('link-card'); },
  redeem(v) { return post('redeem', { rewardId: v }); },
  quick(v) { return post('message', { text: v }); },
  sendChat() { const text = val('chat').trim(); return text ? post('message', { text }) : false; },
  size(v) { return post('profile', { textSize: v }); },
  editName() { S.edit = 'name'; }, async saveName() { await post('profile', { name: val('editName') }); S.edit = null; },
  setSkill(v) { const next = toggle(S.data.user.skills, v); return next.length ? post('profile', { skills: next }) : false; },
  setInterest(v) { return post('profile', { interests: toggle(S.data.user.interests, v) }); },
  signOut() { stopAudio(); localStorage.removeItem('sh_uid'); Object.assign(S, { uid: null, data: null, rd: null, post: null, sheet: false, tab: 'story', auth: 'welcome', err: '', ob: { step: 0, name: '', phone: '', pin: '', skills: [], interests: [] } }); },
};
const KEEP_SCROLL = ['rdChip', 'slot', 'rsvp', 'redeem', 'quick', 'sendChat', 'setSkill', 'setInterest', 'size', 'link', 'cancelLink', 'unlink',
  'obSkill', 'obInterest', 'pickLang', 'editName', 'saveName', 'sheet', 'closeSheet', 'pickVoice', 'readLang', 'rate'];

async function run(el) {
  const a = el.dataset.a;
  try {
    if ((await A[a](el.dataset.v)) === false) return;
    render();
    if (!KEEP_SCROLL.includes(a)) window.scrollTo(0, 0);
    if (a === 'goLink') document.getElementById('cardbox')?.scrollIntoView({ block: 'center' });
    if (a === 'sheet') document.getElementById('sheetT')?.focus();
  } catch (e) { S.err = e.message; alert(e.message); }
}
app.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-a]');
  if (el && !el.disabled) run(el);
});
app.addEventListener('input', (ev) => {
  const id = ev.target.id, v = ev.target.value;
  if (id === 'name') S.ob.name = v; else if (id === 'phone') S.ob.phone = v; else if (id === 'pin') S.ob.pin = v; else if (id === 'reflect' && S.rd) S.rd.text = v;
});
app.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter' && ev.target.id === 'chat') app.querySelector('[data-a=sendChat]').click();
  else if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('figure[data-a]')) { ev.preventDefault(); run(ev.target); }
  else if (ev.key === 'Escape' && S.sheet) { S.sheet = false; render(); }
});
synth()?.addEventListener?.('voiceschanged', () => { if (S.sheet) render(); });

// Keep every screen live: circle forming, arrivals, questions, chat, card linking.
setInterval(async () => {
  if (!S.uid || !S.data || S.rd || S.sheet || document.hidden) return;
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
  S.audio = await fetch('audio/manifest.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
  if (S.uid) { try { setData(await api(`/users/${S.uid}/state`)); } catch { S.uid = null; localStorage.removeItem('sh_uid'); } }
  render();
})();
