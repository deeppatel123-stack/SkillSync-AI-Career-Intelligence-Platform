import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { companyApi, interviewApi } from '../utils/api';

export default function CandidateSearch() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [skills, setSkills] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [branch, setBranch] = useState('all');
  const [search, setSearch] = useState('');

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    jobTitle: 'Software Engineer',
    scheduledAt: '',
    interviewType: 'technical',
    meetingLink: '',
    notes: '',
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const loadCandidates = () => {
    setLoading(true);
    companyApi.searchCandidates({ skills, minCgpa, branch, search })
      .then(res => {
        if (res.success) setCandidates(res.candidates || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCandidates();
  }, [branch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCandidates();
  };

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    interviewApi.schedule({
      studentId: selectedCandidate.id,
      jobTitle: scheduleForm.jobTitle,
      scheduledAt: scheduleForm.scheduledAt,
      interviewType: scheduleForm.interviewType,
      meetingLink: scheduleForm.meetingLink,
      notes: scheduleForm.notes,
    })
      .then(res => {
        if (res.success) {
          setMsg(`Interview scheduled successfully with ${selectedCandidate.name}!`);
          setShowScheduleModal(false);
        }
      })
      .catch(err => setError(err.message || 'Failed to schedule interview'));
  };

  return (
    <AppLayout role="company">
      <div className="container-fluid px-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1"><i className="bi bi-person-search text-primary me-2" />Candidate Discovery & Talent Search</h3>
            <p className="text-muted mb-0">Search students by skills, CGPA, and department to hire top talent</p>
          </div>
        </div>

        {msg && <div className="alert alert-success alert-dismissible fade show">{msg}</div>}
        {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}

        {/* Search Controls */}
        <div className="card shadow-sm border-0 mb-4 p-3 bg-white">
          <form onSubmit={handleSearchSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Required Skills (Comma separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. React, Node, Python, SQL"
                value={skills}
                onChange={e => setSkills(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Minimum CGPA</label>
              <input
                type="number"
                step="0.5"
                className="form-control"
                placeholder="e.g. 7.5"
                value={minCgpa}
                onChange={e => setMinCgpa(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Department / Branch</label>
              <select className="form-select" value={branch} onChange={e => setBranch(e.target.value)}>
                <option value="all">All Departments</option>
                <option value="Computer Science">Computer Science / IT</option>
                <option value="Electronics">Electronics / ECE</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100 fw-semibold">
                <i className="bi bi-search me-1" /> Search
              </button>
            </div>
          </form>
        </div>

        {/* Candidate Cards Grid */}
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : candidates.length > 0 ? (
          <div className="row g-4">
            {candidates.map(c => (
              <div key={c.id} className="col-lg-4 col-md-6">
                <div className="card shadow-sm border-0 h-100 p-3 hover-lift">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-soft-primary text-primary fw-bold p-3 fs-4 me-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      {c.name ? c.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">{c.name}</h5>
                      <span className="small text-muted">{c.branch || c.degree || 'Student'}</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between small text-muted mb-2 bg-light p-2 rounded">
                    <span>CGPA: <strong className="text-dark">{c.cgpa || 'N/A'}</strong></span>
                    <span>Graduation: <strong className="text-dark">{c.passingYear || '2026'}</strong></span>
                  </div>

                  <div className="mb-3">
                    <span className="small text-muted d-block mb-1">Top Skills:</span>
                    {(c.skills || []).slice(0, 5).map(sk => (
                      <span key={sk} className="badge bg-light text-dark border me-1 mb-1">{sk}</span>
                    ))}
                    {(c.skills || []).length === 0 && <span className="small text-muted">No skills listed</span>}
                  </div>

                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary flex-grow-1"
                      onClick={() => setSelectedCandidate(c)}
                    >
                      <i className="bi bi-person me-1" /> View Profile
                    </button>
                    <button
                      className="btn btn-sm btn-success flex-grow-1"
                      onClick={() => {
                        setSelectedCandidate(c);
                        setShowScheduleModal(true);
                      }}
                    >
                      <i className="bi bi-calendar-plus me-1" /> Schedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card border-0 shadow-sm text-center py-5">
            <i className="bi bi-search fs-1 text-muted d-block mb-2" />
            <h5>No Candidates Found</h5>
            <p className="text-muted">Try adjusting your skill or CGPA filter parameters.</p>
          </div>
        )}

        {/* Schedule Interview Modal */}
        {showScheduleModal && selectedCandidate && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold"><i className="bi bi-calendar-event me-2" />Schedule Interview - {selectedCandidate.name}</h5>
                  <button className="btn-close" onClick={() => setShowScheduleModal(false)} />
                </div>
                <form onSubmit={handleScheduleInterview}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Position / Role</label>
                      <input type="text" className="form-control" required value={scheduleForm.jobTitle} onChange={e => setScheduleForm({...scheduleForm, jobTitle: e.target.value})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Date & Time</label>
                      <input type="datetime-local" className="form-control" required value={scheduleForm.scheduledAt} onChange={e => setScheduleForm({...scheduleForm, scheduledAt: e.target.value})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Interview Type</label>
                      <select className="form-select" value={scheduleForm.interviewType} onChange={e => setScheduleForm({...scheduleForm, interviewType: e.target.value})}>
                        <option value="technical">Technical Round</option>
                        <option value="hr">HR Round</option>
                        <option value="screening">Screening Call</option>
                        <option value="final">Final Round</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Meeting Link (Google Meet / Zoom / Teams)</label>
                      <input type="url" className="form-control" placeholder="https://meet.google.com/..." value={scheduleForm.meetingLink} onChange={e => setScheduleForm({...scheduleForm, meetingLink: e.target.value})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Notes for Candidate</label>
                      <textarea className="form-control" rows="2" placeholder="Instructions or topic focus..." value={scheduleForm.notes} onChange={e => setScheduleForm({...scheduleForm, notes: e.target.value})} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-success">Schedule & Notify Candidate</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
