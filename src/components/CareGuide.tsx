import { Sun, Droplets, Leaf, Thermometer, Layers } from 'lucide-react';
import type { CareRequirement } from '../types/crop';

interface Props {
  care: CareRequirement;
}

const careItems = [
  { key: 'sunlight' as const, Icon: Sun, label: '光照', color: '#f59e0b' },
  { key: 'water' as const, Icon: Droplets, label: '水分', color: '#3b82f6' },
  { key: 'fertilizer' as const, Icon: Leaf, label: '肥料', color: '#22c55e' },
  { key: 'temperature' as const, Icon: Thermometer, label: '温度', color: '#ef4444' },
  { key: 'soil' as const, Icon: Layers, label: '土壤', color: '#a16207' },
];

export default function CareGuide({ care }: Props) {
  return (
    <section className="care-guide">
      <h2 className="section-title">种植要求</h2>
      <div className="care-grid">
        {careItems.map(({ key, Icon, label, color }) => (
          <div key={key} className="care-card">
            <div className="care-icon" style={{ background: `${color}20`, color }}>
              <Icon size={28} />
            </div>
            <div className="care-info">
              <h4>{label}</h4>
              <p>{care[key]}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
