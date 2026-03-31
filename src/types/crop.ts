export type GrowthStage =
  | 'seedling'
  | 'germination'
  | 'seedling_stage'
  | 'growth'
  | 'flowering'
  | 'fruiting'
  | 'maturity';

export type Category = 'vegetable' | 'grain' | 'fruit' | 'flower';

export interface StageInfo {
  stage: GrowthStage;
  title: string;
  description: string;
  image: string;
  duration: string;
}

export interface CareRequirement {
  sunlight: string;
  water: string;
  fertilizer: string;
  temperature: string;
  soil: string;
}

export interface Crop {
  id: string;
  name: string;
  scientificName: string;
  category: Category;
  coverImage: string;
  summary: string;
  habits: {
    temperature: string;
    sunlight: string;
    soil: string;
    humidity: string;
    hardiness: string;
  };
  stages: StageInfo[];
  care: CareRequirement;
  tips: string[];
}

export const categoryLabels: Record<Category, string> = {
  vegetable: '蔬菜',
  grain: '粮食',
  fruit: '水果',
  flower: '花卉',
};

export const stageLabels: Record<GrowthStage, string> = {
  seedling: '种子期',
  germination: '发芽期',
  seedling_stage: '幼苗期',
  growth: '生长期',
  flowering: '开花期',
  fruiting: '结果期',
  maturity: '成熟期',
};
