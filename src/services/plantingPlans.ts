export interface SavedPlantingPlan {
  cropId: string;
  cropName: string;
  harvestDays?: string;
  createdAt: string;
}

const STORAGE_KEY = 'farm_planting_plans';
const PLANS_CHANGE_EVENT = 'planting-plans-change';

export function readPlantingPlans(): SavedPlantingPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedPlantingPlan[]) : [];
  } catch {
    return [];
  }
}

export function writePlantingPlans(plans: SavedPlantingPlan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  window.dispatchEvent(new Event(PLANS_CHANGE_EVENT));
}

export function savePlantingPlan(plan: SavedPlantingPlan): SavedPlantingPlan[] {
  const nextPlans = [
    ...readPlantingPlans().filter((item) => item.cropId !== plan.cropId),
    plan,
  ];
  writePlantingPlans(nextPlans);
  return nextPlans;
}

export function removePlantingPlan(cropId: string): SavedPlantingPlan[] {
  const nextPlans = readPlantingPlans().filter((plan) => plan.cropId !== cropId);
  writePlantingPlans(nextPlans);
  return nextPlans;
}

export function updatePlantingPlanStartDate(
  cropId: string,
  createdAt: string
): SavedPlantingPlan[] {
  const nextPlans = readPlantingPlans().map((plan) =>
    plan.cropId === cropId ? { ...plan, createdAt } : plan
  );
  writePlantingPlans(nextPlans);
  return nextPlans;
}

export function getPlanDay(createdAt: string): number {
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) return 1;

  const dayMs = 24 * 60 * 60 * 1000;
  return Math.max(1, Math.floor((Date.now() - createdTime) / dayMs) + 1);
}

export function getEstimatedPlanDays(harvestDays?: string): number | null {
  if (!harvestDays) return null;

  const numbers = harvestDays.match(/\d+/g)?.map(Number);
  if (!numbers?.length) return null;

  const estimate = numbers[numbers.length - 1];
  return harvestDays.includes('年') ? estimate * 365 : estimate;
}

export function getPlanProgress(plan: SavedPlantingPlan): number {
  const estimate = getEstimatedPlanDays(plan.harvestDays);
  if (!estimate) return 0;

  return Math.min(100, Math.round((getPlanDay(plan.createdAt) / estimate) * 100));
}

export function subscribePlantingPlans(listener: () => void): () => void {
  window.addEventListener(PLANS_CHANGE_EVENT, listener);
  return () => window.removeEventListener(PLANS_CHANGE_EVENT, listener);
}
