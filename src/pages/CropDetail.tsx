import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { crops, categoryLabels } from '../data/crops';
import GrowthTimeline from '../components/GrowthTimeline';
import CareGuide from '../components/CareGuide';
import HabitInfo from '../components/HabitInfo';

export default function CropDetail() {
  const { id } = useParams();
  const crop = crops.find((c) => c.id === id);

  if (!crop) {
    return (
      <div className="not-found">
        <h2>未找到该作物</h2>
        <Link to="/" className="back-link">
          <ArrowLeft size={18} /> 返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="crop-detail">
      <div className="crop-hero">
        <img src={crop.coverImage} alt={crop.name} className="crop-hero-image" />
        <div className="crop-hero-overlay">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} /> 返回
          </Link>
          <div className="crop-hero-info">
            <span className="crop-hero-badge">{categoryLabels[crop.category]}</span>
            <h1 className="crop-hero-title">{crop.name}</h1>
            <p className="crop-hero-scientific">{crop.scientificName}</p>
            <p className="crop-hero-summary">{crop.summary}</p>
          </div>
        </div>
      </div>

      <div className="crop-body">
        <HabitInfo habits={crop.habits} />
        <CareGuide care={crop.care} />
        <GrowthTimeline stages={crop.stages} />

        {crop.tips.length > 0 && (
          <section className="tips-section">
            <h2 className="section-title">
              <Lightbulb size={20} /> 种植小贴士
            </h2>
            <ul className="tips-list">
              {crop.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
