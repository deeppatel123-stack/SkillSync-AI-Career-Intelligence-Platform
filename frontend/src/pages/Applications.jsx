import { useEffect, useMemo, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { applicationApi, opportunityApi } from '../utils/api';
import { getAppRole, getSession } from '../utils/userSession';

function getStatusClass(status) {
  return status;
}

function ApplicationDetailsModal({ application, opportunity, onClose, isOrganizer, onUpdateStatus, onDelete }) {
  if (!application) return null;
  const details = application.applicantDetails || {};
  const student = null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Application Details</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <h6 className="text-muted">Opportunity</h6>
                  <p className="fw-semibold">{opportunity?.title || 'Removed'}</p>
                  <h6 className="text-muted">Applicant Name</h6>
                  <p>{details.fullName || student?.name || 'Unknown'}</p>
                  <h6 className="text-muted">Email</h6>
                  <p>{details.email || student?.email || 'N/A'}</p>
                  <h6 className="text-muted">Phone</h6>
                  <p>{details.phone || 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted">University</h6>
                  <p>{details.university || 'N/A'}</p>
                  <h6 className="text-muted">Course</h6>
                  <p>{details.course || 'N/A'}</p>
                  <h6 className="text-muted">Year</h6>
                  <p>{details.year || 'N/A'}</p>
                  <h6 className="text-muted">Resume</h6>
                  <p>{details.resume || 'Not uploaded'}</p>
                  <h6 className="text-muted">LinkedIn</h6>
                  <p>{details.linkedin || 'N/A'}</p>
                </div>
                <div className="col-12">
                  <h6 className="text-muted">Cover Letter</h6>
                  <p>{details.coverLetter || 'No cover letter provided'}</p>
                </div>
                <div className="col-12">
                  <h6 className="text-muted">Status</h6>
                  <span className={`status ${getStatusClass(application.status)} px-3 py-2 text-uppercase`}>
                    {application.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              {isOrganizer && (application.status === 'applied' || application.status === 'pending') && (
                <button type="button" className="btn btn-warning" onClick={() => onUpdateStatus(application.id, 'reviewed')}>
                  Mark Reviewed
                </button>
              )}
              {isOrganizer && application.status !== 'accepted' && application.status !== 'rejected' && (
                <button type="button" className="btn btn-success" onClick={() => onUpdateStatus(application.id, 'accepted')}>
                  Approve
                </button>
              )}
              {isOrganizer && application.status !== 'rejected' && (
                <button type="button" className="btn btn-danger" onClick={() => onUpdateStatus(application.id, 'rejected')}>
                  Reject
                </button>
              )}
              {!isOrganizer && onDelete && (
                <button type="button" className="btn btn-outline-danger" onClick={() => onDelete(application.id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

export default function Applications() {
  const session = getSession();
  const isOrganizerView = session?.role === 'college' || session?.role === 'company';
  const role = isOrganizerView ? 'organizer' : getAppRole(session?.role || 'student');

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

  const filtered = useMemo(() => [...applications].reverse(), [applications]);

  const pageTitle = isOrganizerView ? 'Review Applications' : 'My Applications';
  const pageSubtitle = isOrganizerView
    ? 'Review applicant details and approve or reject applications'
    : 'Track and manage your submitted applications';
  const headerIcon = isOrganizerView ? 'bi-people' : 'bi-journal-check';

  const selectedOpp = selectedApp
    ? opportunities.find((o) => o.id === selectedApp.opportunityId)
    : null;

  return (
    <AppLayout role={role}>
      <div className="page-header">
        <div className="header-title-area">
          <i className={`bi ${headerIcon}`} />
          <div>
            <h2 className="page-title">{pageTitle}</h2>
            <p className="page-subtitle">{pageSubtitle}</p>
          </div>
        </div>
        <div className="status-filter-wrapper mt-3 mt-md-0">
          <div className="filter-icon">
            <i className="bi bi-funnel" />
          </div>
          <select
            id="statusFilter"
            className="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="applied">Applied</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="application-list" id="applicationList">
        {!filtered.length ? (
          <div className="empty-state">
            <i className="bi bi-inbox" />
            <h3>No applications found</h3>
            <p>
              {statusFilter === 'all'
                ? 'No applications received yet.'
                : 'No applications match the selected status.'}
            </p>
          </div>
        ) : (
          filtered.map((app) => {
            const opp = opportunities.find((o) => o.id === app.opportunityId);
            const details = app.applicantDetails || {};

            return (
              <article key={app.id} className="application-list-item">
                <div className="application-list-main">
                  <div className="application-list-header">
                    <h3>{opp?.title || 'Opportunity Removed'}</h3>
                    <span className={`status ${getStatusClass(app.status)} px-3 py-2 text-uppercase`}>
                      {app.status}
                    </span>
                  </div>
                  {isOrganizerView ? (
                    <>
                      <p className="application-list-desc">
                        <strong>{details.fullName}</strong> · {details.email}
                      </p>
                      <div className="application-list-meta">
                        <span>
                          <i className="bi bi-mortarboard" /> {details.university || 'N/A'}
                        </span>
                        <span>
                          <i className="bi bi-book" /> {details.course || 'N/A'}
                        </span>
                        <span>
                          <i className="bi bi-calendar" /> Applied: {app.appliedAt || 'N/A'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="application-list-desc">Type: {opp?.type || 'N/A'}</p>
                      <div className="application-list-meta">
                        <span>
                          <i className="bi bi-calendar" /> Applied: {app.appliedAt || 'N/A'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="application-list-actions">
                  <button
                    type="button"
                    className="btn btn-outline-primary opportunity-btn"
                    onClick={() => setSelectedApp(app)}
                  >
                    <i className="bi bi-eye" /> View Details
                  </button>
                  {isOrganizerView && (app.status === 'applied' || app.status === 'pending') && (
                    <button
                      type="button"
                      className="btn btn-warning opportunity-btn"
                      onClick={() => updateApplicationStatus(app.id, 'reviewed')}
                    >
                      Mark Reviewed
                    </button>
                  )}
                  {isOrganizerView && app.status !== 'accepted' && app.status !== 'rejected' && (
                    <button
                      type="button"
                      className="btn btn-success opportunity-btn"
                      onClick={() => updateApplicationStatus(app.id, 'accepted')}
                    >
                      <i className="bi bi-check2-circle" /> Approve
                    </button>
                  )}
                  {isOrganizerView && app.status !== 'rejected' && app.status !== 'accepted' && (
                    <button
                      type="button"
                      className="btn btn-outline-danger opportunity-btn"
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                    >
                      Reject
                    </button>
                  )}
                </div>
              </article>
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
        />
      )}
    </AppLayout>
  );
}
