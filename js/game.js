/* ============================================
   降临 DESCENT — 主逻辑
   ============================================ */

(function () {
  "use strict";

  /* ---------- DOM ---------- */
  const $ = (id) => document.getElementById(id);
  const el = {
    titleScreen: $("title-screen"),
    startBtn: $("btn-start"),
    freqNum: $("freq-num"),
    ledSignal: $("led-signal"),
    ledWarn: $("led-warn"),
    stageCanvas: $("stage-canvas"),
    stageText: $("stage-text"),
    spiritBar: $("spirit-bar"),
    spiritNum: $("spirit-num"),
    triesNum: $("tries-num"),
    trinketSlot: $("trinket-slot"),
    logContent: $("log-content"),
    logUp: $("log-up"),
    logDown: $("log-down"),
    inputDisplay: $("input-display"),
    keys: document.querySelectorAll(".key[data-k]"),
    viewNumpad: $("view-numpad"),
    viewBattle: $("view-battle"),
    keypadGrid: $("keypad-grid"),
    btnInv: $("btn-inv"),
    fieldInv: $("field-inv"),
    fieldInvBack: $("field-inv-back"),
    fieldInvGrid: $("field-inv-grid"),
    fieldInvAction: $("field-inv-action"),
    fieldInvActionName: $("field-inv-action-name"),
    battlePrompt: $("battle-prompt"),
    battleActions: $("battle-actions"),
    battleBtns: document.querySelectorAll(".battle-key[data-move]"),
    itemList: $("item-list"),
    itemBack: $("item-back"),
    itemListGrid: $("item-list-grid"),
    itemListAction: $("item-list-action"),
    itemListActionName: $("item-list-action-name"),
    endOverlay: $("end-overlay"),
    endText: $("end-text"),
    endStats: $("end-stats"),
    replaceOverlay: $("replace-overlay"),
    replaceText: $("replace-text"),
    replaceList: $("replace-list"),
    eventOverlay: $("event-overlay"),
    eventText: $("event-text"),
    eventOptions: $("event-options"),
    restartBtn: $("btn-restart"),
  };

  const BAG_SIZE = 5;

  /* ---------- 物品类型 ---------- */
  function itemType(id) {
    if (GAME_DATA.consumables[id]) return "consumable";
    const t = GAME_DATA.trinkets[id];
    if (t && t.weapon) return "weapon";
    return "trinket";
  }
  function itemName(id) {
    const c = GAME_DATA.consumables[id];
    if (c) return c.name;
    const t = GAME_DATA.trinkets[id];
    return t ? t.name : id;
  }
  function itemDesc(id) {
    const c = GAME_DATA.consumables[id];
    if (c) return c.desc;
    const t = GAME_DATA.trinkets[id];
    return t ? t.desc : "";
  }
  function itemIcon(id) {
    const icons = {
      water: "💧", cracker: "▤", soda: "◉", choco: "■",
      fruit_knife: "🔪", screwdriver: "⊢", glass_shard: "◣", wrench: "🔧",
      tuning_fork: "⋔", old_mic: "🎤", colossus_fist: "✊",
      tin_ear: "◉", lead_lining: "▓", crystal_diode: "◆",
      third_eye: "👁", old_radio: "📻", iron_stomach: "▣",
      black_tape: "▬", dirty_bandage: "⊜", noise_canceler: "♫",
      weird_fuse: "⚡", static_heart: "♥",
    };
    return icons[id] || "?";
  }

  /* ---------- 游戏状态 ---------- */
  let S = null;

  function newState() {
    return {
      phase: "TITLE",
      bossChannel: 0,
      spirit: GAME_DATA.config.spiritMax,
      tries: GAME_DATA.config.maxTries,
      bag: [],
      equipped: { weapon1: null, weapon2: null, trinket1: null, trinket2: null },
      currentInput: "",
      battle: null,
      deathBy: "explore",   // explore(发疯) | battle(死亡)
      luck: 50,            // 隐藏幸运值 0-100
      timesTuned: 0,       // 已调频次数
      usedEvents: [],      // 已出现过的事件
      proximityMode: false, // 打败第5次小BOSS后进入近远模式
      lightsBroken: false,  // 打败第8次小BOSS后灯坏了
    };
  }

  function equippedList() {
    const e = [];
    if (S.equipped.weapon1) e.push(S.equipped.weapon1);
    if (S.equipped.weapon2) e.push(S.equipped.weapon2);
    if (S.equipped.trinket1) e.push(S.equipped.trinket1);
    if (S.equipped.trinket2) e.push(S.equipped.trinket2);
    return e;
  }

  function spiritMax() {
    let m = GAME_DATA.config.spiritMax;
    equippedList().forEach((id) => {
      const t = GAME_DATA.trinkets[id];
      if (t && t.mods.spiritMax) m += t.mods.spiritMax;
    });
    return m;
  }
  function dmgReduce() {
    let r = 0;
    equippedList().forEach((id) => {
      const t = GAME_DATA.trinkets[id];
      if (t && t.mods.dmgReduce) r += t.mods.dmgReduce;
    });
    return Math.min(r, 0.8);
  }
  function spiritRegen() {
    let r = 0;
    equippedList().forEach((id) => {
      const t = GAME_DATA.trinkets[id];
      if (t && t.mods.spiritRegen) r += t.mods.spiritRegen;
    });
    return r;
  }
  function currentWeapons() {
    const w = [];
    if (S.equipped.weapon1) w.push(GAME_DATA.trinkets[S.equipped.weapon1]);
    if (S.equipped.weapon2) w.push(GAME_DATA.trinkets[S.equipped.weapon2]);
    return w;
  }

  function performAttack() {
    // 返回 { dmg, extraMsg, whiffed }
    const weapons = currentWeapons();
    if (weapons.length === 0) {
      let dmg = 1;
      const hasKnuckle = equippedList().includes("giant_knuckle");
      if (hasKnuckle) dmg += 1;
      return { dmg, extraMsg: "", whiffed: false };
    }
    const noWhiff = equippedList().some((id) => {
      const t = GAME_DATA.trinkets[id];
      return t && t.mods && t.mods.noWhiff;
    });
    let totalDmg = 0;
    let msg = "";
    let anyWhiff = false;
    let allWhiff = true;
    for (const w of weapons) {
      const spec = w.weapon;
      if (spec.whiff && !noWhiff && Math.random() < spec.whiff) {
        anyWhiff = true;
        continue;
      }
      allWhiff = false;
      let d = spec.base;
      if (spec.comboChance && Math.random() < spec.comboChance) {
        d *= 2;
        msg += "连击！";
      }
      if (spec.backfire && Math.random() < spec.backfire) {
        S.spirit = Math.max(0, S.spirit - 2);
        msg += "割到了自己。";
      }
      if (spec.spiritOnHit) {
        S.spirit = Math.min(spiritMax(), S.spirit + spec.spiritOnHit);
        msg += `精神 +${spec.spiritOnHit}。`;
      }
      totalDmg += d;
    }
    if (allWhiff) {
      return { dmg: 0, extraMsg: "但你挥空了。", whiffed: true };
    }
    return { dmg: totalDmg, extraMsg: msg, whiffed: false };
  }

  function pick(key) {
    const pool = GAME_DATA.TEXTS[key];
    if (!pool || !pool.length) return "";
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function log(text, type) {
    // 去重：和最后一行一样就不重复打
    const last = el.logContent.lastElementChild;
    if (last && last.textContent === text) return;
    // 去掉上一行的 latest
    const old = el.logContent.querySelector(".latest");
    if (old) old.classList.remove("latest");
    const p = document.createElement("p");
    p.className = "log-line latest" + (type ? " " + type : "");
    p.textContent = text;
    el.logContent.appendChild(p);
    // 自动滚到底
    el.logContent.scrollTop = el.logContent.scrollHeight;
  }

  function updateHUD() {
    const max = spiritMax();
    el.spiritBar.style.width = Math.max(0, (S.spirit / max) * 100) + "%";
    el.spiritNum.textContent = Math.max(0, S.spirit) + "/" + max;
    el.triesNum.textContent = S.tries;
    const eq = equippedList().map((id) => itemIcon(id) + itemName(id));
    el.trinketSlot.textContent = eq.length ? eq.join(" ") : "—";
  }

  function setFreq(n) {
    el.freqNum.textContent = String(n).padStart(3, "0");
  }

  function setLights(kind) {
    S.lastLights = kind;
    el.ledSignal.classList.remove("on-signal", "on-warn");
    el.ledWarn.classList.remove("on-signal", "on-warn");
    if (kind === "low") el.ledSignal.classList.add("on-warn");
    else if (kind === "high") el.ledWarn.classList.add("on-warn");
    else if (kind === "boss") {
      el.ledSignal.classList.add("on-warn");
      el.ledWarn.classList.add("on-warn");
    }
  }
  function restoreLights() {
    if (S && S.lastLights) setLights(S.lastLights);
  }

  function drawStatic(canvas, intensity) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < w * h; i++) {
      const v = Math.random() * 255 * intensity;
      img.data[i * 4] = v;
      img.data[i * 4 + 1] = v;
      img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  function drawMonster(ctx, monsterId, cw, ch) {
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = "#fff";
    const cx = cw / 2, cy = ch / 2;
    const s = Math.min(cw, ch) / 20; // 像素单位

    // 基础像素人形（由小方块组成）
    function pixel(x, y, w, h) {
      ctx.fillRect(cx + x * s, cy + y * s, w * s, h * s);
    }

    if (monsterId === "static_man") {
      // 静电人：散点人形
      for (let i = 0; i < 60; i++) {
        const x = (Math.random() - 0.5) * 8;
        const y = (Math.random() - 0.5) * 12;
        pixel(x, y, 0.3, 0.3);
      }
    } else if (monsterId === "tuner_bat") {
      // 失智听众：戴耳机
      pixel(-1, -3, 2, 2); // 头
      pixel(-1.5, -2.5, 0.5, 0.5); // 耳机左
      pixel(1, -2.5, 0.5, 0.5); // 耳机右
      pixel(-0.8, -1, 1.6, 3); // 身体
    } else if (monsterId === "white_noise_girl") {
      // 白噪女孩：长发
      pixel(-1, -3, 2, 2); // 头
      pixel(-1.5, -3, 0.5, 4); // 发左
      pixel(1, -3, 0.5, 4); // 发右
      pixel(-0.8, -1, 1.6, 4); // 身体
    } else if (monsterId === "the_listener") {
      // 聆听者：大头
      pixel(-1.5, -3.5, 3, 3); // 大头
      pixel(-0.8, -0.5, 1.6, 3); // 身体
      pixel(-1, -2, 0.5, 0.3); // 眼睛
      pixel(0.5, -2, 0.5, 0.3);
    } else if (monsterId === "broadcaster") {
      // 广播员：带麦克风
      pixel(-1, -3, 2, 2);
      pixel(-0.8, -1, 1.6, 3);
      pixel(1, 0, 0.3, 2); // 麦克风杆
      pixel(0.8, -0.5, 0.7, 0.5); // 麦头
    } else if (monsterId === "colossus") {
      // 巨像：大块头
      pixel(-2, -4, 4, 3);
      pixel(-2.5, -1, 5, 5);
      pixel(-3, 1, 0.5, 3); // 左手臂
      pixel(2.5, 1, 0.5, 3); // 右手臂
    } else if (monsterId === "the_descent") {
      // 降临之物：一团扭曲组织
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 5;
        pixel(Math.cos(angle) * r, Math.sin(angle) * r, 0.4, 0.4);
      }
    }

    // 雪花噪声叠加
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    for (let i = 0; i < 100; i++) {
      ctx.fillRect(Math.random() * cw, Math.random() * ch, 1, 1);
    }
    // 水平错位条
    for (let i = 0; i < 5; i++) {
      const y = Math.random() * ch;
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(0, y, cw, 1 + Math.random() * 2);
    }
  }

  function showSprite(src, fallbackText) {
    const img = new Image();
    img.onload = () => {
      el.stageText.classList.add("hidden");
      el.stageCanvas.classList.remove("hidden");
      const ctx = el.stageCanvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, el.stageCanvas.width, el.stageCanvas.height);
      const cw = el.stageCanvas.width, ch = el.stageCanvas.height;
      const scale = Math.min(cw / img.width, ch / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };
    img.onerror = () => {
      el.stageCanvas.classList.add("hidden");
      el.stageText.classList.remove("hidden");
      el.stageText.textContent = fallbackText || "— 静 电 —";
    };
    img.src = src;
  }

  /* ---------- 背包 ---------- */
  function hasItem(id) {
    if (S.equipped.weapon1 === id) return true;
    if (S.equipped.weapon2 === id) return true;
    if (S.equipped.trinket1 === id) return true;
    if (S.equipped.trinket2 === id) return true;
    return S.bag.some((b) => b.id === id);
  }

  function addToBag(id) {
    const type = itemType(id);
    if (type === "consumable") {
      const existing = S.bag.find((b) => b.id === id);
      if (existing) { existing.count += 1; return true; }
    }
    if (S.bag.length >= BAG_SIZE) {
      showReplacePrompt(id);
      return true;
    }
    S.bag.push({ id, count: 1 });
    return true;
  }

  function showReplacePrompt(newId) {
    S.pendingPickup = newId;
    el.replaceText.textContent = "获得：" + itemName(newId) + " —— " + itemDesc(newId) + "。替换背包里哪个？";
    el.replaceList.innerHTML = "";
    S.bag.forEach((item, idx) => {
      const btn = document.createElement("button");
      btn.className = "px-btn";
      btn.style.display = "block";
      btn.style.margin = "6px 0";
      btn.textContent = `${idx + 1}. ${itemName(item.id)}（${itemDesc(item.id).slice(0, 12)}）`;
      btn.addEventListener("click", () => {
        S.bag[idx] = { id: newId, count: 1 };
        el.replaceOverlay.classList.add("hidden");
        log(`★ 你把 ${itemName(newId)} 塞进了背包。`, "good");
        S.pendingPickup = null;
      });
      el.replaceList.appendChild(btn);
    });
    el.replaceOverlay.classList.remove("hidden");
  }

  function equipItem(bagIdx) {
    const item = S.bag[bagIdx];
    if (!item) return;
    const type = itemType(item.id);
    if (type === "consumable") return;
    if (type === "weapon") {
      const canDual = S.equipped.trinket1 === "giant_knuckle" || S.equipped.trinket2 === "giant_knuckle";
      if (!S.equipped.weapon1) {
        S.equipped.weapon1 = item.id;
        S.bag.splice(bagIdx, 1);
      } else if (canDual && !S.equipped.weapon2) {
        S.equipped.weapon2 = item.id;
        S.bag.splice(bagIdx, 1);
      } else if (canDual) {
        // 双武器满了，弹窗选替换哪个
        showSlotChoice("weapon", [S.equipped.weapon1, S.equipped.weapon2], (slot) => {
          const old = S.equipped[slot];
          S.equipped[slot] = item.id;
          S.bag.splice(bagIdx, 1);
          if (old) S.bag.push({ id: old, count: 1 });
          updateHUD();
        });
        return;
      } else {
        // 没有巨像的手，只能替换主手
        const old = S.equipped.weapon1;
        S.equipped.weapon1 = item.id;
        S.bag.splice(bagIdx, 1);
        if (old) S.bag.push({ id: old, count: 1 });
      }
      updateHUD();
      return;
    }
    // 饰品：选空槽位，满了弹选择
    if (!S.equipped.trinket1) {
      S.equipped.trinket1 = item.id;
      S.bag.splice(bagIdx, 1);
    } else if (!S.equipped.trinket2) {
      S.equipped.trinket2 = item.id;
      S.bag.splice(bagIdx, 1);
    } else {
      // 两个都满，弹窗选替换哪个
      showSlotChoice("trinket", [S.equipped.trinket1, S.equipped.trinket2], (slot) => {
        const old = S.equipped[slot];
        S.equipped[slot] = item.id;
        S.bag.splice(bagIdx, 1);
        S.bag.push({ id: old, count: 1 });
        log(`★ 装备了 ${itemName(item.id)}。`, "good");
        updateHUD();
      });
      return;
    }
    log(`★ 装备了 ${itemName(item.id)}。`, "good");
    updateHUD();
  }

  function useItem(bagIdx) {
    const item = S.bag[bagIdx];
    if (!item || itemType(item.id) !== "consumable") return;
    const c = GAME_DATA.consumables[item.id];
    const doubleFood = equippedList().some((id) => {
      const t = GAME_DATA.trinkets[id];
      return t && t.mods && t.mods.doubleFood;
    });
    const val = doubleFood ? c.value * 2 : c.value;
    S.spirit = Math.min(spiritMax(), S.spirit + val);
    item.count -= 1;
    if (item.count <= 0) S.bag.splice(bagIdx, 1);
    log(pick("use_item") + `${c.name}，精神 +${val}。`, "good");
    updateHUD();
  }

  function dropItem(bagIdx) {
    const item = S.bag[bagIdx];
    if (!item) return;
    log(`丢掉了 ${itemName(item.id)}。`, "system");
    S.bag.splice(bagIdx, 1);
  }

  /* ---------- 物品栏 UI ---------- */
  function renderBagGrid(gridEl) {
    gridEl.innerHTML = "";
    for (let i = 0; i < BAG_SIZE; i++) {
      const slot = document.createElement("button");
      const item = S.bag[i];
      if (item) {
        slot.className = "slot";
        slot.innerHTML = `<div class="slot-icon">${itemIcon(item.id)}</div><div>${itemName(item.id)}</div>${item.count > 1 ? `<div>×${item.count}</div>` : ""}`;
        slot.addEventListener("click", () => openItemAction(i, gridEl));
      } else {
        slot.className = "slot empty";
        slot.textContent = "·";
      }
      gridEl.appendChild(slot);
    }
  }

  function openItemAction(idx, gridEl) {
    const item = S.bag[idx];
    if (!item) return;
    const type = itemType(item.id);
    const isField = gridEl.id === "field-inv-grid";
    const actionBox = isField ? el.fieldInvAction : el.itemListAction;
    const actionName = isField ? el.fieldInvActionName : el.itemListActionName;
    const grid = isField ? el.fieldInvGrid : el.itemListGrid;
    const backBtn = isField ? el.fieldInvBack : el.itemBack;

    grid.classList.add("hidden");
    backBtn.classList.add("hidden");
    actionBox.classList.remove("hidden");
    actionName.textContent = `${itemName(item.id)} —— ${itemDesc(item.id)}`;

    actionBox.querySelectorAll(".inv-act").forEach((b) => {
      const act = b.dataset.act;
      if (act === "use") b.style.display = type === "consumable" ? "" : "none";
      if (act === "equip") b.style.display = type === "consumable" ? "none" : "";
      b.onclick = () => {
        if (act === "use") useItem(idx);
        else if (act === "equip") equipItem(idx);
        else if (act === "drop") dropItem(idx);
        closeItemAction();
      };
    });
  }

  function closeItemAction() {
    el.fieldInvAction.classList.add("hidden");
    el.itemListAction.classList.add("hidden");
    el.fieldInvGrid.classList.remove("hidden");
    el.itemListGrid.classList.remove("hidden");
    el.fieldInvBack.classList.remove("hidden");
    el.itemBack.classList.remove("hidden");
    renderBagGrid(el.fieldInvGrid);
    renderBagGrid(el.itemListGrid);
  }

  /* ---------- 视图切换 ---------- */
  function showNumpad() {
    el.viewBattle.classList.add("hidden");
    el.viewNumpad.classList.remove("hidden");
    closeFieldInv();
  }
  function showBattlePad() {
    el.viewNumpad.classList.add("hidden");
    el.viewBattle.classList.remove("hidden");
    showBattleActions();
  }
  function showBattleActions() {
    el.itemList.classList.add("hidden");
    el.battleActions.classList.remove("hidden");
  }
  function showItemList() {
    el.battleActions.classList.add("hidden");
    el.itemList.classList.remove("hidden");
    closeItemAction();
    renderBagGrid(el.itemListGrid);
  }
  function openFieldInv() {
    if (S.phase !== "TUNING") return;
    el.keypadGrid.classList.add("hidden");
    el.fieldInv.classList.remove("hidden");
    closeItemAction();
    renderBagGrid(el.fieldInvGrid);
  }
  function closeFieldInv() {
    el.fieldInv.classList.add("hidden");
    el.keypadGrid.classList.remove("hidden");
    closeItemAction();
  }
  function setKeysEnabled(on) {
    el.keys.forEach((k) => (k.disabled = !on));
    el.battleBtns.forEach((b) => (b.disabled = !on));
    el.itemBack.disabled = !on;
    el.btnInv.disabled = !on;
  }

  /* ---------- 开始 ---------- */
  function startGame() {
    S = newState();
    S.phase = "TUNING";
    S.bossChannel =
      GAME_DATA.config.channelMin +
      Math.floor(
        Math.random() *
          (GAME_DATA.config.channelMax - GAME_DATA.config.channelMin + 1)
      );
    el.titleScreen.classList.add("hidden");
    el.endOverlay.classList.add("hidden");
    el.logContent.innerHTML = "";
    GAME_DATA.introLines.forEach((l) => log(l, "system"));
    log(`仪器预热完毕。剩余 ${S.tries} 次调频。`, "system");
    setFreq(0);
    setLights(null);
    showNumpad();
    setInput("");
    updateHUD();
    drawStatic(el.stageCanvas, 0.3);
    el.stageText.textContent = "— 静 电 —";
    setKeysEnabled(true);
  }

  function setInput(str) {
    S.currentInput = str;
    el.inputDisplay.textContent = str.padEnd(3, "_").split("").join(" ");
  }

  function onKey(k) {
    if (S.phase !== "TUNING") return;
    if (!el.fieldInv.classList.contains("hidden")) return;
    if (k === "clr") { setInput(""); return; }
    if (k === "ent") { submitChannel(); return; }
    if (S.currentInput.length >= 3) return;
    setInput(S.currentInput + k);
  }

  /* ---------- 提交频道 ---------- */
  function submitChannel() {
    const n = parseInt(S.currentInput, 10);
    if (isNaN(n) || n < GAME_DATA.config.channelMin || n > GAME_DATA.config.channelMax) {
      log("仪器无法锁定这个频率。", "bad");
      setInput("");
      return;
    }

    S.phase = "RESOLVING";
    setKeysEnabled(false);
    setFreq(n);

    S.tries -= 1;
    S.timesTuned += 1;
    S.spirit -= GAME_DATA.config.spiritPerTune;

    // 串台：开局50必定触发，其他5%概率
    const isStatic = (S.timesTuned === 1 && n === 50) || Math.random() < 0.05;
    if (isStatic) {
      setLights(null);
      el.freqNum.textContent = "ERR";
      log("频道串了。数字在抖，你听不清任何东西。", "bad");
      // 串台离开选择：留道具或扣精神
      el.eventText.textContent = "频道串了。数字在抖，你听不清任何东西。你站在一个像祭坛的房间里，中间有个东西在等你留下什么。";
      el.eventOptions.innerHTML = "";
        const leaveItem = document.createElement("button");
        leaveItem.className = "px-btn";
        leaveItem.textContent = "留下背包里的物品";
        leaveItem.addEventListener("click", () => {
          el.eventOverlay.classList.add("hidden");
          // 打开背包选一个物品丢掉
          if (S.bag.length === 0) {
            log("你背包里什么都没有。只能留下精神了。", "bad");
            S.spirit -= 15;
            log("精神 -15。", "bad");
          } else {
            showBagDrop(() => {
              log("你丢下了一件东西。它收下了。", "system");
              if (Math.random() < 0.4) {
                addToBag("weird_fuse");
                log("★ 异常保险丝 —— 串台里捡的。闪避成功率 +20%。", "good");
              }
            });
          }
          updateHUD();
          checkGameOver();
          if (S.phase === "RESOLVING") {
            S.phase = "TUNING";
            setKeysEnabled(true);
            setInput("");
            showNumpad();
          }
        });
        const leaveSpirit = document.createElement("button");
        leaveSpirit.className = "px-btn";
        leaveSpirit.textContent = "直接离开（精神-15）";
        leaveSpirit.addEventListener("click", () => {
          el.eventOverlay.classList.add("hidden");
          S.spirit -= 15;
          log("你硬挤了出去。精神 -15。", "bad");
          updateHUD();
          checkGameOver();
          if (S.phase === "RESOLVING") {
            S.phase = "TUNING";
            setKeysEnabled(true);
            setInput("");
            showNumpad();
          }
        });
        el.eventOptions.appendChild(leaveItem);
        el.eventOptions.appendChild(leaveSpirit);
        el.eventOverlay.classList.remove("hidden");
      return;
    }

    log(pick("tune_in"), "system");

    const regen = spiritRegen();
    if (regen > 0) {
      S.spirit = Math.min(spiritMax(), S.spirit + regen);
      log(`矿石检波器震动，精神 +${regen}。`, "good");
    }

    if (n === S.bossChannel) {
      setLights("boss");
      log(pick("enc_boss"), "bad");
      startBattle(GAME_DATA.boss, true, false);
    } else {
      if (S.lightsBroken) {
        setLights(null);
        log("仪器好像被摔坏了，指示灯不亮了。", "bad");
      } else if (S.proximityMode && !equippedList().includes("noise_canceler")) {
        const dist = Math.abs(n - S.bossChannel);
        const near = dist < 15;
        setLights(near ? "low" : "high"); // 左=近，右=远
        log(near ? "（你觉得它近了）" : "（你觉得它远了）", "system");
      } else {
        const isHigh = n > S.bossChannel;
        setLights(isHigh ? "high" : "low");
        log(pick(isHigh ? "too_high" : "too_low"), "system");
      }
      rollEncounter();
    }

    updateHUD();
    checkGameOver();
    if (S.phase === "RESOLVING") {
      S.phase = "TUNING";
      setKeysEnabled(true);
      setInput("");
      showNumpad();
    }
  }

  function rollEncounter() {
    // 固定小BOSS：第5次=广播员（弱），第8次=巨像（强）
    if (S.timesTuned === 5) {
      const m = GAME_DATA.minibosses[0];
      log(pick("enc_miniboss"), "bad");
      startBattle(m, false, true);
      return;
    }
    if (S.timesTuned === 8) {
      const m = GAME_DATA.minibosses[1];
      log(pick("enc_miniboss"), "bad");
      startBattle(m, false, true);
      return;
    }
    let chance = GAME_DATA.config.normalChance;
    const aggro = equippedList().some((id) => {
      const t = GAME_DATA.trinkets[id];
      return t && t.mods && t.mods.aggro;
    });
    if (aggro) chance = Math.min(1, chance * 1.6);
    if (Math.random() < chance) {
      const m = pickRandom(GAME_DATA.monsters);
      log(pick("enc_normal"), "system");
      startBattle(m, false, false);
    } else if (Math.random() < 0.3) {
      // 空频道
      log("这个频道是空的。你站在一片不存在的空间里，什么也没发生。", "system");
      checkGameOver();
      if (S.phase === "OVER") return;
      setTimeout(() => {
        if (S.phase === "RESOLVING") {
          S.phase = "TUNING";
          setKeysEnabled(true);
          setInput("");
          showNumpad();
        }
      }, 900);
    } else {
      rollEvent();
    }
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function rollEvent() {
    // 过滤已用过的事件
    const pool = GAME_DATA.events.filter((e) => !S.usedEvents.includes(e.text));
    if (pool.length === 0) {
      log("这里什么都没有。只有静电。", "system");
      checkGameOver();
      if (S.phase === "OVER") return;
      setTimeout(() => {
        if (S.phase === "RESOLVING") {
          S.phase = "TUNING";
          setKeysEnabled(true);
          setInput("");
          showNumpad();
        }
      }, 900);
      return;
    }
    const totalW = pool.reduce((s, e) => s + e.weight, 0);
    let r = Math.random() * totalW;
    let picked = pool[0];
    for (const e of pool) {
      r -= e.weight;
      if (r <= 0) { picked = e; break; }
    }
    S.usedEvents.push(picked.text);

    if (picked.options) {
      // 选择式事件
      log(picked.text, "system");
      showEventChoice(picked);
    } else {
      // 直接事件：事件文本和效果合并显示
      const eff = picked.effect;
      let suffix = "";
      if (eff && eff.type === "spirit") {
        const before = S.spirit;
        S.spirit = Math.min(spiritMax(), S.spirit + eff.value);
        const actual = S.spirit - before;
        if (actual > 0) suffix = `（精神 +${actual}）`;
        else if (actual < 0) suffix = `（精神 ${actual}）`;
      } else if (eff && eff.type === "give_consumable") {
        addToBag(eff.item);
        suffix = `· ${itemName(eff.item)}`;
      } else if (eff && eff.type === "give_trinket") {
        addToBag(eff.trinket);
        suffix = `★ ${itemName(eff.trinket)}`;
      } else if (eff && eff.type === "restore_tries") {
        S.tries += eff.value;
        suffix = `（调频机会 +${eff.value}）`;
      }
      if (picked.luck) S.luck += picked.luck;
      log(picked.text + (suffix ? " " + suffix : ""), "system");
      updateHUD();
      checkGameOver();
      if (S.phase === "OVER") return;
      setTimeout(() => {
        if (S.phase === "RESOLVING") {
          S.phase = "TUNING";
          setKeysEnabled(true);
          setInput("");
          showNumpad();
        }
      }, 900);
    }
  }

  function showBagDrop(callback) {
    el.eventText.textContent = "留下哪件东西？";
    el.eventOptions.innerHTML = "";
    // 背包里的
    S.bag.forEach((item, idx) => {
      const btn = document.createElement("button");
      btn.className = "px-btn";
      btn.textContent = `${itemName(item.id)}${item.count > 1 ? " x" + item.count : ""}`;
      btn.addEventListener("click", () => {
        S.bag.splice(idx, 1);
        el.eventOverlay.classList.add("hidden");
        callback();
      });
      el.eventOptions.appendChild(btn);
    });
    // 已装备的
    const equippedSlots = [
      { slot: "weapon1", id: S.weapon1 },
      { slot: "weapon2", id: S.weapon2 },
      { slot: "trinket1", id: S.trinket1 },
      { slot: "trinket2", id: S.trinket2 },
    ];
    equippedSlots.forEach((e) => {
      if (!e.id) return;
      const btn = document.createElement("button");
      btn.className = "px-btn";
      btn.textContent = `${itemName(e.id)}（已装备）`;
      btn.addEventListener("click", () => {
        S[e.slot] = null;
        el.eventOverlay.classList.add("hidden");
        callback();
      });
      el.eventOptions.appendChild(btn);
    });
    if (S.bag.length === 0 && equippedSlots.every((e) => !e.id)) {
      const none = document.createElement("button");
      none.className = "px-btn";
      none.textContent = "你什么都没有";
      none.addEventListener("click", () => {
        el.eventOverlay.classList.add("hidden");
        S.spirit -= 15;
        log("精神 -15。", "bad");
        updateHUD();
        checkGameOver();
        if (S.phase === "RESOLVING") {
          S.phase = "TUNING";
          setKeysEnabled(true);
          setInput("");
          showNumpad();
        }
      });
      el.eventOptions.appendChild(none);
    }
    el.eventOverlay.classList.remove("hidden");
  }

  function showSlotChoice(kind, ids, callback) {
    const labels = kind === "weapon" ? ["主手", "副手"] : ["饰品1", "饰品2"];
    el.eventText.textContent = `替换哪个？`;
    el.eventOptions.innerHTML = "";
    ids.forEach((id, i) => {
      const btn = document.createElement("button");
      btn.className = "px-btn";
      btn.textContent = `${labels[i]}: ${itemName(id)}`;
      btn.addEventListener("click", () => {
        el.eventOverlay.classList.add("hidden");
        callback(kind === "weapon" ? (i === 0 ? "weapon1" : "weapon2") : (i === 0 ? "trinket1" : "trinket2"));
        // 实时刷新背包
        if (!el.itemList.classList.contains("hidden")) renderBagGrid(el.itemListGrid);
        if (!el.fieldInv.classList.contains("hidden")) renderBagGrid(el.fieldInvGrid);
      });
      el.eventOptions.appendChild(btn);
    });
    // 取消按钮
    const cancel = document.createElement("button");
    cancel.className = "px-btn";
    cancel.textContent = "取消";
    cancel.addEventListener("click", () => {
      el.eventOverlay.classList.add("hidden");
      log("取消装备。", "system");
    });
    el.eventOptions.appendChild(cancel);
    el.eventOverlay.classList.remove("hidden");
  }

  function showEventModal(text) {
    el.eventText.textContent = text;
    el.eventOptions.innerHTML = "";
    const btn = document.createElement("button");
    btn.className = "px-btn";
    btn.textContent = "继 续";
    btn.addEventListener("click", () => {
      el.eventOverlay.classList.add("hidden");
      if (S.phase === "RESOLVING") {
        S.phase = "TUNING";
        setKeysEnabled(true);
        setInput("");
        showNumpad();
      }
    });
    el.eventOptions.appendChild(btn);
    el.eventOverlay.classList.remove("hidden");
  }

  function drawEvent(evText) {
    const canvas = $("event-canvas");
    const ctx = canvas.getContext("2d");
    const cw = canvas.width, ch = canvas.height;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = "#fff";
    const cx = cw / 2, cy = ch / 2;
    const s = 4;

    function px(x, y, w, h) { ctx.fillRect(cx + x * s, cy + y * s, w * s, h * s); }

    if (evText.includes("售货机")) {
      // 售货机：长方形+投币口
      px(-5, -7, 10, 14);
      px(-4, -6, 3, 8); // 橱窗
      px(2, -5, 2, 2); // 按钮
      px(2, 0, 2, 1); // 取货口
    } else if (evText.includes("门")) {
      // 一扇门
      px(-4, -8, 8, 16);
      px(2, 0, 1, 1); // 门把手
    } else if (evText.includes("镜子")) {
      // 镜子
      px(-3, -7, 6, 14);
      px(-2, -6, 4, 12); // 镜面
    } else if (evText.includes("无线电")) {
      // 老式无线电
      px(-5, -4, 10, 8);
      px(-4, -3, 3, 3); // 喇叭
      px(1, -2, 3, 1); // 调频条
      px(0, -5, 1, 2); // 天线
    } else if (evText.includes("饭")) {
      // 一碗饭
      px(-3, 0, 6, 2); // 碗
      px(-2, -2, 4, 2); // 饭
    } else if (evText.includes("黑板")) {
      // 黑板
      px(-6, -5, 12, 10);
      ctx.fillStyle = "#333";
      ctx.fillRect(cx - 5 * s, cy - 4 * s, 10 * s, 8 * s);
      ctx.fillStyle = "#fff";
      px(-3, -2, 6, 1);
      px(-2, 0, 4, 1);
    } else if (evText.includes("照片")) {
      // 照片
      px(-3, -4, 6, 8);
      px(-2, -3, 4, 5); // 人像
    } else if (evText.includes("淋浴")) {
      // 淋浴
      px(-1, -6, 2, 2); // 花洒
      for (let i = -2; i <= 2; i++) px(i, -3, 0.3, 3); // 水流
    } else if (evText.includes("天台")) {
      // 天台边
      px(-6, 2, 12, 1);
      px(0, -3, 1, 3); // 人影
    } else if (evText.includes("脚步")) {
      // 一串脚印
      px(-4, -2, 1, 1); px(-2, 0, 1, 1); px(0, -2, 1, 1); px(2, 0, 1, 1); px(4, -2, 1, 1);
    } else if (evText.includes("电梯")) {
      // 电梯门
      px(-4, -8, 8, 16);
      px(0, -8, 0.3, 16); // 门缝
    } else if (evText.includes("便利店")) {
      // 货架
      px(-5, -5, 10, 10);
      px(-4, -3, 8, 0.5);
      px(-4, 0, 8, 0.5);
      px(-4, 3, 8, 0.5);
    } else if (evText.includes("ATM")) {
      px(-3, -6, 6, 12);
      px(-2, -5, 4, 3); // 屏幕
    } else if (evText.includes("串") || evText.includes("祭坛")) {
      // 祭坛
      px(-2, -2, 4, 4);
      px(-4, 2, 8, 2);
    }

    // 雪花
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    for (let i = 0; i < 30; i++) {
      ctx.fillRect(Math.random() * cw, Math.random() * ch, 1, 1);
    }
  }

  function showEventChoice(ev) {
    el.eventText.textContent = ev.text;
    drawEvent(ev.text);
    el.eventOptions.innerHTML = "";
    ev.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "px-btn";
      btn.textContent = opt.label;
      btn.addEventListener("click", () => resolveEventChoice(opt));
      el.eventOptions.appendChild(btn);
    });
    el.eventOverlay.classList.remove("hidden");
  }

  function resolveEventChoice(opt) {
    el.eventOverlay.classList.add("hidden");
    // 成功率 = 0.5 + (luck-50)/100 + luckMod
    const baseChance = 0.5 + (S.luck - 50) / 100 + (opt.luckMod || 0);
    const success = Math.random() < baseChance;
    const result = success ? opt.ok : opt.bad;
    if (success) S.luck += 2; else S.luck -= 2;
    S.luck = Math.max(0, Math.min(100, S.luck));

    // 结果描述
    const resultText = success ? (opt.okText || "你做到了。") : (opt.badText || "出了意外。");
    log(resultText, success ? "good" : "bad");
    if (result.spirit) {
      const before = S.spirit;
      S.spirit = Math.min(spiritMax(), S.spirit + result.spirit);
      const actual = S.spirit - before;
      if (actual > 0) log(`（精神 +${actual}）`, "good");
      else if (actual < 0) log(`（精神 ${actual}）`, "bad");
    }
    if (result.tries) {
      S.tries += result.tries;
      log(`（调频机会 +${result.tries}）`, "good");
    }
    if (result.give) {
      addToBag(result.give);
      log(`★ ${itemName(result.give)} —— ${itemDesc(result.give)}`, "good");
    }
    updateHUD();
    checkGameOver();
    if (S.phase === "OVER") return;
    setTimeout(() => {
      if (S.phase === "RESOLVING") {
        S.phase = "TUNING";
        setKeysEnabled(true);
        setInput("");
        showNumpad();
      }
    }, 900);
  }

  function applyEventEffect(eff) {
    if (!eff) return;
    switch (eff.type) {
      case "spirit": {
        const before = S.spirit;
        S.spirit = Math.min(spiritMax(), S.spirit + eff.value);
        const actual = S.spirit - before;
        if (actual > 0) log(`（精神 +${actual}）`, "good");
        else if (actual < 0) log(`（精神 ${actual}）`, "bad");
        break;
      }
      case "give_trinket":
        if (addToBag(eff.trinket)) {
          log(pick("get_trinket"), "good");
          log(`★ ${itemName(eff.trinket)} —— ${itemDesc(eff.trinket)}`, "good");
        }
        break;
      case "give_consumable":
        if (addToBag(eff.item)) {
          log(`· 捡到 ${itemName(eff.item)}`, "good");
        }
        break;
      case "restore_tries":
        S.tries += eff.value;
        log(`（调频机会 +${eff.value}）`, "good");
        break;
    }
    updateHUD();
  }

  /* ---------- 战斗（概率制，非猜拳） ---------- */
  function startBattle(monster, isBoss, isMiniboss) {
    S.phase = "BATTLE";
    S.battle = { monster, hp: monster.hp, isBoss, isMiniboss, debuff: null, debuffNext: null };
    showBattlePad();
    // 程序化绘制怪物像素图
    el.stageText.classList.add("hidden");
    el.stageCanvas.classList.remove("hidden");
    currentMonster = monster;
    el.battlePrompt.textContent = monster.desc;
    log(pick("enc_normal") || monster.desc, "system");
    setKeysEnabled(true);
  }

  function battleMove(move) {
    if (!S.battle || S.phase !== "BATTLE") return;
    if (move === "item") { showItemList(); return; }
    if (move === "flee") { doFlee(); return; }

    const b = S.battle;
    // debuff 检查
    if (b.debuff === "disableAttack" && move === "attack") {
      log("你下不了手。", "bad");
      return;
    }
    if (b.debuff === "disableDefend" && move === "defend") {
      log("你挡不住。", "bad");
      return;
    }
    if (b.debuff === "disableDodge" && move === "dodge") {
      log("你跑不掉。", "bad");
      return;
    }

    setKeysEnabled(false);
    const m = b.monster;

    // 怪物按AI权重选动作 [attack, defend, dodge]
    const w = m.aiWeights;
    const moves = ["attack", "defend", "dodge"];
    const total = w[0] + w[1] + w[2];
    let r = Math.random() * total;
    let ai = "attack";
    for (let i = 0; i < 3; i++) {
      r -= w[i];
      if (r <= 0) { ai = moves[i]; break; }
    }

    log(`你【${GAME_DATA.moves[move]}】，它【${GAME_DATA.moves[ai]}】。`, "system");

    if (ai === "attack") {
      // 怪物攻击你
      if (move === "attack") {
        // 硬碰硬：50/50
        if (Math.random() < 0.5) {
          const atk = performAttack();
          if (!atk.whiffed) {
            b.hp -= atk.dmg;
            const hasWeapon = !!(S.weapon1 || S.weapon2);
            let hitText;
            if (hasWeapon) {
              const wid = S.weapon1 || S.weapon2;
              const wTexts = GAME_DATA.TEXTS.weaponHit[wid];
              hitText = wTexts ? pick(wTexts) : pick("clash_win");
            } else {
              hitText = pick("clash_win_bare");
            }
            log(hitText + ` ${atk.extraMsg}`, "good");
          } else {
            log(pick("clash_win_bare") + " 它退了一步，但你没打中。", "system");
          }
        } else {
          let dmg = m.spiritDamage * (1 - dmgReduce());
          dmg = Math.round(dmg);
          S.spirit -= dmg;
          S.deathBy = "battle";
          const atkText = m.attackTexts ? pick(m.attackTexts) : pick("hit_self");
          log(atkText + " " + pick("clash_lose") + `（精神 -${dmg}）`, "bad");
        }
      } else if (move === "defend") {
        // 防御：70%防住扣2，30%全扣
        if (Math.random() < 0.7) {
          S.spirit = Math.max(0, S.spirit - 2);
          S.deathBy = "battle";
          log(pick("defend_ok") + " 精神 -2。", "system");
        } else {
          let dmg = m.spiritDamage * (1 - dmgReduce());
          dmg = Math.round(dmg);
          S.spirit -= dmg;
          S.deathBy = "battle";
          const atkText = m.attackTexts ? pick(m.attackTexts) : pick("hit_self");
          log(atkText + " " + pick("defend_fail") + `（精神 -${dmg}）`, "bad");
        }
      } else if (move === "dodge") {
        // 闪避：60%闪开+3精神，40%全扣，异常保险丝+20%
        let dodgeChance = 0.6;
        if (equippedList().includes("weird_fuse")) dodgeChance += 0.2;
        if (Math.random() < dodgeChance) {
          S.spirit = Math.min(spiritMax(), S.spirit + 3);
          log(pick("dodge_ok") + " 精神 +3。", "good");
        } else {
          let dmg = m.spiritDamage * (1 - dmgReduce());
          dmg = Math.round(dmg);
          S.spirit -= dmg;
          S.deathBy = "battle";
          const atkText = m.attackTexts ? pick(m.attackTexts) : pick("hit_self");
          log(atkText + " " + pick("dodge_fail") + `（精神 -${dmg}）`, "bad");
        }
      }
    } else if (ai === "defend") {
      // 怪物防御
      if (move === "attack") {
        log(pick("blocked"), "system");
      } else if (move === "defend") {
        log(pick("round_draw"), "system");
      } else {
        // 你闪避，它防御：谁也没碰到谁
        S.spirit = Math.min(spiritMax(), S.spirit + 2);
        log(pick("dodge_vs_defend") + " 精神 +2。", "good");
      }
    } else {
      // 怪物闪避
      if (move === "attack") {
        const atk = performAttack();
        if (!atk.whiffed) {
          b.hp -= atk.dmg;
          const hasWeapon = !!(S.weapon1 || S.weapon2);
          let hitText;
          if (hasWeapon) {
            const wid = S.weapon1 || S.weapon2;
            const wTexts = GAME_DATA.TEXTS.weaponHit[wid];
            hitText = wTexts ? pick(wTexts) : pick("hit_foe");
          } else {
            hitText = pick("hit_foe_bare");
          }
          log(hitText + ` ${atk.extraMsg}`, "good");
        } else {
          log(pick("miss"), "system");
        }
      } else if (move === "defend") {
        // 你防御，它闪避：谁也没碰到谁
        S.spirit = Math.min(spiritMax(), S.spirit + 2);
        log(pick("defend_vs_dodge") + " 精神 +2。", "good");
      } else {
        log(pick("round_draw"), "system");
      }
    }

    updateHUD();
    checkGameOver();
    if (S.phase === "END") return;

    if (b.hp <= 0) {
      endBattleWin();
      return;
    }
    // 怪物技能触发
    if (m.skill && Math.random() < (m.skillChance || 0.2)) {
      b.debuff = m.skill;
      const isBig = isBoss || b.isMiniboss;
      const debuffByMonster = {
        disableAttack: isBig
          ? ["它的低语灌满了你的颅腔。你的手抬不起来。", "它在你脑子里说了一个词。你听懂了，但你动不了。"]
          : ["它的声音在你脑子里响成一片。下回合你下不了手。", "它哼的那个调子卡在你耳朵里。你下不去手。"],
        disableDefend: isBig
          ? ["它的存在压得你站不住。你怎么挡？", "巨物的阴影罩下来。你的腿软了。"]
          : ["它的节奏让你站不稳。下回合你挡不住。", "它晃了晃头。你脚下一滑。"],
        disableDodge: isBig
          ? ["它的温度漫开，像沥青裹住你。你跑不掉。", "它的触须在地上铺开。你动不了。"]
          : ["它的歌声缠住了你的脚。下回合你跑不掉。", "她的声音粘在你鞋底。你迈不开步。"],
      };
      const arr = debuffByMonster[m.skill] || ["它对你做了什么。"];
      log(pick(arr), "bad");
    } else if (b.debuff) {
      b.debuff = null;
    }
    setTimeout(() => setKeysEnabled(true), 300);
  }

  function doFlee() {
    setKeysEnabled(false);
    const noPenalty = equippedList().some((id) => {
      const t = GAME_DATA.trinkets[id];
      return t && t.mods && t.mods.fleeNoPenalty;
    });
    const fleeBad = equippedList().some((id) => {
      const t = GAME_DATA.trinkets[id];
      return t && t.mods && t.mods.fleeBad;
    });
    if (noPenalty) {
      log(pick("flee") + "（耳机里的静电盖住了脚步声）", "system");
    } else {
      S.spirit -= fleeBad ? 20 : 10;
      S.deathBy = "explore";
      log(pick("flee") + `（精神 -${fleeBad ? 20 : 10}）`, "bad");
    }
    S.battle = null;
    S.phase = "TUNING";
    showNumpad();
    setInput("");
    drawStatic(el.stageCanvas, 0.3);
    el.stageText.textContent = "— 静 电 —";
    setKeysEnabled(true);
    updateHUD();
    checkGameOver();
    if (S.phase !== "END") setKeysEnabled(true);
    restoreLights();
  }

  function endBattleWin() {
    const b = S.battle;
    const m = b.monster;

    if (b.isBoss) {
      S.battle = null;
      gameOver("win");
      return;
    }

    log(pick(b.isMiniboss ? "kill_miniboss" : "kill_normal"), "good");

    // 小BOSS击杀后切换灯模式
    if (b.isMiniboss) {
      if (S.timesTuned === 5) {
        S.proximityMode = true;
        showEventModal("它碎掉的瞬间，耳机里炸开一阵刺耳的白噪声。仪器不再告诉你高低。你只能感觉到，目标近了还是远了。");
      } else if (S.timesTuned === 8) {
        S.lightsBroken = true;
        showEventModal("你把巨像砸烂的瞬间，仪器里冒出一股焦味。灯灭了。它什么都不会再告诉你了。");
      }
      // 小BOSS随机掉专属饰品
      if (Math.random() < 0.6) {
        const dropId = S.timesTuned === 5 ? "old_mic" : "giant_knuckle";
        addToBag(dropId);
        log(`★ ${itemName(dropId)} —— ${itemDesc(dropId)}`, "good");
      }
    }

    // 脏绷带：击杀回精神
    equippedList().forEach((id) => {
      const t = GAME_DATA.trinkets[id];
      if (t && t.mods && t.mods.healOnKill) {
        S.spirit = Math.min(spiritMax(), S.spirit + t.mods.healOnKill);
        log(`（绷带渗血，精神 +${t.mods.healOnKill}）`, "good");
      }
    });

    // 饰品掉落：只掉没拥有过的
    if (Math.random() < m.trinketChance) {
      const available = m.trinkets.filter((tid) => !hasItem(tid));
      if (available.length > 0) {
        const tid = available[Math.floor(Math.random() * available.length)];
        if (addToBag(tid)) {
          log(pick("get_trinket"), "good");
          log(`★ ${itemName(tid)} —— ${itemDesc(tid)}`, "good");
        }
      }
    }
    if (Math.random() < 0.4) {
      const ids = Object.keys(GAME_DATA.consumables);
      const id = ids[Math.floor(Math.random() * ids.length)];
      addToBag(id);
      log(`· 你捡到了 ${itemName(id)}`, "good");
    }

    S.battle = null;
    currentMonster = null;

    S.phase = "TUNING";
    showNumpad();
    setInput("");
    drawStatic(el.stageCanvas, 0.3);
    el.stageText.textContent = "— 静 电 —";
    setKeysEnabled(true);
    updateHUD();
    checkGameOver();
    restoreLights();
  }

  function checkGameOver() {
    if (S.spirit <= 0) {
      gameOver(S.deathBy === "battle" ? "death" : "crazy");
      return;
    }
    if (S.tries <= 0 && S.phase !== "BATTLE") {
      gameOver("lost");
    }
  }

  function gameOver(kind) {
    S.phase = "END";
    setKeysEnabled(false);
    let lines = [];
    if (kind === "win") {
      lines = S.timesTuned <= 3 ? GAME_DATA.endingSpeedrun : GAME_DATA.endingWin;
    }
    else if (kind === "death") lines = GAME_DATA.endingDeath;
    else if (kind === "crazy") lines = GAME_DATA.endingLoseSpirit;
    else lines = GAME_DATA.endingLoseTries;

    el.endText.textContent = lines.join("\n");
    const eq = equippedList().map(itemName);
    el.endStats.innerHTML =
      `目标频道：CH ${String(S.bossChannel).padStart(3, "0")}<br>` +
      `剩余次数：${S.tries}<br>` +
      `剩余精神：${Math.max(0, S.spirit)}<br>` +
      `已装备：${eq.join("、") || "无"}`;
    el.endOverlay.classList.remove("hidden");
  }

  /* ---------- 事件绑定 ---------- */
  el.startBtn.addEventListener("click", startGame);
  el.restartBtn.addEventListener("click", startGame);

  // 开场文字逐行显示
  const introLines = [
    "那天晚上，收音机自己响了。",
    "电流声里夹着一段新闻。女播报员的声音在抖。",
    "她说，天上有个东西。不是云，不是卫星。",
    "她说完最后一个字，尖叫起来。然后断了。",
    "我转台。一个台，两个台——",
    "等我回过神，我已经不在原来的房间里了。",
    "这台旧机器能把我带到那些频道里去。",
    "它在叫我。很远，很近。我找不到它在哪。",
    "我得找到它。",
  ];
  let introIdx = 0;
  const introText = $("intro-text");
  const introScreen = $("intro-screen");
  const titleScreen = $("title-screen");

  function showIntroLine() {
    if (introIdx < introLines.length) {
      introText.textContent += (introIdx > 0 ? "\n" : "") + introLines[introIdx];
      introIdx++;
      setTimeout(showIntroLine, 1200);
    } else {
      $("intro-hint").style.display = "block";
    }
  }
  $("intro-hint").style.display = "none";
  showIntroLine();

  introScreen.addEventListener("click", () => {
    if (introIdx < introLines.length) {
      // 跳过逐行，直接显示全部
      introText.textContent = introLines.join("\n");
      introIdx = introLines.length;
      $("intro-hint").style.display = "block";
    } else {
      introScreen.classList.add("hidden");
      titleScreen.classList.remove("hidden");
    }
  });
  el.logUp.addEventListener("click", () => {
    el.logContent.scrollTop -= 40;
  });
  el.logDown.addEventListener("click", () => {
    el.logContent.scrollTop += 40;
  });
  $("btn-replace-skip").addEventListener("click", () => {
    el.replaceOverlay.classList.add("hidden");
    log("你没有拾取。", "system");
    S.pendingPickup = null;
  });
  el.keys.forEach((k) => k.addEventListener("click", () => onKey(k.dataset.k)));
  el.battleBtns.forEach((b) => b.addEventListener("click", () => battleMove(b.dataset.move)));
  el.itemBack.addEventListener("click", showBattleActions);
  el.btnInv.addEventListener("click", openFieldInv);
  el.fieldInvBack.addEventListener("click", closeFieldInv);

  document.addEventListener("keydown", (e) => {
    if (!S) return;
    if (S.phase === "TUNING") {
      if (!el.fieldInv.classList.contains("hidden")) return;
      if (/^[0-9]$/.test(e.key)) onKey(e.key);
      else if (e.key === "Backspace") onKey("clr");
      else if (e.key === "Enter") onKey("ent");
    } else if (S.phase === "BATTLE") {
      if (e.key === "1") battleMove("attack");
      if (e.key === "2") battleMove("defend");
      if (e.key === "3") battleMove("dodge");
      if (e.key === "4") battleMove("item");
      if (e.key === "5") battleMove("flee");
    }
  });

  drawStatic(el.stageCanvas, 0.2);

  // 持续雪花噪声动画
  const noiseCanvas = $("noise-canvas");
  const nctx = noiseCanvas.getContext("2d");
  let currentMonster = null;
  function tickNoise() {
    const w = noiseCanvas.width, h = noiseCanvas.height;
    nctx.clearRect(0, 0, w, h);
    nctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 80; i++) {
      nctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }
    // 偶尔水平错位
    if (Math.random() < 0.1) {
      nctx.fillStyle = "rgba(255,255,255,0.1)";
      const y = Math.random() * h;
      nctx.fillRect(0, y, w, 1);
    }
    // 持续重绘怪物
    if (currentMonster && !el.stageCanvas.classList.contains("hidden")) {
      const mctx = el.stageCanvas.getContext("2d");
      drawMonster(mctx, currentMonster.id, el.stageCanvas.width, el.stageCanvas.height);
    }
    requestAnimationFrame(tickNoise);
  }
  requestAnimationFrame(tickNoise);
})();

