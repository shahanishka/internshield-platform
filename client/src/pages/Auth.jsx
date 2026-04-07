import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = `http://localhost:5000/api/auth/${tab}`;
      const payload = tab === 'signup'
        ? { name: form.name, email: form.email, password: form.password, college: form.college }
        : { email: form.email, password: form.password };

      const res = await axios.post(url, payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <Link to="/" className="auth-logo">🛡️ InternShield</Link>
        <h2>Your shield against<br /><span>fake internships.</span></h2>
        <p>Join thousands of students who browse safely and verify offers before applying.</p>
        <div className="auth-illustration">
          <div className="auth-stat">✅ 10,000+ students protected</div>
          <div className="auth-stat">🔍 50,000+ messages checked</div>
          <div className="auth-stat">📋 200+ verified internships</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setError(''); }}
            >Login</button>
            <button
              className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => { setTab('signup'); setError(''); }}
            >Sign Up</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text" name="name"
                  placeholder="Rahul Sharma"
                  value={form.name} onChange={handleChange} required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email" name="email"
                placeholder="rahul@college.edu"
                value={form.email} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password" name="password"
                placeholder={tab === 'signup' ? 'Min 6 characters' : 'Enter your password'}
                value={form.password} onChange={handleChange} required
              />
            </div>

            {tab === 'signup' && (
              <div className="form-group">
                <label>College Name <span className="optional">(optional)</span></label>
                <input
                  type="text" name="college"
                  placeholder="e.g. IIT Delhi, BITS Pilani"
                  value={form.college} onChange={handleChange}
                />
              </div>
            )}

            {error && <div className="auth-error">⚠️ {error}</div>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Please wait...' : tab === 'login' ? 'Login to InternShield' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            {tab === 'login'
              ? <>Don't have an account? <button onClick={() => setTab('signup')}>Sign up free</button></>
              : <>Already have an account? <button onClick={() => setTab('login')}>Login</button></>
            }
          </p>
        </div>
      </div>
    </div>
  );
}