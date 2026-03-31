import { Link } from 'react-router-dom';
import { Leaf, List } from 'lucide-react';
import type { Crop } from '../types/crop';
import { categoryLabels } from '../data/crops';

interface Props {
  crop: Crop;
}

export default function CropCard({ crop }: Props) {
  return (
    <Link to={`/crop/${crop.id}`} className="crop-card">
      <div className="crop-card-image">
        <img src={crop.coverImage} alt={crop.name} loading="lazy" />
        <span className="crop-card-badge">{categoryLabels[crop.category]}</span>
      </div>
      <div className="crop-card-body">
        <h3 className="crop-card-title">
          <Leaf size={18} />
          {crop.name}
        </h3>
        <p className="crop-card-scientific">{crop.scientificName}</p>
        <p className="crop-card-summary">{crop.summary}</p>
        <div className="crop-card-footer">
          <List size={14} />
          <span>共 {crop.stages.length} 个生长阶段</span>
        </div>
      </div>
    </Link>
  );
}
