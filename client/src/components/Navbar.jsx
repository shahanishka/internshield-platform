import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">🛡️ InternShield</Link>
      <div className="navbar-links">
        <Link to="/listings" className="nav-link">Internships</Link>
        <Link to="/detect" className="nav-link">Check a Message</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={handleLogout} className="btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/auth?tab=login" className="btn-outline">Login</Link>
            <Link to="/auth?tab=signup" className="btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}