import { Link, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const categories = [
  { label: '全部', value: 'all' },
  { label: '蔬菜', value: 'vegetable' },
  { label: '粮食', value: 'grain' },
  { label: '水果', value: 'fruit' },
  { label: '花卉', value: 'flower' },
];

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <Leaf size={24} />
          <span>Farm Guide</span>
        </Link>
        {isHome && (
          <nav className="navbar-nav">
            {categories.map((cat) => (
              <button key={cat.value} className="nav-link" data-category={cat.value}>
                {cat.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
