// All game content lives here. Add a story by copying one of these objects.
// Every text is { en, zh } so the app can switch language.

const SKILLS = [
  { id: 'cooking', icon: '🍳', en: 'Cooking', zh: '烹饪' },
  { id: 'gardening', icon: '🌱', en: 'Gardening', zh: '园艺' },
  { id: 'sewing', icon: '🧵', en: 'Sewing', zh: '缝纫' },
  { id: 'language', icon: '🗣️', en: 'Teaching a language', zh: '教语言' },
  { id: 'music', icon: '🎵', en: 'Music', zh: '音乐' },
  { id: 'repairs', icon: '🔧', en: 'Repairs', zh: '修理' },
];

const INTERESTS = [
  { id: 'kopi', icon: '☕', en: 'Coffee and chatting', zh: '喝咖啡聊天' },
  { id: 'walks', icon: '🚶', en: 'Short walks', zh: '散步' },
  { id: 'games', icon: '🀄', en: 'Board games', zh: '棋牌游戏' },
  { id: 'kids', icon: '🧒', en: 'Being with children', zh: '陪伴孩子' },
  { id: 'heritage', icon: '🏮', en: 'Old stories and heritage', zh: '老故事与传统' },
  { id: 'crafts', icon: '🎨', en: 'Crafts', zh: '手工' },
];

const REWARDS = [
  { id: 'taichi', icon: '🧘', cost: 100, en: 'Tai chi class pass', zh: '太极课程一节' },
  { id: 'check', icon: '🩺', cost: 150, en: 'Basic health screening', zh: '基础健康检查' },
  { id: 'swim', icon: '🏊', cost: 200, en: 'Swimming pool entry (4 visits)', zh: '游泳池入场券（4次）' },
  { id: 'shoes', icon: '👟', cost: 300, en: 'Walking shoes voucher', zh: '步行鞋礼券' },
];

// Fictional partner venue for the demo.
const CAFE = {
  id: 'cafe-1',
  name: { en: 'Kopi Corner Café', zh: '咖啡角落' },
  address: { en: 'Block 12, Hill Street (demo venue)', zh: '禧街12座（演示地点）' },
  slots: ['2:00 pm', '3:00 pm', '4:00 pm'],
};

const POINTS = { story: 100, event: 200 };

