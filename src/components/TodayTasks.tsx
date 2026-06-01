import { CheckCircle2, Sprout } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cropStageActions } from '../data/cropStageActions';
import { defaultStageActions } from '../data/defaultStageActions';
import {
  getPlanDay,
  getPlanProgress,
  readPlantingPlans,
  subscribePlantingPlans,
  type SavedPlantingPlan,
} from '../services/plantingPlans';
import type { StageInfo } from '../types/crop';

interface Props {
  cropId: string;
  stages: StageInfo[];
}

function getCurrentStageIndex(plan: SavedPlantingPlan, stages: StageInfo[]): number {
  const progress = getPlanProgress(plan);
  if (progress <= 0) return 0;

  return Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));
}

function getTaskStorageKey(cropId: string, plan: SavedPlantingPlan, stage: StageInfo): string {
  return `farm_task_done:${cropId}:${plan.createdAt.slice(0, 10)}:${stage.stage}`;
}

function readCompletedTasks(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeCompletedTasks(key: string, tasks: string[]) {
  localStorage.setItem(key, JSON.stringify(tasks));
}

export default function TodayTasks({ cropId, stages }: Props) {
  const [plans, setPlans] = useState<SavedPlantingPlan[]>(() => readPlantingPlans());
  const [completedByKey, setCompletedByKey] = useState<Record<string, string[]>>({});
  const currentPlan = plans.find((plan) => plan.cropId === cropId);
  const stage = currentPlan ? stages[getCurrentStageIndex(currentPlan, stages)] : null;
  const taskStorageKey = currentPlan && stage ? getTaskStorageKey(cropId, currentPlan, stage) : '';

  useEffect(() => {
    return subscribePlantingPlans(() => setPlans(readPlantingPlans()));
  }, []);

  if (!currentPlan || !stage) return null;

  const tasks = [
    ...(cropStageActions[cropId]?.[stage.stage] || []),
    ...defaultStageActions[stage.stage],
  ].slice(0, 4);
  const completedTasks = completedByKey[taskStorageKey] ?? readCompletedTasks(taskStorageKey);

  const toggleTask = (task: string) => {
    const nextTasks = completedTasks.includes(task)
      ? completedTasks.filter((item) => item !== task)
      : [...completedTasks, task];
    setCompletedByKey((prev) => ({ ...prev, [taskStorageKey]: nextTasks }));
    writeCompletedTasks(taskStorageKey, nextTasks);
  };

  return (
    <section id="today" className="today-tasks">
      <div className="today-tasks-header">
        <div>
          <span>第 {getPlanDay(currentPlan.createdAt)} 天</span>
          <h2>今日该做什么</h2>
        </div>
        <strong>{stage.title}</strong>
      </div>
      <p>{stage.description}</p>
      <ul>
        {tasks.map((task) => (
          <li key={task} className={completedTasks.includes(task) ? 'done' : ''}>
            <button onClick={() => toggleTask(task)} aria-label={`切换任务：${task}`}>
              <CheckCircle2 size={16} />
            </button>
            {task}
          </li>
        ))}
      </ul>
      <Sprout size={22} className="today-tasks-mark" />
    </section>
  );
}
