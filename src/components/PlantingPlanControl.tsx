import { CalendarPlus, Check, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { CropPlanningInfo } from '../data/cropPlanning';
import {
  getPlanDay,
  getPlanProgress,
  readPlantingPlans,
  removePlantingPlan,
  savePlantingPlan,
  updatePlantingPlanStartDate,
  type SavedPlantingPlan,
} from '../services/plantingPlans';

interface Props {
  cropId: string;
  cropName: string;
  planning?: CropPlanningInfo;
}

export default function PlantingPlanControl({ cropId, cropName, planning }: Props) {
  const [plans, setPlans] = useState<SavedPlantingPlan[]>(() => readPlantingPlans());

  const currentPlan = plans.find((plan) => plan.cropId === cropId);
  const progress = currentPlan ? getPlanProgress(currentPlan) : 0;

  const addPlan = () => {
    setPlans(
      savePlantingPlan({
        cropId,
        cropName,
        harvestDays: planning?.harvestDays,
        createdAt: new Date().toISOString(),
      })
    );
  };

  const removePlan = () => {
    setPlans(removePlantingPlan(cropId));
  };

  const updateStartDate = (value: string) => {
    if (!value) return;
    setPlans(updatePlantingPlanStartDate(cropId, new Date(value).toISOString()));
  };

  return (
    <section className="planting-plan-control">
      <div>
        <h2>我的种植计划</h2>
        {currentPlan ? (
          <p>
            第 {getPlanDay(currentPlan.createdAt)} 天 ·{' '}
            {new Date(currentPlan.createdAt).toLocaleDateString('zh-CN')}
            {currentPlan.harvestDays ? ` · ${currentPlan.harvestDays}` : ''}
          </p>
        ) : (
          <p>{planning?.harvestDays ? `预计${planning.harvestDays}` : '准备开始本季种植'}</p>
        )}
      </div>
      {currentPlan ? (
        <button className="plan-remove-btn" onClick={removePlan}>
          <Trash2 size={16} />
          移除
        </button>
      ) : (
        <button className="plan-add-btn" onClick={addPlan}>
          <CalendarPlus size={16} />
          加入计划
        </button>
      )}
      {currentPlan && (
        <>
          <label className="plan-date-field">
            <span>开始日期</span>
            <input
              type="date"
              value={currentPlan.createdAt.slice(0, 10)}
              onChange={(e) => updateStartDate(e.target.value)}
              onInput={(e) => updateStartDate(e.currentTarget.value)}
            />
          </label>
          <div className="plan-progress" aria-label="计划进度">
            <span style={{ width: `${progress}%` }} />
          </div>
          <span className="plan-saved-mark">
            <Check size={14} />
            {progress}%
          </span>
        </>
      )}
    </section>
  );
}
