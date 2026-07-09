import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { demoAdmin } from '../data/mockData';
import { applicationApi, opportunityApi, userApi } from '../utils/api';
import { getSession, setSession } from '../utils/userSession';

function getStatusBadgeClass(status) {
  switch (status) {
    case 'applied':
      return 'bg-primary';
    case 'reviewed':
      return 'bg-warning';
    case 'accepted':
      return 'bg-success';
    case 'rejected':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
}

function getReviewBadgeClass(reviewStatus) {
  switch (reviewStatus) {
    case 'approved':
      return 'bg-success';
    case 'rejected':
      return 'bg-danger';
    default:
      return 'bg-warning';
  }
}

function OpportunityDetailsModal({ opportunity, organizerName, onClose }) {
  if (!opportunity) return null;

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
              <h5 className="modal-title">{opportunity.title}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <h6 className="text-muted">Opportunity Type</h6>
                  <p>
                    <span className="badge bg-info text-uppercase">{opportunity.type}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted">Posted By</h6>
                  <p>{organizerName}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted">Deadline</h6>
                  <p>{new Date(opportunity.deadline).toLocaleDateString()}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted">Location</h6>
                  <p>{opportunity.location || 'Not specified'}</p>
                </div>
                <div className="col-12">
                  <h6 className="text-muted">Description</h6>
                  <p>{opportunity.description || 'No description provided'}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted">Requirements</h6>
                  <p>{opportunity.requirements || 'Not specified'}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted">Benefits</h6>
                  <p>{opportunity.benefits || 'Not specified'}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

function ApplicationDetailsModal({ application, opportunity, student, onClose, onDelete }) {
  if (!application) return null;
  const details = application.applicantDetails || {};

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
              <h5 className="modal-title">Applicant Submission Details</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <h6 className="text-muted">Opportunity</h6>
                  <p className="fw-semibold">{opportunity?.title || 'Removed'}</p>
                  <h6 className="text-muted">Applicant</h6>
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
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button type="button" className="btn btn-danger" onClick={() => onDelete(application.id)}>
                <i className="bi bi-trash" /> Delete Application
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState('dashboard');
  const [profileEditing, setProfileEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: demoAdmin.name,
    email: demoAdmin.email,
    organization: demoAdmin.organization || '',
    phone: demoAdmin.phone || '',
    role: demoAdmin.role || '',
    adminId: demoAdmin.id,
  });

  const [securitySettings, setSecuritySettings] = useState({
    mfaEnabled: true,
    reauthForSensitiveActions: true,
    notifyNewApplications: true,
  });
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [platformStats, setPlatformStats] = useState({ totalUsers: 0, totalOpportunities: 0, totalApplications: 0, adminCount: 0 });
  const [organizerMap, setOrganizerMap] = useState({});
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const session = getSession();
  const adminUser = session || demoAdmin;

  useEffect(() => {
    if (session) {
      setProfile({
        name: session.name,
        email: session.email,
        organization: session.organization || '',
        phone: session.phone || '',
        role: session.role || '',
        adminId: session.id,
      });
    }
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [oppRes, appRes, userRes, statsRes] = await Promise.all([
        opportunityApi.list(),
        applicationApi.list(),
        userApi.getAll(),
        userApi.getStats(),
      ]);
      setOpportunities(oppRes.opportunities || []);
      setApplications(appRes.applications || []);
      setUsers(userRes.users || []);
      setPlatformStats(statsRes.stats || {});
      const map = {};
      (userRes.users || []).forEach((u) => {
        map[u.id] = u.name;
      });
      setOrganizerMap(map);
    } catch {
      /* keep empty on error */
    }
  };

  const nonAdminUsers = users;
  const closedOpportunities = opportunities.filter((o) => o.status === 'closed' || new Date(o.deadline) < new Date()).length;
  const openOpportunities = opportunities.filter((o) => {
    const deadlinePassed = new Date(o.deadline) < new Date();
    return o.status !== 'closed' && !deadlinePassed;
  }).length;
  const pendingReviewOpportunities = opportunities.filter((o) => o.reviewStatus === 'pending').length;

  const reviewedApplications = applications.filter((app) => app.status === 'reviewed').length;
  const pendingApplications = applications.filter((app) => app.status === 'applied' || app.status === 'pending').length;

  const getOrganizerName = (organizerId) => organizerMap[organizerId] || 'Unknown';

  const renderDashboard = () => (
    <>
      <div className="row mt-4 g-4" id="dashboard-section">
        <div className="col-lg-3 col-md-6">
          <div className="stat-card">
            <div className="stat-icon icon-blue">
              <i className="bi bi-people-fill" />
            </div>
            <div className="stat-info">
              <h3>{platformStats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="stat-card">
            <div className="stat-icon icon-green">
              <i className="bi bi-briefcase-fill" />
            </div>
            <div className="stat-info">
              <h3>{platformStats.totalOpportunities}</h3>
              <p>Total Opportunities</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="stat-card">
            <div className="stat-icon icon-orange">
              <i className="bi bi-file-text-fill" />
            </div>
            <div className="stat-info">
              <h3>{platformStats.totalApplications}</h3>
              <p>Total Applications</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="stat-card">
            <div className="stat-icon icon-purple">
              <i className="bi bi-shield-lock" />
            </div>
            <div className="stat-info">
              <h3>{platformStats.adminCount}</h3>
              <p>Admin Users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <h4 className="section-title">Recent Platform Activity</h4>
          <div className="mt-3">
            {applications.length ? (
              [...applications]
                .slice()
                .reverse()
                .map((app) => {
                  const opportunity = opportunities.find((o) => o.id === app.opportunityId);
                  const studentName = app.applicantDetails?.fullName || 'Unknown';
                  return (
                    <div className="card mb-2" key={app.id}>
                      <div className="card-body py-2">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <div>
                            <h6 className="mb-0">
                              {studentName} applied to {opportunity?.title || 'Unknown Opportunity'}
                            </h6>
                            <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                              Application ID: {app.id}
                            </p>
                          </div>
                          <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-muted">No activity yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="row mt-4 g-4">
        <div className="col-lg-3 col-md-6">
          <a
            href="#section"
            className="action-card"
            onClick={(e) => {
              e.preventDefault();
              setSection('opportunities');
            }}
          >
            <div className="action-icon icon-blue">
              <i className="bi bi-briefcase-fill" />
            </div>
            <div className="action-content">
              <h5>Opportunities</h5>
              <p>Moderate and monitor postings</p>
            </div>
            <i className="bi bi-arrow-right action-arrow" />
          </a>
        </div>
        <div className="col-lg-3 col-md-6">
          <a
            href="#section"
            className="action-card"
            onClick={(e) => {
              e.preventDefault();
              setSection('applications');
            }}
          >
            <div className="action-icon icon-blue">
              <i className="bi bi-file-earmark-text-fill" />
            </div>
            <div className="action-content">
              <h5>Applications</h5>
              <p>Review submitted candidate info</p>
            </div>
            <i className="bi bi-arrow-right action-arrow" />
          </a>
        </div>
        <div className="col-lg-3 col-md-6">
          <a
            href="#section"
            className="action-card"
            onClick={(e) => {
              e.preventDefault();
              setSection('users');
            }}
          >
            <div className="action-icon icon-green">
              <i className="bi bi-people-fill" />
            </div>
            <div className="action-content">
              <h5>All Users</h5>
              <p>Manage roles and access</p>
            </div>
            <i className="bi bi-arrow-right action-arrow" />
          </a>
        </div>
        <div className="col-lg-3 col-md-6 mx-auto">
          <a
            href="#section"
            className="action-card"
            onClick={(e) => {
              e.preventDefault();
              setSection('profile');
            }}
          >
            <div className="action-icon icon-purple">
              <i className="bi bi-person-fill-gear" />
            </div>
            <div className="action-content">
              <h5>Admin Profile</h5>
              <p>Security & profile settings</p>
            </div>
            <i className="bi bi-arrow-right action-arrow" />
          </a>
        </div>
      </div>
    </>
  );

  const renderOpportunities = () => (
    <div className="row mt-5" id="opportunities-section">
      <div className="col-12">
        <h4 className="section-title">Opportunities Posted by Colleges & Companies</h4>
        <div className="row g-4 mb-2">
          <div className="col-lg-4 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-green">
                <i className="bi bi-unlock-fill" />
              </div>
              <div className="stat-info">
                <h3>{openOpportunities}</h3>
                <p>Open Opportunities</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <i className="bi bi-lock-fill" />
              </div>
              <div className="stat-info">
                <h3>{closedOpportunities}</h3>
                <p>Closed Opportunities</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <i className="bi bi-hourglass-split" />
              </div>
              <div className="stat-info">
                <h3>{pendingReviewOpportunities}</h3>
                <p>Pending Admin Review</p>
              </div>
            </div>
          </div>
        </div>
        <div className="opportunity-list">
          {opportunities.length ? (
            opportunities.map((opp) => {
              const organizerName = getOrganizerName(opp.organizerId);
              const appCount = applications.filter((a) => a.opportunityId === opp.id).length;
              const deadlinePassed = opp.status === 'closed' || new Date(opp.deadline) < new Date();
              const reviewLabel =
                opp.reviewStatus === 'approved'
                  ? 'approved'
                  : opp.reviewStatus === 'rejected'
                    ? 'rejected'
                    : 'pending review';

              return (
                <article key={opp.id} className="opportunity-list-item">
                  <div className="opportunity-list-main">
                    <div className="opportunity-list-header">
                      <h3>{opp.title}</h3>
                      <span className={`type-badge ${opp.type}`}>{opp.type}</span>
                    </div>
                    <p className="opportunity-list-desc">{opp.description}</p>
                    <div className="opportunity-list-meta">
                      <span>
                        <i className="bi bi-building" /> {organizerName}
                      </span>
                      <span>
                        <i className="bi bi-people-fill" /> {appCount} Application{appCount !== 1 ? 's' : ''}
                      </span>
                      <span>
                        <i className="bi bi-calendar-event" /> Deadline: {new Date(opp.deadline).toLocaleDateString()}
                      </span>
                      <span className={`badge ${deadlinePassed ? 'bg-danger' : 'bg-success'}`}>
                        {deadlinePassed ? 'Closed' : 'Open'}
                      </span>
                      <span className={`badge ${getReviewBadgeClass(opp.reviewStatus)}`}>{reviewLabel}</span>
                    </div>
                  </div>

                  <div className="opportunity-list-actions">
                    <button
                      type="button"
                      className="btn btn-outline-primary opportunity-btn"
                      onClick={() => setSelectedOpportunity(opp)}
                    >
                      <i className="bi bi-eye" /> View Details
                    </button>
                    {(opp.reviewStatus === 'pending' || !opp.reviewStatus) && (
                      <button
                        type="button"
                        className="btn btn-success opportunity-btn"
                        onClick={async () => {
                          await opportunityApi.review(opp.id, 'approved');
                          loadAllData();
                        }}
                      >
                        <i className="bi bi-check2-circle" /> Approve
                      </button>
                    )}
                    {(opp.reviewStatus === 'pending' || !opp.reviewStatus) && (
                      <button
                        type="button"
                        className="btn btn-warning opportunity-btn"
                        onClick={async () => {
                          await opportunityApi.review(opp.id, 'rejected');
                          loadAllData();
                        }}
                      >
                        <i className="bi bi-x-circle" /> Reject
                      </button>
                    )}
                    {opp.reviewStatus === 'rejected' && (
                      <button
                        type="button"
                        className="btn btn-danger opportunity-btn"
                        onClick={async () => {
                          await opportunityApi.remove(opp.id);
                          loadAllData();
                        }}
                      >
                        <i className="bi bi-trash" /> Delete
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="opportunity-empty">
              <i className="bi bi-inbox" />
              <p>No opportunities found</p>
            </div>
          )}
        </div>
        <OpportunityDetailsModal
          opportunity={selectedOpportunity}
          organizerName={getOrganizerName(selectedOpportunity?.organizerId)}
          onClose={() => setSelectedOpportunity(null)}
        />
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="row mt-5" id="users-section">
      <div className="col-12">
        <h4 className="section-title">All Registered Users</h4>
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {nonAdminUsers.length ? (
                    nonAdminUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className="badge bg-primary">{user.role}</span>
                        </td>
                        <td>
                          <span className="badge bg-success">Active</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={async () => {
                              await userApi.delete(user.id);
                              loadAllData();
                            }}
                          >
                            <i className="bi bi-trash" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="row mt-5" id="applications-section">
      <div className="col-12">
        <h4 className="section-title">All Applications</h4>
        <div className="row g-4 mb-2">
          <div className="col-lg-4 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <i className="bi bi-file-earmark-text-fill" />
              </div>
              <div className="stat-info">
                <h3>{applications.length}</h3>
                <p>Total Applications</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <i className="bi bi-search" />
              </div>
              <div className="stat-info">
                <h3>{reviewedApplications}</h3>
                <p>Reviewed Applications</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <i className="bi bi-hourglass-split" />
              </div>
              <div className="stat-info">
                <h3>{pendingApplications}</h3>
                <p>Pending Applications</p>
              </div>
            </div>
          </div>
        </div>
        <div className="application-list">
          {applications.length ? (
            applications.map((app) => {
              const opportunity = opportunities.find((o) => o.id === app.opportunityId);
              const details = app.applicantDetails || {};

              return (
                <article key={app.id} className="application-list-item">
                  <div className="application-list-main">
                    <div className="application-list-header">
                      <h3>{opportunity?.title || 'Opportunity Removed'}</h3>
                      <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
                    </div>
                    <p className="application-list-desc">
                      <strong>{details.fullName || 'Unknown Student'}</strong> · {details.email || 'N/A'}
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
                      <span>
                        <i className="bi bi-tag" /> {opportunity?.type || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="application-list-actions">
                    <button
                      type="button"
                      className="btn btn-outline-primary opportunity-btn"
                      onClick={() => setSelectedApplication(app)}
                    >
                      <i className="bi bi-eye" /> View Details
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger opportunity-btn"
                      onClick={async () => {
                        await applicationApi.remove(app.id);
                        loadAllData();
                      }}
                    >
                      <i className="bi bi-trash" /> Delete
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="opportunity-empty">
              <i className="bi bi-inbox" />
              <p>No applications found</p>
            </div>
          )}
        </div>
        <ApplicationDetailsModal
          application={selectedApplication}
          opportunity={opportunities.find((o) => o.id === selectedApplication?.opportunityId)}
          student={null}
          onClose={() => setSelectedApplication(null)}
          onDelete={async (appId) => {
            await applicationApi.remove(appId);
            setSelectedApplication(null);
            loadAllData();
          }}
        />
      </div>
    </div>
  );

  const renderProfile = () => (
    <div id="profile-section">
      <div className="page-header">
        <div className="header-title-area">
          <i className="bi bi-shield-lock" />
          <div>
            <h2 className="page-title">Admin Profile & Settings</h2>
            <p className="page-subtitle">Manage admin details, access, and security controls</p>
          </div>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-card-main">
          <div className="card-header-custom">
            <div className="card-header-title">
              <i className="bi bi-person-vcard" />
              <span>Profile Information</span>
            </div>

            {!profileEditing && (
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setProfileEditing(true)}>
                <i className="bi bi-pencil-square" /> Edit Profile
              </button>
            )}
          </div>

          <div className="card-body-custom">
            <div className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="adminName">Full Name</label>
                <input
                  type="text"
                  id="adminName"
                  className="form-control-custom"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  disabled={!profileEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminEmail">Email Address</label>
                <input type="email" id="adminEmail" className="form-control-custom" value={profile.email} disabled />
              </div>

              <div className="form-group">
                <label htmlFor="adminOrganization">Organization</label>
                <input
                  type="text"
                  id="adminOrganization"
                  className="form-control-custom"
                  value={profile.organization}
                  onChange={(e) => setProfile((p) => ({ ...p, organization: e.target.value }))}
                  disabled={!profileEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminPhone">Phone Number</label>
                <input
                  type="text"
                  id="adminPhone"
                  className="form-control-custom"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  disabled={!profileEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminRole">Role</label>
                <input type="text" id="adminRole" className="form-control-custom" value={profile.role} disabled />
              </div>

              <div className="form-group">
                <label htmlFor="adminId">Admin ID</label>
                <input type="text" id="adminId" className="form-control-custom" value={profile.adminId} disabled />
              </div>
            </div>

            {profileEditing && (
              <div className="mt-4 d-flex gap-3">
                <button
                  type="button"
                  className="btn-save"
                  onClick={async () => {
                    try {
                      const data = await userApi.updateProfile({
                        name: profile.name,
                        organization: profile.organization,
                        phone: profile.phone,
                      });
                      setSession(data.user);
                      setProfileEditing(false);
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                >
                  <i className="bi bi-check-circle" /> Save Changes
                </button>
                <button type="button" className="btn-cancel" onClick={() => setProfileEditing(false)}>
                  <i className="bi bi-x-circle" /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="account-actions-card">
          <div className="settings-header">
            <i className="bi bi-gear" />
            <span>Admin Actions</span>
          </div>

          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-header">
                <h6>Review Applications</h6>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setSection('applications')}
                >
                  Go
                </button>
              </div>
              <p>Check statuses and shortlist candidates</p>
            </div>

            <div className="settings-item">
              <div className="settings-item-header">
                <h6>Manage Users</h6>
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setSection('users')}>
                  Go
                </button>
              </div>
              <p>Monitor access and roles</p>
            </div>

            <div className="settings-item">
              <div className="settings-item-header">
                <h6>Opportunities Oversight</h6>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setSection('opportunities')}
                >
                  Go
                </button>
              </div>
              <p>Validate postings from colleges and companies</p>
            </div>
          </div>

          <div className="mt-4 settings-header">
            <i className="bi bi-shield-lock" />
            <span>Security & Access</span>
          </div>

          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-header">
                <h6>Two-Factor Authentication (2FA)</h6>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="mfaEnabled"
                  checked={securitySettings.mfaEnabled}
                  onChange={(e) => setSecuritySettings((s) => ({ ...s, mfaEnabled: e.target.checked }))}
                />
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-header">
                <h6>Re-auth for Sensitive Actions</h6>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="reauthForSensitiveActions"
                  checked={securitySettings.reauthForSensitiveActions}
                  onChange={(e) =>
                    setSecuritySettings((s) => ({ ...s, reauthForSensitiveActions: e.target.checked }))
                  }
                />
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-header">
                <h6>Notify on New Applications</h6>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="notifyNewApplications"
                  checked={securitySettings.notifyNewApplications}
                  onChange={(e) => setSecuritySettings((s) => ({ ...s, notifyNewApplications: e.target.checked }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout
      role="admin"
      adminSection={section}
      onAdminSectionChange={setSection}
      onLogout={() => navigate('/admin/login')}
    >
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="welcome-box">
              <div className="welcome-content">
                <h2>Welcome back, {adminUser.name} 👋</h2>
                <p className="text-muted">Manage the entire SkillSync platform and oversee all users</p>
              </div>
              <div className="welcome-icon">
                <i className="bi bi-shield-lock" />
              </div>
            </div>
          </div>
        </div>

        {section === 'dashboard' && renderDashboard()}
        {section === 'opportunities' && renderOpportunities()}
        {section === 'applications' && renderApplications()}
        {section === 'users' && renderUsers()}
        {section === 'profile' && renderProfile()}
      </div>
    </AppLayout>
  );
}
