import type { GrowthStage } from '../types/crop';

export const defaultStageActions: Record<GrowthStage, string[]> = {
  seedling: ['确认种苗或种子状态', '准备疏松干净的育苗介质'],
  germination: ['保持基质湿润', '维持适宜温度并避免积水'],
  seedling_stage: ['及时通风见光', '间苗或移栽弱苗'],
  growth: ['观察长势并补充水肥', '清理杂草和病弱叶'],
  flowering: ['控制氮肥并补充磷钾肥', '关注授粉和花期温度'],
  fruiting: ['保持稳定水分', '加强病虫害巡查'],
  maturity: ['分批采收成熟部分', '记录表现并清理残株'],
};
