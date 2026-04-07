import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/detail.css';
import BookmarkButton from '../components/BookmarkButton';
import ApplyButton from '../components/ApplyButton';


export default function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intern, setIntern] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/auth?tab=login');
  }, []);

  // Fetch internship + related
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/internships/${id}`)
      .then(res => {
        setIntern(res.data);
        // Fetch all for related
        return axios.get('http://localhost:5000/api/internships');
      })
      .then(res => {
        const others = res.data.filter(i => i._id !== id && i.domain === intern?.domain);
        setRelated(others.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Second pass for related (after intern loads)
  useEffect(() => {
    if (!intern) return;
    axios.get('http://localhost:5000/api/internships')
      .then(res => {
        const others = res.data.filter(i => i._id !== id && i.domain === intern.domain);
        setRelated(others.slice(0, 3));
      });
  }, [intern]);

  function getDomainColor(domain) {
    const colors = { Tech: '#3b2f8f', Marketing: '#0891b2', Design: '#7c3aed', Finance: '#065f46', Other: '#92400e' };
    return colors[domain] || '#555';
  }

  function getDomainBg(domain) {
    const colors = { Tech: '#ede9fe', Marketing: '#e0f2fe', Design: '#f3e8ff', Finance: '#d1fae5', Other: '#fef3c7' };
    return colors[domain] || '#f3f4f6';
  }

  function formatStipend(amount) {
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)},000 / month`;
    return `₹${amount} / month`;
  }

  function daysLeft(deadline) {
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Deadline passed';
    if (diff === 0) return 'Last day to apply!';
    return `${diff} days left to apply`;
  }

  function deadlineColor(deadline) {
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return '#ef4444';
    if (diff <= 3) return '#f59e0b';
    return '#22c55e';
  }

  if (loading) {
    return (
      <div className="detail-wrapper">
        <Navbar />
        <div className="detail-loading">
          <div className="skeleton-hero" />
          <div className="skeleton-body">
            <div className="skeleton-line wide" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
          </div>
        </div>
      </div>
    );
  }

  if (!intern) {
    return (
      <div className="detail-wrapper">
        <Navbar />
        <div className="detail-error">
          <div style={{ fontSize: '3rem' }}>😕</div>
          <h2>Internship not found</h2>
          <p>This listing may have been removed.</p>
          <Link to="/listings" className="back-btn">← Back to Listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-wrapper">
      <Navbar />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/listings">← Back to Listings</Link>
        <span>/</span>
        <span>{intern.role}</span>
      </div>

      <div className="detail-layout">
        {/* Main content */}
        <div className="detail-main">

          {/* Hero card */}
          <div className="detail-hero-card">
            <div className="detail-hero-top">
              <div className="detail-avatar">{intern.company.charAt(0)}</div>
              <div className="detail-hero-info">
                <h1>{intern.role}</h1>
                <p className="detail-company">
                  {intern.website
                    ? <a href={intern.website} target="_blank" rel="noreferrer">{intern.company} ↗</a>
                    : intern.company
                  }
                </p>
              </div>
              <div
                className="detail-domain-badge"
                style={{ color: getDomainColor(intern.domain), background: getDomainBg(intern.domain) }}
              >
                {intern.domain}
              </div>
            </div>

            <div className="detail-meta-row">
              <div className="meta-chip">📍 {intern.location}</div>
              <div className="meta-chip">💼 {intern.workMode}</div>
              <div className="meta-chip">💰 {formatStipend(intern.stipend)}</div>
              <div className="meta-chip" style={{ color: deadlineColor(intern.deadline) }}>
                ⏰ {daysLeft(intern.deadline)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="detail-section">
            <h2>About This Internship</h2>
            <p className="detail-description">{intern.description}</p>
          </div>

          {/* Responsibilities */}
          <div className="detail-section">
            <h2>What You'll Do</h2>
            <ul className="detail-list">
              {intern.responsibilities.map((r, i) => (
                <li key={i}>
                  <span className="list-dot">▸</span> {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="detail-section">
            <h2>What We're Looking For</h2>
            <ul className="detail-list">
              {intern.requirements.map((r, i) => (
                <li key={i}>
                  <span className="list-dot">▸</span> {r}
                </li>
              ))}
            </ul>
          </div>

          {/* How to apply */}
          <div className="detail-section">
            <h2>How to Apply</h2>
            <div className="apply-info">
              <p>Send your resume and a short introduction to:</p>
              <a href={`mailto:${intern.applyEmail}`} className="apply-email">
                📧 {intern.applyEmail}
              </a>
              <p className="apply-tip">
                💡 <strong>Tip:</strong> Use the subject line "{intern.role} Application — [Your Name]"
              </p>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-stipend">{formatStipend(intern.stipend)}</div>
            <div className="sidebar-deadline" style={{ color: deadlineColor(intern.deadline) }}>
              ⏰ {daysLeft(intern.deadline)}
            </div>
            <ApplyButton
              internshipId={intern._id}
              applyEmail={intern.applyEmail}
              role={intern.role}
            />
            {/* Add this */}
            <div className="sidebar-bookmark-row">
              <BookmarkButton internshipId={intern._id} size="large" />
              <span className="bookmark-label">Save this internship</span>
            </div>

            <button
              className={`apply-btn ${applied ? 'applied' : ''}`}
              onClick={() => {
                setApplied(true);
                window.open(`mailto:${intern.applyEmail}?subject=${intern.role} Application`, '_blank');
              }}
            >
              {applied ? '✅ Application Opened!' : 'Apply Now'}
            </button>

            {intern.website && (
              <a href={intern.website} target="_blank" rel="noreferrer" className="website-btn">
                🌐 Visit Company Website
              </a>
            )}

            <div className="sidebar-divider" />

            <div className="sidebar-details">
              <div className="sidebar-detail-row">
                <span className="sd-label">Domain</span>
                <span className="sd-value">{intern.domain}</span>
              </div>
              <div className="sidebar-detail-row">
                <span className="sd-label">Work Mode</span>
                <span className="sd-value">{intern.workMode}</span>
              </div>
              <div className="sidebar-detail-row">
                <span className="sd-label">Location</span>
                <span className="sd-value">{intern.location}</span>
              </div>
              <div className="sidebar-detail-row">
                <span className="sd-label">Deadline</span>
                <span className="sd-value">
                  {new Date(intern.deadline).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="sidebar-divider" />

            <Link to="/detect" className="check-fake-btn">
              🔍 Check if this is fake
            </Link>
          </div>
        </div>
      </div>

      {/* Related internships */}
      {related.length > 0 && (
        <div className="related-section">
          <h2>More {intern.domain} Internships</h2>
          <div className="related-grid">
            {related.map(r => (
              <Link to={`/internships/${r.id}`} key={r.id} className="related-card">
                <div className="related-avatar">{r.company.charAt(0)}</div>
                <div className="related-info">
                  <strong>{r.role}</strong>
                  <p>{r.company}</p>
                  <span>₹{(r.stipend / 1000).toFixed(0)}k/mo · {r.workMode}</span>
                </div>
                <div className="related-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}