import type { Crop } from '../types/crop';

export type PlantingSpace = 'balcony' | 'garden' | 'field';
export type PlantingDifficulty = 'easy' | 'medium' | 'hard';
export type SunlightLevel = 'low' | 'medium' | 'high';
export type ExperienceLevel = 'beginner' | 'comfortable';
export type PlantingRegion = 'north' | 'east' | 'south' | 'southwest' | 'northeast';

export interface CropPlanningInfo {
  months: number[];
  regions: PlantingRegion[];
  spaces: PlantingSpace[];
  difficulty: PlantingDifficulty;
  sunlight: SunlightLevel[];
  harvestDays: string;
  sowingDepth: string;
  spacing: string;
  containerDepth: string;
  waterRhythm: string;
}

export interface RecommendationAnswers {
  month: number;
  region: PlantingRegion;
  space: PlantingSpace;
  sunlight: SunlightLevel;
  experience: ExperienceLevel;
}

export interface CropRecommendation {
  crop: Crop;
  planning: CropPlanningInfo;
  score: number;
  reasons: string[];
}

export const spaceLabels: Record<PlantingSpace | 'all', string> = {
  all: '全部空间',
  balcony: '阳台/盆栽',
  garden: '庭院菜园',
  field: '露地/田间',
};

export const regionLabels: Record<PlantingRegion, string> = {
  north: '华北',
  east: '华东',
  south: '华南',
  southwest: '西南',
  northeast: '东北',
};

export const difficultyLabels: Record<PlantingDifficulty | 'all', string> = {
  all: '全部难度',
  easy: '容易',
  medium: '中等',
  hard: '进阶',
};

export const sunlightLabels: Record<SunlightLevel, string> = {
  low: '半阴',
  medium: '半日照',
  high: '全日照',
};

export const experienceLabels: Record<ExperienceLevel, string> = {
  beginner: '刚开始种',
  comfortable: '有一些经验',
};

export const monthLabels = Array.from({ length: 12 }, (_, index) => `${index + 1}月`);

