import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-icon">✓</span> PlaceTrack
        </Link>
      </div>

      <div className="navbar-links">
        {user?.role === 'student' && (
          <>
            <Link to="/student/dashboard">Dashboard</Link>
            <Link to="/student/jobs">Jobs</Link>
            <Link to="/student/applications">My Applications</Link>
            <Link to="/student/profile">Profile</Link>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/jobs">Manage Jobs</Link>
            <Link to="/admin/applications">Applications</Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        {user && (
          <>
            <span className="navbar-user">Hi, {user.name}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
