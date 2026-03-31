import { stageLabels } from '../types/crop';
import type { StageInfo } from '../types/crop';

interface Props {
  stages: StageInfo[];
  onImageClick: (src: string, alt: string) => void;
}

export default function GrowthTimeline({ stages, onImageClick }: Props) {
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
                <div
                  className="timeline-image-wrapper"
                  onClick={() => onImageClick(stage.image, stage.title)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onImageClick(stage.image, stage.title)}
                >
                  <img
                    src={stage.image}
                    alt={stage.title}
                    className="timeline-image"
                    loading="lazy"
                  />
                  <div className="timeline-image-zoom">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
                    </svg>
                  </div>
                </div>
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