export const cropPlanning: Record<string, CropPlanningInfo> = {
  tomato: {
    months: [3, 4, 5],
    regions: ['north', 'east', 'south', 'southwest'],
    spaces: ['balcony', 'garden', 'field'],
    difficulty: 'medium',
    sunlight: ['high'],
    harvestDays: '90–120天',
    sowingDepth: '0.5–1cm',
    spacing: '40–50cm',
    containerDepth: '30cm以上',
    waterRhythm: '见干见湿，结果期保持稳定',
  },
  cucumber: {
    months: [3, 4, 5, 6],
    regions: ['north', 'east', 'south', 'southwest'],
    spaces: ['garden', 'field'],
    difficulty: 'medium',
    sunlight: ['medium', 'high'],
    harvestDays: '60–90天',
    sowingDepth: '1–2cm',
    spacing: '35–45cm',
    containerDepth: '30cm以上并需支架',
    waterRhythm: '结果期水分要足，避免忽干忽湿',
  },
  wheat: {
    months: [9, 10, 11],
    regions: ['north', 'east', 'southwest'],
    spaces: ['field'],
    difficulty: 'hard',
    sunlight: ['high'],
    harvestDays: '220–260天',
    sowingDepth: '3–5cm',
    spacing: '行距15–20cm',
    containerDepth: '不建议盆栽',
    waterRhythm: '拔节和灌浆期重点补水',
  },
  corn: {
    months: [4, 5, 6],
    regions: ['north', 'east', 'south', 'southwest', 'northeast'],
    spaces: ['garden', 'field'],
    difficulty: 'medium',
    sunlight: ['high'],
    harvestDays: '90–120天',
    sowingDepth: '3–5cm',
    spacing: '25–35cm',
    containerDepth: '40cm以上',
    waterRhythm: '拔节至抽雄期需水较多',
  },
  cabbage: {
    months: [2, 3, 8, 9],
    regions: ['north', 'east', 'south', 'southwest', 'northeast'],
    spaces: ['garden', 'field'],
    difficulty: 'medium',
    sunlight: ['medium', 'high'],
    harvestDays: '70–100天',
    sowingDepth: '0.5–1cm',
    spacing: '35–45cm',
    containerDepth: '25cm以上',
    waterRhythm: '包心期保持土壤湿润',
  },
  sunflower: {
    months: [3, 4, 5, 6],
    regions: ['north', 'east', 'south', 'southwest', 'northeast'],
    spaces: ['garden', 'field'],
    difficulty: 'easy',
    sunlight: ['high'],
    harvestDays: '80–120天',
    sowingDepth: '1–2cm',
    spacing: '30–45cm',
    containerDepth: '30cm以上',
    waterRhythm: '苗期保湿，成株耐旱',
  },
  rice: {
    months: [4, 5, 6],
    regions: ['east', 'south', 'southwest', 'northeast'],
    spaces: ['field'],
    difficulty: 'hard',
    sunlight: ['high'],
    harvestDays: '120–160天',
    sowingDepth: '育秧浅播',
    spacing: '15–20cm',
    containerDepth: '水田或深水培容器',
    waterRhythm: '浅水勤灌，收割前排水',
  },
  strawberry: {
    months: [9, 10, 11],
    regions: ['north', 'east', 'south', 'southwest'],
    spaces: ['balcony', 'garden'],
    difficulty: 'medium',
    sunlight: ['high'],
    harvestDays: '90–150天',
    sowingDepth: '苗心露出土面',
    spacing: '20–30cm',
    containerDepth: '20cm以上',
    waterRhythm: '保持湿润，果期避免积水',
  },
  potato: {
    months: [2, 3, 8, 9],
    regions: ['north', 'east', 'southwest', 'northeast'],
    spaces: ['garden', 'field'],
    difficulty: 'easy',
    sunlight: ['medium', 'high'],
    harvestDays: '80–110天',
    sowingDepth: '8–12cm',
    spacing: '25–30cm',
    containerDepth: '35cm以上',
    waterRhythm: '块茎膨大期稳定供水',
  },
  carrot: {
    months: [3, 4, 8, 9, 10],
    regions: ['north', 'east', 'south', 'southwest', 'northeast'],
    spaces: ['balcony', 'garden', 'field'],
    difficulty: 'easy',
    sunlight: ['medium', 'high'],
    harvestDays: '80–110天',
    sowingDepth: '0.5–1cm',
    spacing: '6–10cm',
    containerDepth: '25cm以上',
    waterRhythm: '全程均匀供水，防裂根',
  },
  lettuce: {
    months: [2, 3, 4, 9, 10, 11],
    regions: ['north', 'east', 'south', 'southwest', 'northeast'],
    spaces: ['balcony', 'garden', 'field'],
    difficulty: 'easy',
    sunlight: ['low', 'medium', 'high'],
    harvestDays: '35–60天',
    sowingDepth: '0.3–0.5cm',
    spacing: '15–25cm',
    containerDepth: '15cm以上',
    waterRhythm: '保持湿润，避免叶片发苦',
  },
  soybean: {
    months: [4, 5, 6],
    regions: ['north', 'east', 'southwest', 'northeast'],
    spaces: ['garden', 'field'],
    difficulty: 'medium',
    sunlight: ['high'],
    harvestDays: '90–130天',
    sowingDepth: '3–5cm',
    spacing: '15–20cm',
    containerDepth: '30cm以上',
    waterRhythm: '花荚期不能缺水',
  },
  apple: {
    months: [11, 12, 1, 2, 3],
    regions: ['north', 'east', 'southwest', 'northeast'],
    spaces: ['garden', 'field'],
    difficulty: 'hard',
    sunlight: ['high'],
    harvestDays: '2–4年结果',
    sowingDepth: '嫁接苗按原土痕定植',
    spacing: '2–4m',
    containerDepth: '60cm以上或地栽',
    waterRhythm: '萌芽、膨果、采后重点补水',
  },
  grape: {
    months: [11, 12, 1, 2, 3],
    regions: ['north', 'east', 'southwest', 'northeast'],
    spaces: ['garden', 'field'],
    difficulty: 'hard',
    sunlight: ['high'],
    harvestDays: '2–3年结果',
    sowingDepth: '苗木根颈略高于土面',
    spacing: '1.5–3m',
    containerDepth: '50cm以上并需架式',
    waterRhythm: '萌芽膨果期补水，转色后控水',
  },
  rose: {
    months: [3, 4, 9, 10, 11],
    regions: ['north', 'east', 'south', 'southwest', 'northeast'],
    spaces: ['balcony', 'garden', 'field'],
    difficulty: 'medium',
    sunlight: ['high'],
    harvestDays: '60–120天见花',
    sowingDepth: '根颈略高于土面',
    spacing: '30–50cm',
    containerDepth: '30cm以上',
    waterRhythm: '见干见湿，避免托盘积水',
  },
  marigold: {
    months: [3, 4, 5, 6],
    regions: ['north', 'east', 'south', 'southwest'],
    spaces: ['balcony', 'garden', 'field'],
    difficulty: 'easy',
    sunlight: ['high'],
    harvestDays: '50–80天见花',
    sowingDepth: '0.5cm',
    spacing: '20–30cm',
    containerDepth: '18cm以上',
    waterRhythm: '盆土表面干后浇透',
  },
};

export function getCropRecommendations(
  crops: Crop[],
  answers: RecommendationAnswers
): CropRecommendation[] {
  return crops
    .map((crop) => {
      const planning = cropPlanning[crop.id];
      if (!planning) return null;

      const reasons: string[] = [];
      let score = 0;

      if (planning.months.includes(answers.month)) {
        score += 35;
        reasons.push(`适合${monthLabels[answers.month - 1]}安排播种或定植`);
      }

      if (planning.regions.includes(answers.region)) {
        score += 15;
        reasons.push(`适配${regionLabels[answers.region]}常见种植条件`);
      }

      if (planning.spaces.includes(answers.space)) {
        score += 25;
        reasons.push(`适合${spaceLabels[answers.space]}`);
      }

      if (planning.sunlight.includes(answers.sunlight)) {
        score += 20;
        reasons.push(`匹配${sunlightLabels[answers.sunlight]}条件`);
      }

      if (answers.experience === 'beginner') {
        if (planning.difficulty === 'easy') {
          score += 20;
          reasons.push('上手难度低，适合新手');
        } else if (planning.difficulty === 'medium') {
          score += 10;
          reasons.push('需要一些日常管理，但难度可控');
        } else {
          score -= 10;
        }
      } else if (planning.difficulty === 'hard') {
        score += 15;
        reasons.push('适合有经验后挑战长期管理');
      } else {
        score += 18;
        reasons.push('管理强度适中，容易形成稳定反馈');
      }

      reasons.push(`预计${planning.harvestDays}`);

      return { crop, planning, score, reasons };
    })
    .filter((item): item is CropRecommendation => item !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
