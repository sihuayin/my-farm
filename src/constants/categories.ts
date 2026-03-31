import type { Category } from '../types/crop';

export const categories: { label: string; value: Category | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '蔬菜', value: 'vegetable' },
  { label: '粮食', value: 'grain' },
  { label: '水果', value: 'fruit' },
  { label: '花卉', value: 'flower' },
];
