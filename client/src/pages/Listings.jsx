import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/listings.css';
import BookmarkButton from '../components/BookmarkButton';


export default function Listings() {
  const [internships, setInternships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All');
  const [workMode, setWorkMode] = useState('All');
  const [stipend, setStipend] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/auth?tab=login');
  }, []);

  // Fetch internships
  useEffect(() => {
    axios.get('http://localhost:5000/api/internships')
      .then(res => {
        setInternships(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...internships];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.role.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q)
      );
    }

    if (domain !== 'All') result = result.filter(i => i.domain === domain);
    if (workMode !== 'All') result = result.filter(i => i.workMode === workMode);

    if (stipend === 'Under 10k') result = result.filter(i => i.stipend < 10000);
    else if (stipend === '10k-20k') result = result.filter(i => i.stipend >= 10000 && i.stipend <= 20000);
    else if (stipend === 'Above 20k') result = result.filter(i => i.stipend > 20000);

    setFiltered(result);
  }, [search, domain, workMode, stipend, internships]);

  function getDomainColor(domain) {
    const colors = {
      Tech: '#3b2f8f', Marketing: '#0891b2',
      Design: '#7c3aed', Finance: '#065f46', Other: '#92400e'
    };
    return colors[domain] || '#555';
  }

  function getDomainBg(domain) {
    const colors = {
      Tech: '#ede9fe', Marketing: '#e0f2fe',
      Design: '#f3e8ff', Finance: '#d1fae5', Other: '#fef3c7'
    };
    return colors[domain] || '#f3f4f6';
  }

  function formatStipend(amount) {
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}k/mo`;
    return `₹${amount}/mo`;
  }

  function daysLeft(deadline) {
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Expired';
    if (diff === 0) return 'Last day!';
    return `${diff} days left`;
  }

  function deadlineColor(deadline) {
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return '#ef4444';
    if (diff <= 3) return '#f59e0b';
    return '#22c55e';
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="listings-wrapper">
      <Navbar />

      <div className="listings-header">
        <div>
          <h1>Browse Internships</h1>
          <p>Welcome back, {user.name?.split(' ')[0] || 'Student'} 👋 — {filtered.length} opportunities found</p>
        </div>
        <Link to="/detect" className="detect-cta">🔍 Check a suspicious message</Link>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by role or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="filter-group">
          <label>Domain</label>
          <select value={domain} onChange={e => setDomain(e.target.value)}>
            <option>All</option>
            <option>Tech</option>
            <option>Marketing</option>
            <option>Design</option>
            <option>Finance</option>
            <option>Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Work Mode</label>
          <select value={workMode} onChange={e => setWorkMode(e.target.value)}>
            <option>All</option>
            <option>Remote</option>
            <option>Onsite</option>
            <option>Hybrid</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Stipend</label>
          <select value={stipend} onChange={e => setStipend(e.target.value)}>
            <option>All</option>
            <option>Under 10k</option>
            <option>10k-20k</option>
            <option>Above 20k</option>
          </select>
        </div>

        {(domain !== 'All' || workMode !== 'All' || stipend !== 'All' || search) && (
          <button className="clear-filters" onClick={() => {
            setDomain('All'); setWorkMode('All');
            setStipend('All'); setSearch('');
          }}>Clear all</button>
        )}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="listings-loading">
          {[1,2,3,4,5,6].map(n => <div key={n} className="skeleton-card" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔎</div>
          <h3>No internships found</h3>
          <p>Try adjusting your search or filters</p>
          <button onClick={() => {
            setDomain('All'); setWorkMode('All');
            setStipend('All'); setSearch('');
          }}>Reset filters</button>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map(intern => (
            <Link to={`/internships/${intern._id}`} key={intern._id} className="intern-card">
              <div className="card-top">
                <div className="company-avatar">
                  {intern.company.charAt(0)}
                </div>
                <div className="card-top-right">
                  <div
                    className="domain-badge"
                    style={{
                      color: getDomainColor(intern.domain),
                      background: getDomainBg(intern.domain)
                    }}
                  >
                    {intern.domain}
                  </div>
                  <BookmarkButton internshipId={intern._id} />
                </div>
              </div>

              <div className="card-body">
                <h3 className="card-role">{intern.role}</h3>
                <p className="card-company">{intern.company}</p>

                <div className="card-meta">
                  <span>📍 {intern.location}</span>
                  <span>💼 {intern.workMode}</span>
                </div>
              </div>

              <div className="card-footer">
                <div className="card-stipend">{formatStipend(intern.stipend)}</div>
                <div
                  className="card-deadline"
                  style={{ color: deadlineColor(intern.deadline) }}
                >
                  ⏰ {daysLeft(intern.deadline)}
                </div>
              </div>

              <div className="card-hover-overlay">View Details →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}