import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Listings from './pages/Listings';
import InternshipDetail from './pages/InternshipDetail';
import FakeDetector from './pages/FakeDetector';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/internships/:id" element={<InternshipDetail />} />
        <Route path="/detect" element={<FakeDetector />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;