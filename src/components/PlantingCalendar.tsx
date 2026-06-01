import { CalendarDays, Clock, Droplets, Layers, MapPin, Ruler, SunMedium } from 'lucide-react';
import {
  difficultyLabels,
  monthLabels,
  spaceLabels,
  sunlightLabels,
  type CropPlanningInfo,
} from '../data/cropPlanning';

interface Props {
  planning: CropPlanningInfo;
}

export default function PlantingCalendar({ planning }: Props) {
  const activeMonths = new Set(planning.months);
  const spaces = planning.spaces.map((space) => spaceLabels[space]).join('、');
  const sunlight = planning.sunlight.map((level) => sunlightLabels[level]).join('、');

  return (
    <section id="calendar" className="planting-calendar">
      <h2 className="section-title">
        <CalendarDays size={20} />
        种植日历
      </h2>
      <div className="calendar-months" aria-label="适种月份">
        {monthLabels.map((label, index) => {
          const month = index + 1;
          const isActive = activeMonths.has(month);
          return (
            <span key={label} className={`calendar-month ${isActive ? 'active' : ''}`}>
              {label}
            </span>
          );
        })}
      </div>
      <div className="calendar-summary">
        <div className="calendar-summary-item">
          <MapPin size={18} />
          <div>
            <span>适合空间</span>
            <strong>{spaces}</strong>
          </div>
        </div>
        <div className="calendar-summary-item">
          <SunMedium size={18} />
          <div>
            <span>日照条件</span>
            <strong>{sunlight}</strong>
          </div>
        </div>
        <div className="calendar-summary-item">
          <Clock size={18} />
          <div>
            <span>成熟周期</span>
            <strong>{planning.harvestDays}</strong>
          </div>
        </div>
        <div className="calendar-summary-item">
          <CalendarDays size={18} />
          <div>
            <span>上手难度</span>
            <strong>{difficultyLabels[planning.difficulty]}</strong>
          </div>
        </div>
      </div>
      <div className="calendar-practical">
        <div>
          <Ruler size={17} />
          <span>播深</span>
          <strong>{planning.sowingDepth}</strong>
        </div>
        <div>
          <Ruler size={17} />
          <span>间距</span>
          <strong>{planning.spacing}</strong>
        </div>
        <div>
          <Layers size={17} />
          <span>容器</span>
          <strong>{planning.containerDepth}</strong>
        </div>
        <div>
          <Droplets size={17} />
          <span>浇水</span>
          <strong>{planning.waterRhythm}</strong>
        </div>
      </div>
    </section>
  );
}
