import { useEffect, useState } from 'react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const STATUSES = ['Applied', 'Shortlisted', 'Rejected', 'Selected'];

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [updating, setUpdating] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', adminNote: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchApps = () => {
    setLoading(true);
    API.get('/applications/all')
      .then(r => setApplications(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, []);

  const openUpdate = (app) => {
    setSelectedApp(app);
    setStatusForm({ status: app.status, adminNote: app.adminNote || '' });
    setError('');
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await API.put(`/applications/${selectedApp._id}/status`, statusForm);
      setSelectedApp(null);
      fetchApps();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (status) => {
    const map = { Applied: 'badge-applied', Shortlisted: 'badge-shortlisted', Selected: 'badge-selected', Rejected: 'badge-rejected' };
    return <span className={`badge ${map[status] || 'badge-applied'}`}>{status}</span>;
  };

  const filtered = filter === 'All' ? applications : applications.filter(a => a.status === filter);

  return (
    <>
      <Navbar />
      <div className="page">
        <h1 className="page-title">All applications</h1>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {['All', ...STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="btn"
              style={{
                padding: '0.3rem 0.875rem', fontSize: 12,
                background: filter === s ? 'var(--accent)' : 'var(--bg3)',
                color: filter === s ? 'white' : 'var(--txt2)',
                border: `1px solid ${filter === s ? 'var(--accent)' : 'var(--border2)'}`,
              }}
            >
              {s} ({s === 'All' ? applications.length : applications.filter(a => a.status === s).length})
            </button>
          ))}
        </div>

        {loading ? <div className="loading">Loading…</div> : filtered.length === 0 ? (
          <div className="empty">No applications found.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Dept / CGPA</th>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Resume</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app._id}>
                    <td>
                      <strong>{app.student?.name}</strong>
                      <br />
                      <span style={{ fontSize: 12, color: 'var(--txt3)' }}>{app.student?.email}</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--txt2)' }}>
                      {app.student?.department}<br />
                      <span style={{ color: 'var(--txt3)' }}>CGPA: {app.student?.cgpa || '—'}</span>
                    </td>
                    <td style={{ color: 'var(--txt2)' }}>{app.job?.title}</td>
                    <td style={{ color: 'var(--txt2)' }}>{app.job?.company}</td>
                    <td style={{ color: 'var(--txt3)', fontSize: 12 }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>{statusBadge(app.status)}</td>
                    <td>
                      {app.resumeUrl ? (
                        <a href={`http://localhost:5000${app.resumeUrl}`} target="_blank" rel="noreferrer"
                          style={{ color: 'var(--accent)', fontSize: 12, textDecoration: 'none' }}>
                          View PDF ↗
                        </a>
                      ) : <span style={{ color: 'var(--txt3)', fontSize: 12 }}>—</span>}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.75rem', fontSize: 12 }}
                        onClick={() => openUpdate(app)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Update application status</div>
              <button className="modal-close" onClick={() => setSelectedApp(null)}>×</button>
            </div>

            <div style={{ marginBottom: '1.25rem', padding: '0.875rem', background: 'var(--bg3)', borderRadius: 8 }}>
              <div style={{ fontWeight: 600 }}>{selectedApp.student?.name}</div>
              <div style={{ fontSize: 13, color: 'var(--txt2)', marginTop: 2 }}>{selectedApp.job?.title} at {selectedApp.job?.company}</div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleStatusUpdate}>
              <div className="form-group">
                <label>Status</label>
                <select value={statusForm.status} onChange={e => setStatusForm({ ...statusForm, status: e.target.value })}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Note to student (optional)</label>
                <textarea
                  value={statusForm.adminNote}
                  onChange={e => setStatusForm({ ...statusForm, adminNote: e.target.value })}
                  placeholder="e.g. Please join us for an interview on Monday 10am…"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedApp(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminApplications;
