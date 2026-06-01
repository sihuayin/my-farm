import { AlertTriangle, ShieldCheck } from 'lucide-react';
import type { BeginnerRisk } from '../data/cropBeginnerRisks';

interface Props {
  risks: BeginnerRisk[];
}

export default function BeginnerRiskTips({ risks }: Props) {
  if (risks.length === 0) return null;

  return (
    <section id="risks" className="beginner-risks">
      <h2 className="section-title">
        <AlertTriangle size={20} />
        新手避坑
      </h2>
      <div className="risk-grid">
        {risks.map((risk) => (
          <article key={risk.title} className="risk-card">
            <div className="risk-card-title">
              <AlertTriangle size={18} />
              <h3>{risk.title}</h3>
            </div>
            <p>{risk.mistake}</p>
            <div className="risk-fix">
              <ShieldCheck size={16} />
              <span>{risk.fix}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
