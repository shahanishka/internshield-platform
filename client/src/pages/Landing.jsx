import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/landing.css';

export default function Landing() {
  return (
    <div className="landing-wrapper">
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🛡️ Trusted by 10,000+ students</div>
          <h1 className="hero-title">
            Find Real Internships.<br />
            <span className="gradient-text">Spot Fake Ones Instantly.</span>
          </h1>
          <p className="hero-subtitle">
            InternShield helps you discover genuine internship opportunities and
            protects you from scams — with AI-powered message verification built right in.
          </p>
          <div className="hero-ctas">
            <Link to="/listings" className="cta-primary">Browse Internships →</Link>
            <Link to="/detect" className="cta-secondary">Check a Message</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <span className="card-icon">✅</span>
            <div>
              <strong>TechNova Solutions</strong>
              <p>Frontend Intern · ₹15,000/mo</p>
            </div>
          </div>
          <div className="floating-card card-2">
            <span className="card-icon">🚨</span>
            <div>
              <strong>Suspicious Message</strong>
              <p>Payment requested detected</p>
            </div>
          </div>
          <div className="floating-card card-3">
            <span className="card-icon">🎯</span>
            <div>
              <strong>FinEdge Capital</strong>
              <p>Finance Intern · Delhi</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Smart Fake Detector</h3>
          <p>Paste any internship message or upload a PDF — our system flags red flags instantly.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Curated Listings</h3>
          <p>Browse verified internships across Tech, Marketing, Finance, and Design domains.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎓</div>
          <h3>Student Dashboard</h3>
          <p>Track your checks, save internships, and manage your profile all in one place.</p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 InternShield · Built for students, by students</p>
      </footer>
    </div>
  );
}