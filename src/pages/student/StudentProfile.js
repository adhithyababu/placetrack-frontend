import { useEffect, useState } from 'react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', department: '', cgpa: '', skills: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    API.get('/students/profile')
      .then(r => {
        setProfile(r.data);
        setForm({
          name: r.data.name || '',
          phone: r.data.phone || '',
          department: r.data.department || '',
          cgpa: r.data.cgpa || '',
          skills: (r.data.skills || []).join(', '),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        ...form,
        cgpa: parseFloat(form.cgpa) || 0,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      const { data } = await API.put('/students/profile', payload);
      setProfile(data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Only PDF files are allowed' });
      return;
    }
    setUploading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const { data } = await API.post('/students/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(prev => ({ ...prev, resumeUrl: data.resumeUrl }));
      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <><Navbar /><div className="loading">Loading profile…</div></>;

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth: 700 }}>
        <h1 className="page-title">My profile</h1>

        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'var(--accent2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 600, color: 'white', flexShrink: 0
            }}>
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{profile?.name}</div>
              <div style={{ fontSize: 13, color: 'var(--txt2)', marginTop: 2 }}>{profile?.email}</div>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Full name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select name="department" value={form.department} onChange={handleChange}>
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
                <label>CGPA</label>
                <input name="cgpa" type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={handleChange} placeholder="e.g. 8.5" />
              </div>
            </div>
            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, Python, MongoDB" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </div>

        {/* Resume upload */}
        <div className="card">
          <div className="section-hd" style={{ marginBottom: '1rem' }}>
            <div className="section-title">Resume</div>
            {profile?.resumeUrl && (
              <a
                href={`http://localhost:5000${profile.resumeUrl}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: 12 }}
              >
                View current resume ↗
              </a>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'var(--txt2)', marginBottom: '1rem' }}>
            Upload your resume as a PDF (max 5MB). This will be attached to your applications automatically.
          </p>
          <label style={{
            display: 'inline-block', padding: '0.6rem 1.25rem',
            background: 'var(--bg3)', border: '1px dashed var(--border2)',
            borderRadius: 8, cursor: 'pointer', fontSize: 14, color: 'var(--txt2)',
            transition: 'border-color 0.15s'
          }}>
            {uploading ? 'Uploading…' : '📄 Choose PDF file'}
            <input type="file" accept=".pdf" onChange={handleResumeUpload} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>
      </div>
    </>
  );
};

export default StudentProfile;
