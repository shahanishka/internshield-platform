import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      textAlign: 'center',
      padding: '2rem'
    }}>

      {/* Animated 404 */}
      <div style={{
        fontSize: '8rem',
        fontWeight: '900',
        background: 'linear-gradient(135deg, var(--primary), #9b59b6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1,
        marginBottom: '1rem',
        animation: 'float1 3s ease-in-out infinite'
      }}>
        404
      </div>

      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>

      <h1 style={{
        fontSize: '1.6rem',
        fontWeight: '800',
        color: 'var(--text)',
        marginBottom: '0.6rem'
      }}>
        Page Not Found
      </h1>

      <p style={{
        color: 'var(--muted)',
        fontSize: '1rem',
        maxWidth: '380px',
        lineHeight: '1.7',
        marginBottom: '2.5rem'
      }}>
        Looks like this page doesn't exist or was moved. Don't worry — your internship search is safe with us!
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{
          padding: '0.85rem 2rem',
          background: 'var(--primary)',
          color: 'white',
          borderRadius: '10px',
          fontWeight: '700',
          fontSize: '1rem',
          textDecoration: 'none',
          transition: 'all 0.2s',
          boxShadow: '0 4px 16px rgba(59,47,143,0.3)'
        }}>
          🏠 Go Home
        </Link>

        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '0.85rem 2rem',
            border: '2px solid var(--primary)',
            background: 'transparent',
            color: 'var(--primary)',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ← Go Back
        </button>
      </div>

      <div style={{
        marginTop: '3rem',
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link to="/listings" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
          Browse Internships →
        </Link>
        <Link to="/detect" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
          Check a Message →
        </Link>
        <Link to="/dashboard" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
          My Dashboard →
        </Link>
      </div>

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}