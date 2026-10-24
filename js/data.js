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
    normalChance: 0.5,
    minibossChance: 0.12,
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

  endingSpeedrun: [
    "你甚至没怎么找。",
    "第三个频道。它就在那里，等着被你发现。",
    "你杀死它的时候，它甚至没来得及展开。",
    "太巧了。巧得像它故意让你找到的。",
    "",
    "【速通玩家 · 你是不是来过这里？】",
  ],

  endingLoseSpirit: [
    "你的手指停在按键上，再也按不下去了。",
    "那些声音、形状、名字——一起涌进了你的脑子里。",
    "你开始对着空气说话。空气也在回答你。",
    "收音机从掌心滑落，你没去捡。",
    "",
    "【发疯 · 你成了静电的一部分】",
  ],

  endingDeath: [
    "它的手贯穿了你的胸口。",
    "你低头看了一眼——那里没有血，只有雪花点。",
    "你想说点什么，但嘴里出来的是滋滋声。",
    "屏幕上最后闪过一个频道号。你没看清。",
    "",
    "【死亡 · 你的频道断了】",
  ],

  endingLoseTries: [
    "十次机会用完了。",
    "你仍然没有找到它的频道。",
    "你还在按。但数字键已经没反应了。",
    "它就在某个频道里，听着你。它知道你找不到了。",
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
      aiWeights: [5, 3, 3],
      spiritDamage: 5,
      skill: "disableDefend",
      skillChance: 0.3,
      trinketChance: 0.25,
      trinkets: ["lead_lining"],
    },
    {
      id: "white_noise_girl",
      name: "白噪女孩",
      desc: "她在唱歌，但你一个字也听不清。",
      sprite: "assets/sprites/white_noise_girl.png",
      hp: 2,
      aiWeights: [3, 3, 5],
      spiritDamage: 6,
      skill: "disableDodge",
      skillChance: 0.25,
      trinketChance: 0.3,
      trinkets: ["crystal_diode"],
    },
    {
      id: "the_listener",
      name: "聆听者",
      desc: "它没有嘴，但它在复述你的念头。",
      sprite: "assets/sprites/the_listener.png",
      hp: 2,
      aiWeights: [5, 3, 3],
      spiritDamage: 8,
      skill: "disableAttack",
      skillChance: 0.25,
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
    // 无选择，直接发生（小事件）
    { weight: 1, text: "这里是海边。浪声一下一下，像有人在极远处替你数呼吸。你忘了刚才在怕什么。", effect: { type: "spirit", value: 5 }, luck: 2 },
    { weight: 1, text: "一张破沙发。弹簧扎人，但你还是坐了一会儿。有人在这上面等过谁。", effect: { type: "spirit", value: 3 }, luck: 1 },
    { weight: 2, text: "公园长椅。树叶的影子在你手背上走。你闭了一会儿眼。", effect: { type: "spirit", value: 4 }, luck: 2 },
    { weight: 2, text: "雨打在窗户上。你听着听着，忘了自己为什么在这里。", effect: { type: "spirit", value: 4 }, luck: 1 },
    { weight: 2, text: "楼道灯坏了。你摸着黑走，脚下是自己的家。", effect: { type: "spirit", value: 3 }, luck: 1 },
    // 负面小事件
    { weight: 2, text: "钢琴自己在弹。你认出那首曲子——是你葬礼上会放的那首。", effect: { type: "spirit", value: -5 }, luck: -1 },
    { weight: 2, text: "照片里所有人都在看你身后。你没有回头。", effect: { type: "spirit", value: -6 }, luck: -1 },
    { weight: 2, text: "有人在你身后数你的脚步。你走快，它也快。", effect: { type: "spirit", value: -6 }, luck: -1 },
    { weight: 2, text: "电梯里贴着寻人启事。照片上的人是你。", effect: { type: "spirit", value: -5 }, luck: -1 },
    { weight: 1, text: "镜子里的你慢了半拍。你笑，它没笑。", effect: { type: "spirit", value: -8 }, luck: -2 },
    { weight: 1, text: "走廊尽头有人在叫你小时候的乳名。你没走过去。", effect: { type: "spirit", value: -5 }, luck: -1 },
    { weight: 1, text: "银幕上在放你的一天。观众席有人在笑。", effect: { type: "spirit", value: -6 }, luck: -1 },

    // 有选择
    { weight: 2, text: "自动售货机嗡嗡响。投币口卡着一罐东西。", options: [
      { label: "伸手去够", ok: {spirit: 10, give: "water"}, bad: {spirit: -8}, luckMod: 0.1, okText: "你够到了那罐东西。拉环上有牙印。", badText: "你手被机器夹了一下。里面在笑。" },
      { label: "拍一下机器", ok: {tries: 1}, bad: {spirit: -5}, luckMod: -0.1, okText: "机器哐当一声，多吐出一枚硬币。是你小时候丢的那枚。", badText: "机器没反应。你拍得手疼，它却在晃。" },
    ]},
    { weight: 2, text: "走廊尽头有一扇门，门后有人在叫你小时候的乳名。", options: [
      { label: "走过去开门", ok: {spirit: 15, give: "old_headphones"}, bad: {spirit: -12}, luckMod: -0.2, okText: "门后是空的。地上有一副旧耳机，海绵都烂了。", badText: "门后有什么东西凑过来，贴着你的耳朵。" },
      { label: "转身往回走", ok: {spirit: 3}, bad: {spirit: -3}, luckMod: 0, okText: "你转身走了。那声音渐渐远了。", badText: "那声音追了你一路。你到家它还在叫。" },
    ]},
    { weight: 1, text: "镜子里的你慢了半拍。你笑，它没笑。", options: [
      { label: "盯着它看", ok: {give: "third_eye"}, bad: {spirit: -15}, luckMod: -0.3, okText: "镜子裂开。一只眼睛从裂缝里长出来，嵌进了你的额头。", badText: "镜子里的你伸手出来，攥住了你的手腕。" },
      { label: "移开视线", ok: {spirit: 2}, bad: {spirit: -5}, luckMod: 0, okText: "你移开视线。它恢复了正常。", badText: "你移开视线后，后颈凉飕飕的。它在你背后。" },
    ]},
    { weight: 2, text: "废墟里有一台老式无线电，还在响。", options: [
      { label: "捡起来", ok: {give: "old_radio"}, bad: {spirit: -10}, luckMod: -0.2, okText: "无线电钻进你口袋，再也掏不出来了。", badText: "无线电烫得像烧红的铁。里面在播你的讣告。" },
      { label: "踹开它", ok: {spirit: 5}, bad: {spirit: -5}, luckMod: 0, okText: "你一脚踹碎了它。安静了。", badText: "你踹到了自己的脚。它还在响。" },
    ]},
    { weight: 1, text: "桌子上有一碗冷掉的饭。你饿极了。", options: [
      { label: "吃下去", ok: {give: "iron_stomach"}, bad: {spirit: -15}, luckMod: -0.3, okText: "你吃了下去。从那以后，你的胃变成了铁。", badText: "饭里有东西在动。你吐了出来——是一截手指。" },
      { label: "倒掉", ok: {spirit: 0}, bad: {spirit: -3}, luckMod: 0, okText: "你把饭倒了。肚子还是饿。", badText: "你倒掉时，碗底有一张你的脸。它在嚼。" },
    ]},
    { weight: 1, text: "黑板上用粉笔写着你的名字。另一半是你自己的笔迹。", options: [
      { label: "全擦掉", ok: {spirit: 8}, bad: {spirit: -8}, luckMod: 0.1, okText: "你擦干净了。黑板上空空的。", badText: "你擦到一半，名字自己又长了出来。越写越密。" },
      { label: "留着", ok: {spirit: -3}, bad: {spirit: -3}, luckMod: 0, okText: "你没擦。它在那里看着你，你转身走了。", badText: "你没擦。黑板上开始密密麻麻浮现出你不认识的字符，你打了个寒颤。" },
    ]},
    { weight: 1, text: "照片里所有人都在看你身后。", options: [
      { label: "回头看", ok: {spirit: 10, give: "black_tape"}, bad: {spirit: -15}, luckMod: -0.2, okText: "身后什么都没有。地上有一卷黑胶布。", badText: "你回头时，那东西正贴在你后背上。" },
      { label: "不回头", ok: {spirit: 5}, bad: {spirit: -2}, luckMod: 0.1, okText: "你没回头。那东西失去了兴趣。", badText: "你没回头。但它在你耳朵边呼了口气。" },
    ]},
    { weight: 2, text: "淋浴间地上有一卷脏绷带。水很烫。", options: [
      { label: "捡起绷带", ok: {give: "dirty_bandage", spirit: 8}, bad: {spirit: -5}, luckMod: 0.1, okText: "你捡起绷带，缠在手腕上。它温温的。", badText: "绷带上有血。你缩了一下手。血是热的。" },
      { label: "只洗澡", ok: {spirit: 12}, bad: {spirit: -3}, luckMod: 0, okText: "热水冲下来，你觉得轻了一点。", badText: "水忽然变凉了。水里有头发。" },
    ]},
    { weight: 1, text: "天台风很大。你站在边上，忽然觉得被什么东西从后面轻轻推了一下。", options: [
      { label: "往前迈一步", ok: {spirit: 20}, bad: {spirit: -20}, luckMod: -0.4, okText: "你迈出去——风灌进肺里。你还活着。", badText: "你迈出去——那一下像被人从背后猛推了一把。你退了回来。" },
      { label: "退回来", ok: {spirit: 5}, bad: {spirit: -2}, luckMod: 0, okText: "你退回来了。风还在吹。", badText: "你退回来时，差点摔。它在你后颈吹了口气。" },
    ]},
    { weight: 1, text: "有人在你身后数你的脚步。你走快，它也快。", options: [
      { label: "突然停下", ok: {spirit: 10}, bad: {spirit: -12}, luckMod: 0.1, okText: "你猛地停下。身后什么都没有。", badText: "你停下时，它撞上了你。它没有影子。" },
      { label: "继续走", ok: {spirit: 2}, bad: {spirit: -8}, luckMod: -0.1, okText: "你继续走。它数到了你家门口。", badText: "它数得越来越近。你数了一下——它多了一个人。" },
    ]},
    { weight: 1, text: "电梯里的寻人启事，照片上是你。", options: [
      { label: "撕下来", ok: {spirit: 8}, bad: {spirit: -8}, luckMod: 0.1, okText: "你撕下来揉成一团。", badText: "你撕下来时，照片上的你眨了眨眼。" },
      { label: "假装没看见", ok: {spirit: 0}, bad: {spirit: -6}, luckMod: 0, okText: "你假装没看见。电梯到了。", badText: "电梯没到。但门开了。外面是黑的。" },
    ]},
    { weight: 2, text: "空无一人的便利店。货架上有面包和水。", options: [
      { label: "拿面包", ok: {give: "cracker", spirit: 5}, bad: {spirit: -5}, luckMod: 0.1, okText: "你拿了面包。没人来。", badText: "面包过期了。你肚子疼。里面有牙齿。" },
      { label: "拿水", ok: {give: "water", spirit: 5}, bad: {spirit: -5}, luckMod: 0.1, okText: "你拿了水。冰的。", badText: "水里有东西在游。它在看你。" },
    ]},
    { weight: 1, text: "ATM 吐出一张卡，背面写着你的身份证号。", options: [
      { label: "拿走卡", ok: {tries: 1}, bad: {spirit: -10}, luckMod: -0.2, okText: "你拿走卡。ATM 多吐了一次。", badText: "卡上的名字慢慢变成了你的。" },
      { label: "推回去", ok: {spirit: 3}, bad: {spirit: 0}, luckMod: 0, okText: "你把卡推回去。它再也没出来。", badText: "你把卡推回去。发现有双眼睛在机器里看着你。" },
    ]},
    { weight: 1, text: "一个白大褂的人递给你两团棉花。\"戴上它。\"他说。", options: [
      { label: "接过棉花", ok: {give: "noise_canceler"}, bad: {spirit: -15}, luckMod: 0.1, okText: "你把棉花塞进耳朵。白噪声小了。", badText: "这棉花黑黑的，像一团头发。它还在动。" },
      { label: "拒绝", ok: {spirit: 5}, bad: {spirit: -5}, luckMod: 0, okText: "你没接。他消失了。", badText: "他叹了口气。你耳朵开始响。是他在说话。" },
    ]},
    // 新增大事件
    { weight: 1, text: "电话亭里的电话在响。听筒旁挂着一副旧耳机。", options: [
      { label: "接起来", ok: {spirit: 12, give: "old_headphones"}, bad: {spirit: -15}, luckMod: 0.1, okText: "里面是你妈妈的声音。她说饭好了。", badText: "里面是你自己的声音。在说你葬礼的时间。" },
      { label: "挂掉", ok: {spirit: 2}, bad: {spirit: -5}, luckMod: 0, okText: "你挂了。它不响了。", badText: "你挂了。它又响了。用更大的力气。" },
    ]},
    { weight: 1, text: "空椅子上搭着一件你的外套。口袋里有东西。", options: [
      { label: "穿上外套", ok: {spirit: 10}, bad: {spirit: -8}, luckMod: 0.1, okText: "外套很暖。口袋里有一颗糖。", badText: "外套很沉。口袋里有一张你的照片。照片上你在哭。" },
      { label: "只掏口袋", ok: {give: "cracker", spirit: 3}, bad: {spirit: -5}, luckMod: 0, okText: "你掏出一块压缩饼干。", badText: "你掏出口袋。里面是一根手指。指甲是你的。" },
    ]},
    { weight: 1, text: "卫生间水龙头一直在滴答。你拧紧了，它还在滴。", options: [
      { label: "拆开水龙头", ok: {spirit: 12, give: "water"}, bad: {spirit: -10}, luckMod: 0.1, okText: "水龙头里掉出一卷胶布。水终于停了。", badText: "水龙头里掉出来一截头发。它还在动。" },
      { label: "不管它", ok: {spirit: 3}, bad: {spirit: -5}, luckMod: 0, okText: "你走了。滴答声留在了身后。", badText: "你躺下时，滴答声在你枕头边上。" },
    ]},
    { weight: 1, text: "电视开着。屏幕上在放你昨天做的事。", options: [
      { label: "坐下来看", ok: {spirit: 5}, bad: {spirit: -10}, luckMod: 0.1, okText: "你看了一会儿。它放完了。", badText: "你看了一会儿。它开始放你没做过的事。" },
      { label: "关掉", ok: {spirit: 3}, bad: {spirit: -5}, luckMod: 0, okText: "你关了。屏幕黑了。", badText: "你关了。它又自己开了。" },
    ]},
    { weight: 1, text: "床底下有人在呼吸。", options: [
      { label: "趴下去看", ok: {spirit: 8, give: "black_tape"}, bad: {spirit: -15}, luckMod: -0.2, okText: "床底下是空的。有一卷黑胶布。", badText: "床底下有一只腐臭膨胀的猫咪。它在看你。" },
      { label: "上床睡", ok: {spirit: 10}, bad: {spirit: -8}, luckMod: 0, okText: "你上床睡了。呼吸声慢慢停了。", badText: "你刚躺下。呼吸声在你耳朵边上。" },
    ]},
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
    noise_canceler: {
      name: "抗噪耳塞",
      desc: "戴上后，即使在白噪声里也能听清高低。",
      mods: { ignoreNoise: true },
    },
    old_mic: {
      name: "旧麦克风",
      desc: "广播员的东西。1倍伤害，每次命中回2精神。",
      mods: {},
      weapon: { base: 1, spiritOnHit: 2 },
    },
    giant_knuckle: {
      name: "巨像的手",
      desc: "空手攻击伤害 +1。",
      mods: { bareBonus: 1 },
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
    /* ---------- 神器（装上取不下来） ---------- */
    third_eye: {
      name: "第三只眼",
      desc: "【神器】攻击不会挥空，但精神上限 -20。它正在你额头上睁开。",
      mods: { spiritMax: -20, noWhiff: true },
      cursed: true,
    },
    old_radio: {
      name: "旧无线电",
      desc: "【神器】每次调频后回5精神，但更容易遇怪。它在你口袋里自己响。",
      mods: { spiritRegen: 5, aggro: true },
      cursed: true,
    },
    iron_stomach: {
      name: "铁胃",
      desc: "【神器】吃任何东西效果翻倍，但逃跑扣20精神。",
      mods: { doubleFood: true, fleeBad: true },
      cursed: true,
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
      "你扑上去，刀刃切开它的轮廓，像划开一层湿纸。",
      "你一刀扎进去，它没有血，只有雪花从伤口里漏出来。",
      "它慢了半拍。你的刀已经陷进去了，拔出来时带着一声滋滋声。",
    ],
    // 这一轮你命中了它（空手）
    hit_foe_bare: [
      "你扑上去，一拳砸在它脸上。它的脸是凉的。",
      "你一把揪住它的轮廓，撕下一截。它没叫。",
      "你攥紧拳头砸上去，它晃了晃，像一台信号不好的电视。",
    ],
    // 这一轮你收势挡住了（成功减伤）
    defend_ok: [
      "你沉住气，它的手撞在你面前，碎成一片雪花。",
      "你没动。它扑了个空，只有一阵冷风扫过你。",
      "你把那一下吞了下去。骨头没碎，但牙在打颤。",
    ],
    // 防御没挡住
    defend_fail: [
      "你想挡住，但那只手穿过了你的手臂。",
      "你没站稳。它的攻击从你胸口穿了过去。",
      "你防住了一半。另一半在你身体里。",
    ],
    // 这一轮你吃了一下
    hit_self: [
      "它比你快。那一下结结实实，像被门夹了。",
      "你没来得及反应。它已经碰到了你。",
      "它抓住了你的空档。你听见自己脑子里叮了一声。",
    ],
    // 双方攻击，你打中
    clash_win: [
      "你们同时扑向对方——你的刀先碰到了它。",
      "硬碰硬。它退了半步，你站稳了。你的手在抖。",
      "谁也没躲。但你的刀比它快了零点一秒。",
    ],
    // 双方攻击，你打中（空手）
    clash_win_bare: [
      "你们同时扑向对方——你一拳抡在它下巴上。",
      "硬碰硬。它退了半步，你攥着拳头站稳了。",
      "谁也没躲。但你先扑到了它身上。",
    ],
    // 双方攻击，它打中
    clash_lose: [
      "你们同时扑向对方——它的手先碰到了你。",
      "硬碰硬。你退了半步，它站稳了。",
      "谁也没躲。但它的爪子比你快。",
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



