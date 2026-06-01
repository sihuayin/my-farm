import { CheckCircle2, ClipboardList } from 'lucide-react';
import { cropStageActions } from '../data/cropStageActions';
import { defaultStageActions } from '../data/defaultStageActions';
import type { StageInfo } from '../types/crop';

interface Props {
  cropId: string;
  stages: StageInfo[];
}

export default function StageActionChecklist({ cropId, stages }: Props) {
  return (
    <section id="stage-actions" className="stage-actions">
      <h2 className="section-title">
        <ClipboardList size={20} />
        阶段任务
      </h2>
      <div className="stage-action-list">
        {stages.map((stage) => (
          <article key={stage.stage} className="stage-action-item">
            <div className="stage-action-header">
              <span>{stage.title}</span>
              <strong>{stage.duration}</strong>
            </div>
            <p className="stage-action-description">{stage.description}</p>
            <ul>
              {[
                ...(cropStageActions[cropId]?.[stage.stage] || []),
                ...defaultStageActions[stage.stage],
              ].map((action) => (
                <li key={action}>
                  <CheckCircle2 size={16} />
                  {action}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
