// All story content. Every text is { en, zh }.
// The story is one mystery told in four voices: each member of a circle plays a
// different witness. No witness can answer the café questions alone.

const t = (en, zh) => ({ en, zh });

const SKILLS = [
  { id: 'cooking', icon: '🍳', ...t('Cooking', '烹饪') },
  { id: 'gardening', icon: '🌱', ...t('Gardening', '园艺') },
  { id: 'sewing', icon: '🧵', ...t('Sewing', '缝纫') },
  { id: 'language', icon: '🗣️', ...t('Teaching a language', '教语言') },
  { id: 'music', icon: '🎵', ...t('Music and singing', '音乐与歌唱') },
  { id: 'repairs', icon: '🔧', ...t('Repairs', '修理') },
];

const INTERESTS = [
  { id: 'kopi', icon: '☕', ...t('Coffee and chatting', '喝咖啡聊天') },
  { id: 'walks', icon: '🚶', ...t('Short walks', '散步') },
  { id: 'games', icon: '🀄', ...t('Board games', '棋牌游戏') },
  { id: 'kids', icon: '🧒', ...t('Being with children', '陪伴孩子') },
  { id: 'heritage', icon: '🏮', ...t('Old stories and heritage', '老故事与传统') },
  { id: 'crafts', icon: '🎨', ...t('Crafts', '手工') },
];

const REWARDS = [
  { id: 'taichi', icon: '🧘', cost: 100, ...t('Tai chi class pass', '太极课程一节') },
  { id: 'check', icon: '🩺', cost: 150, ...t('Basic health screening', '基础健康检查') },
  { id: 'swim', icon: '🏊', cost: 200, ...t('Swimming pool entry, 4 visits', '游泳池入场券（4次）') },
  { id: 'shoes', icon: '👟', cost: 300, ...t('Walking shoes voucher', '步行鞋礼券') },
];

// Fictional partners for the demo.
const CAFE = {
  id: 'cafe-1',
  name: t('Kopi Corner Café', '咖啡角落'),
  address: t('Block 12, Hill Street', '禧街12座'),
  slots: ['2:00 pm', '3:00 pm', '4:00 pm'],
};

// The community event is chosen by the skill the circle shares.
const EVENTS = {
  cooking: { title: t('Teach a family recipe to children', '教孩子们做一道家传菜'), partner: t("Sunbeam Children's Centre", '阳光儿童中心') },
  gardening: { title: t('Plant a herb garden with pupils', '和学生一起种香草园'), partner: t('Greenfield Primary garden club', '绿野小学园艺社') },
  sewing: { title: t('Teach students to mend and stitch', '教学生缝补衣物'), partner: t('Hill Street Youth Hub', '禧街青年中心') },
  language: { title: t('Mother-tongue story hour for children', '给孩子们的母语故事时间'), partner: t('Hill Street Public Library', '禧街公共图书馆') },
  music: { title: t('Sing the old songs with preschoolers', '和幼儿一起唱老歌'), partner: t('Little Lantern Childcare', '小灯笼托儿所') },
  repairs: { title: t('Run a repair corner for teenagers', '为青少年开设修理角'), partner: t('Hill Street Youth Hub', '禧街青年中心') },
};
const EVENT_DETAIL = t('One hour, together with your circle. You bring what you know; the centre brings everything else.', '一小时，和你的小组一起。你们带来本领，其余由中心准备。');

const POINTS = { story: 100, event: 200 };

// One question about the reader's own life after each chapter. The answers
// become conversation cards at the café.
const REFLECTIONS = [
  { label: t('Childhood food', '童年的味道'), q: t('Which food takes you straight back to your childhood?', '哪一种食物会让您一下子回到童年？'),
    chips: [t('Chicken rice', '鸡饭'), t('Kaya toast', '咖椰吐司'), t("My mother's curry", '妈妈的咖喱'), t('Plain porridge', '白粥')] },
  { label: t('Who taught them', '谁教会了我'), q: t('Who taught you something you still do today?', '谁教会了您一件至今还在做的事？'),
    chips: [t('My mother', '我的母亲'), t('My father', '我的父亲'), t('A teacher', '一位老师'), t('My first boss', '我的第一位老板')] },
  { label: t('Wants to teach', '想传授的'), q: t('What would you most like to teach a young person?', '您最想教年轻人什么？'),
    chips: [t('A family recipe', '一道家传菜'), t('My mother tongue', '我的母语'), t('How to mend things', '怎样修补东西'), t('How to grow things', '怎样种植')] },
];

