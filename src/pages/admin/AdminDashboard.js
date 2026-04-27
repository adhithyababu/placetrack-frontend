import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get('/jobs/all'), API.get('/applications/all')])
      .then(([jobsRes, appsRes]) => {
        setJobs(jobsRes.data);
        setApplications(appsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    jobs: jobs.length,
    applications: applications.length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    selected: applications.filter(a => a.status === 'Selected').length,
  };

  const statusBadge = (status) => {
    const map = { Applied: 'badge-applied', Shortlisted: 'badge-shortlisted', Selected: 'badge-selected', Rejected: 'badge-rejected' };
    return <span className={`badge ${map[status] || 'badge-applied'}`}>{status}</span>;
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: 22, fontWeight: 600 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--txt2)', marginTop: 4, fontSize: 14 }}>Manage placements for {user?.name}</p>
        </div>

        {loading ? <div className="loading">Loading…</div> : (
          <>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Active jobs</div>
                <div className="kpi-num" style={{ color: 'var(--accent)' }}>{counts.jobs}</div>
                <div className="kpi-sub"><Link to="/admin/jobs" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Manage →</Link></div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Total applications</div>
                <div className="kpi-num">{counts.applications}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Shortlisted</div>
                <div className="kpi-num" style={{ color: 'var(--warn)' }}>{counts.shortlisted}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Selected</div>
                <div className="kpi-num" style={{ color: 'var(--success)' }}>{counts.selected}</div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="section-hd">
              <div className="section-title">Recent applications</div>
              <Link to="/admin/applications" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>See all →</Link>
            </div>

            {applications.length === 0 ? (
              <div className="card empty">No applications yet.</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Department</th>
                      <th>Job</th>
                      <th>Company</th>
                      <th>Applied</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 8).map(app => (
                      <tr key={app._id}>
                        <td><strong>{app.student?.name}</strong><br /><span style={{ fontSize: 12, color: 'var(--txt3)' }}>{app.student?.email}</span></td>
                        <td style={{ color: 'var(--txt2)', fontSize: 12 }}>{app.student?.department}</td>
                        <td style={{ color: 'var(--txt2)' }}>{app.job?.title}</td>
                        <td style={{ color: 'var(--txt2)' }}>{app.job?.company}</td>
                        <td style={{ color: 'var(--txt3)' }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                        <td>{statusBadge(app.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
