import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { demoStudent } from '../data/mockData';
import { opportunityApi, interviewApi, userApi } from '../utils/api';
import { getSession } from '../utils/userSession';

export default function StudentDashboard() {
  const currentUser = getSession() || demoStudent;
  const [stats, setStats] = useState({
    totalApplications: 0,
    availableOpportunities: 0,
    shortlisted: 0,
    eventsJoined: 0,
  });
  const [opportunities, setOpportunities] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [savedOpps, setSavedOpps] = useState([]);

  useEffect(() => {
    opportunityApi.dashboardStats()
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch(() => {});

    opportunityApi.list({ forStudent: 'true' })
      .then((data) => {
        if (data.success) setOpportunities(data.opportunities || []);
      })
      .catch(() => {});

    interviewApi.list()
      .then((data) => {
        if (data.success) setInterviews(data.interviews || []);
      })
      .catch(() => {});

    userApi.getSaved()
      .then((data) => {
        if (data.success) setSavedOpps(data.opportunities || []);
      })
      .catch(() => {});
  }, []);

  // Profile Completion Calculation & Missing Fields
  const completionItems = [
    { label: 'Profile Photo', done: !!currentUser.profilePhoto, link: '/student/profile' },
    { label: 'Technical Skills', done: (currentUser.skills || []).length > 0, link: '/student/profile' },
    { label: 'Projects', done: (currentUser.projects || []).length > 0, link: '/student/profile' },
    { label: 'Resume', done: !!currentUser.resume, link: '/resume' },
    { label: 'Certifications', done: (currentUser.certifications || []).length > 0, link: '/student/profile' },
    { label: 'LinkedIn / GitHub', done: !!(currentUser.linkedin || currentUser.github), link: '/student/profile' },
  ];
  const completedCount = completionItems.filter(i => i.done).length;
  const completionPct = Math.round((completedCount / completionItems.length) * 100);

  // Career Readiness Score (0-100)
  const skillsScore = Math.min(25, (currentUser.skills || []).length * 5);
  const projectsScore = Math.min(20, (currentUser.projects || []).length * 10);
  const certsScore = Math.min(15, (currentUser.certifications || []).length * 7.5);
  const resumeScore = currentUser.resume ? 15 : 0;
  const profileScore = Math.min(25, (completionPct / 100) * 25);
  const careerReadiness = Math.round(skillsScore + projectsScore + certsScore + resumeScore + profileScore);

  // Opportunity Recommendation Engine with "Why this matches you"
  const studentSkills = (currentUser.skills || []).map(s => s.toLowerCase());
  const recommendedOpportunities = opportunities
    .map(opp => {
      const matchReasons = [];
      const oppTitle = (opp.title || '').toLowerCase();
      const oppReq = (opp.requirements || '').toLowerCase();
      const oppDesc = (opp.description || '').toLowerCase();

      studentSkills.forEach(skill => {
        if (oppTitle.includes(skill) || oppReq.includes(skill) || oppDesc.includes(skill)) {
          matchReasons.push(skill.charAt(0).toUpperCase() + skill.slice(1));
        }
      });

      if (currentUser.branch && (oppReq.includes(currentUser.branch.toLowerCase()) || oppDesc.includes(currentUser.branch.toLowerCase()))) {
        matchReasons.push(currentUser.branch);
      }

      return { ...opp, matchReasons, score: matchReasons.length };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return (
    <AppLayout role="student">
      <div className="container-fluid px-3">
        {/* Welcome Header */}
        <div className="row">
          <div className="col-12">
            <div className="welcome-box shadow-sm d-flex justify-content-between align-items-center mb-4 p-4 rounded-3">
              <div className="welcome-content">
                <h2 className="fw-bold mb-1">
                  <i className="bi bi-person-workspace me-2 text-primary" />
                  Welcome back, {currentUser.name}
                </h2>
                <p className="mb-0 text-muted">Your Career Hub & Opportunity Intelligence Dashboard</p>
              </div>
              <div className="d-flex gap-2">
                <Link to="/opportunities" className="btn btn-primary btn-sm fw-semibold px-3">
                  <i className="bi bi-search me-1" /> Browse Opportunities
                </Link>
                <Link to="/resume" className="btn btn-outline-secondary btn-sm fw-semibold px-3">
                  <i className="bi bi-file-earmark-arrow-down me-1" /> Resume Builder
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Readiness & Profile Completion Row */}
        <div className="row g-4 mb-4">
          {/* Career Readiness Score */}
          <div className="col-lg-5">
            <div className="card-box shadow-sm h-100 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-shield-check text-primary me-2" />
                  Career Readiness Score
                </h5>
                <span className="badge bg-primary-subtle text-primary fs-6 fw-bold px-3 py-1">{careerReadiness} / 100</span>
              </div>
              <div className="progress mb-3" style={{ height: '10px' }}>
                <div
                  className={`progress-bar ${careerReadiness >= 75 ? 'bg-success' : careerReadiness >= 50 ? 'bg-primary' : 'bg-warning'}`}
                  style={{ width: `${careerReadiness}%` }}
                />
              </div>

              <div className="row g-2 small text-muted">
                <div className="col-6"><i className="bi bi-check2-circle text-primary me-1" />Profile: <strong>{profileScore}/25</strong></div>
                <div className="col-6"><i className="bi bi-check2-circle text-primary me-1" />Skills: <strong>{skillsScore}/25</strong></div>
                <div className="col-6"><i className="bi bi-check2-circle text-primary me-1" />Projects: <strong>{projectsScore}/20</strong></div>
                <div className="col-6"><i className="bi bi-check2-circle text-primary me-1" />Certifications: <strong>{certsScore}/15</strong></div>
                <div className="col-6"><i className="bi bi-check2-circle text-primary me-1" />Resume: <strong>{resumeScore}/15</strong></div>
              </div>
            </div>
          </div>

          {/* Profile Completion Checklist */}
          <div className="col-lg-7">
            <div className="card-box shadow-sm h-100 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-person-check text-primary me-2" />
                    Profile Completion Checklist
                  </h5>
                  <span className="small text-muted">{completionPct}% Complete ({completedCount} of {completionItems.length} items)</span>
                </div>
                <Link to="/student/profile" className="btn btn-sm btn-outline-primary fw-semibold">Update Profile</Link>
              </div>

              <div className="row g-2">
                {completionItems.map((item, idx) => (
                  <div key={idx} className="col-md-6">
                    <Link to={item.link} className={`d-flex align-items-center justify-content-between p-2 rounded-3 text-decoration-none border ${item.done ? 'bg-body-tertiary text-muted' : 'bg-body-secondary text-body fw-medium'}`}>
                      <span>
                        <i className={`bi ${item.done ? 'bi-check-circle-fill text-success' : 'bi-dash-circle text-warning'} me-2`} />
                        {item.label}
                      </span>
                      {!item.done && <span className="small text-primary"><i className="bi bi-arrow-right-short" />Add</span>}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Core Stats Overview */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-md-6">
            <Link to="/applications" className="card-box text-decoration-none p-3 shadow-sm h-100 d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-blue me-3">
                  <i className="bi bi-file-earmark-text-fill" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-primary">{stats.totalApplications}</h3>
                  <span className="text-muted small fw-medium">My Applications</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-lg-3 col-md-6">
            <Link to="/opportunities" className="card-box text-decoration-none p-3 shadow-sm h-100 d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-blue me-3">
                  <i className="bi bi-search" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-primary">{stats.availableOpportunities}</h3>
                  <span className="text-muted small fw-medium">Active Opportunities</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-lg-3 col-md-6">
            <Link to="/student/saved" className="card-box text-decoration-none p-3 shadow-sm h-100 d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-orange me-3">
                  <i className="bi bi-bookmark-star-fill" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-primary">{savedOpps.length}</h3>
                  <span className="text-muted small fw-medium">Saved Items</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-lg-3 col-md-6">
            <Link to="/student/interviews" className="card-box text-decoration-none p-3 shadow-sm h-100 d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-green me-3">
                  <i className="bi bi-calendar-check-fill" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-primary">{interviews.length}</h3>
                  <span className="text-muted small fw-medium">Scheduled Interviews</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recommended Opportunities for You */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card-box shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-stars text-primary me-2" />
                  Recommended Opportunities For You
                </h5>
                <Link to="/opportunities" className="btn btn-sm btn-outline-primary fw-semibold">Browse All</Link>
              </div>
              <div>
                {recommendedOpportunities.length > 0 ? (
                  <div className="row g-3">
                    {recommendedOpportunities.map(opp => (
                      <div key={opp.id} className="col-lg-6">
                        <div className="p-3 border rounded-3 bg-body-tertiary h-100 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-start mb-1">
                              <h6 className="fw-bold mb-0">{opp.title}</h6>
                              <span className="badge bg-primary-subtle text-primary text-uppercase">{opp.type}</span>
                            </div>
                            <span className="small text-muted d-block mb-2"><i className="bi bi-building me-1" />{opp.organizerName || 'Company'}</span>

                            {/* Why this matches tag */}
                            <div className="bg-body p-2 rounded border mb-2">
                              <span className="small fw-semibold text-success d-block mb-1"><i className="bi bi-check-circle-fill me-1" />Why this matches you:</span>
                              {opp.matchReasons && opp.matchReasons.length > 0 ? (
                                opp.matchReasons.map(r => <span key={r} className="badge bg-success-subtle text-success me-1">✓ {r}</span>)
                              ) : (
                                <span className="badge bg-secondary-subtle text-secondary">Matching active career domain</span>
                              )}
                            </div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center pt-2">
                            <span className="small text-muted"><i className="bi bi-calendar-event me-1" />Deadline: {opp.deadline}</span>
                            <Link to="/opportunities" className="btn btn-sm btn-primary fw-medium">View & Apply</Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    No active opportunities available right now.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Career Tools Quick Access */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <Link to="/ai/profile-analysis" className="card-box text-decoration-none p-3 h-100 d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-blue me-3"><i className="bi bi-cpu-fill" /></div>
                <div>
                  <h6 className="fw-bold mb-0">Profile Analysis</h6>
                  <p className="text-muted small mb-0">AI profile audit</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/ai/career-role" className="card-box text-decoration-none p-3 h-100 d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-blue me-3"><i className="bi bi-briefcase-fill" /></div>
                <div>
                  <h6 className="fw-bold mb-0">Role Recommendation</h6>
                  <p className="text-muted small mb-0">Target role match</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/ai/skill-gap" className="card-box text-decoration-none p-3 h-100 d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-orange me-3"><i className="bi bi-exclamation-triangle-fill" /></div>
                <div>
                  <h6 className="fw-bold mb-0">Skill Gap Analysis</h6>
                  <p className="text-muted small mb-0">Identify missing skills</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/learning-hub/roadmap" className="card-box text-decoration-none p-3 h-100 d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-green me-3"><i className="bi bi-signpost-2-fill" /></div>
                <div>
                  <h6 className="fw-bold mb-0">Learning Roadmap</h6>
                  <p className="text-muted small mb-0">Track learning path</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
