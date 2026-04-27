import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    API.get('/applications/my')
      .then(r => setApplications(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status) => {
    const map = { Applied: 'badge-applied', Shortlisted: 'badge-shortlisted', Selected: 'badge-selected', Rejected: 'badge-rejected' };
    return <span className={`badge ${map[status] || 'badge-applied'}`}>{status}</span>;
  };

  const statuses = ['All', 'Applied', 'Shortlisted', 'Selected', 'Rejected'];
  const filtered = filter === 'All' ? applications : applications.filter(a => a.status === filter);

  return (
    <>
      <Navbar />
      <div className="page">
        <h1 className="page-title">My applications</h1>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="btn btn-secondary"
              style={{
                padding: '0.3rem 0.875rem',
                fontSize: 12,
                background: filter === s ? 'var(--accent)' : 'var(--bg3)',
                color: filter === s ? 'white' : 'var(--txt2)',
                border: `1px solid ${filter === s ? 'var(--accent)' : 'var(--border2)'}`,
              }}
            >
              {s} {s === 'All' ? `(${applications.length})` : `(${applications.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? <div className="loading">Loading…</div> : filtered.length === 0 ? (
          <div className="empty">
            {applications.length === 0
              ? <><p>You haven't applied to any jobs yet.</p><Link to="/student/jobs" style={{ color: 'var(--accent)' }}>Browse open jobs →</Link></>
              : <p>No applications with status "{filter}".</p>
            }
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Type</th>
                  <th>Stipend</th>
                  <th>Applied on</th>
                  <th>Status</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app._id}>
                    <td><strong>{app.job?.company}</strong></td>
                    <td style={{ color: 'var(--txt2)' }}>{app.job?.title}</td>
                    <td>
                      <span className={`badge ${app.job?.type === 'Internship' ? 'badge-internship' : 'badge-fulltime'}`}>
                        {app.job?.type}
                      </span>
                    </td>
                    <td style={{ color: 'var(--txt3)' }}>{app.job?.stipend || '—'}</td>
                    <td style={{ color: 'var(--txt3)' }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>{statusBadge(app.status)}</td>
                    <td style={{ color: 'var(--txt3)', fontSize: 12 }}>{app.adminNote || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentApplications;
