export type CropProblemType = 'disease' | 'pest' | 'care';

export interface CropProblem {
  type: CropProblemType;
  name: string;
  symptoms: string;
  response: string;
  prevention: string;
}

export const problemTypeLabels: Record<CropProblemType, string> = {
  disease: '病害',
  pest: '虫害',
  care: '养护问题',
};

export const cropProblems: Record<string, CropProblem[]> = {
  tomato: [
    {
      type: 'disease',
      name: '早疫病',
      symptoms: '叶片出现同心轮纹褐斑，严重时叶片干枯脱落。',
      response: '摘除病叶，减少叶面喷水，必要时使用保护性杀菌剂。',
      prevention: '避免连作，保持通风，浇水尽量浇根部。',
    },
    {
      type: 'pest',
      name: '蚜虫',
      symptoms: '嫩梢和叶背聚集小虫，叶片卷曲，常伴随蜜露。',
      response: '少量可用清水冲洗，严重时使用肥皂水或低毒药剂。',
      prevention: '及时清除杂草，增加通风，发现初期尽快处理。',
    },
    {
      type: 'care',
      name: '脐腐病',
      symptoms: '果实底部出现水浸状黑褐斑，逐渐凹陷。',
      response: '稳定浇水，叶面补钙，摘除严重病果。',
      prevention: '避免忽干忽湿，结果期补钙并控制氮肥。',
    },
  ],
  cucumber: [
    {
      type: 'disease',
      name: '霜霉病',
      symptoms: '叶片出现黄绿色多角斑，叶背有灰紫色霉层。',
      response: '摘除病叶，降低湿度，及时喷施对症药剂。',
      prevention: '搭架栽培，避免夜间叶片长期潮湿。',
    },
    {
      type: 'disease',
      name: '白粉病',
      symptoms: '叶面出现白色粉状斑，逐渐扩散影响光合作用。',
      response: '剪除重病叶，改善通风，可用硫制剂或专用药剂处理。',
      prevention: '避免密植，保持株间通风透光。',
    },
    {
      type: 'pest',
      name: '瓜绢螟',
      symptoms: '叶片被卷起或啃食，幼虫藏在卷叶内取食。',
      response: '人工摘除卷叶，低龄幼虫期及时防治。',
      prevention: '定期检查新叶和花附近，发现虫卵及时清除。',
    },
  ],
  wheat: [
    {
      type: 'disease',
      name: '赤霉病',
      symptoms: '穗部局部发白，潮湿时出现粉红色霉层。',
      response: '抽穗扬花期遇连续阴雨要及时防治。',
      prevention: '合理轮作，避免田间湿度过高和秸秆病残体堆积。',
    },
    {
      type: 'disease',
      name: '锈病',
      symptoms: '叶片或茎秆出现铁锈色粉状病斑。',
      response: '发现中心病株后及时喷施对症杀菌剂。',
      prevention: '选择抗病品种，避免过量施氮导致群体郁闭。',
    },
    {
      type: 'pest',
      name: '蚜虫',
      symptoms: '穗部或叶片聚集吸汁，植株发黄，灌浆受影响。',
      response: '虫量达到防治指标时集中处理。',
      prevention: '保护天敌，控制田间杂草和过密群体。',
    },
  ],
  corn: [
    {
      type: 'pest',
      name: '玉米螟',
      symptoms: '心叶出现排孔，茎秆和穗部有蛀孔和虫粪。',
      response: '心叶期或低龄幼虫期进行重点防治。',
      prevention: '清理越冬秸秆，减少虫源。',
    },
    {
      type: 'disease',
      name: '大斑病',
      symptoms: '叶片出现长梭形褐色病斑，严重时整叶枯死。',
      response: '摘除重病叶，发病初期使用对症药剂。',
      prevention: '合理密植，增强通风，避免连作重茬。',
    },
    {
      type: 'care',
      name: '倒伏',
      symptoms: '茎秆基部弯折或根系松动，植株倒伏。',
      response: '轻度倒伏可扶正培土，严重倒伏及时抢收。',
      prevention: '避免过密和偏施氮肥，拔节前适当培土。',
    },
  ],
  cabbage: [
    {
      type: 'pest',
      name: '菜青虫',
      symptoms: '叶片被啃食成孔洞，叶面有绿色虫粪。',
      response: '人工捕捉幼虫，低龄期使用生物制剂。',
      prevention: '覆盖防虫网，及时清除十字花科杂草。',
    },
    {
      type: 'disease',
      name: '软腐病',
      symptoms: '叶球或基部水浸状腐烂，并有臭味。',
      response: '拔除病株，撒施草木灰或保持伤口干燥。',
      prevention: '避免积水和机械伤口，雨后及时排水。',
    },
    {
      type: 'care',
      name: '不包心',
      symptoms: '叶片散开，迟迟不能形成紧实叶球。',
      response: '补充磷钾肥，控制水分和氮肥。',
      prevention: '适期播种，避免高温期进入包心阶段。',
    },
  ],
  sunflower: [
    {
      type: 'disease',
      name: '菌核病',
      symptoms: '茎秆或花盘腐烂，内部可见黑色菌核。',
      response: '拔除病株，减少田间病残体。',
      prevention: '避免连作，保持通风，控制田间湿度。',
    },
    {
      type: 'pest',
      name: '蚜虫',
      symptoms: '嫩梢和花盘附近聚集吸汁，植株生长受阻。',
      response: '少量冲洗，严重时喷施低毒药剂。',
      prevention: '保持植株健壮，及时清除附近杂草。',
    },
    {
      type: 'care',
      name: '茎秆倒伏',
      symptoms: '花盘变重后植株倾倒或折断。',
      response: '及时支撑固定，减少风害。',
      prevention: '全日照栽培，避免过密和氮肥过多。',
    },
  ],
  rice: [
    {
      type: 'disease',
      name: '稻瘟病',
      symptoms: '叶片、节部或穗颈出现褐色病斑，穗颈发病会白穗。',
      response: '发现叶瘟或破口期高风险时及时防治。',
      prevention: '选择抗病品种，控制氮肥，保持合理水层。',
    },
    {
      type: 'disease',
      name: '纹枯病',
      symptoms: '叶鞘出现云纹状病斑，湿度大时扩展迅速。',
      response: '分蘖后期至拔节期关注病斑并及时处理。',
      prevention: '合理密植，晒田控蘖，降低田间湿度。',
    },
    {
      type: 'pest',
      name: '螟虫',
      symptoms: '出现枯心苗或白穗，茎秆内有蛀道。',
      response: '低龄幼虫期集中防治。',
      prevention: '清理稻桩，减少越冬虫源。',
    },
  ],
  strawberry: [
    {
      type: 'disease',
      name: '灰霉病',
      symptoms: '花和果实腐烂，表面产生灰色霉层。',
      response: '摘除病花病果，降低湿度，必要时用药。',
      prevention: '通风降湿，地膜覆盖，避免果实接触湿土。',
    },
    {
      type: 'disease',
      name: '白粉病',
      symptoms: '叶背和果面出现白色粉层，叶缘上卷。',
      response: '剪除病叶，改善通风，使用对症药剂。',
      prevention: '避免密植和温室闷湿，控制氮肥。',
    },
    {
      type: 'pest',
      name: '红蜘蛛',
      symptoms: '叶片失绿发黄，叶背可见细小螨虫和丝网。',
      response: '清除重病叶，使用杀螨剂或生物防治。',
      prevention: '高温干燥期增加巡查，避免植株缺水衰弱。',
    },
  ],
  potato: [
    {
      type: 'disease',
      name: '晚疫病',
      symptoms: '叶片出现水浸状暗斑，潮湿时叶背有白霉。',
      response: '摘除病叶，雨季及时喷施保护性药剂。',
      prevention: '避免连作，保持通风，收获后清除病残体。',
    },
    {
      type: 'pest',
      name: '蛴螬',
      symptoms: '块茎被咬出孔洞，根系受损，植株长势弱。',
      response: '翻土捕杀，严重时进行土壤处理。',
      prevention: '施用充分腐熟有机肥，播前深翻晒土。',
    },
    {
      type: 'care',
      name: '青皮薯',
      symptoms: '块茎见光后表皮发绿，不适合食用。',
      response: '剔除青皮部分严重的块茎。',
      prevention: '及时培土，采后避光保存。',
    },
  ],
  carrot: [
    {
      type: 'pest',
      name: '根结线虫',
      symptoms: '根部形成瘤状结节，肉质根畸形，植株矮小。',
      response: '拔除重病株，避免病土继续种根菜。',
      prevention: '轮作葱蒜类或禾本科作物，播前深翻晒土。',
    },
    {
      type: 'disease',
      name: '黑腐病',
      symptoms: '叶柄和根肩出现黑褐色病斑，后期腐烂。',
      response: '清除病株，控制浇水，保持田间干爽。',
      prevention: '使用健康种子，避免过密和积水。',
    },
    {
      type: 'care',
      name: '叉根裂根',
      symptoms: '肉质根分叉、开裂，商品性下降。',
      response: '保持后期水分稳定，及时采收过大的根。',
      prevention: '深翻细整土壤，避免未腐熟有机肥和石块。',
    },
  ],
  lettuce: [
    {
      type: 'pest',
      name: '蚜虫',
      symptoms: '嫩叶卷曲发黏，叶背聚集小虫。',
      response: '清水冲洗或使用低毒药剂，采收前注意安全间隔。',
      prevention: '覆盖防虫网，保持通风，及时清除老叶。',
    },
    {
      type: 'disease',
      name: '霜霉病',
      symptoms: '叶片出现淡黄斑，叶背有霉层。',
      response: '摘除病叶，减少叶面喷水。',
      prevention: '避免密植，高湿天气加强通风。',
    },
    {
      type: 'care',
      name: '抽薹发苦',
      symptoms: '植株抽出花茎，叶片变硬发苦。',
      response: '尽快采收可食叶片。',
      prevention: '冷凉季节种植，夏季遮阴并选择耐热品种。',
    },
  ],
  soybean: [
    {
      type: 'pest',
      name: '豆荚螟',
      symptoms: '豆荚被蛀食，荚内有虫粪，籽粒受损。',
      response: '开花结荚初期重点巡查并及时防治。',
      prevention: '清除田间残株，减少虫源。',
    },
    {
      type: 'disease',
      name: '根腐病',
      symptoms: '根部褐变腐烂，植株萎蔫发黄。',
      response: '拔除病株，改善排水。',
      prevention: '避免低洼积水，合理轮作，播前拌种。',
    },
    {
      type: 'care',
      name: '落花落荚',
      symptoms: '开花后花和幼荚大量脱落。',
      response: '及时补水，避免高温干旱持续。',
      prevention: '花荚期保持土壤适墒，避免氮肥过多。',
    },
  ],
  apple: [
    {
      type: 'disease',
      name: '腐烂病',
      symptoms: '枝干皮层坏死凹陷，有酒糟味或流胶。',
      response: '刮除病斑并消毒保护伤口。',
      prevention: '冬季清园，避免冻害和修剪大伤口感染。',
    },
    {
      type: 'pest',
      name: '蚜虫',
      symptoms: '新梢卷叶，叶片黏腻，生长受阻。',
      response: '剪除虫梢，严重时使用对症药剂。',
      prevention: '保护瓢虫等天敌，萌芽期加强检查。',
    },
    {
      type: 'care',
      name: '大小年',
      symptoms: '一年结果过多，下一年花量和产量明显下降。',
      response: '大年及时疏花疏果。',
      prevention: '均衡修剪和施肥，保持树势稳定。',
    },
  ],
  grape: [
    {
      type: 'disease',
      name: '霜霉病',
      symptoms: '叶面黄斑，叶背白色霉层，果穗也可受害。',
      response: '雨后及时处理病叶和病穗。',
      prevention: '避雨栽培，及时绑蔓摘心，改善通风。',
    },
    {
      type: 'disease',
      name: '白粉病',
      symptoms: '叶片和果粒表面出现白色粉层，果粒易裂。',
      response: '发病初期使用对症药剂，剪除病部。',
      prevention: '控制枝叶郁闭，避免氮肥过量。',
    },
    {
      type: 'care',
      name: '裂果',
      symptoms: '成熟期果粒开裂，易腐烂招虫。',
      response: '及时采收裂果，减少病菌扩散。',
      prevention: '转色后控水，补钙，避免土壤忽干忽湿。',
    },
  ],
  rose: [
    {
      type: 'disease',
      name: '黑斑病',
      symptoms: '叶片出现黑褐色圆斑，周围发黄并落叶。',
      response: '摘除病叶，清理落叶，喷施对症药剂。',
      prevention: '保持通风，浇水避开叶片，定期清园。',
    },
    {
      type: 'disease',
      name: '白粉病',
      symptoms: '嫩叶、花梗出现白粉，叶片卷曲畸形。',
      response: '剪除重病枝叶，使用硫制剂或专用药剂。',
      prevention: '避免闷湿和昼夜温差过大，增强光照。',
    },
    {
      type: 'pest',
      name: '红蜘蛛',
      symptoms: '叶片失绿发灰，叶背有细小虫体和丝网。',
      response: '冲洗叶背，严重时使用杀螨剂。',
      prevention: '高温干燥期保持巡查，增强植株水分供应。',
    },
  ],
  marigold: [
    {
      type: 'pest',
      name: '蚜虫',
      symptoms: '嫩梢和花蕾聚集小虫，花蕾发育受影响。',
      response: '清水冲洗或使用低毒药剂处理。',
      prevention: '保持通风，及时剪除过密枝叶。',
    },
    {
      type: 'disease',
      name: '灰霉病',
      symptoms: '花瓣和叶片出现褐色腐烂，潮湿时有灰霉。',
      response: '剪除病花病叶，减少浇水频率。',
      prevention: '雨季避雨，避免花叶长期潮湿。',
    },
    {
      type: 'care',
      name: '徒长少花',
      symptoms: '枝叶旺盛但花少，株型松散。',
      response: '摘心促分枝，减少氮肥，增加光照。',
      prevention: '全日照养护，花前补充磷钾肥。',
    },
  ],
};
