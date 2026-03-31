import { Link, useSearchParams } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import type { Category } from '../types/crop';
import { categories } from '../pages/Home';

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const handleCategoryClick = (category: Category | 'all') => {
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <Leaf size={24} />
          <span>Farm Guide</span>
        </Link>
        <nav className="navbar-nav">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`nav-link ${activeCategory === cat.value ? 'active' : ''}`}
              data-category={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
