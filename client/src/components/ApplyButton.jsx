import { useState, useEffect } from 'react';
import axios from 'axios';
import './ApplyButton.css';

export default function ApplyButton({ internshipId, applyEmail, role }) {
  const [status, setStatus] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const token = localStorage.getItem('token');

  const statuses = ['Applied', 'In Review', 'Selected', 'Rejected'];

  const statusConfig = {
    Applied:    { color: '#3b82f6', bg: '#eff6ff', icon: '📨' },
    'In Review':{ color: '#f59e0b', bg: '#fffbeb', icon: '👀' },
    Selected:   { color: '#22c55e', bg: '#f0fdf4', icon: '🎉' },
    Rejected:   { color: '#ef4444', bg: '#fef2f2', icon: '❌' }
  };

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    axios.get(`http://localhost:5000/api/applications/check/${internshipId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setApplied(res.data.applied);
        setStatus(res.data.status);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [internshipId]);

  async function handleApply() {
    if (!token) return;
    setUpdating(true);
    try {
      // Open mail client
      window.open(
        `mailto:${applyEmail}?subject=${role} Application`,
        '_blank'
      );
      // Mark as applied
      await axios.post(
        `http://localhost:5000/api/applications/${internshipId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplied(true);
      setStatus('Applied');
    } catch (err) {
      if (err.response?.status === 409) {
        setApplied(true);
        setStatus('Applied');
      }
    } finally {
      setUpdating(false);
    }
  }

  async function updateStatus(newStatus) {
    setUpdating(true);
    setShowDropdown(false);
    try {
      await axios.patch(
        `http://localhost:5000/api/applications/${internshipId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(newStatus);
    } catch {}
    finally { setUpdating(false); }
  }

  async function removeApplication() {
    setUpdating(true);
    setShowDropdown(false);
    try {
      await axios.delete(
        `http://localhost:5000/api/applications/${internshipId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplied(false);
      setStatus(null);
    } catch {}
    finally { setUpdating(false); }
  }

  if (loading) return <div className="apply-btn-skeleton" />;

  if (applied && status) {
    const cfg = statusConfig[status];
    return (
      <div className="apply-tracker">
        <div
          className="status-badge"
          style={{ color: cfg.color, background: cfg.bg }}
        >
          {cfg.icon} {status}
        </div>
        <div className="status-controls">
          <div className="status-dropdown-wrapper">
            <button
              className="update-status-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={updating}
            >
              Update Status ▾
            </button>
            {showDropdown && (
              <div className="status-dropdown">
                {statuses.map(s => (
                  <button
                    key={s}
                    className={`status-option ${s === status ? 'active' : ''}`}
                    style={s === status ? {
                      color: statusConfig[s].color,
                      background: statusConfig[s].bg
                    } : {}}
                    onClick={() => updateStatus(s)}
                  >
                    {statusConfig[s].icon} {s}
                  </button>
                ))}
                <div className="status-dropdown-divider" />
                <button
                  className="status-option remove"
                  onClick={removeApplication}
                >
                  🗑️ Remove Application
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      className="apply-now-btn"
      onClick={handleApply}
      disabled={updating}
    >
      {updating ? 'Opening...' : '🚀 Apply Now'}
    </button>
  );
}