from PIL import Image, ImageDraw, ImageFont

W = 900
rows = []
# (分类, 文件名, 名称, 尺寸, 说明)
rows.append(("SECTION", "一、怪物立绘", "", "", ""))
rows.append(("", "static_man.png", "静电人", "128x128", "雪花点人形，无脸"))
rows.append(("", "tuner_bat.png", "失智听众", "128x128", "戴破耳机晃头"))
rows.append(("", "white_noise_girl.png", "白噪女孩", "128x128", "在唱歌的女孩"))
rows.append(("", "the_listener.png", "聆听者", "128x128", "无嘴，复述你念头"))
rows.append(("", "broadcaster.png", "广播员(小BOSS)", "160x160", "戴老式耳机播音"))
rows.append(("", "colossus.png", "静电巨像(小BOSS)", "160x160", "雪花拼成的巨人"))
rows.append(("", "boss.png", "降临之物(BOSS)", "192x192", "正在成形的生物组织"))

rows.append(("SECTION", "二、装备图标 (全部 32x32)", "", "", ""))
rows.append(("", "tin_ear.png", "锡耳朵", "32x32", "减伤20%"))
rows.append(("", "lead_lining.png", "铅衬里", "32x32", "精神上限+20"))
rows.append(("", "crystal_diode.png", "矿石检波器", "32x32", "每频道+3精神"))
rows.append(("", "fruit_knife.png", "水果刀(武器)", "32x32", "攻击双倍"))
rows.append(("", "screwdriver.png", "十字螺丝刀(武器)", "32x32", "攻击双倍"))
rows.append(("", "glass_shard.png", "玻璃碎片(武器)", "32x32", "攻击双倍"))
rows.append(("", "wrench.png", "老式扳手(武器)", "32x32", "攻击三倍"))
rows.append(("", "tuning_fork.png", "断音叉(武器)", "32x32", "攻击双倍"))
rows.append(("", "hunter_notebook.png", "猎人笔记", "32x32", "前3轮找到BOSS奖励"))
rows.append(("", "static_heart.png", "静电心脏(BOSS掉)", "32x32", "精神上限+30，减伤30%"))

rows.append(("SECTION", "三、消耗品图标 (全部 32x32)", "", "", ""))
rows.append(("", "cracker.png", "压缩饼干", "32x32", "精神+15"))
rows.append(("", "water.png", "半瓶水", "32x32", "精神+10"))
rows.append(("", "hot_choco.png", "热可可", "32x32", "精神+25"))

# 计算高度
row_h = 32
section_h = 40
pad = 20
title_h = 60
total_h = title_h + pad*2
for r in rows:
    if r[0] == "SECTION":
        total_h += section_h
    else:
        total_h += row_h

img = Image.new("RGB", (W, total_h), (0,0,0))
d = ImageDraw.Draw(img)

try:
    font = ImageFont.truetype("C:\\Windows\\Fonts\\msyh.ttc", 15)
    font_b = ImageFont.truetype("C:\\Windows\\Fonts\\msyhbd.ttc", 17)
    font_title = ImageFont.truetype("C:\\Windows\\Fonts\\msyhbd.ttc", 24)
except:
    font = ImageFont.load_default()
    font_b = font
    font_title = font

d.text((pad, pad), "降临 · 素材清单", fill=(255,255,255), font=font_title)
d.text((pad, pad+32), "黑白像素风 / PNG透明底 / 共20个素材位", fill=(120,120,120), font=font)

y = title_h + pad
col1 = pad
col2 = 260
col3 = 430
col4 = 580
col5 = 700

# 表头
d.text((col1, y), "文件名", fill=(150,150,150), font=font)
d.text((col2, y), "名称", fill=(150,150,150), font=font)
d.text((col3, y), "尺寸", fill=(150,255,255), font=font)
d.text((col4, y), "说明", fill=(150,150,150), font=font)
y += row_h

for r in rows:
    if r[0] == "SECTION":
        d.line([(pad, y), (W-pad, y)], fill=(60,60,60), width=1)
        d.text((pad, y+6), r[1], fill=(255,255,100), font=font_b)
        y += section_h
    else:
        d.text((col1, y), r[1], fill=(100,100,100), font=font)
        d.text((col2, y), r[2], fill=(255,255,255), font=font)
        d.text((col3, y), r[3], fill=(100,255,255), font=font)
        d.text((col4, y), r[4], fill=(180,180,180), font=font)
        y += row_h

img.save(r"E:\项目组\降临\素材清单.png")
print("saved")
