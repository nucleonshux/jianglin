/* ============================================
   降临 DESCENT — 游戏数据配置
   ============================================ */

const GAME_DATA = {

  /* ---------- 全局参数 ---------- */
  config: {
    channelMin: 1,
    channelMax: 100,
    maxTries: 10,
    spiritMax: 100,
    spiritPerTune: 10,
    normalChance: 0.7,
    minibossChance: 0.15,
  },

  /* ---------- 开头 / 结局文案 ---------- */
  introLines: [
    "收音机里传来滋滋的电流声。",
    "你按下数字键——静电深处，有什么东西在呼吸。",
    "它没有名字。它正在靠近。",
    "一百个频道。十次机会。找到它。",
  ],

  endingWin: [
    "它的轮廓在你眼前一层一层剥落。",
    "没有血，没有叫声。它只是——散了。",
    "屏幕上重新开始下雪。那些雪花很安静。",
    "你做到了。你听见了它，然后让它闭嘴了。",
    "",
    "【降临 · 已被你听见】",
  ],

  endingLoseSpirit: [
    "你的手指停在按键上，再也按不下去了。",
    "那些声音、形状、名字——一起涌进了你的脑子里。",
    "你开始对着空气说话。空气也在回答你。",
    "",
    "【发疯 · 你成了静电的一部分】",
  ],

  endingDeath: [
    "它的手贯穿了你的胸口。",
    "你低头看了一眼——那里没有血，只有雪花点。",
    "收音机从掌心滑落，砸在地上。",
    "",
    "【死亡 · 你的频道断了】",
  ],

  endingLoseTries: [
    "十次机会用完了。",
    "你仍然没有找到它的频道。",
    "你还在按。但数字键已经没反应了。",
    "它就在某个频道里，听着你。",
    "",
    "【迷失 · 你永远在找它的路上】",
  ],

  /* ---------- 动作（底层仍是剪刀石头布） ----------
   * attack(突进) = 剪刀：克 dodge(滑开)，被 defend(收势) 克
   * defend(收势) = 石头：克 attack(突进)，被 dodge(滑开) 克
   * dodge(滑开)  = 布： 克 defend(收势)，被 attack(突进) 克
   * aiWeights 顺序：[attack, defend, dodge]
   */
  moves: {
    attack:  "攻击",
    defend:  "防御",
    dodge:   "闪避",
  },

  /* ---------- 普通怪物 ----------
   * hp: 需要几轮命中才能击杀
   * spiritDamage: 玩家输一轮扣多少精神
   * trinketChance: 击杀后掉装备概率
   */
  monsters: [
    {
      id: "static_man",
      name: "静电人",
      desc: "由雪花点组成的人形，没有脸。",
      sprite: "assets/sprites/static_man.png",
      hp: 1,
      aiWeights: [4, 4, 4],
      spiritDamage: 4,
      trinketChance: 0.25,
      trinkets: ["tin_ear"],
    },
    {
      id: "tuner_bat",
      name: "失智听众",
      desc: "它戴着一副破耳机，跟着不存在的节拍晃头。",
      sprite: "assets/sprites/tuner_bat.png",
      hp: 1,
      aiWeights: [4, 4, 4],
      spiritDamage: 5,
      trinketChance: 0.25,
      trinkets: ["lead_lining"],
    },
    {
      id: "white_noise_girl",
      name: "白噪女孩",
      desc: "她在唱歌，但你一个字也听不清。",
      sprite: "assets/sprites/white_noise_girl.png",
      hp: 2,
      aiWeights: [4, 4, 4],
      spiritDamage: 6,
      trinketChance: 0.3,
      trinkets: ["crystal_diode"],
    },
    {
      id: "the_listener",
      name: "聆听者",
      desc: "它没有嘴，但它在复述你的念头。",
      sprite: "assets/sprites/the_listener.png",
      hp: 2,
      aiWeights: [4, 4, 4],
      spiritDamage: 8,
      trinketChance: 0.3,
      trinkets: ["tin_ear", "lead_lining", "crystal_diode"],
    },
  ],

  /* ---------- 小BOSS（血厚，奖励好） ---------- */
  minibosses: [
    {
      id: "the_broadcaster",
      name: "广播员",
      desc: "它戴着一副老式耳机，正在替谁播音。",
      sprite: "assets/sprites/broadcaster.png",
      hp: 3,
      aiWeights: [4, 4, 4],
      spiritDamage: 12,
      trinketChance: 1.0,
      trinkets: ["crystal_diode", "fruit_knife"],
    },
    {
      id: "static_colossus",
      name: "静电巨像",
      desc: "它由无数个频道的雪花拼成，每走一步都在掉像素。",
      sprite: "assets/sprites/colossus.png",
      hp: 3,
      aiWeights: [4, 4, 4],
      spiritDamage: 14,
      trinketChance: 1.0,
      trinkets: ["lead_lining", "fruit_knife"],
    },
  ],

  /* ---------- 终极 BOSS ---------- */
  boss: {
    id: "the_descent",
    name: "降 临 之 物",
    desc: "它不是生物。它是一片正在成形的组织。",
    sprite: "assets/sprites/boss.png",
    hp: 5,
    aiWeights: [4, 4, 4],
    spiritDamage: 12,
    trinketChance: 1.0,
    trinkets: ["static_heart"],
  },

  /* ---------- 随机事件（直接执行，20个） ---------- */
  events: [
    { weight: 2, text: "这里是海边。浪声一下一下，像有人在极远处替你数呼吸。你忘了刚才在怕什么。", effect: { type: "spirit", value: 10 } },
    { weight: 2, text: "一张破沙发。弹簧扎人，但你还是坐了一会儿。有人在这上面等过谁。", effect: { type: "spirit", value: 8 } },
    { weight: 1, text: "电话亭里的电话在响。听筒旁挂着一副旧耳机，海绵都烂了。你把它揣进了口袋。", effect: { type: "give_trinket", trinket: "old_headphones" } },
    { weight: 1, text: "黑板上用粉笔写着你的名字。你擦了一半，发现另一半是用你自己的笔迹写的。地上有一卷黑胶布。", effect: { type: "give_trinket", trinket: "black_tape" } },
    { weight: 2, text: "自动售货机嗡嗡作响。掉出一罐冰可乐，拉环上有牙印。", effect: { type: "give_consumable", item: "water" } },
    { weight: 2, text: "公园长椅。树叶的影子在你手背上走。你闭了一会儿眼。", effect: { type: "spirit", value: 15 } },
    { weight: 1, text: "走廊很长，消毒水味。尽头有一扇门，门后有人在叫你小时候的乳名。你没走过去。", effect: { type: "spirit", value: -8 } },
    { weight: 2, text: "一本空白的书。翻到最后一页，画着你——但少了一根手指。", effect: { type: "spirit", value: 5 } },
    { weight: 2, text: "雨打在窗户上。你听着听着，忘了自己为什么在这里。", effect: { type: "spirit", value: 12 } },
    { weight: 1, text: "钢琴自己在弹。你认出那首曲子——是你葬礼上会放的那首。", effect: { type: "spirit", value: -6 } },
    { weight: 1, text: "ATM 吐出一张卡。背面写着你的身份证号。你把它推了回去。", effect: { type: "spirit", value: -5 } },
    { weight: 1, text: "照片里所有人都在看你身后。你没有回头。你不敢。", effect: { type: "spirit", value: -10 } },
    { weight: 2, text: "面包店刚开门。玻璃后面的人对你点了点头，像认识你很久了。", effect: { type: "give_consumable", item: "cracker" } },
    { weight: 1, text: "银幕上在放你的一天。观众席有人在笑，有人在哭。你不知道该坐哪边。", effect: { type: "spirit", value: -8 } },
    { weight: 2, text: "热水浇下来。你低头看自己的手，手指正在变透明。淋浴间地上有一卷脏绷带。", effect: { type: "give_trinket", trinket: "dirty_bandage" } },
    { weight: 1, text: "空售货机。你拍了一下，掉出一枚硬币——是你小时候丢的那枚。", effect: { type: "restore_tries", value: 1 } },
    { weight: 1, text: "一块空碑。上面没名字，却摆着一束还新鲜的花。你站了一会儿。", effect: { type: "spirit", value: 5 } },
    { weight: 1, text: "镜子里的你慢了半拍。你笑，它没笑。你移开了视线。", effect: { type: "spirit", value: -12 } },
    { weight: 2, text: "邮筒里有一封信。没署名。字是你写的，但你不记得写过。", effect: { type: "spirit", value: 8 } },
    { weight: 1, text: "天台风很大。你站在边上，忽然觉得被什么东西从后面轻轻推了一下。", effect: { type: "spirit", value: 20 } },
  ],

  /* ---------- 装备 ---------- */
  trinkets: {
    tin_ear: {
      name: "锡耳朵",
      desc: "用易拉罐做的助听器。战斗失败 -20% 精神损失。",
      mods: { dmgReduce: 0.2 },
    },
    lead_lining: {
      name: "铅衬里",
      desc: "一片薄薄的铅皮。精神上限 +20。",
      mods: { spiritMax: 20 },
    },
    crystal_diode: {
      name: "矿石检波器",
      desc: "每进入一个频道后，精神 +3。",
      mods: { spiritRegen: 3 },
    },
    fruit_knife: {
      name: "水果刀",
      desc: "轻快。30%概率连击打两次。",
      mods: {},
      weapon: { base: 1, comboChance: 0.3 },
    },
    screwdriver: {
      name: "十字螺丝刀",
      desc: "细长。1倍伤害，但25%概率戳空。",
      mods: {},
      weapon: { base: 1, whiff: 0.25 },
    },
    glass_shard: {
      name: "玻璃碎片",
      desc: "锋利但割手。2倍伤害，10%概率自己-2精神。",
      mods: {},
      weapon: { base: 2, backfire: 0.1 },
    },
    wrench: {
      name: "老式扳手",
      desc: "沉重。3倍伤害，但20%概率挥空。",
      mods: {},
      weapon: { base: 3, whiff: 0.2 },
    },
    tuning_fork: {
      name: "断音叉",
      desc: "刺耳。1倍伤害，但命中后回3精神。",
      mods: {},
      weapon: { base: 1, spiritOnHit: 3 },
    },
    hunter_notebook: {
      name: "猎人笔记",
      desc: "前3轮找到BOSS奖励。1倍伤害，命中回2精神，精神上限+20。",
      mods: { spiritMax: 20 },
      weapon: { base: 1, spiritOnHit: 2 },
    },
    static_heart: {
      name: "静电心脏",
      desc: "BOSS 掉落。它在你胸腔里跳动，频率和它一样。",
      mods: { spiritMax: 30, dmgReduce: 0.3 },
    },
    old_headphones: {
      name: "旧耳机",
      desc: "逃跑不扣精神。",
      mods: { fleeNoPenalty: true },
    },
    dirty_bandage: {
      name: "脏绷带",
      desc: "每打赢一场怪，精神 +3。",
      mods: { healOnKill: 3 },
    },
    black_tape: {
      name: "黑胶布",
      desc: "精神上限 +10，减伤 10%。",
      mods: { spiritMax: 10, dmgReduce: 0.1 },
    },
  },

  /* ---------- 消耗品（战斗中可使用，回精神） ---------- */
  consumables: {
    cracker: { name: "压缩饼干", value: 15, desc: "+15" },
    water:   { name: "半瓶水",   value: 10, desc: "+10" },
    cocoa:   { name: "热可可",   value: 25, desc: "+25" },
  },

  /* ---------- 随机文案池（每条 3 句，随机抽一句） ---------- */
  TEXTS: {
    // 输入一个新频道
    tune_in: [
      "数字敲进去，静电滋滋响了一阵，稳了。",
      "静电像水一样漫上来，又退下去。",
      "你把频率卡在这里——这里有东西。",
    ],
    // 高了
    too_high: [
      "仪器发出一声尖鸣——波段【高了】。",
      "指示灯闪了闪，像在摇头：再低一点。",
      "刺耳的啸叫。你输太大了。",
    ],
    // 低了
    too_low: [
      "仪器发出一声闷响——波段【低了】。",
      "指示灯暗了暗：还不够。",
      "声音沉在水底。再往上输一点。",
    ],
    // 遇普通怪
    enc_normal: [
      "雪花点聚成了一个形状。它在看你。",
      "屏幕里有什么东西，从噪音里站了起来。",
      "这个频道不空。它已经在等你了。",
    ],
    // 遇小BOSS
    enc_miniboss: [
      "这个频道太安静了——安静得像故意的。",
      "静电退潮，露出一个比想象中大得多的轮廓。",
      "你输到了一个不该输的地方。",
    ],
    // 遇BOSS
    enc_boss: [
      "指示灯猛地亮成一片。屏幕炸开白噪——它就在这里。",
      "所有静电同时停了。你听见了它的呼吸。",
      "频道对上了。你知道，它也知道。",
    ],
    // 这一轮你命中了它（有武器）
    hit_foe: [
      "你扑上去，它没躲开。",
      "刀刃结结实实落在它身上。",
      "它慢了半拍，你得手了。",
    ],
    // 这一轮你命中了它（空手）
    hit_foe_bare: [
      "你扑上去，用拳头砸在它身上。",
      "你一把揪住它的轮廓，撕了下去。",
      "你没拿刀，但它还是被你打中了。",
    ],
    // 这一轮你收势挡住了（成功减伤）
    defend_ok: [
      "你沉住气，它的攻击撞在你面前碎成雪花。",
      "你没动。它扑了个空，只有余波扫过你。",
      "你把大部分动静都吞了下去。",
    ],
    // 防御没挡住
    defend_fail: [
      "你想挡住，但那股力量太大了。",
      "你没站稳。它的攻击穿了过来。",
      "你防了个寂寞。",
    ],
    // 这一轮你吃了一下
    hit_self: [
      "它比你快。那一下结结实实。",
      "你没来得及反应。",
      "它抓住了你的空档。",
    ],
    // 双方攻击，你打中
    clash_win: [
      "你们同时扑向对方——你先碰到它。",
      "硬碰硬。它退了半步，你站稳了。",
      "谁也没躲。但你的刀更快。",
    ],
    // 双方攻击，你打中（空手）
    clash_win_bare: [
      "你们同时扑向对方——你一拳抡在它脸上。",
      "硬碰硬。它退了半步，你攥着拳头站稳了。",
      "谁也没躲。但你先扑到了它身上。",
    ],
    // 双方攻击，它打中
    clash_lose: [
      "你们同时扑向对方——它先碰到你。",
      "硬碰硬。你退了半步，它站稳了。",
      "谁也没躲。但它的爪子更快。",
    ],
    // 你打它防着的（无事）
    blocked: [
      "你砍上去，它的轮廓纹丝不动。",
      "刀刃撞在一层静电上，滑开了。",
      "它缩成一团。你打不穿。",
    ],
    // 僵持
    round_draw: [
      "你们同时动了，又同时停住。",
      "谁也没碰到谁。静电在中间滋滋响。",
      "它歪了歪头。你也没敢动。",
    ],
    // 击杀普通怪
    kill_normal: [
      "它的轮廓散成雪花，退回了噪音里。",
      "它最后看了你一眼，然后消失了。",
      "这个频道又空了。",
    ],
    // 击杀小BOSS
    kill_miniboss: [
      "它倒下的时候，整个屏幕闪了三下。",
      "巨大的轮廓塌成一片静电。有什么东西从里面掉了出来。",
      "它没了。但你知道，真正的那个还在更深处。",
    ],
    // 获得装备
    get_trinket: [
      "你从碎片里捡起一件东西。它还带着温度。",
      "屏幕上掉下来一个小物件，你攥进了手心。",
      "这东西属于这里。但现在它属于你了。",
    ],
    // 用物品
    use_item: [
      "你嚼着东西，盯着它的眼睛。",
      "一口热水下去，耳鸣轻了一点。",
      "你抓紧时间喘了口气。",
    ],
    // 逃跑
    flee: [
      "你猛地按下退出键。它的手伸到一半，停住了。",
      "你连滚带爬地退出了这个频道。",
      "它没有追。也许是不能，也许是不想。",
    ],
    // 赢了回精神
    gain_spirit: [
      "你稳住了。精神 +",
      "你找到了一点节奏。精神 +",
      "这一下打对了。精神 +",
    ],
    // 攻击落空
    miss: [
      "你扑了个空。它晃了一下。",
      "刀刃划过空气，什么都没碰到。",
      "它闪开了。",
    ],
    // 闪避成功
    dodge_ok: [
      "你贴着地面滑开，它扑空了。",
      "你绕到了它身后。心跳很快。",
      "你的动作比它快了半拍。",
    ],
    // 闪避失败
    dodge_fail: [
      "你以为自己闪开了——但没有。",
      "脚下一滑。它抓住了这个空档。",
      "你慢了半拍。",
    ],
  },
};



