import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const StudentRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/student/register', form);
      login(data);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <div className="auth-title">Create student account</div>
        <div className="auth-sub">Register to start applying for placements</div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input name="name" placeholder="Adhithya Babu" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select name="department" value={form.department} onChange={handleChange} required>
              <option value="">Select department</option>
              <option>Computer Science & Engineering</option>
              <option>Electronics & Communication</option>
              <option>Mechanical Engineering</option>
              <option>Civil Engineering</option>
              <option>Information Technology</option>
              <option>Electrical Engineering</option>
            </select>
          </div>
          <div className="form-group">
            <label>Phone number</label>
            <input name="phone" placeholder="+91 9XXXXXXXXX" value={form.phone} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
