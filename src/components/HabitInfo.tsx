import { Thermometer, Sun, Layers, Droplets, Shield } from 'lucide-react';

interface Props {
  habits: {
    temperature: string;
    sunlight: string;
    soil: string;
    humidity: string;
    hardiness: string;
  };
}

const habitItems = [
  { key: 'temperature' as const, Icon: Thermometer, label: '温度' },
  { key: 'sunlight' as const, Icon: Sun, label: '光照' },
  { key: 'soil' as const, Icon: Layers, label: '土壤' },
  { key: 'humidity' as const, Icon: Droplets, label: '湿度' },
  { key: 'hardiness' as const, Icon: Shield, label: '耐寒性' },
];

export default function HabitInfo({ habits }: Props) {
  return (
    <section className="habit-info">
      <h2 className="section-title">生长习性</h2>
      <div className="habit-grid">
        {habitItems.map(({ key, Icon, label }) => (
          <div key={key} className="habit-item">
            <Icon size={18} className="habit-icon" />
            <div>
              <span className="habit-label">{label}</span>
              <span className="habit-value">{habits[key]}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
