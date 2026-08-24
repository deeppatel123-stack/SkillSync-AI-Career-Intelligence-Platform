import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { companyApi } from '../utils/api';
import { getSession } from '../utils/userSession';

export default function CompanyDashboard() {
  const session = getSession();
  const currentUser = session || { name: 'Recruiter', role: 'company' };
  const [stats, setStats] = useState({
    activeJobs: 0,
    activeInternships: 0,
    totalApplicants: 0,
    underReview: 0,
    shortlisted: 0,
    inInterview: 0,
    offersMade: 0,
    scheduledInterviews: 0,
    funnel: { applied: 0, reviewed: 0, shortlisted: 0, interview: 0, selected: 0, rejected: 0 },
    topApplicantSkills: [],
  });
  const [recentApps, setRecentApps] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyApi.getStats()
      .then(res => {
        if (res.success) {
          setStats(res.stats || {});
          setRecentApps(res.recentApplications || []);
          setUpcomingInterviews(res.upcomingInterviews || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const funnelStages = [
    { label: 'Applied', count: stats.funnel.applied, badgeClass: 'bg-primary text-white' },
    { label: 'Under Review', count: stats.funnel.reviewed, badgeClass: 'bg-secondary text-white' },
    { label: 'Shortlisted', count: stats.funnel.shortlisted, badgeClass: 'bg-warning text-dark' },
    { label: 'Interview', count: stats.funnel.interview, badgeClass: 'bg-info text-white' },
    { label: 'Selected', count: stats.funnel.selected, badgeClass: 'bg-success text-white' },
  ];

  return (
    <AppLayout role="company">
      <div className="container-fluid px-3">
        {/* Clean Recruiter Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
          <div>
            <h3 className="fw-bold mb-1 text-dark">
              {currentUser.name} Recruiter Suite
            </h3>
            <p className="text-muted mb-0">Manage candidate pipelines, search talent, and schedule interviews</p>
          </div>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <Link to="/opportunities/add" className="btn btn-primary btn-sm fw-semibold px-3">
              <i className="bi bi-plus-circle me-1" /> Post New Job
            </Link>
            <Link to="/company/candidates" className="btn btn-outline-secondary btn-sm fw-semibold px-3">
              <i className="bi bi-person-search me-1" /> Find Candidates
            </Link>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="card-box p-3 shadow-sm h-100 d-flex align-items-center">
              <div className="stat-icon icon-blue me-3">
                <i className="bi bi-briefcase-fill" />
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-primary">{loading ? '...' : stats.activeJobs + stats.activeInternships}</h3>
                <span className="text-muted small fw-medium">Active Postings</span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card-box p-3 shadow-sm h-100 d-flex align-items-center">
              <div className="stat-icon icon-blue me-3">
                <i className="bi bi-file-earmark-person-fill" />
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-primary">{loading ? '...' : stats.totalApplicants}</h3>
                <span className="text-muted small fw-medium">Total Applicants</span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card-box p-3 shadow-sm h-100 d-flex align-items-center">
              <div className="stat-icon icon-orange me-3">
                <i className="bi bi-star-fill" />
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-primary">{loading ? '...' : stats.shortlisted}</h3>
                <span className="text-muted small fw-medium">Shortlisted Candidates</span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card-box p-3 shadow-sm h-100 d-flex align-items-center">
              <div className="stat-icon icon-green me-3">
                <i className="bi bi-calendar-check-fill" />
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-primary">{loading ? '...' : stats.scheduledInterviews}</h3>
                <span className="text-muted small fw-medium">Scheduled Interviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recruitment Pipeline Funnel */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card-box shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-diagram-3 text-primary me-2" />
                  Candidate Hiring Pipeline
                </h5>
                <Link to="/applications" className="btn btn-sm btn-outline-primary fw-semibold">
                  Open Recruitment Pipeline
                </Link>
              </div>
              <div className="row g-3 text-center">
                {funnelStages.map((stage, idx) => (
                  <div className="col" key={stage.label}>
                    <div className="p-3 bg-body-tertiary rounded-3 border">
                      <span className={`badge text-uppercase mb-2 px-2 py-1 ${stage.badgeClass}`}>
                        Stage {idx + 1}
                      </span>
                      <h4 className="fw-bold mb-1">{stage.count}</h4>
                      <span className="small text-muted fw-medium">{stage.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications & Upcoming Interviews */}
        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="card-box shadow-sm h-100 p-3">
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-clock-history me-2 text-primary" />
                  Recent Applicants
                </h5>
                <Link to="/applications" className="btn btn-sm btn-link text-decoration-none">View All</Link>
              </div>
              <div>
                {recentApps.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {recentApps.map(app => (
                      <div key={app.id} className="list-group-item bg-transparent px-0 py-3 border-bottom d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-1">{app.applicantDetails?.fullName || 'Candidate'}</h6>
                          <span className="text-muted small"><i className="bi bi-envelope me-1" />{app.applicantDetails?.email}</span>
                          <div className="mt-1">
                            <span className="badge bg-light text-dark border me-2">CGPA: {app.applicantDetails?.cgpa || 'N/A'}</span>
                            <span className="badge bg-secondary-subtle text-secondary">{app.applicantDetails?.course || 'Student'}</span>
                          </div>
                        </div>
                        <span className="badge bg-primary-subtle text-primary text-uppercase px-3 py-1">{app.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-inbox fs-2 d-block mb-2 text-muted" />
                    No recent applications received yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card-box shadow-sm h-100 p-3">
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-calendar-event me-2 text-primary" />
                  Upcoming Interviews
                </h5>
                <Link to="/company/interviews" className="btn btn-sm btn-link text-decoration-none">Manage Interviews</Link>
              </div>
              <div>
                {upcomingInterviews.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {upcomingInterviews.map(inv => (
                      <div key={inv.id} className="list-group-item bg-transparent px-0 py-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="fw-bold mb-0">{inv.studentName} - {inv.jobTitle}</h6>
                          <span className="badge bg-success-subtle text-success text-uppercase px-2 py-1">{inv.interviewType}</span>
                        </div>
                        <p className="text-muted small mb-2"><i className="bi bi-calendar-check me-1" />{new Date(inv.scheduledAt).toLocaleString()}</p>
                        {inv.meetingLink && (
                          <a href={inv.meetingLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary py-1 px-3">
                            <i className="bi bi-link-45deg me-1" /> Join Meeting
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-calendar-x fs-2 d-block mb-2 text-muted" />
                    No interviews scheduled yet. <br />
                    <Link to="/applications" className="btn btn-sm btn-primary mt-2 fw-medium">Schedule From Applications</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
