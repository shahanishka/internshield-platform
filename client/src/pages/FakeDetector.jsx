import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/detector.css';

export default function FakeDetector() {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const resultRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/auth?tab=login');
  }, []);

  // Scroll to result when it appears
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  async function handleSubmit() {
    setError('');
    setResult(null);

    if (mode === 'text' && text.trim().length < 20) {
      setError('Please paste a longer message (at least 20 characters).');
      return;
    }
    if (mode === 'pdf' && !file) {
      setError('Please upload a PDF file.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let res;

      if (mode === 'text') {
        res = await axios.post(
          'http://localhost:5000/api/detect',
          { text },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const formData = new FormData();
        formData.append('pdf', file);
        res = await axios.post(
          'http://localhost:5000/api/detect',
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
      }

      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') {
      setFile(dropped);
      setError('');
    } else {
      setError('Only PDF files are accepted.');
    }
  }

  function handleReset() {
    setText('');
    setFile(null);
    setResult(null);
    setError('');
  }

  const sampleMessages = [
    {
      label: '🚨 Scam message',
      text: `Congratulations! You are selected for our Work From Home Data Entry internship. You will earn up to Rs 50,000 per month working just 2 hours a day. No experience needed, anyone can apply! Limited slots available, act now. Please send a registration fee of Rs 500 to confirm your slot. Contact us only on WhatsApp: 9999999999. Kindly do the needful and revert back immediately.`
    },
    {
      label: '✅ Genuine message',
      text: `Dear Applicant, Thank you for applying to the Frontend Developer Internship at TechNova Solutions. We reviewed your profile and would like to invite you for a technical interview on 20th May 2025 at 11:00 AM via Google Meet. The internship is a 3-month hybrid role based in Bangalore with a stipend of Rs 15,000 per month. Please confirm your availability by replying to this email at careers@technova.in. Looking forward to speaking with you.`
    },
    {
      label: '⚠️ Suspicious message',
      text: `Hi! We found your profile on LinkedIn and think you'd be a great fit for our Marketing Intern role. The stipend is Rs 25,000/month remote. We're moving fast — only 3 slots left. No formal interview, just a quick WhatsApp chat. Please share your Aadhaar card and a recent photo for verification. Reply urgently as slots are filling up fast.`
    }
  ];

  const verdictConfig = {
    Genuine: {
      color: '#22c55e', bg: '#f0fdf4', border: '#86efac',
      icon: '✅', label: 'Looks Genuine',
      desc: 'No major red flags detected. This message appears to be from a legitimate source.'
    },
    Suspicious: {
      color: '#f59e0b', bg: '#fffbeb', border: '#fde68a',
      icon: '⚠️', label: 'Suspicious',
      desc: 'Some red flags found. Proceed with caution and verify the company independently.'
    },
    'Likely Fake': {
      color: '#ef4444', bg: '#fef2f2', border: '#fca5a5',
      icon: '🚨', label: 'Likely Fake!',
      desc: 'Multiple red flags detected. This message shows strong signs of being a scam.'
    }
  };

  return (
    <div className="detector-wrapper">
      <Navbar />

      <div className="detector-container">

        {/* Header */}
        <div className="detector-header">
          <h1>🔍 Fake Internship Detector</h1>
          <p>Paste a suspicious message or upload a PDF offer letter — our system will analyze it for red flags instantly.</p>
        </div>

        {/* Input mode toggle */}
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
            onClick={() => { setMode('text'); setResult(null); setError(''); }}
          >
            ✏️ Paste Message
          </button>
          <button
            className={`mode-btn ${mode === 'pdf' ? 'active' : ''}`}
            onClick={() => { setMode('pdf'); setResult(null); setError(''); }}
          >
            📄 Upload PDF
          </button>
        </div>

        <div className="detector-body">
          {/* Left: input panel */}
          <div className="input-panel">

            {mode === 'text' ? (
              <>
                <div className="input-label-row">
                  <label>Paste the message or email text below</label>
                  <span className="char-count">{text.length} chars</span>
                </div>
                <textarea
                  className="message-textarea"
                  placeholder="Paste the internship offer, email, or WhatsApp message here..."
                  value={text}
                  onChange={e => { setText(e.target.value); setResult(null); }}
                  rows={10}
                />

                {/* Sample messages */}
                <div className="samples-section">
                  <p className="samples-label">Try a sample:</p>
                  <div className="samples-row">
                    {sampleMessages.map((s, i) => (
                      <button
                        key={i}
                        className="sample-btn"
                        onClick={() => { setText(s.text); setResult(null); setError(''); }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div
                className={`pdf-dropzone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !file && fileRef.current.click()}
              >
                <input
                  type="file"
                  accept=".pdf"
                  ref={fileRef}
                  style={{ display: 'none' }}
                  onChange={e => {
                    setFile(e.target.files[0]);
                    setResult(null);
                    setError('');
                  }}
                />
                {file ? (
                  <div className="file-selected">
                    <div className="file-icon">📄</div>
                    <div className="file-info">
                      <strong>{file.name}</strong>
                      <span>{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button
                      className="file-remove"
                      onClick={e => { e.stopPropagation(); setFile(null); setResult(null); }}
                    >✕</button>
                  </div>
                ) : (
                  <>
                    <div className="dropzone-icon">📂</div>
                    <p className="dropzone-title">Drag & drop a PDF here</p>
                    <p className="dropzone-sub">or click to browse files</p>
                    <p className="dropzone-note">Accepts PDF files only · Max 5MB</p>
                  </>
                )}
              </div>
            )}

            {error && <div className="detector-error">⚠️ {error}</div>}

            <div className="detector-actions">
              <button
                className="analyze-btn"
                onClick={handleSubmit}
                disabled={loading || (mode === 'text' ? !text.trim() : !file)}
              >
                {loading ? (
                  <span className="analyzing">
                    <span className="spinner" /> Analyzing...
                  </span>
                ) : '🔍 Analyze Now'}
              </button>

              {(text || file || result) && (
                <button className="reset-btn" onClick={handleReset}>Reset</button>
              )}
            </div>
          </div>

          {/* Right: tips panel */}
          <div className="tips-panel">
            <h3>🛡️ How It Works</h3>
            <div className="tip-item">
              <div className="tip-icon">💸</div>
              <div>
                <strong>Payment requests</strong>
                <p>Any message asking for a fee is an instant red flag.</p>
              </div>
            </div>
            <div className="tip-item">
              <div className="tip-icon">⚡</div>
              <div>
                <strong>Urgency tactics</strong>
                <p>"Limited slots", "act now" — classic pressure scam language.</p>
              </div>
            </div>
            <div className="tip-item">
              <div className="tip-icon">📧</div>
              <div>
                <strong>Suspicious email domains</strong>
                <p>Real companies don't hire from Gmail or Yahoo accounts.</p>
              </div>
            </div>
            <div className="tip-item">
              <div className="tip-icon">💰</div>
              <div>
                <strong>Unrealistic stipends</strong>
                <p>₹50,000/month for 2 hours of work? Too good to be true.</p>
              </div>
            </div>
            <div className="tip-item">
              <div className="tip-icon">🎯</div>
              <div>
                <strong>Pre-selected without interview</strong>
                <p>No real company selects you without a proper process.</p>
              </div>
            </div>

            <div className="verdict-guide">
              <h4>Verdict Guide</h4>
              <div className="verdict-row green">✅ Genuine — Score 0–2</div>
              <div className="verdict-row yellow">⚠️ Suspicious — Score 3–5</div>
              <div className="verdict-row red">🚨 Likely Fake — Score 6+</div>
            </div>
          </div>
        </div>

        {/* Result section */}
        {result && (
          <div className="result-section" ref={resultRef}>
            <div
              className="result-card"
              style={{
                borderColor: verdictConfig[result.verdict].border,
                background: verdictConfig[result.verdict].bg
              }}
            >
              <div className="result-header">
                <div className="result-icon">{verdictConfig[result.verdict].icon}</div>
                <div>
                  <h2 style={{ color: verdictConfig[result.verdict].color }}>
                    {verdictConfig[result.verdict].label}
                  </h2>
                  <p className="result-desc">{verdictConfig[result.verdict].desc}</p>
                </div>
                <div className="result-score" style={{ color: verdictConfig[result.verdict].color }}>
                  <span className="score-number">{result.score}</span>
                  <span className="score-label">risk score</span>
                </div>
              </div>

              {result.redFlags.length > 0 ? (
                <div className="red-flags-section">
                  <h3>🚩 Red Flags Found ({result.redFlags.length})</h3>
                  <div className="red-flags-list">
                    {result.redFlags.map((flag, i) => (
                      <div className="flag-item" key={i}>
                        <div className="flag-message">{flag.message}</div>
                        <div className="flag-tip">💡 {flag.tip}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-flags">
                  🎉 No red flags detected. Always do your own research before applying!
                </div>
              )}

              {result.verdict !== 'Genuine' && (
                <div className="what-to-do">
                  <h3>🛡️ What To Do</h3>
                  <ul>
                    <li>Do NOT pay any fee or share bank details</li>
                    <li>Verify the company on LinkedIn and MCA portal</li>
                    <li>Search the company name + "scam" on Google</li>
                    <li>Contact the company directly through their official website</li>
                    <li>Report to the National Cyber Crime portal: <strong>cybercrime.gov.in</strong></li>
                  </ul>
                </div>
              )}

              <div className="result-actions">
                <button className="check-another-btn" onClick={handleReset}>
                  🔍 Check Another Message
                </button>
                <Link to="/dashboard" className="view-history-btn">
                  📋 View My History
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}