const STORY = {
  id: 'recipe',
  title: t('The Lost Recipe', '失传的食谱'),
  tagline: t('A mystery told in four voices', '四个人讲述的一个谜'),
  setting: t('Hill Street, 1975', '禧街，1975年'),
  blurb: t("Fifty years ago, the best chicken rice stall in town closed overnight and its recipe vanished. Four people were there. You are one of them.", '五十年前，全城最好的鸡饭摊一夜之间关了门，食谱也随之失传。当时有四个人在场。您就是其中一位。'),
  chapterTitles: [t('The stall on Hill Street', '禧街的小摊'), t('The last night', '最后一夜'), t('What you kept', '你留下的')],

  roles: [
    {
      id: 'hock', color: '#b5411c', name: t('Ah Hock', '阿福'), title: t('The apprentice', '学徒'),
      intro: t("You washed the rice at Auntie Mei's stall for three years.", '你在美姨的摊位洗了三年的米。'),
      chapters: [
        {
          pages: [
            t("It is 1975 and you are seventeen. Every morning before the sun is up, you walk to Hill Street, where a red lantern hangs over the best chicken rice stall in Singapore. It belongs to Auntie Mei. You are her only apprentice.", '那是1975年，你十七岁。每天天还没亮，你就走到禧街。那里挂着一盏红灯笼，灯笼下是全新加坡最好吃的鸡饭摊。摊主是美姨，而你是她唯一的学徒。'),
            t("Your job is the rice. You wash it three times in cold water until the water runs clear, the way she showed you on your first day. 'Rice remembers how it was treated,' she likes to say. You are not sure what that means, but you wash it carefully.", '你的工作是洗米。用冷水洗三遍，洗到水变清为止，就像她第一天教你的那样。她常说：“米会记得你怎么对待它。”你不太明白这句话，但你洗得很用心。'),
            t("By eleven the queue runs past the tailor's shop. Taxi drivers, clerks, schoolteachers. They all say the same thing: nobody else's rice smells like this. You have washed that rice a thousand times and you still cannot say why.", '到了十一点，队伍已经排过了裁缝店。德士司机、书记、教师，人人都说同一句话：别家的饭没有这种香味。这米你洗过上千次，却还是说不出原因。'),
            t("Because there is one step you have never seen. Just before the lid goes on the pot, Auntie Mei sends you to fetch water. Once you turned back too early. You saw her tie something green into a knot and drop it in.", '因为有一个步骤你从来没见过。每次盖上锅盖之前，美姨都会叫你去打水。有一次你回头得太早，看见她把一样绿色的东西打了个结，放进锅里。'),
          ],
          choice: { q: t('She catches you looking. What do you do?', '她发现你在看。你怎么办？'), options: [
            { label: t('Ask her what it is', '问她那是什么'), reply: t("She laughs. 'When your rice is perfect, I will tell you.' You wash the rice harder after that.", '她笑了：“等你的米洗得完美了，我就告诉你。”从那以后，你洗得更卖力了。') },
            { label: t('Pretend you saw nothing', '假装什么也没看见'), reply: t('She says nothing, but that evening she gives you an extra drumstick to take home.', '她什么也没说，但那天傍晚她多给了你一只鸡腿带回家。') },
          ] },
          note: t('Before the lid went on, she tied something green into a knot and dropped it into the pot. I never saw what it was.', '盖锅盖之前，她把一样绿色的东西打了个结放进锅里。我始终没看清那是什么。'),
        },
        {
          pages: [
            t('Three years pass. Your rice is good now; even Auntie Mei says so, which she does by saying nothing at all. You begin to hope that soon she will show you the last step.', '三年过去了。你洗的米已经很好，连美姨也认可——她的认可就是一句话也不说。你开始盼望，她很快会把最后一步教给你。'),
            t('One evening in December she is quiet. She forgets a customer\'s change. Twice you find her staring at a letter with a foreign stamp. When you ask if something is wrong, she tells you to scrub the chopping board.', '十二月的一个傍晚，她很沉默，还忘了找钱给客人。你两次看见她盯着一封贴着外国邮票的信。你问她是不是出了什么事，她只叫你去刷砧板。'),
            t("At six she does something she has never done. 'Go home early, Hock,' she says. 'You have worked hard.' She presses a red packet into your hand, though it is nowhere near New Year. You do not understand, but you go.", '六点钟，她做了一件从来没做过的事。“阿福，早点回家吧，”她说，“你辛苦了。”她把一个红包塞进你手里，可是离新年还远得很。你不明白，但还是走了。'),
            t('The next morning the lantern is gone. The stall is shuttered and padlocked. You wait until noon. You come back the next day, and the next. Nobody has left a note for you. Nobody has left anything at all.', '第二天早上，灯笼不见了。摊位拉下了铁门，上了锁。你等到中午。第二天你又来，第三天也来。没有人给你留下字条，什么都没有留下。'),
          ],
          choice: { q: t('What do you do with the red packet?', '那个红包你怎么处理？'), options: [
            { label: t('Keep it, unopened', '留着，不打开'), reply: t('You keep it in a biscuit tin for fifty years. You still have not opened it.', '你把它放在饼干罐里，放了五十年，至今没有打开。') },
            { label: t('Buy a rice pot of your own', '买一个自己的饭锅'), reply: t('It is a small, cheap pot. You cook in it for forty years.', '那是个又小又便宜的锅。你用它煮了四十年的饭。') },
          ] },
          note: t('She sent me home early with a red packet. Next morning the stall was locked. She left no note for me. Nothing.', '她给了我一个红包，叫我早点回家。第二天早上摊位就锁了。她没有给我留下任何字条，什么都没有。'),
        },
        {
          pages: [
            t('You find other work. A shipyard, then a bus depot. You marry; you have children; you cook chicken rice for them on Sundays. It is good. It is not hers. Your children do not know the difference, but you do.', '你找了别的工作，先在船厂，后来在巴士车厂。你结了婚，有了孩子，星期天给他们煮鸡饭。味道不错，但不是她的味道。孩子们吃不出分别，你却吃得出。'),
            t('For three years you were the one who washed the rice. Every single morning, your hands in the cold water. If she had wanted to teach anyone, you tell yourself, surely it would have been you. But she left without a word.', '那三年，洗米的人一直是你。每一个早晨，你的双手都泡在冷水里。你对自己说，如果她想把手艺传给谁，那个人一定是你。可是她一句话也没留就走了。'),
            t('Sometimes you are angry about it. Mostly you just wonder. Did she think you were not ready? Did she mean to come back? You try ginger, garlic, lemongrass, a dozen green things tied in knots. None of them is right.', '有时候你会生气，但更多时候只是想不通。她觉得你还没准备好吗？她本来打算回来吗？你试过姜、蒜、香茅，试过十几种打了结的绿色东西，没有一样是对的。'),
            t('Now you are old, and yesterday a card arrived in your letterbox: a torn corner of a recipe, in handwriting you would know anywhere. Your corner is not enough. But it seems three other people on Hill Street remember that stall too.', '如今你老了。昨天，信箱里来了一张卡片：一张食谱被撕下的一角，那笔迹你到哪里都认得。只有一角是不够的。不过，看来禧街上还有另外三个人也记得那个摊位。'),
          ],
          choice: { q: t('How do you feel about meeting them?', '要和他们见面，你有什么感觉？'), options: [
            { label: t('Curious', '好奇'), reply: t('Fifty years is a long time to wonder. You iron a shirt.', '想了五十年，实在太久了。你熨好了一件衬衫。') },
            { label: t('A little nervous', '有点紧张'), reply: t('You have not spoken about Auntie Mei in decades. You iron a shirt anyway.', '你已经几十年没提起美姨了。但你还是熨好了一件衬衫。') },
          ] },
          note: t('I was the one who washed the rice, every morning for three years. But I never received anything from her.', '三年里，每天早上洗米的人就是我。可是我从来没有收到她留下的任何东西。'),
        },
      ],
    },
    {
      id: 'kamala', color: '#7a4fa3', name: t('Kamala', '卡玛拉'), title: t('The neighbour', '邻摊的花贩'),
      intro: t("Your flower stall stood beside Auntie Mei's for eleven years.", '你的花摊在美姨隔壁摆了十一年。'),
      chapters: [
        {
          pages: [
            t("It is 1975. Your flower stall stands beside Auntie Mei's on Hill Street, so close that your jasmine garlands smell of chicken broth by lunchtime. You have been neighbours for eleven years. You know her better than anyone does.", '那是1975年。你的花摊就在禧街美姨的摊位旁边，近得到了中午，你的茉莉花环都带着鸡汤味。你们做了十一年邻居，没有人比你更了解她。'),
            t('You know she takes her tea without sugar. You know she hums when the queue is long. And you know what the customers never notice: Mei does not buy from the spice sellers. Not once in eleven years have you seen her at their stalls.', '你知道她喝茶不加糖，知道排队的人一多她就会哼歌。你还知道客人们从没注意到的一件事：美姨不向香料贩买东西。十一年来，你一次也没见她去过他们的摊位。'),
            t('Instead, every morning before she lights the fire, she goes to a big clay pot behind her stall. A plant grows there, with long green leaves like sword blades. She cuts two or three, wipes them on her apron, and carries them inside.', '每天早上生火之前，她会走到摊位后面的一个大瓦盆前。盆里种着一棵植物，叶子又长又绿，像一把把剑。她剪下两三片，在围裙上擦一擦，拿进摊里。'),
            t("You asked her about it once. She only smiled and said, 'Everyone looks for secrets in the market, Kamala. Nobody looks in the flowerpot.' Then she gave you a plate of rice so you would stop asking. It worked.", '你问过她一次。她只是笑着说：“卡玛拉，人人都到巴刹里找秘密，没有人会看花盆。”然后她给了你一盘饭，好让你别再问。这一招很管用。'),
          ],
          choice: { q: t('Do you tell anyone about the pot?', '瓦盆的事，你会告诉别人吗？'), options: [
            { label: t('Never. It is her business.', '绝不。那是她的事。'), reply: t('You keep it to yourself for fifty years. You are a good neighbour.', '你守了五十年。你是个好邻居。') },
            { label: t('Only your sister', '只告诉你的姐姐'), reply: t('Your sister does not believe a plant could matter so much. You let her think so.', '姐姐不相信一棵植物会那么重要。你也就由她这么想。') },
          ] },
          note: t('She never bought from the spice sellers. Every morning she cut long green leaves from a clay pot behind her stall.', '她从不向香料贩买东西。每天早上，她都从摊位后面的瓦盆里剪下又长又绿的叶子。'),
        },
        {
          pages: [
            t('In December a letter comes for Mei with a Malaysian stamp. She reads it standing up, between customers. You see her face change. For the rest of the day she moves like someone carrying a full bowl of soup.', '十二月，美姨收到一封贴着马来西亚邮票的信。她趁着没有客人，站着把信读完。你看见她的脸色变了。那天余下的时间，她走路就像端着一碗满满的汤。'),
            t("After closing, she comes to your stall and sits on your little stool, which she has never done. 'It is my daughter,' she says. 'In Penang. She is very ill, and there is nobody else to look after her.'", '收摊以后，她来到你的摊位，坐在你的小凳子上——她以前从没这样做过。“是我女儿，”她说，“在槟城。她病得很重，身边没有别人可以照顾她。”'),
            t("'When will you come back?' you ask. She looks at her stall for a long time. 'A daughter is not a pot of rice,' she says. 'You cannot leave her and come back in an hour.' You understand then that she will not come back.", '“你什么时候回来？”你问。她看着自己的摊位，看了很久。“女儿不是一锅饭，”她说，“不能放下她，过一个钟头再回来。”那一刻你明白了，她不会回来了。'),
            t("She goes behind her stall and returns carrying the clay pot in both arms. 'Keep this alive for me,' she says. It is heavier than it looks. That is the last time you see her. In the morning her stall is locked.", '她走到摊位后面，双手抱着那个瓦盆回来。“帮我把它养活，”她说。盆比看起来重得多。那是你最后一次见到她。第二天早上，她的摊位上了锁。'),
          ],
          choice: { q: t('What do you say as she leaves?', '她离开时，你说了什么？'), options: [
            { label: t("'I will water it every day.'", '“我会每天给它浇水。”'), reply: t('And you do. Every day, for fifty years.', '你也真的做到了。每一天，整整五十年。') },
            { label: t('Nothing. You hold her hand.', '什么也没说，只是握住她的手。'), reply: t('She squeezes it once. That is enough.', '她用力握了一下。这就够了。') },
          ] },
          note: t('That last night she told me her daughter in Penang was very ill. She gave me her clay pot plant and asked me to keep it alive.', '最后那一晚，她告诉我她在槟城的女儿病得很重。她把那盆植物交给我，要我把它养活。'),
        },
        {
          pages: [
            t('The plant does well with you. You move it to your flat when the street is cleared, and it sits on your balcony now, grown so big you have split it into four pots. The whole corridor smells sweet when it rains.', '那棵植物在你手里长得很好。街道清拆时，你把它搬回组屋，现在就放在阳台上。它长得太大，你把它分成了四盆。一下雨，整条走廊都是甜甜的香味。'),
            t("Mei writes to you twice. The first letter says her daughter is slowly getting better. The second, years later, says: 'My girl is strong again, but she has no patience for the pot. She buys her rice from a shop. Imagine.'", '美姨给你写过两封信。第一封说，她女儿正在慢慢好起来。第二封是多年以后写的：“我女儿身体又好了，可是她对煮饭没有耐心，吃的饭都是店里买的。你想想看。”'),
            t('You always wondered what would become of the recipe then. Not the daughter, clearly. Mei never wrote of it again, and then the letters stopped. You kept watering the plant. It was the only thing you knew how to do for her.', '你一直在想，那食谱以后会怎样。显然不会传给她女儿。美姨再也没有在信里提起，后来信也断了。你继续给那棵植物浇水。这是你唯一能为她做的事。'),
            t("Yesterday a card arrived: a torn corner of a recipe in Mei's handwriting. You held it for a long time. Your corner is not enough to read. But it seems three other people remember that stall. You wonder which of them she trusted.", '昨天来了一张卡片：一张食谱被撕下的一角，是美姨的笔迹。你拿着它看了很久。只有一角，读不出什么。不过，看来还有另外三个人记得那个摊位。你想知道，她当年信任的是哪一个。'),
          ],
          choice: { q: t('What will you bring to the meeting?', '见面时你会带什么去？'), options: [
            { label: t('A cutting from the plant', '那棵植物的几片叶子'), reply: t('You wrap three leaves in damp newspaper. They smell like 1975.', '你用湿报纸包了三片叶子。闻起来就像1975年。') },
            { label: t('Her two letters', '她写的两封信'), reply: t('The paper is soft as cloth now. You put them in your handbag.', '信纸如今软得像布一样。你把它们放进手提包里。') },
          ] },
          note: t("Her daughter got well again but never cooked. Mei wrote: 'My girl has no patience for the pot.' Her plant still grows on my balcony.", '她女儿后来康复了，但从不下厨。美姨在信里写道：“我女儿对煮饭没有耐心。”她的那棵植物至今还长在我的阳台上。'),
        },
      ],
    },
    {
      id: 'salleh', color: '#2f6b4f', name: t('Salleh', '沙烈'), title: t('The delivery boy', '送炭的少年'),
      intro: t('You delivered charcoal to Auntie Mei every morning at six.', '你每天早上六点给美姨送炭。'),
      chapters: [
        {
          pages: [
            t("It is 1975 and you are fifteen, the fastest delivery boy on Hill Street. You carry charcoal on the back of your uncle's bicycle: to the satay man, the kopi shop, and every morning at six, to Auntie Mei's chicken rice stall.", '那是1975年，你十五岁，是禧街上跑得最快的送货少年。你用叔叔的脚车载着木炭，送给沙爹摊、咖啡店，还有每天早上六点，送到美姨的鸡饭摊。'),
            t("Other hawkers have changed to gas. It is quicker and cleaner, they say. Auntie Mei will not hear of it. 'Gas is in a hurry,' she tells you. 'My rice is not in a hurry.' She cooks it slowly over your charcoal, the lid never lifted.", '别的小贩都改用煤气了，说是又快又干净。美姨却听也不要听。“煤气太赶了，”她对你说，“我的饭不赶时间。”她用你送的炭慢慢地煮，锅盖从不掀开。'),
            t('She is also the only customer who never makes you wait for money. Every Saturday she counts the coins into your palm, exactly right, and adds a packet of rice for your mother. Your uncle says she is the most honest woman on the street.', '她也是唯一一个从不拖欠货款的客人。每个星期六，她把硬币一个个数到你手心里，分毫不差，还多包一包饭给你母亲。叔叔说，她是整条街最老实的人。'),
            t("You like to stand by her fire for a minute before you ride on. The steam from her pot does not smell like anyone else's. It is sweet, almost like a cake baking. You ask what is in it. She says, 'Charcoal and patience. You bring one of them.'", '继续上路之前，你喜欢在她的炉火旁站一会儿。她锅里冒出的热气和别家不一样，甜甜的，几乎像在烤蛋糕。你问锅里放了什么，她说：“木炭和耐心。其中一样是你送来的。”'),
          ],
          choice: { q: t('She offers you a taste before the stall opens. Do you take it?', '开摊之前，她请你尝一口。你吃吗？'), options: [
            { label: t('Of course', '当然吃'), reply: t('You eat it standing up, burning your tongue. You are late for the satay man. It is worth it.', '你站着吃，烫到了舌头，给沙爹摊送货也迟了。但很值得。') },
            { label: t('No, you are working', '不吃，你在工作'), reply: t('She nods, pleased, and packs a bigger packet for your mother.', '她满意地点点头，给你母亲包了更大的一包。') },
          ] },
          note: t('She cooked slowly over charcoal, never gas. She always paid me on time, exactly right. The steam from her pot smelled sweet.', '她只用木炭慢慢煮，从不用煤气。她付钱总是准时，分毫不差。她锅里的热气闻起来是甜的。'),
        },
        {
          pages: [
            t("One evening in December your uncle sends you back to Hill Street. 'Auntie Mei asked for you,' he says. 'Tonight, not tomorrow.' You ride over, worried she wants to cancel her charcoal. Everyone is changing to gas.", '十二月的一个傍晚，叔叔叫你再去一趟禧街。“美姨找你，”他说，“今晚就去，不要等明天。”你骑车过去，担心她也要停掉木炭。毕竟人人都在改用煤气。'),
            t("But she has the account book open. She pays for this week. Then she pays for next week too, charcoal she has not even received. 'So your uncle is not short,' she says. She has paid the ice man and the rice merchant the same way. You watch her do it.", '可是她摊开了账簿。她付清了这个星期的钱，接着连下个星期的也付了——那些炭她根本还没收到。“免得你叔叔吃亏，”她说。送冰的和米商，她也是这样一一付清的。你亲眼看着。'),
            t("Then she takes a brown envelope from her apron. It is sealed, with no name on it. 'Salleh, you are quick and you do not gossip. Give this to the one who washes the rice. Tomorrow morning. Nobody else.'", '然后她从围裙里拿出一个牛皮纸信封，封了口，上面没有写名字。“沙烈，你手脚快，又不多嘴。把这个交给洗米的那个人。明天早上。不要给别人。”'),
            t('You put the envelope in your delivery bag, under the charcoal sacks, to keep it safe. You promise. She puts her hand on your head for a moment, the way your grandmother does. Then you ride home in the dark.', '你把信封放进送货袋，压在炭包下面，这样才安全。你答应了她。她把手在你头上放了一会儿，就像你祖母那样。然后你摸黑骑车回家。'),
          ],
          choice: { q: t('Do you ask what is in the envelope?', '你会问信封里是什么吗？'), options: [
            { label: t('Yes', '会'), reply: t("'Something that is not mine to keep,' she says. That is all.", '“一样不该由我留着的东西，”她说。就只有这一句。') },
            { label: t('No. A delivery is a delivery.', '不问。送货就是送货。'), reply: t("She smiles. 'That is why I chose you.'", '她笑了：“所以我才选你。”') },
          ] },
          note: t("On her last night she paid every bill in full, even next week's charcoal. She owed nobody anything.", '最后那一晚，她把所有的账都付清了，连下星期的炭钱也付了。她不欠任何人一分钱。'),
        },
        {
          pages: [
            t("The next morning Hill Street is in an uproar. Auntie Mei's stall is locked, and everybody has a theory. In the noise, your uncle sends you on a rush order to the docks. Then another. It is a very busy week.", '第二天早上，禧街闹哄哄的。美姨的摊位锁了，人人都有自己的说法。就在这片吵闹中，叔叔派你去码头送一批急货，接着又是一批。那个星期忙得不得了。'),
            t('By the time you remember the envelope, a month has gone by. You tip out the delivery bag. Coal dust, string, a broken pencil. No envelope. You search the bicycle shed on your knees. You never tell anyone. You are fifteen and ashamed.', '等你想起那个信封，已经过了一个月。你把送货袋倒过来：炭灰、绳子、一支断了的铅笔，就是没有信封。你跪在脚车棚里到处找。这件事你从没告诉过任何人。你才十五岁，觉得很羞愧。'),
            t('You grow up. You drive lorries, then run your own small transport company. You are known for one thing: you have never lost a parcel. Your drivers think you are strict about it. They do not know why.', '你长大了，开过罗厘，后来经营自己的小运输公司。你出名的只有一件事：从来没丢过一件包裹。司机们觉得你在这方面特别严格，却不知道为什么。'),
            t('Last month your grandson cleared out the old shed and found a canvas bag with a false bottom. Inside was a brown envelope, still sealed. And yesterday a card came in the post, a torn corner of a recipe. You think you finally know who the envelope is for.', '上个月，你的孙子清理旧棚子，找到一个有夹层的帆布袋。夹层里是一个牛皮纸信封，封口完好。而昨天，邮差送来一张卡片，是一张食谱被撕下的一角。你想，你终于知道那个信封该交给谁了。'),
          ],
          choice: { q: t('Do you open the envelope?', '你会打开信封吗？'), options: [
            { label: t('No. It is not yours to open.', '不会。这不是你该打开的。'), reply: t('Fifty years late is bad enough. You will deliver it sealed.', '迟了五十年已经够糟了。你要原封不动地送到。') },
            { label: t('Hold it up to the light', '拿到灯光下照一照'), reply: t('The paper is too thick to read through. Good. It is still a delivery.', '纸太厚，什么也看不到。也好。它仍然是一件待送的货。') },
          ] },
          note: t("She gave me a sealed envelope 'for the one who washes the rice'. I lost it for fifty years. I have just found it, still sealed.", '她交给我一个封了口的信封，说是“给洗米的那个人”。我把它弄丢了五十年，最近才找到，封口还是完好的。'),
        },
      ],
    },
    {
      id: 'lim', color: '#2c5d8a', name: t('Mr Lim', '林老师'), title: t('The regular customer', '常客'),
      intro: t("You ate lunch at Auntie Mei's stall every school day.", '每个上课日，你都在美姨的摊位吃午饭。'),
      chapters: [
        {
          pages: [
            t("It is 1975. You teach history at the boys' school on the hill, and every day at half past twelve you walk down to Hill Street for lunch. Same stall, same stool, same order. The other teachers tease you. You do not mind.", '那是1975年。你在山上的男校教历史，每天十二点半走下山，到禧街吃午饭。同一个摊位，同一张凳子，同一份饭。别的老师常取笑你，你并不介意。'),
            t("You have tried to describe Auntie Mei's rice in your diary, the way a historian should. 'Fragrant,' you wrote. 'A sweetness in the nose, not on the tongue. Not hot at all; a child could eat it.' It reads like a poor essay. The rice deserves better.", '你试过像历史学者那样，在日记里描写美姨的饭。你写道：“很香。甜味在鼻子里，不在舌头上。一点也不辣，小孩子都能吃。”读起来像一篇蹩脚的作文。这饭值得更好的文字。'),
            t("One slow afternoon you ask her straight. 'Madam Mei, what is your secret?' She wipes the counter. 'My secret,' she says, 'keeps the rice company.' You write that down. You have puzzled over the sentence for fifty years.", '一个清闲的下午，你直接问她：“美姨，你的秘诀是什么？”她擦着柜台说：“我的秘诀嘛，是陪着米饭的。”你把这句话记了下来，琢磨了五十年。'),
            t('You notice other things, because noticing is your job. Her apprentice, a thin boy, washes the rice and is always sent away before the lid goes on. The flower seller next door watches everything. And the fire is always charcoal.', '你还留意到别的事，因为留意本来就是你的工作。她的学徒是个瘦瘦的少年，负责洗米，每次盖锅盖前都被支开。隔壁卖花的把一切看在眼里。还有，炉火用的永远是木炭。'),
          ],
          choice: { q: t('You consider asking the apprentice. Do you?', '你想过去问那个学徒。你问了吗？'), options: [
            { label: t('Yes, quietly', '问了，悄悄地问'), reply: t("'I only wash the rice, sir,' the boy says. He looks as curious as you are.", '“老师，我只负责洗米。”少年说。他看起来和你一样好奇。') },
            { label: t('No, that would be unfair to him', '没有，那样对他不公平'), reply: t('A teacher should not ask a boy to tell on his teacher. You order a second plate instead.', '当老师的，不该叫一个孩子出卖自己的师父。你改为多点了一盘饭。') },
          ] },
          note: t("The rice smelled sweet and fragrant, never hot. When I asked her secret she said: 'My secret keeps the rice company.'", '那饭闻起来又甜又香，一点也不辣。我问她秘诀，她说：“我的秘诀是陪着米饭的。”'),
        },
        {
          pages: [
            t('On the last day of the school term you stay late marking papers and miss lunch entirely. You tell yourself you will have two plates tomorrow. This is the kind of small decision a person remembers for the rest of his life.', '学期的最后一天，你留下来改卷子，连午饭也错过了。你对自己说，明天吃两盘就是了。就是这种小小的决定，会让人记一辈子。'),
            t("The next morning you leave early to catch the first bus to your mother's house. The station is nearly empty at dawn. On the far platform a woman sits very straight on a bench with one small suitcase. It is Auntie Mei, without her apron.", '第二天一早，你出门去赶头班车回母亲家。天刚亮，车站几乎没有人。远处的月台上，一个女人笔直地坐在长凳上，身边只有一个小皮箱。那是美姨，没有系围裙。'),
            t('You have never seen her anywhere but behind her counter. You raise your hand, but she is looking down at a letter. Then the long-distance bus pulls in, the one that goes north across the Causeway, and she climbs aboard.', '除了柜台后面，你从没在别的地方见过她。你举起手，可她正低头看着一封信。接着长途巴士进站了，就是那趟过长堤往北去的车。她上了车。'),
            t('You think nothing of it. People visit relatives. But when term starts again, the stall is shuttered, and the street is full of stories: debts, a quarrel, a rich man. You say nothing. You only know what you saw: one suitcase, a letter, and the bus north.', '当时你没多想，探亲是常有的事。可是开学以后，摊位关了，街上传着各种说法：欠债、吵架、有钱人。你什么也没说。你只知道自己看见的：一个皮箱，一封信，还有那趟北上的巴士。'),
          ],
          choice: { q: t('Should you have called out to her?', '当时你该不该叫住她？'), options: [
            { label: t('Yes. You regret it still.', '该。你至今还在后悔。'), reply: t('A historian knows that some questions can only be asked once.', '研究历史的人都知道，有些问题只有一次发问的机会。') },
            { label: t('No. She wanted to be alone.', '不该。她想一个人静一静。'), reply: t('Some journeys are private. You were right to let her go.', '有些路是要自己走的。你让她走是对的。') },
          ] },
          note: t('At dawn I saw her at the bus station with one suitcase and a letter. She boarded the bus going north, to Malaysia.', '天刚亮时，我在车站看见她，带着一个皮箱和一封信。她上了往北去马来西亚的巴士。'),
        },
        {
          pages: [
            t("You cannot leave a mystery alone. In January you write to the newspaper: 'Would any reader know the method of the Hill Street chicken rice?' They print it on page nine. Eleven people reply. All eleven recipes are wrong.", '遇到谜团，你总是放不下。一月，你写信给报馆：“有哪位读者知道禧街鸡饭的做法？”信登在第九版，有十一个人回信。十一份食谱，全都不对。'),
            t("You remember then something she told you, the week before she left. You had joked that she should publish a cookbook. She did not laugh. 'It is not mine to print,' she said. 'It belongs to whoever will stand at the pot and cook it.'", '这时你想起她离开前一个星期说过的话。你开玩笑说她应该出一本食谱，她没有笑。“这不是我可以拿去印的东西，”她说，“谁肯站在锅边把它煮出来，它就属于谁。”'),
            t('Whoever will stand at the pot. Not a newspaper, then, and not a customer like you, who can barely boil an egg. You have turned that sentence over for years. She meant someone in particular. You are sure of it.', '谁肯站在锅边。那就不是报馆，也不是像你这样连鸡蛋都煮不好的客人。这句话你反复想了很多年。她指的是某一个特定的人，这一点你很肯定。'),
            t('You are retired now, with a shelf of diaries nobody reads. Yesterday a card arrived: a torn corner of a recipe in a hand you recognise from her chalkboard menu. One corner proves nothing. But a historian knows what to do next: find the other witnesses.', '如今你退休了，书架上的日记没有人读。昨天来了一张卡片：一张食谱被撕下的一角，那笔迹你在她的小黑板菜单上见过。只有一角，什么也证明不了。但研究历史的人知道下一步该做什么：找到其他见证人。'),
          ],
          choice: { q: t('What do you take to the meeting?', '见面时你带什么去？'), options: [
            { label: t('Your 1975 diary', '你1975年的日记'), reply: t('You mark the pages with old bus tickets. It is good to have evidence.', '你用旧车票在那几页做了记号。有证据总是好的。') },
            { label: t('Just yourself and your questions', '只带自己和满肚子的问题'), reply: t('After fifty years, you would rather listen than lecture.', '过了五十年，你宁愿多听，少讲。') },
          ] },
          note: t("She refused to publish the recipe. She said: 'It belongs to whoever will stand at the pot and cook it.'", '她不肯把食谱公开。她说：“谁肯站在锅边把它煮出来，它就属于谁。”'),
        },
      ],
    },
  ],

  cliffhanger: t('Your memory is only one corner of the truth. Three other witnesses hold the rest. Only together can you find out what really happened.', '你的记忆只是真相的一角，其余的在另外三位见证人那里。只有聚在一起，才能弄清当年到底发生了什么。'),

  // Asked on the café device. `answer` stays on the server.
  questions: [
    { q: t("What was Auntie Mei's secret ingredient?", '美姨的秘密材料是什么？'),
      options: { red: t('Chilli', '辣椒'), yellow: t('Ginger', '姜'), green: t('Pandan leaf', '班兰叶') }, answer: 'green',
      hint: t('Who saw what went into the pot? Who remembers the smell?', '谁看见了放进锅里的东西？谁记得那股香味？'),
      explain: t('A knotted pandan leaf, cut fresh from the clay pot.', '是打了结的班兰叶，从瓦盆里现剪的。') },
    { q: t('Why did she close the stall?', '她为什么关掉摊位？'),
      options: { red: t('She owed money', '她欠了债'), yellow: t('Her daughter was ill', '她的女儿病了'), green: t('The rent went up', '租金涨了') }, answer: 'yellow',
      hint: t('Who spoke to her that night? Who saw where she went? Who saw her pay?', '那一晚谁和她说过话？谁看见她去了哪里？谁看见她付账？'),
      explain: t('Her daughter in Penang was very ill. She owed nobody.', '她在槟城的女儿病得很重。她不欠任何人。') },
    { q: t('Who was the recipe meant for?', '那份食谱是要留给谁的？'),
      options: { red: t('Her daughter', '她的女儿'), yellow: t('The newspaper', '报馆'), green: t('Her apprentice', '她的学徒') }, answer: 'green',
      hint: t('Who washed the rice? What did she say about printing it?', '洗米的是谁？对于公开食谱，她说过什么？'),
      explain: t('The envelope was for the one who washed the rice.', '那个信封是给洗米的那个人的。') },
  ],

  endingTitle: t('The letter arrives, fifty years late', '迟到了五十年的信'),
  ending: t("Inside the envelope is the rest of the recipe card, and one line in her handwriting: 'Hock. Rice, broth, charcoal, patience, and one pandan leaf tied in a knot. A recipe only lives when it is taught. Now teach it.'", '信封里是食谱卡剩下的部分，还有她亲笔写的一行字：“阿福：米、鸡汤、木炭、耐心，再加一片打了结的班兰叶。食谱只有传下去，才算活着。现在，去教别人吧。”'),
  finalChapter: t('What you know only lives when it is passed on. Your circle has one chapter left, and it is not in the app.', '本领只有传下去，才算活着。你们的小组还有最后一章，而这一章不在应用里。'),
};

module.exports = { SKILLS, INTERESTS, REWARDS, CAFE, EVENTS, EVENT_DETAIL, POINTS, REFLECTIONS, STORY };
