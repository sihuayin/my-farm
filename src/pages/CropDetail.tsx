import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { crops, categoryLabels } from '../data/crops';
import BeginnerRiskTips from '../components/BeginnerRiskTips';
import DetailSectionNav from '../components/DetailSectionNav';
import GrowthTimeline from '../components/GrowthTimeline';
import CareGuide from '../components/CareGuide';
import HabitInfo from '../components/HabitInfo';
import ImageModal from '../components/ImageModal';
import CropComments from '../components/CropComments';
import PestDiseaseGuide from '../components/PestDiseaseGuide';
import PlantingCalendar from '../components/PlantingCalendar';
import PlantingPlanControl from '../components/PlantingPlanControl';
import StageActionChecklist from '../components/StageActionChecklist';
import TodayTasks from '../components/TodayTasks';
import { cropBeginnerRisks } from '../data/cropBeginnerRisks';
import { cropProblems } from '../data/cropProblems';
import { cropPlanning } from '../data/cropPlanning';

export default function CropDetail() {
  const { id } = useParams();
  const crop = crops.find((c) => c.id === id);
  const planning = id ? cropPlanning[id] : undefined;
  const problems = id ? cropProblems[id] || [] : [];
  const risks = id ? cropBeginnerRisks[id] || [] : [];
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

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

  const handleImageClick = (src: string, alt: string) => {
    setModalImage({ src, alt });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="crop-detail">
      <div className="crop-hero">
        <img
          src={crop.coverImage}
          alt={crop.name}
          className="crop-hero-image"
          onClick={() => handleImageClick(crop.coverImage, crop.name)}
        />
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
        <DetailSectionNav />
        <PlantingPlanControl cropId={crop.id} cropName={crop.name} planning={planning} />
        <TodayTasks cropId={crop.id} stages={crop.stages} />
        {planning && <PlantingCalendar planning={planning} />}
        <BeginnerRiskTips risks={risks} />
        <StageActionChecklist cropId={crop.id} stages={crop.stages} />
        <HabitInfo habits={crop.habits} />
        <CareGuide care={crop.care} />
        <PestDiseaseGuide problems={problems} />
        <GrowthTimeline stages={crop.stages} onImageClick={handleImageClick} />

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

        <CropComments cropName={crop.name} cropId={crop.id} />
      </div>

      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          isOpen={!!modalImage}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
