import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import CropCard from '../components/CropCard';
import { crops } from '../data/crops';
import type { Category } from '../types/crop';
import { categories } from '../constants/categories';

export default function Home() {
  const [query, setQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get('category') as Category | 'all') || 'all';

  useEffect(() => {
    // Sync active state for both nav-link and filter-btn
    const category = searchParams.get('category') || 'all';
    document.querySelectorAll('.nav-link, .filter-btn').forEach((btn) => {
      const btnCategory = btn.getAttribute('data-category');
      btn.classList.toggle('active', btnCategory === category);
    });
  }, [searchParams]);

  const handleCategoryClick = (category: Category | 'all') => {
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const filtered = crops.filter((crop) => {
    const matchCategory = activeCategory === 'all' || crop.category === activeCategory;
    const matchQuery =
      !query ||
      crop.name.includes(query) ||
      crop.scientificName.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  });

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
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-light)',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      <div className="filter-bar">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`filter-btn ${activeCategory === cat.value ? 'active' : ''}`}
            data-category={cat.value}
            onClick={() => handleCategoryClick(cat.value)}
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
