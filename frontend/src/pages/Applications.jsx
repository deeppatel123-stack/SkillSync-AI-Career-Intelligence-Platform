import { useEffect, useMemo, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { applicationApi, opportunityApi, companyApi } from '../utils/api';
import { getSession } from '../utils/userSession';

const STAGE_STEPS = ['applied', 'reviewed', 'shortlisted', 'interview', 'accepted'];

function StageProgressStepper({ currentStatus }) {
  if (currentStatus === 'rejected') {
    return (
      <div className="bg-light p-3 rounded text-center my-3 border border-danger">
        <span className="badge bg-danger fs-6 mb-1">Application Status: Rejected</span>
        <p className="small text-muted mb-0">Thank you for your interest. Unfortunately, the recruiter did not move forward with your application.</p>
      </div>
    );
  }

  const currentIndex = STAGE_STEPS.indexOf(currentStatus) !== -1 ? STAGE_STEPS.indexOf(currentStatus) : 0;

  return (
    <div className="py-3 px-3 my-3 bg-body-tertiary rounded border overflow-x-auto">
      <div className="d-flex justify-content-between align-items-center position-relative" style={{ minWidth: '420px' }}>
        <div className="position-absolute top-50 start-0 end-0 translate-middle-y bg-secondary opacity-25" style={{ height: '4px', zIndex: 1 }} />
        <div
          className="position-absolute top-50 start-0 translate-middle-y bg-success"
          style={{
            height: '4px',
            zIndex: 2,
            width: `${(currentIndex / (STAGE_STEPS.length - 1)) * 100}%`,
            transition: 'width 0.3s ease',
          }}
        />
        {STAGE_STEPS.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div key={step} className="text-center position-relative" style={{ zIndex: 3 }}>
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1 fw-bold ${
                  isCurrent
                    ? 'bg-primary text-white ring-4 ring-primary'
                    : isDone
                    ? 'bg-success text-white'
                    : 'bg-white border text-muted'
                }`}
                style={{ width: '32px', height: '32px', fontSize: '13px' }}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span className={`small text-capitalize ${isCurrent ? 'fw-bold text-primary' : 'text-muted'}`}>
                {step === 'accepted' ? 'Selected' : step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApplicationDetailsModal({ application, opportunity, onClose, isOrganizer, onUpdateStatus, onAddNote }) {
  if (!application) return null;
  const details = application.applicantDetails || {};
  const [noteInput, setNoteInput] = useState('');

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(application.id, noteInput);
    setNoteInput('');
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Candidate Application - {details.fullName}</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              {/* Stepper */}
              <StageProgressStepper currentStatus={application.status} />

              <div className="row g-3">
                <div className="col-md-6">
                  <h6 className="fw-bold text-dark mb-1">Target Position</h6>
                  <p className="text-primary fw-semibold">{opportunity?.title || 'Position'}</p>
                  <h6 className="fw-bold text-dark mb-1">Applicant Contact</h6>
                  <p className="mb-1">{details.fullName} ({details.email})</p>
                  <p className="text-muted small">{details.phone || 'No phone provided'}</p>
                  <h6 className="fw-bold text-dark mb-1">Academic Info</h6>
                  <p className="mb-0">{details.university} - {details.course}</p>
                  <span className="badge bg-light text-dark border">CGPA: {details.cgpa || 'N/A'}</span>
                </div>

                <div className="col-md-6">
                  <h6 className="fw-bold text-dark mb-1">Profiles & Resume</h6>
                  <p className="mb-1">
                    {details.resume ? (
                      <span className="badge bg-soft-primary text-primary"><i className="bi bi-file-earmark-pdf me-1" />{details.resume}</span>
                    ) : (
                      <span className="text-muted small">No resume attached</span>
                    )}
                  </p>
                  <p className="mb-1"><strong>GitHub:</strong> {details.github || 'N/A'}</p>
                  <p className="mb-1"><strong>LinkedIn:</strong> {details.linkedin || 'N/A'}</p>
                  <p className="mb-0"><strong>Portfolio:</strong> {details.portfolio || 'N/A'}</p>
                </div>

                <div className="col-12 border-top pt-3">
                  <h6 className="fw-bold text-dark">Skills</h6>
                  {(details.skills || []).map(s => <span key={s} className="badge bg-primary me-1 mb-1">{s}</span>)}
                </div>

                {(details.projects || []).length > 0 && (
                  <div className="col-12 border-top pt-3">
                    <h6 className="fw-bold text-dark">Projects</h6>
                    {details.projects.map((p, i) => (
                      <div key={i} className="mb-2 p-2 bg-light rounded">
                        <strong>{p.title || 'Project'}</strong>
                        <p className="small text-muted mb-0">{p.technologies}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recruiter Notes Section */}
                <div className="col-12 border-top pt-3">
                  <h6 className="fw-bold text-dark"><i className="bi bi-journal-text me-1" />Recruiter Notes</h6>
                  {(application.recruiterNotes || []).length > 0 ? (
                    (application.recruiterNotes || []).map((n, idx) => (
                      <div key={idx} className="p-2 bg-light border-start border-3 border-primary rounded mb-2">
                        <p className="mb-0 text-dark small">{n.note}</p>
                        <span className="small text-muted">{n.addedBy} · {new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))
                  ) : (
                    <p className="small text-muted">No notes added yet.</p>
                  )}

                  {isOrganizer && (
                    <form onSubmit={handleNoteSubmit} className="mt-2 d-flex gap-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Add internal recruiter note..."
                        value={noteInput}
                        onChange={e => setNoteInput(e.target.value)}
                      />
                      <button type="submit" className="btn btn-sm btn-primary text-nowrap">Add Note</button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer d-flex justify-content-between">
              <div>
                {isOrganizer && (
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-info" onClick={() => onUpdateStatus(application.id, 'reviewed')}>Under Review</button>
                    <button className="btn btn-outline-warning" onClick={() => onUpdateStatus(application.id, 'shortlisted')}>Shortlist</button>
                    <button className="btn btn-outline-primary" onClick={() => onUpdateStatus(application.id, 'interview')}>Interview</button>
                    <button className="btn btn-outline-success" onClick={() => onUpdateStatus(application.id, 'accepted')}>Select/Offer</button>
                    <button className="btn btn-outline-danger" onClick={() => onUpdateStatus(application.id, 'rejected')}>Reject</button>
                  </div>
                )}
              </div>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Applications() {
  const session = getSession();
  const role = session?.role || 'student';
  const isOrganizerView = role === 'college' || role === 'company' || role === 'superadmin';

  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  const loadApplications = () => {
    const params = statusFilter !== 'all' ? { status: statusFilter } : {};
    applicationApi
      .list(params)
      .then((data) => setApplications(data.applications || []))
      .catch(() => setApplications([]));
  };

  useEffect(() => {
    loadApplications();
    opportunityApi.list().then((data) => setOpportunities(data.opportunities || [])).catch(() => {});
  }, [statusFilter]);

  const updateApplicationStatus = async (appId, status) => {
    try {
      const data = await applicationApi.updateStatus(appId, status);
      setApplications((prev) => prev.map((item) => (item.id === appId ? data.application : item)));
      setSelectedApp((prev) => (prev?.id === appId ? data.application : prev));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddNote = async (appId, note) => {
    try {
      const res = await companyApi.addNote(appId, note);
      if (res.success) {
        setApplications(prev => prev.map(item => item.id === appId ? res.application : item));
        setSelectedApp(res.application);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = useMemo(() => [...applications].reverse(), [applications]);

  const selectedOpp = selectedApp
    ? opportunities.find((o) => o.id === selectedApp.opportunityId)
    : null;

  return (
    <AppLayout role={role}>
      <div className="container-fluid px-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              <i className="bi bi-diagram-3-fill text-primary me-2" />
              {isOrganizerView ? 'Recruitment Application Pipeline' : 'My Applications & Status'}
            </h3>
            <p className="text-muted mb-0">Track application stages, reviews, interviews, and status updates</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <label className="small text-muted fw-semibold mb-0">Filter Status:</label>
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="all">All Stages</option>
              <option value="applied">Applied</option>
              <option value="reviewed">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="accepted">Selected / Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* List of Applications */}
        <div className="row g-3">
          {!filtered.length ? (
            <div className="col-12">
              <div className="card border-0 shadow-sm text-center py-5">
                <i className="bi bi-inbox fs-1 text-muted d-block mb-2" />
                <h5>No Applications Found</h5>
                <p className="text-muted">No submitted applications found matching the selected filter.</p>
              </div>
            </div>
          ) : (
            filtered.map((app) => {
              const opp = opportunities.find((o) => o.id === app.opportunityId);
              const details = app.applicantDetails || {};

              return (
                <div key={app.id} className="col-12">
                  <div className="card shadow-sm border-0 p-3">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                      <div className="mb-2 mb-md-0">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h5 className="fw-bold text-dark mb-0">{opp?.title || 'Position'}</h5>
                          <span className={`badge text-uppercase ${
                            app.status === 'accepted' ? 'bg-success' :
                            app.status === 'rejected' ? 'bg-danger' :
                            app.status === 'shortlisted' ? 'bg-warning text-dark' :
                            app.status === 'interview' ? 'bg-indigo text-white' : 'bg-primary'
                          }`}>
                            {app.status === 'accepted' ? 'Selected' : app.status}
                          </span>
                        </div>
                        <p className="text-muted small mb-1">
                          {isOrganizerView ? (
                            <>Applicant: <strong>{details.fullName}</strong> ({details.email}) · CGPA: {details.cgpa || 'N/A'}</>
                          ) : (
                            <>Applied on: {app.appliedAt} · {opp?.type ? `Type: ${opp.type}` : ''}</>
                          )}
                        </p>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedApp(app)}
                        >
                          <i className="bi bi-eye me-1" /> Details & Pipeline
                        </button>
                        {isOrganizerView && (
                          <div className="dropdown">
                            <button className="btn btn-sm btn-light border dropdown-toggle" type="button" data-bs-toggle="dropdown">
                              Move Stage
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li><button className="dropdown-item" onClick={() => updateApplicationStatus(app.id, 'reviewed')}>Under Review</button></li>
                              <li><button className="dropdown-item" onClick={() => updateApplicationStatus(app.id, 'shortlisted')}>Shortlist</button></li>
                              <li><button className="dropdown-item" onClick={() => updateApplicationStatus(app.id, 'interview')}>Interview Stage</button></li>
                              <li><button className="dropdown-item text-success" onClick={() => updateApplicationStatus(app.id, 'accepted')}>Select / Offer</button></li>
                              <li><button className="dropdown-item text-danger" onClick={() => updateApplicationStatus(app.id, 'rejected')}>Reject</button></li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stepper Preview */}
                    <StageProgressStepper currentStatus={app.status} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {selectedApp && (
          <ApplicationDetailsModal
            application={selectedApp}
            opportunity={selectedOpp}
            onClose={() => setSelectedApp(null)}
            isOrganizer={isOrganizerView}
            onUpdateStatus={updateApplicationStatus}
            onAddNote={handleAddNote}
          />
        )}
      </div>
    </AppLayout>
  );
}
