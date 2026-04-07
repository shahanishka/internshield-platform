import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [history, setHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth?tab=login'); return; }
    fetchHistory(token);
    fetchBookmarks(token);
    fetchApplications(token);
  }, []);

  async function fetchHistory(token) {
    try {
      const res = await axios.get('http://localhost:5000/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch { setHistory([]); }
    finally { setLoadingHistory(false); }
  }

  async function fetchBookmarks(token) {
    try {
      const res = await axios.get('http://localhost:5000/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(res.data);
    } catch { setBookmarks([]); }
    finally { setLoadingBookmarks(false); }
  }
  async function fetchApplications(token) {
    try {
      const res = await axios.get('http://localhost:5000/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch { setApplications([]); }
    finally { setLoadingApps(false); }
  }

  async function removeBookmark(internshipId) {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/bookmarks/${internshipId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(prev => prev.filter(b => b.internshipId?._id !== internshipId));
    } catch { }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  const verdictConfig = {
    Genuine:       { color: '#22c55e', bg: '#f0fdf4', border: '#86efac', icon: '✅' },
    Suspicious:    { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: '⚠️' },
    'Likely Fake': { color: '#ef4444', bg: '#fef2f2', border: '#fca5a5', icon: '🚨' }
  };

  const stats = {
    total:      history.length,
    genuine:    history.filter(h => h.verdict === 'Genuine').length,
    suspicious: history.filter(h => h.verdict === 'Suspicious').length,
    fake:       history.filter(h => h.verdict === 'Likely Fake').length
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <div className="dashboard-container">

        {/* Welcome banner */}
        <div className="welcome-banner">
          <div className="welcome-left">
            <div className="welcome-avatar">{user.name?.charAt(0) || 'S'}</div>
            <div>
              <h1>Welcome back, {user.name?.split(' ')[0] || 'Student'} 👋</h1>
              <p>Here's your InternShield activity summary</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        {/* Stats row */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Checks</div>
            <div className="stat-icon">🔍</div>
          </div>
          <div className="stat-card genuine">
            <div className="stat-number">{stats.genuine}</div>
            <div className="stat-label">Genuine</div>
            <div className="stat-icon">✅</div>
          </div>
          <div className="stat-card suspicious">
            <div className="stat-number">{stats.suspicious}</div>
            <div className="stat-label">Suspicious</div>
            <div className="stat-icon">⚠️</div>
          </div>
          <div className="stat-card fake">
            <div className="stat-number">{stats.fake}</div>
            <div className="stat-label">Fake Caught</div>
            <div className="stat-icon">🚨</div>
          </div>
          <div className="stat-card saved">
            <div className="stat-number">{bookmarks.length}</div>
            <div className="stat-label">Saved</div>
            <div className="stat-icon">❤️</div>
          </div>
          <div className="stat-card applications">
            <div className="stat-number">{applications.length}</div>
            <div className="stat-label">Applied</div>
            <div className="stat-icon">🚀</div>
          </div>

        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`dash-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >👤 Profile</button>
          <button
            className={`dash-tab ${activeTab === 'bookmarks' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookmarks')}
          >❤️ Saved ({bookmarks.length})</button>
          <button
            className={`dash-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >🕵️ History ({history.length})</button>
          <button
            className={`dash-tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >🚀 Applications</button>
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="section-card">
            <h2 className="section-title">👤 My Profile</h2>
            <div className="profile-rows">
              <div className="profile-row">
                <span className="profile-label">Full Name</span>
                <span className="profile-value">{user.name || '—'}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Email</span>
                <span className="profile-value">{user.email || '—'}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">College</span>
                <span className="profile-value">{user.college || 'Not provided'}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Member Since</span>
                <span className="profile-value">
                  {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="profile-actions">
              <Link to="/listings" className="profile-action-btn primary">
                Browse Internships →
              </Link>
              <Link to="/detect" className="profile-action-btn secondary">
                Check a Message →
              </Link>
            </div>
          </div>
        )}
        {activeTab === 'applications' && (
          <div className="section-card">
            <div className="section-header">
              <h2 className="section-title">🚀 My Applications</h2>
              <Link to="/listings" className="section-link">Find More →</Link>
            </div>

            {loadingApps ? (
              <div className="history-loading">
                {[1,2,3].map(n => <div key={n} className="skeleton-history" />)}
              </div>
            ) : applications.length === 0 ? (
              <div className="placeholder-box">
                <div className="placeholder-icon">🚀</div>
                <p>No applications tracked yet.</p>
                <p style={{ fontSize: '0.85rem' }}>Click Apply Now on any internship to track it here.</p>
                <Link to="/listings" className="placeholder-btn">Browse Internships</Link>
              </div>
            ) : (
              <div className="applications-list">
                {applications.map(app => {
                  const intern = app.internshipId;
                  if (!intern) return null;

                  const statusConfig = {
                    Applied:     { color: '#3b82f6', bg: '#eff6ff', icon: '📨' },
                    'In Review': { color: '#f59e0b', bg: '#fffbeb', icon: '👀' },
                    Selected:    { color: '#22c55e', bg: '#f0fdf4', icon: '🎉' },
                    Rejected:    { color: '#ef4444', bg: '#fef2f2', icon: '❌' }
                  };
                  const cfg = statusConfig[app.status] || statusConfig['Applied'];

                  return (
                    <div key={app._id} className="application-item">
                      <div className="bookmark-avatar">{intern.company?.charAt(0)}</div>
                      <div className="bookmark-info">
                        <strong>{intern.role}</strong>
                        <p>{intern.company} · {intern.location}</p>
                        <span>Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}</span>
                      </div>
                      <div className="app-right">
                        <div
                          className="app-status-badge"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          {cfg.icon} {app.status}
                        </div>
                        <Link
                          to={`/internships/${intern._id}`}
                          className="bookmark-view-btn"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}


        {activeTab === 'bookmarks' && (
          <div className="section-card">
            <div className="section-header">
              <h2 className="section-title">❤️ Saved Internships</h2>
              <Link to="/listings" className="section-link">Browse More →</Link>
            </div>

            {loadingBookmarks ? (
              <div className="history-loading">
                {[1,2,3].map(n => <div key={n} className="skeleton-history" />)}
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="placeholder-box">
                <div className="placeholder-icon">🤍</div>
                <p>No saved internships yet.</p>
                <p style={{ fontSize: '0.85rem' }}>Click the ❤️ icon on any listing to save it here.</p>
                <Link to="/listings" className="placeholder-btn">Browse Internships</Link>
              </div>
            ) : (
              <div className="bookmarks-list">
                {bookmarks.map(b => {
                  const intern = b.internshipId;
                  if (!intern) return null;
                  return (
                    <div key={b._id} className="bookmark-item">
                      <div className="bookmark-avatar">{intern.company?.charAt(0)}</div>
                      <div className="bookmark-info">
                        <strong>{intern.role}</strong>
                        <p>{intern.company} · {intern.location}</p>
                        <span>₹{(intern.stipend/1000).toFixed(0)}k/mo · {intern.workMode}</span>
                      </div>
                      <div className="bookmark-actions">
                        <Link to={`/internships/${intern._id}`} className="bookmark-view-btn">
                          View →
                        </Link>
                        <button
                          className="bookmark-remove-btn"
                          onClick={() => removeBookmark(intern._id)}
                        >🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="section-card">
            <div className="section-header">
              <h2 className="section-title">🕵️ Detection History</h2>
              <Link to="/detect" className="section-link">Check New →</Link>
            </div>

            {loadingHistory ? (
              <div className="history-loading">
                {[1,2,3].map(n => <div key={n} className="skeleton-history" />)}
              </div>
            ) : history.length === 0 ? (
              <div className="placeholder-box">
                <div className="placeholder-icon">🔍</div>
                <p>You haven't checked any messages yet.</p>
                <Link to="/detect" className="placeholder-btn">Check Your First Message</Link>
              </div>
            ) : (
              <div className="history-list">
                {history.map((entry, i) => {
                  const cfg = verdictConfig[entry.verdict] || verdictConfig['Genuine'];
                  return (
                    <div key={entry._id || i} className="history-item"
                      style={{ borderLeftColor: cfg.color }}>
                      <div className="history-top">
                        <div className="history-verdict"
                          style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                          {cfg.icon} {entry.verdict}
                        </div>
                        <div className="history-score">
                          Risk Score: <strong>{entry.score}</strong>
                        </div>
                        <div className="history-date">{formatDate(entry.checkedAt)}</div>
                      </div>
                      <p className="history-preview">"{entry.textPreview}"</p>
                      {entry.redFlags?.length > 0 && (
                        <div className="history-flags">
                          {entry.redFlags.slice(0, 2).map((f, j) => (
                            <span key={j} className="history-flag-chip">{f.message}</span>
                          ))}
                          {entry.redFlags.length > 2 && (
                            <span className="history-flag-chip muted">
                              +{entry.redFlags.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
}