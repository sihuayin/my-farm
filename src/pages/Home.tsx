import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CropCard from '../components/CropCard';
import { crops } from '../data/crops';
import type { Category } from '../types/crop';

const categories: { label: string; value: Category | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '蔬菜', value: 'vegetable' },
  { label: '粮食', value: 'grain' },
  { label: '水果', value: 'fruit' },
  { label: '花卉', value: 'flower' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  useEffect(() => {
    const navBtns = document.querySelectorAll<HTMLButtonElement>('.nav-link');
    navBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.category === activeCategory);
    });
  }, [activeCategory]);

  const filtered = crops.filter((crop) => {
    const matchCategory = activeCategory === 'all' || crop.category === activeCategory;
    const matchQuery =
      !query ||
      crop.name.includes(query) ||
      crop.scientificName.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  });

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const cat = e.currentTarget.dataset.category as Category | 'all';
    setActiveCategory(cat);
  };

  return (
    <div className="home">
      <section className="hero-section">
        <h1 className="hero-title">🌱 农作物种植指南</h1>
        <p className="hero-subtitle">从种子到丰收，了解每一种作物的生长历程</p>
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="搜索作物名称或学名..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      <div className="filter-bar">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`filter-btn ${activeCategory === cat.value ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <section className="crop-grid">
        {filtered.length > 0 ? (
          filtered.map((crop) => <CropCard key={crop.id} crop={crop} />)
        ) : (
          <div className="empty-state">
            <p>没有找到匹配的作物</p>
          </div>
        )}
      </section>
    </div>
  );
}
