import { useEffect, useState } from 'react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    API.get('/jobs')
      .then(r => setJobs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const applyForJob = async (jobId) => {
    setApplying(jobId);
    setMessages({});
    try {
      await API.post('/applications/apply', { jobId });
      setMessages({ [jobId]: { type: 'success', text: 'Application submitted successfully!' } });
    } catch (err) {
      setMessages({ [jobId]: { type: 'error', text: err.response?.data?.message || 'Failed to apply' } });
    } finally {
      setApplying(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="section-hd">
          <h1 className="page-title" style={{ margin: 0 }}>Open jobs</h1>
          <span style={{ color: 'var(--txt3)', fontSize: 13 }}>{jobs.length} positions available</span>
        </div>

        {loading ? <div className="loading">Loading jobs…</div> : jobs.length === 0 ? (
          <div className="empty">No open jobs at the moment. Check back soon!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {jobs.map(job => (
              <div key={job._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600 }}>{job.title}</h3>
                      <span className={`badge ${job.type === 'Internship' ? 'badge-internship' : 'badge-fulltime'}`}>{job.type}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--accent)', marginBottom: 8 }}>{job.company}</div>
                    <p style={{ color: 'var(--txt2)', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{job.description}</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: 13, color: 'var(--txt2)' }}>
                      <span>📍 {job.location}</span>
                      <span>💰 {job.stipend}</span>
                      <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                      {job.eligibility?.minCGPA > 0 && <span>🎓 Min CGPA: {job.eligibility.minCGPA}</span>}
                      {job.eligibility?.departments?.length > 0 && (
                        <span>🏛 {job.eligibility.departments.join(', ')}</span>
                      )}
                    </div>
                  </div>

                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    {messages[job._id] && (
                      <div className={`alert ${messages[job._id].type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 8, minWidth: 200 }}>
                        {messages[job._id].text}
                      </div>
                    )}
                    <button
                      className="btn btn-primary"
                      onClick={() => applyForJob(job._id)}
                      disabled={applying === job._id || messages[job._id]?.type === 'success'}
                    >
                      {applying === job._id ? 'Applying…' : messages[job._id]?.type === 'success' ? '✓ Applied' : 'Apply now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StudentJobs;
