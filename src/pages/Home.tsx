import { useState, useEffect } from 'react';
import { ArrowRight, Search, Sparkles, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import CropCard from '../components/CropCard';
import SavedPlansPanel from '../components/SavedPlansPanel';
import { categoryLabels, crops } from '../data/crops';
import type { Category } from '../types/crop';
import { categories } from '../constants/categories';
import {
  cropPlanning,
  difficultyLabels,
  experienceLabels,
  getCropRecommendations,
  monthLabels,
  regionLabels,
  spaceLabels,
  sunlightLabels,
  type ExperienceLevel,
  type PlantingDifficulty,
  type PlantingRegion,
  type PlantingSpace,
  type SunlightLevel,
} from '../data/cropPlanning';

export default function Home() {
  const [query, setQuery] = useState('');
  const currentMonth = new Date().getMonth() + 1;
  const [recommendationMonth, setRecommendationMonth] = useState(currentMonth);
  const [recommendationRegion, setRecommendationRegion] = useState<PlantingRegion>('east');
  const [recommendationSpace, setRecommendationSpace] = useState<PlantingSpace>('balcony');
  const [recommendationSunlight, setRecommendationSunlight] = useState<SunlightLevel>('medium');
  const [recommendationExperience, setRecommendationExperience] =
    useState<ExperienceLevel>('beginner');
  const [selectedMonth, setSelectedMonth] = useState<'all' | number>('all');
  const [selectedSpace, setSelectedSpace] = useState<PlantingSpace | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<PlantingDifficulty | 'all'>('all');
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

  const categoryCounts = categories.reduce<Record<Category | 'all', number>>(
    (acc, cat) => {
      acc[cat.value] =
        cat.value === 'all'
          ? crops.length
          : crops.filter((crop) => crop.category === cat.value).length;
      return acc;
    },
    { all: 0, vegetable: 0, grain: 0, fruit: 0, flower: 0 }
  );

  const filtered = crops.filter((crop) => {
    const matchCategory = activeCategory === 'all' || crop.category === activeCategory;
    const planning = cropPlanning[crop.id];
    const matchMonth =
      selectedMonth === 'all' || planning?.months.includes(selectedMonth);
    const matchSpace =
      selectedSpace === 'all' || planning?.spaces.includes(selectedSpace);
    const matchDifficulty =
      selectedDifficulty === 'all' || planning?.difficulty === selectedDifficulty;
    const normalizedQuery = query.trim().toLowerCase();
    const searchableText = [
      crop.name,
      crop.scientificName,
      crop.summary,
      crop.habits.temperature,
      crop.habits.sunlight,
      crop.habits.soil,
      crop.habits.humidity,
      crop.habits.hardiness,
      crop.care.sunlight,
      crop.care.water,
      crop.care.fertilizer,
      crop.care.temperature,
      crop.care.soil,
      ...crop.tips,
    ]
      .join(' ')
      .toLowerCase();
    const matchQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
    return matchCategory && matchMonth && matchSpace && matchDifficulty && matchQuery;
  });

  const hasPlannerFilter =
    selectedMonth !== 'all' || selectedSpace !== 'all' || selectedDifficulty !== 'all';

  const recommendations = getCropRecommendations(crops, {
    month: recommendationMonth,
    region: recommendationRegion,
    space: recommendationSpace,
    sunlight: recommendationSunlight,
    experience: recommendationExperience,
  });

  const applyRecommendationToList = () => {
    setSelectedMonth(recommendationMonth);
    setSelectedSpace(recommendationSpace);
    setSelectedDifficulty(recommendationExperience === 'beginner' ? 'easy' : 'all');
  };

  const resetPlannerFilters = () => {
    setSelectedMonth('all');
    setSelectedSpace('all');
    setSelectedDifficulty('all');
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

      <SavedPlansPanel crops={crops} />

      <section className="recommendation-panel" aria-label="我适合种什么推荐器">
        <div className="recommendation-header">
          <div>
            <h2>
              <Sparkles size={22} />
              我适合种什么
            </h2>
            <p>按你的月份、空间、日照和经验，优先推荐现在更容易成功的作物。</p>
            <p className="recommendation-note">地区用于做基础气候适配，实际播种仍需结合当地天气微调。</p>
          </div>
          <button className="recommendation-apply" onClick={applyRecommendationToList}>
            应用到列表
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="recommendation-controls">
          <div className="planner-control">
            <label htmlFor="recommendation-month">当前月份</label>
            <select
              id="recommendation-month"
              value={recommendationMonth}
              onChange={(e) => setRecommendationMonth(Number(e.target.value))}
            >
              {monthLabels.map((label, index) => (
                <option key={label} value={index + 1}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="planner-control">
            <label htmlFor="recommendation-region">所在地区</label>
            <select
              id="recommendation-region"
              value={recommendationRegion}
              onChange={(e) => setRecommendationRegion(e.target.value as PlantingRegion)}
            >
              {Object.entries(regionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="planner-control">
            <label htmlFor="recommendation-space">可用空间</label>
            <select
              id="recommendation-space"
              value={recommendationSpace}
              onChange={(e) => setRecommendationSpace(e.target.value as PlantingSpace)}
            >
              {Object.entries(spaceLabels)
                .filter(([value]) => value !== 'all')
                .map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
            </select>
          </div>
          <div className="planner-control">
            <label htmlFor="recommendation-sunlight">每天日照</label>
            <select
              id="recommendation-sunlight"
              value={recommendationSunlight}
              onChange={(e) => setRecommendationSunlight(e.target.value as SunlightLevel)}
            >
              {Object.entries(sunlightLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="planner-control">
            <label htmlFor="recommendation-experience">种植经验</label>
            <select
              id="recommendation-experience"
              value={recommendationExperience}
              onChange={(e) => setRecommendationExperience(e.target.value as ExperienceLevel)}
            >
              {Object.entries(experienceLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="recommendation-results">
          {recommendations.map(({ crop, planning, reasons, score }, index) => (
            <Link key={crop.id} to={`/crop/${crop.id}`} className="recommendation-card">
              <div className="recommendation-rank">#{index + 1}</div>
              <div className="recommendation-card-main">
                <div className="recommendation-card-title">
                  <span>{crop.name}</span>
                  <small>{categoryLabels[crop.category]}</small>
                </div>
                <p>{crop.summary}</p>
                <div className="recommendation-reasons">
                  {reasons.slice(0, 3).map((reason) => (
                    <span key={reason}>{reason}</span>
                  ))}
                </div>
              </div>
              <div className="recommendation-score">
                <strong>{Math.max(0, Math.min(100, score))}</strong>
                <span>匹配度</span>
                <small>{planning.harvestDays}</small>
              </div>
            </Link>
          ))}
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
            {cat.label} <span className="filter-count">{categoryCounts[cat.value]}</span>
          </button>
        ))}
      </div>

      <section className="planner-panel" aria-label="种植决策筛选">
        <div className="planner-control">
          <label htmlFor="planting-month">适种月份</label>
          <select
            id="planting-month"
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
          >
            <option value="all">全年</option>
            {monthLabels.map((label, index) => (
              <option key={label} value={index + 1}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="planner-control">
          <label htmlFor="planting-space">种植空间</label>
          <select
            id="planting-space"
            value={selectedSpace}
            onChange={(e) => setSelectedSpace(e.target.value as PlantingSpace | 'all')}
          >
            {Object.entries(spaceLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="planner-control">
          <label htmlFor="planting-difficulty">上手难度</label>
          <select
            id="planting-difficulty"
            value={selectedDifficulty}
            onChange={(e) =>
              setSelectedDifficulty(e.target.value as PlantingDifficulty | 'all')
            }
          >
            {Object.entries(difficultyLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {hasPlannerFilter && (
          <button className="planner-reset" onClick={resetPlannerFilters}>
            <X size={16} />
            清除
          </button>
        )}
      </section>

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
