export interface BeginnerRisk {
  title: string;
  mistake: string;
  fix: string;
}

export const cropBeginnerRisks: Record<string, BeginnerRisk[]> = {
  tomato: [
    { title: '水分忽干忽湿', mistake: '容易裂果或出现脐腐。', fix: '结果期保持稳定浇水，盆土表面干后浇透。' },
    { title: '不搭架不整枝', mistake: '枝叶郁闭，果实小且病害多。', fix: '定植后搭架，保留1–2条主枝。' },
    { title: '氮肥过多', mistake: '只长叶不开花，坐果少。', fix: '开花后减少氮肥，增加磷钾肥和钙肥。' },
  ],
  cucumber: [
    { title: '藤蔓趴地', mistake: '通风差，瓜条弯曲，病害增加。', fix: '尽早搭架绑蔓，让藤蔓向上生长。' },
    { title: '结果期缺水', mistake: '瓜条发苦或畸形。', fix: '结果期保持土壤湿润，避免突然断水。' },
    { title: '采收太晚', mistake: '老瓜消耗养分，后续坐瓜减少。', fix: '达到合适长度就及时采收。' },
  ],
  wheat: [
    { title: '播种过密', mistake: '群体郁闭，倒伏和病害风险增加。', fix: '按推荐播量播种，返青后观察群体密度。' },
    { title: '拔节期缺肥水', mistake: '穗数和粒数不足。', fix: '拔节前后追肥浇水。' },
    { title: '扬花期忽视阴雨', mistake: '赤霉病风险升高。', fix: '连续阴雨前后重点预防。' },
  ],
  corn: [
    { title: '种得太密', mistake: '光照不足，穗小且容易倒伏。', fix: '定苗时保留合理株距。' },
    { title: '抽雄吐丝期缺水', mistake: '授粉差，秃尖缺粒。', fix: '关键期保持土壤水分。' },
    { title: '不培土', mistake: '根系支撑弱，大风后易倒伏。', fix: '拔节期结合追肥培土。' },
  ],
  cabbage: [
    { title: '高温期包心', mistake: '不包心或叶球松散。', fix: '选择冷凉季节安排包心期。' },
    { title: '雨后积水', mistake: '软腐病风险高。', fix: '雨后及时排水，避免叶球受伤。' },
    { title: '忽视菜青虫', mistake: '叶片被快速啃食。', fix: '幼苗期和莲座期定期翻叶检查。' },
  ],
  sunflower: [
    { title: '光照不足', mistake: '茎秆细弱，花盘小。', fix: '选择全日照位置，每天6小时以上直射光。' },
    { title: '不支撑高秆品种', mistake: '花盘变重后倒伏。', fix: '株高增加后提前立支柱。' },
    { title: '氮肥过多', mistake: '植株过高但茎秆脆弱。', fix: '开花前控制氮肥，补充磷钾肥。' },
  ],
  rice: [
    { title: '水层管理混乱', mistake: '根系弱，分蘖差。', fix: '分蘖期浅水，后期干湿交替。' },
    { title: '氮肥过量', mistake: '无效分蘖多，病害和倒伏增加。', fix: '看苗施肥，适时晒田控蘖。' },
    { title: '收割太晚', mistake: '倒伏、落粒和霉变风险增加。', fix: '黄熟末期择晴收割。' },
  ],
  strawberry: [
    { title: '苗心埋住', mistake: '容易烂心，缓苗失败。', fix: '定植时让苗心露出土面。' },
    { title: '果实贴湿土', mistake: '灰霉病和烂果增加。', fix: '铺地膜或垫草，保持通风。' },
    { title: '花期授粉不足', mistake: '畸形果多。', fix: '室内种植可人工辅助授粉。' },
  ],
  potato: [
    { title: '不培土', mistake: '块茎见光变绿。', fix: '苗高20cm左右开始培土。' },
    { title: '土壤太黏或积水', mistake: '烂薯和畸形薯增加。', fix: '使用疏松排水好的土壤。' },
    { title: '现蕾后氮肥多', mistake: '茎叶旺但结薯少。', fix: '现蕾后控氮，增加钾肥。' },
  ],
  carrot: [
    { title: '土不够松', mistake: '叉根、短根、畸形根多。', fix: '播前深翻细整，清除石块。' },
    { title: '不间苗', mistake: '根细小，互相挤压。', fix: '2–3片真叶时间苗，保留6–10cm株距。' },
    { title: '水分忽干忽湿', mistake: '肉质根容易开裂。', fix: '膨大期保持均匀供水。' },
  ],
  lettuce: [
    { title: '夏季暴晒', mistake: '叶片发苦，容易抽薹。', fix: '高温季节午后遮阴，选择耐热品种。' },
    { title: '覆土太厚', mistake: '出苗慢或不整齐。', fix: '浅播，覆土0.3–0.5cm。' },
    { title: '采收太晚', mistake: '叶片老化、口感下降。', fix: '叶片达到可食大小就采外叶或整株采收。' },
  ],
  soybean: [
    { title: '低洼积水', mistake: '根腐病和缺苗风险高。', fix: '选择排水好的地块，雨后排水。' },
    { title: '花荚期缺水', mistake: '落花落荚，产量下降。', fix: '开花结荚期保持土壤适墒。' },
    { title: '氮肥过多', mistake: '徒长倒伏，根瘤固氮受影响。', fix: '少施氮肥，重视磷钾肥。' },
  ],
  apple: [
    { title: '单株缺授粉', mistake: '开花多但坐果少。', fix: '配置授粉品种或附近有同期花源。' },
    { title: '不疏果', mistake: '果小且容易大小年。', fix: '坐果后保留合理果量。' },
    { title: '树冠郁闭', mistake: '内膛结果差，病害增加。', fix: '冬剪和夏剪都要改善通风透光。' },
  ],
  grape: [
    { title: '枝蔓太密', mistake: '通风差，霜霉病和白粉病增加。', fix: '及时绑蔓、摘心、疏枝。' },
    { title: '成熟期大水', mistake: '裂果和糖度下降。', fix: '转色后适度控水。' },
    { title: '不疏穗疏粒', mistake: '果粒拥挤，品质下降。', fix: '果实膨大期保留合理穗量。' },
  ],
  rose: [
    { title: '通风差', mistake: '黑斑病和白粉病容易反复。', fix: '拉开株距，剪除过密枝。' },
    { title: '花后不修剪', mistake: '复花慢，株型凌乱。', fix: '残花从饱满芽上方剪掉。' },
    { title: '盆底积水', mistake: '根系缺氧，叶黄掉叶。', fix: '见干见湿，托盘不要长期存水。' },
  ],
  marigold: [
    { title: '光照不足', mistake: '徒长、花少、花色淡。', fix: '放在全日照位置，至少6小时直射光。' },
    { title: '残花不剪', mistake: '花期变短，植株消耗养分。', fix: '花朵萎蔫后及时剪掉。' },
    { title: '氮肥过多', mistake: '只长叶不开花。', fix: '花前减少氮肥，增加磷钾肥。' },
  ],
  'asparagus-fern': [
    { title: '放在直射光下', mistake: '叶状枝容易发黄、焦尖，株形很快变稀疏。', fix: '移到明亮散射光处，夏季避开西晒和正午直射。' },
    { title: '浇水太勤', mistake: '盆土长期湿闷会烂根，表现为越浇越黄。', fix: '等表土干后再浇透，托盘积水及时倒掉。' },
    { title: '空气太干或风口直吹', mistake: '新枝干尖、老枝发黄脱落。', fix: '远离空调暖气风口，干燥季节用托盘水石或周围喷雾增湿。' },
  ],
};
