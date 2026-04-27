import { useEffect, useState } from 'react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const EMPTY_FORM = {
  title: '', company: '', description: '',
  location: '', type: 'Internship', stipend: '',
  deadline: '', minCGPA: '', departments: ''
};

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchJobs = () => {
    setLoading(true);
    API.get('/jobs/all')
      .then(r => setJobs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const openCreate = () => {
    setEditJob(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (job) => {
    setEditJob(job);
    setForm({
      title: job.title,
      company: job.company,
      description: job.description,
      location: job.location,
      type: job.type,
      stipend: job.stipend,
      deadline: job.deadline?.slice(0, 10),
      minCGPA: job.eligibility?.minCGPA || '',
      departments: (job.eligibility?.departments || []).join(', '),
    });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      title: form.title,
      company: form.company,
      description: form.description,
      location: form.location,
      type: form.type,
      stipend: form.stipend,
      deadline: form.deadline,
      eligibility: {
        minCGPA: parseFloat(form.minCGPA) || 0,
        departments: form.departments.split(',').map(d => d.trim()).filter(Boolean),
      },
    };
    try {
      if (editJob) {
        await API.put(`/jobs/${editJob._id}`, payload);
      } else {
        await API.post('/jobs', payload);
      }
      setShowModal(false);
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="section-hd">
          <h1 className="page-title" style={{ margin: 0 }}>Manage jobs</h1>
          <button className="btn btn-primary" onClick={openCreate}>+ Add job</button>
        </div>

        {loading ? <div className="loading">Loading…</div> : jobs.length === 0 ? (
          <div className="empty">No jobs posted yet. Click "Add job" to create one.</div>
        ) : (
          <div className="table-wrap" style={{ marginTop: '1rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Stipend</th>
                  <th>Deadline</th>
                  <th>Min CGPA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job._id}>
                    <td><strong>{job.title}</strong></td>
                    <td style={{ color: 'var(--txt2)' }}>{job.company}</td>
                    <td><span className={`badge ${job.type === 'Internship' ? 'badge-internship' : 'badge-fulltime'}`}>{job.type}</span></td>
                    <td style={{ color: 'var(--txt3)' }}>{job.stipend}</td>
                    <td style={{ color: new Date(job.deadline) < new Date() ? 'var(--danger)' : 'var(--txt3)' }}>
                      {new Date(job.deadline).toLocaleDateString()}
                    </td>
                    <td style={{ color: 'var(--txt3)' }}>{job.eligibility?.minCGPA || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: 12 }} onClick={() => openEdit(job)}>Edit</button>
                        <button className="btn btn-danger" style={{ padding: '0.3rem 0.75rem', fontSize: 12 }} onClick={() => handleDelete(job._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editJob ? 'Edit job' : 'Add new job'}</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="form-group">
                  <label>Job title</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="UI/UX Design Intern" required />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="CogniCor Technologies" required />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the role, responsibilities, and requirements…" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="form-group">
                  <label>Location</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Kochi, Kerala" />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option>Internship</option>
                    <option>Full-time</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stipend / Salary</label>
                  <input name="stipend" value={form.stipend} onChange={handleChange} placeholder="₹15,000/month" />
                </div>
                <div className="form-group">
                  <label>Application deadline</label>
                  <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Min CGPA (0 = any)</label>
                  <input name="minCGPA" type="number" step="0.1" min="0" max="10" value={form.minCGPA} onChange={handleChange} placeholder="7.0" />
                </div>
                <div className="form-group">
                  <label>Eligible departments (comma separated)</label>
                  <input name="departments" value={form.departments} onChange={handleChange} placeholder="CSE, IT (blank = all)" />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editJob ? 'Save changes' : 'Create job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminJobs;
