import { Link } from 'react-router-dom';
import { Box, CalendarClock, Microscope, Move3D } from 'lucide-react';

export default function TomatoVisualizationEntry() {
  return (
    <section className="tomato-visual-entry" aria-label="番茄3D全周期展示入口">
      <div className="tomato-visual-entry-content">
        <span className="tomato-visual-kicker">
          <Box size={16} />
          番茄专属展示
        </span>
        <h2>番茄种植全周期可视化系统</h2>
        <p>
          按种植日期自动定位生长阶段，支持 3D 视角查看、病害状态切换、严重程度对比和处理建议展示。
        </p>
        <div className="tomato-visual-entry-points">
          <span>
            <CalendarClock size={16} />
            时间驱动阶段
          </span>
          <span>
            <Move3D size={16} />
            3D交互查看
          </span>
          <span>
            <Microscope size={16} />
            病害模拟
          </span>
        </div>
      </div>
      <Link to="/tomato-visualization" className="tomato-visual-entry-link">
        进入3D展示
      </Link>
    </section>
  );
}
