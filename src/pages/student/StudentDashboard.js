import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          API.get('/applications/my'),
          API.get('/jobs'),
        ]);
        setApplications(appsRes.data);
        setJobs(jobsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const counts = {
    total: applications.length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    selected: applications.filter(a => a.status === 'Selected').length,
    openJobs: jobs.length,
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
          <h1 style={{ fontSize: 22, fontWeight: 600 }}>Welcome back, {user?.name} 👋</h1>
          <p style={{ color: 'var(--txt2)', marginTop: 4, fontSize: 14 }}>Here's your placement activity at a glance</p>
        </div>

        {loading ? <div className="loading">Loading…</div> : (
          <>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Applications sent</div>
                <div className="kpi-num" style={{ color: 'var(--accent)' }}>{counts.total}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Shortlisted</div>
                <div className="kpi-num" style={{ color: 'var(--warn)' }}>{counts.shortlisted}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Selected</div>
                <div className="kpi-num" style={{ color: 'var(--success)' }}>{counts.selected}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Open jobs</div>
                <div className="kpi-num">{counts.openJobs}</div>
                <div className="kpi-sub"><Link to="/student/jobs" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Browse →</Link></div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="section-hd">
              <div className="section-title">Recent applications</div>
              <Link to="/student/applications" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>See all →</Link>
            </div>

            {applications.length === 0 ? (
              <div className="card empty">
                No applications yet. <Link to="/student/jobs" style={{ color: 'var(--accent)' }}>Browse open jobs →</Link>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Type</th>
                      <th>Applied</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 5).map(app => (
                      <tr key={app._id}>
                        <td><strong>{app.job?.company}</strong></td>
                        <td style={{ color: 'var(--txt2)' }}>{app.job?.title}</td>
                        <td>
                          <span className={`badge ${app.job?.type === 'Internship' ? 'badge-internship' : 'badge-fulltime'}`}>
                            {app.job?.type}
                          </span>
                        </td>
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

export default StudentDashboard;
