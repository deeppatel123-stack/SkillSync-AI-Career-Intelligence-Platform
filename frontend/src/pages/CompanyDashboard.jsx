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
    { label: 'Applied', count: stats.funnel.applied, color: 'bg-primary' },
    { label: 'Under Review', count: stats.funnel.reviewed, color: 'bg-info text-dark' },
    { label: 'Shortlisted', count: stats.funnel.shortlisted, color: 'bg-warning text-dark' },
    { label: 'Interview', count: stats.funnel.interview, color: 'bg-indigo text-white' },
    { label: 'Selected', count: stats.funnel.selected, color: 'bg-success' },
  ];

  return (
    <AppLayout role="company">
      <div className="container-fluid px-3">
        {/* Recruiter Header */}
        <div className="row">
          <div className="col-12">
            <div className="welcome-box bg-dark text-white p-4 rounded-3 shadow-sm d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold mb-1"><i className="bi bi-building me-2" />{currentUser.name} Recruiter Suite</h2>
                <p className="mb-0 text-white-50">Manage candidate pipelines, search talent, and schedule interviews</p>
              </div>
              <div className="d-flex gap-2">
                <Link to="/opportunities/add" className="btn btn-primary btn-sm fw-semibold">
                  <i className="bi bi-plus-circle me-1" /> Post New Job
                </Link>
                <Link to="/company/candidates" className="btn btn-outline-light btn-sm fw-semibold">
                  <i className="bi bi-person-search me-1" /> Find Candidates
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="stat-card p-3 bg-white rounded-3 shadow-sm border-start border-4 border-primary">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-blue me-3">
                  <i className="bi bi-briefcase-fill fs-3 text-primary" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{loading ? '...' : stats.activeJobs + stats.activeInternships}</h3>
                  <span className="text-muted small">Active Postings</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stat-card p-3 bg-white rounded-3 shadow-sm border-start border-4 border-info">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">
                  <i className="bi bi-file-earmark-person-fill fs-3 text-info" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{loading ? '...' : stats.totalApplicants}</h3>
                  <span className="text-muted small">Total Applicants</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stat-card p-3 bg-white rounded-3 shadow-sm border-start border-4 border-warning">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-orange me-3">
                  <i className="bi bi-star-fill fs-3 text-warning" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{loading ? '...' : stats.shortlisted}</h3>
                  <span className="text-muted small">Shortlisted Candidates</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stat-card p-3 bg-white rounded-3 shadow-sm border-start border-4 border-success">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-green me-3">
                  <i className="bi bi-calendar-check-fill fs-3 text-success" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{loading ? '...' : stats.scheduledInterviews}</h3>
                  <span className="text-muted small">Scheduled Interviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recruitment Pipeline Funnel */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold"><i className="bi bi-diagram-3 text-primary me-2" />Interactive Candidate Hiring Funnel</h5>
                <Link to="/applications" className="btn btn-sm btn-outline-primary">Open Recruitment Pipeline</Link>
              </div>
              <div className="card-body">
                <div className="row g-2 text-center">
                  {funnelStages.map((stage, idx) => (
                    <div className="col" key={stage.label}>
                      <div className="p-3 bg-light rounded-3 border">
                        <span className="badge rounded-pill text-uppercase mb-2 px-3 py-1 ${stage.color}">Stage {idx + 1}</span>
                        <h4 className="fw-bold mb-1">{stage.count}</h4>
                        <span className="small text-muted fw-semibold">{stage.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications & Upcoming Interviews */}
        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold"><i className="bi bi-clock-history me-2 text-info" />Recent Applicants</h5>
                <Link to="/applications" className="btn btn-sm btn-link">View All</Link>
              </div>
              <div className="card-body p-0">
                {recentApps.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {recentApps.map(app => (
                      <div key={app.id} className="list-group-item p-3 border-bottom d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-0">{app.applicantDetails?.fullName || 'Candidate'}</h6>
                          <span className="text-muted small"><i className="bi bi-envelope me-1" />{app.applicantDetails?.email}</span>
                          <div className="mt-1">
                            <span className="badge bg-light text-dark border me-1">CGPA: {app.applicantDetails?.cgpa || 'N/A'}</span>
                            <span className="badge bg-soft-info text-info">{app.applicantDetails?.course || 'Student'}</span>
                          </div>
                        </div>
                        <span className="badge bg-primary text-uppercase">{app.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-inbox fs-2 d-block mb-2" />
                    No recent applications received yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold"><i className="bi bi-calendar-event me-2 text-success" />Upcoming Interviews</h5>
                <Link to="/company/interviews" className="btn btn-sm btn-link">Manage Interviews</Link>
              </div>
              <div className="card-body p-0">
                {upcomingInterviews.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {upcomingInterviews.map(inv => (
                      <div key={inv.id} className="list-group-item p-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="fw-bold text-dark mb-0">{inv.studentName} - {inv.jobTitle}</h6>
                          <span className="badge bg-soft-success text-success text-uppercase">{inv.interviewType}</span>
                        </div>
                        <p className="text-muted small mb-1"><i className="bi bi-calendar-check me-1" />{new Date(inv.scheduledAt).toLocaleString()}</p>
                        {inv.meetingLink && (
                          <a href={inv.meetingLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary py-0 text-nowrap">
                            <i className="bi bi-link-45deg me-1" /> Join Meeting
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted p-3">
                    <i className="bi bi-calendar-x fs-2 d-block mb-2" />
                    No interviews scheduled. <br />
                    <Link to="/applications" className="btn btn-sm btn-success mt-2">Schedule From Applications</Link>
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
