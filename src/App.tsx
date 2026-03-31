import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CropDetail from './pages/CropDetail';
import { GitHubAuthCallback } from './components/CropComments';

function App() {
  return (
    <BrowserRouter basename="/my-farm">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crop/:id" element={<CropDetail />} />
          <Route path="/auth/github/callback" element={<GitHubAuthCallback />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