const STORIES = {
  recipe: {
    id: 'recipe',
    skill: 'cooking',
    icon: '🍚',
    title: { en: 'The Lost Recipe', zh: '失传的食谱' },
    piece: { en: 'recipe card', zh: '食谱卡' },
    episodes: [
      {
        cards: [
          { icon: '🏮', text: { en: "Fifty years ago, Auntie Mei's stall on Hill Street sold the best chicken rice in town.", zh: '五十年前，禧街上美姨的小摊卖着全城最好吃的鸡饭。' } },
          { icon: '🚪', text: { en: 'When she closed the stall, her recipe vanished. Nobody had ever written it down.', zh: '小摊关门后，她的食谱也跟着消失了。从来没有人把它写下来。' } },
          { icon: '✉️', text: { en: 'Yesterday, a torn piece of an old recipe card arrived in your letterbox.', zh: '昨天，你的信箱里出现了一张撕破的旧食谱卡。' } },
        ],
        game: {
          type: 'pairs',
          prompt: { en: "Find the pairs to see what was in Auntie Mei's kitchen.", zh: '找出相同的一对，看看美姨的厨房里有什么。' },
          items: ['🍚', '🐔', '🧄'],
        },
      },
      {
        cards: [
          { icon: '📜', text: { en: "The card smells of ginger and smoke. On the back, a note says: 'Cook it the way I showed you.'", zh: '卡片上有姜和炭火的味道。背面写着：“照我教你的方法煮。”' } },
          { icon: '👩‍🍳', text: { en: 'You remember watching her work. What did she do first?', zh: '你还记得看她做饭的样子。她先做什么呢？' } },
        ],
        game: {
          type: 'order',
          prompt: { en: 'Tap the steps in the right order.', zh: '按正确的顺序点选步骤。' },
          items: [
            { icon: '🚿', text: { en: 'Wash the rice', zh: '洗米' } },
            { icon: '🍲', text: { en: 'Boil the chicken', zh: '煮鸡' } },
            { icon: '🍚', text: { en: 'Cook the rice in the broth', zh: '用鸡汤煮饭' } },
            { icon: '🥢', text: { en: 'Serve with sauce', zh: '配酱料上桌' } },
          ],
        },
      },
      {
        cards: [
          { icon: '❓', text: { en: 'One line on the card is still missing: the secret ingredient.', zh: '卡片上还缺一行：秘密材料。' } },
          { icon: '🛣️', text: { en: 'You go back to Hill Street to find her old stall. She always hung a red lantern outside.', zh: '你回到禧街寻找她的旧摊位。她总是在门外挂一盏红灯笼。' } },
        ],
        game: {
          type: 'find',
          prompt: { en: "Which one marks Auntie Mei's stall?", zh: '哪一个是美姨摊位的记号？' },
          hint: { en: 'Look for the red lantern.', zh: '找找红灯笼。' },
          options: ['🔔', '🏮', '⭐', '🎈'],
          answer: 1,
        },
      },
    ],
    cliffhanger: { en: 'Your card is only one quarter of the recipe. Three neighbours each hold another piece. Only together can you read it.', zh: '你的卡片只是食谱的四分之一。另外三位邻居各有一片。只有聚在一起才能读懂它。' },
    clues: [
      { en: 'The secret is not hot on the tongue.', zh: '这个秘密材料不辣。' },
      { en: 'The secret is not dug out of the ground.', zh: '这个秘密材料不是从土里挖出来的。' },
      { en: 'She tied it in a knot before it went in the pot.', zh: '下锅之前，她会把它打一个结。' },
      { en: 'It is green, and children loved its smell.', zh: '它是绿色的，孩子们都喜欢它的香味。' },
    ],
    riddle: {
      q: { en: "What was Auntie Mei's secret ingredient?", zh: '美姨的秘密材料是什么？' },
      options: { red: 'Chilli', yellow: 'Ginger', green: 'Pandan leaf' },
      answer: 'green',
    },
    endingTitle: { en: 'Pandan leaf!', zh: '是班兰叶！' },
    ending: { en: "A knotted pandan leaf, cooked with the rice. On the last line Auntie Mei wrote: 'A recipe only lives when it is taught.'", zh: '把班兰叶打个结，和米饭一起煮。美姨在最后一行写道：“食谱只有传下去，才算活着。”' },
    event: {
      icon: '🧒',
      title: { en: 'Teach a chicken rice class for children', zh: '教孩子们做鸡饭' },
      partner: { en: "Sunbeam Children's Centre (demo partner)", zh: '阳光儿童中心（演示伙伴）' },
      detail: { en: 'One hour, together with your circle. You bring the recipe; the centre brings the kitchen.', zh: '一小时，和你的小组一起。你们带食谱，中心提供厨房。' },
    },
  },

  seed: {
    id: 'seed',
    skill: 'gardening',
    icon: '🌱',
    title: { en: 'The Last Seed', zh: '最后一粒种子' },
    piece: { en: 'seed packet', zh: '种子袋' },
    episodes: [
      {
        cards: [
          { icon: '🏡', text: { en: 'Behind Block 12 there was once a garden that fed the whole kampong.', zh: '12座后面曾经有一个菜园，养活了整个甘榜。' } },
          { icon: '👨‍🌾', text: { en: 'Uncle Rahman tended it for forty years. When he left, the garden was paved over.', zh: '拉曼大叔照顾了它四十年。他离开后，菜园被铺成了水泥地。' } },
          { icon: '✉️', text: { en: 'Last week, an envelope arrived with a torn seed packet inside.', zh: '上星期，你收到一个信封，里面是一个撕破的种子袋。' } },
        ],
        game: {
          type: 'pairs',
          prompt: { en: "Find the pairs to see what was in Uncle Rahman's garden.", zh: '找出相同的一对，看看拉曼大叔的菜园里有什么。' },
          items: ['🌻', '💧', '🐝'],
        },
      },
      {
        cards: [
          { icon: '📜', text: { en: "On the packet is a note: 'Plant it the way I showed you.'", zh: '袋子上写着：“照我教你的方法种。”' } },
          { icon: '🤔', text: { en: 'You remember kneeling beside him in the soil. What came first?', zh: '你还记得跪在他身旁的泥土里。先做什么呢？' } },
        ],
        game: {
          type: 'order',
          prompt: { en: 'Tap the steps in the right order.', zh: '按正确的顺序点选步骤。' },
          items: [
            { icon: '🕳️', text: { en: 'Dig a small hole', zh: '挖一个小洞' } },
            { icon: '🌰', text: { en: 'Drop in the seed', zh: '放入种子' } },
            { icon: '🪴', text: { en: 'Cover it with soil', zh: '盖上泥土' } },
            { icon: '💧', text: { en: 'Water it gently', zh: '轻轻浇水' } },
          ],
        },
      },
      {
        cards: [
          { icon: '❓', text: { en: 'The name of the plant is torn off the packet.', zh: '植物的名字被撕掉了。' } },
          { icon: '🚶', text: { en: 'You go to find where the garden used to be. He always grew a sunflower by the gate.', zh: '你去寻找菜园原来的位置。他总是在门边种一棵向日葵。' } },
        ],
        game: {
          type: 'find',
          prompt: { en: 'Which one marks the garden gate?', zh: '哪一个是菜园门口的记号？' },
          hint: { en: 'Look for the sunflower.', zh: '找找向日葵。' },
          options: ['🌵', '🍄', '🌻', '🌲'],
          answer: 2,
        },
      },
    ],
    cliffhanger: { en: 'Your packet is only one quarter of the label. Three neighbours each hold another piece. Only together can you read it.', zh: '你的种子袋只是标签的四分之一。另外三位邻居各有一片。只有聚在一起才能读懂它。' },
    clues: [
      { en: 'It is not a flower.', zh: '它不是花。' },
      { en: 'It does not grow under the ground.', zh: '它不长在地下。' },
      { en: 'It climbs up a pole or a fence.', zh: '它会沿着竹竿或篱笆往上爬。' },
      { en: 'It is long and green and goes into the curry.', zh: '它又长又绿，可以放进咖喱里。' },
    ],
    riddle: {
      q: { en: 'What did Uncle Rahman grow from this seed?', zh: '拉曼大叔用这粒种子种出了什么？' },
      options: { red: 'Hibiscus', yellow: 'Long beans', green: 'Sweet potato' },
      answer: 'yellow',
    },
    endingTitle: { en: 'Long beans!', zh: '是长豆！' },
    ending: { en: "Long beans, climbing the old fence. On the packet Uncle Rahman wrote: 'A garden only lives when it is shared.'", zh: '长豆沿着旧篱笆往上爬。拉曼大叔在袋子上写道：“菜园只有分享出去，才算活着。”' },
    event: {
      icon: '🧒',
      title: { en: 'Plant a long bean patch with pupils', zh: '和学生一起种长豆' },
      partner: { en: 'Greenfield Primary garden club (demo partner)', zh: '绿野小学园艺社（演示伙伴）' },
      detail: { en: 'One hour, together with your circle. You bring the know-how; the school brings the soil.', zh: '一小时，和你的小组一起。你们带经验，学校提供土地。' },
    },
  },
};

// Your first skill that has a story picks your story.
function storyForSkills(skills) {
  for (const s of skills || []) {
    const hit = Object.values(STORIES).find((st) => st.skill === s);
    if (hit) return hit.id;
  }
  return 'recipe';
}

module.exports = { SKILLS, INTERESTS, REWARDS, CAFE, POINTS, STORIES, storyForSkills };
