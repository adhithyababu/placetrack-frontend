import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = role === 'admin' ? '/auth/admin/login' : '/auth/student/login';
      const { data } = await API.post(endpoint, form);
      login(data);
      navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-icon">✓</div>
          <span style={{ fontWeight: 600, fontSize: 16 }}>PlaceTrack</span>
        </div>
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to your account to continue</div>

        {/* Role Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          {['student', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className="btn"
              style={{
                flex: 1,
                background: role === r ? 'var(--accent)' : 'var(--bg3)',
                color: role === r ? 'white' : 'var(--txt2)',
                border: `1px solid ${role === r ? 'var(--accent)' : 'var(--border2)'}`,
                justifyContent: 'center',
                textTransform: 'capitalize',
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in…' : `Sign in as ${role}`}
          </button>
        </form>

        {role === 'student' && (
          <div className="auth-footer">
            No account yet? <Link to="/register">Create one</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
