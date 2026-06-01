import { CalendarCheck, ExternalLink, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cropStageActions } from '../data/cropStageActions';
import { defaultStageActions } from '../data/defaultStageActions';
import {
  getPlanProgress,
  getPlanDay,
  readPlantingPlans,
  removePlantingPlan,
  type SavedPlantingPlan,
} from '../services/plantingPlans';
import type { Crop, StageInfo } from '../types/crop';

interface Props {
  crops: Crop[];
}

function getCurrentStage(plan: SavedPlantingPlan, stages: StageInfo[]): StageInfo {
  const progress = getPlanProgress(plan);
  const index = Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));
  return stages[index];
}

export default function SavedPlansPanel({ crops }: Props) {
  const [plans, setPlans] = useState<SavedPlantingPlan[]>(() => readPlantingPlans());

  if (plans.length === 0) return null;

  const handleRemove = (cropId: string) => {
    setPlans(removePlantingPlan(cropId));
  };

  return (
    <section className="saved-plans-panel" aria-label="我的种植计划">
      <div className="saved-plans-header">
        <h2>
          <CalendarCheck size={20} />
          我的计划
        </h2>
        <span>{plans.length} 项</span>
      </div>
      <div className="saved-plans-list">
        {plans.map((plan) => (
          <SavedPlanItem
            key={plan.cropId}
            plan={plan}
            crop={crops.find((crop) => crop.id === plan.cropId)}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </section>
  );
}

interface SavedPlanItemProps {
  plan: SavedPlantingPlan;
  crop?: Crop;
  onRemove: (cropId: string) => void;
}

function SavedPlanItem({ plan, crop, onRemove }: SavedPlanItemProps) {
  const stage = crop ? getCurrentStage(plan, crop.stages) : null;
  const stageTask =
    stage && crop
      ? [...(cropStageActions[crop.id]?.[stage.stage] || []), ...defaultStageActions[stage.stage]][0]
      : null;

  return (
    <div className="saved-plan-item">
      <Link to={`/crop/${plan.cropId}`} className="saved-plan-link">
        <strong>{plan.cropName}</strong>
        <span>
          第 {getPlanDay(plan.createdAt)} 天 · {new Date(plan.createdAt).toLocaleDateString('zh-CN')}
          {plan.harvestDays ? ` · ${plan.harvestDays}` : ''}
        </span>
        <small>{getPlanProgress(plan)}%</small>
        <ExternalLink size={14} />
        {stage && stageTask && (
          <em>
            {stage.title} · {stageTask}
          </em>
        )}
      </Link>
      <button
        className="saved-plan-remove"
        onClick={() => onRemove(plan.cropId)}
        title="移除计划"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
