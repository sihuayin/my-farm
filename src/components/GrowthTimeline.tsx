import { stageLabels } from '../types/crop';
import type { StageInfo } from '../types/crop';

interface Props {
  stages: StageInfo[];
}

export default function GrowthTimeline({ stages }: Props) {
  return (
    <section className="growth-timeline">
      <h2 className="section-title">生长周期</h2>
      <div className="timeline">
        {stages.map((stage, index) => (
          <div key={stage.stage} className="timeline-item">
            <div className="timeline-connector">
              <div className="timeline-dot" />
              {index < stages.length - 1 && <div className="timeline-line" />}
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-stage">{stageLabels[stage.stage]}</span>
                <span className="timeline-duration">{stage.duration}</span>
              </div>
              <div className="timeline-card">
                <img
                  src={stage.image}
                  alt={stage.title}
                  className="timeline-image"
                  loading="lazy"
                />
                <div className="timeline-info">
                  <h4>{stage.title}</h4>
                  <p>{stage.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
