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
            <div className="welcome-box bg-gradient-primary text-white p-4 rounded-3 shadow-sm d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold mb-1">Welcome back, {currentUser.name}</h2>
                <p className="mb-0 text-white-50">Your Career Hub & Opportunity Intelligence Dashboard</p>
              </div>
              <div className="d-flex gap-2">
                <Link to="/opportunities" className="btn btn-light btn-sm fw-semibold">
                  <i className="bi bi-search me-1" /> Browse Opportunities
                </Link>
                <Link to="/resume" className="btn btn-outline-light btn-sm fw-semibold">
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
            <div className="card shadow-sm border-0 h-100 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-shield-check text-success me-2" />Career Readiness Score</h5>
                <span className="badge bg-soft-success text-success fs-6">{careerReadiness} / 100</span>
              </div>
              <div className="progress mb-3" style={{ height: '14px' }}>
                <div
                  className={`progress-bar ${careerReadiness >= 75 ? 'bg-success' : careerReadiness >= 50 ? 'bg-primary' : 'bg-warning'}`}
                  style={{ width: `${careerReadiness}%` }}
                />
              </div>

              <div className="row g-2 small text-muted">
                <div className="col-6"><i className="bi bi-check2-circle text-success me-1" />Profile Completeness: <strong>{profileScore}/25</strong></div>
                <div className="col-6"><i className="bi bi-check2-circle text-success me-1" />Technical Skills: <strong>{skillsScore}/25</strong></div>
                <div className="col-6"><i className="bi bi-check2-circle text-success me-1" />Projects: <strong>{projectsScore}/20</strong></div>
                <div className="col-6"><i className="bi bi-check2-circle text-success me-1" />Certifications: <strong>{certsScore}/15</strong></div>
                <div className="col-6"><i className="bi bi-check2-circle text-success me-1" />Resume Ready: <strong>{resumeScore}/15</strong></div>
              </div>
            </div>
          </div>

          {/* Profile Completion Checklist */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 h-100 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-person-check text-primary me-2" />Profile Completion Checklist</h5>
                  <span className="small text-muted">{completionPct}% Complete ({completedCount} of {completionItems.length} items)</span>
                </div>
                <Link to="/student/profile" className="btn btn-sm btn-outline-primary">Update Profile</Link>
              </div>

              <div className="row g-2">
                {completionItems.map((item, idx) => (
                  <div key={idx} className="col-md-6">
                    <Link to={item.link} className={`d-flex align-items-center justify-content-between p-2 rounded text-decoration-none border ${item.done ? 'bg-light text-muted' : 'bg-soft-warning text-dark fw-semibold'}`}>
                      <span>
                        <i className={`bi ${item.done ? 'bi-check-circle-fill text-success' : 'bi-dash-circle text-warning'} me-2`} />
                        {item.label}
                      </span>
                      {!item.done && <span className="small text-warning"><i className="bi bi-arrow-right-short" />Add</span>}
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
            <Link to="/applications" className="stat-card text-decoration-none p-3 bg-white rounded-3 shadow-sm border-start border-4 border-primary d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-blue me-3">
                  <i className="bi bi-file-earmark-text-fill fs-3 text-primary" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-dark">{stats.totalApplications}</h3>
                  <span className="text-muted small">My Applications</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-lg-3 col-md-6">
            <Link to="/opportunities" className="stat-card text-decoration-none p-3 bg-white rounded-3 shadow-sm border-start border-4 border-info d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">
                  <i className="bi bi-search fs-3 text-info" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-dark">{stats.availableOpportunities}</h3>
                  <span className="text-muted small">Active Opportunities</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-lg-3 col-md-6">
            <Link to="/student/saved" className="stat-card text-decoration-none p-3 bg-white rounded-3 shadow-sm border-start border-4 border-warning d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-orange me-3">
                  <i className="bi bi-bookmark-star-fill fs-3 text-warning" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-dark">{savedOpps.length}</h3>
                  <span className="text-muted small">Saved Opportunities</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-lg-3 col-md-6">
            <Link to="/student/interviews" className="stat-card text-decoration-none p-3 bg-white rounded-3 shadow-sm border-start border-4 border-success d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-green me-3">
                  <i className="bi bi-calendar-check-fill fs-3 text-success" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-dark">{interviews.length}</h3>
                  <span className="text-muted small">Scheduled Interviews</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recommended Opportunities for You */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold"><i className="bi bi-stars text-primary me-2" />Recommended Opportunities For You</h5>
                <Link to="/opportunities" className="btn btn-sm btn-outline-primary">Browse All</Link>
              </div>
              <div className="card-body">
                {recommendedOpportunities.length > 0 ? (
                  <div className="row g-3">
                    {recommendedOpportunities.map(opp => (
                      <div key={opp.id} className="col-lg-6">
                        <div className="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-start mb-1">
                              <h6 className="fw-bold text-dark mb-0">{opp.title}</h6>
                              <span className="badge bg-soft-primary text-primary text-uppercase">{opp.type}</span>
                            </div>
                            <span className="small text-muted d-block mb-2"><i className="bi bi-building me-1" />{opp.organizerName || 'Company'}</span>

                            {/* Why this matches tag */}
                            <div className="bg-white p-2 rounded border mb-2">
                              <span className="small fw-semibold text-success d-block mb-1"><i className="bi bi-check-circle-fill me-1" />Why this matches you:</span>
                              {opp.matchReasons && opp.matchReasons.length > 0 ? (
                                opp.matchReasons.map(r => <span key={r} className="badge bg-success me-1">✓ {r}</span>)
                              ) : (
                                <span className="badge bg-secondary">Matching active career domain</span>
                              )}
                            </div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center pt-2">
                            <span className="small text-muted"><i className="bi bi-calendar-event me-1" />Deadline: {opp.deadline}</span>
                            <Link to="/opportunities" className="btn btn-sm btn-primary">View & Apply</Link>
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
            <Link to="/ai/profile-analysis" className="action-card text-decoration-none">
              <div className="action-icon icon-blue"><i className="bi bi-file-earmark-text" /></div>
              <div className="action-content">
                <h6 className="fw-bold text-dark mb-0">Profile Analysis</h6>
                <p className="text-muted small mb-0">AI profile audit</p>
              </div>
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/ai/career-role" className="action-card text-decoration-none">
              <div className="action-icon icon-purple"><i className="bi bi-briefcase-fill" /></div>
              <div className="action-content">
                <h6 className="fw-bold text-dark mb-0">Role Recommendation</h6>
                <p className="text-muted small mb-0">Find best target role</p>
              </div>
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/ai/skill-gap" className="action-card text-decoration-none">
              <div className="action-icon icon-orange"><i className="bi bi-exclamation-triangle" /></div>
              <div className="action-content">
                <h6 className="fw-bold text-dark mb-0">Skill Gap Analysis</h6>
                <p className="text-muted small mb-0">Identify missing skills</p>
              </div>
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/learning-hub/roadmap" className="action-card text-decoration-none">
              <div className="action-icon icon-green"><i className="bi bi-signpost-2" /></div>
              <div className="action-content">
                <h6 className="fw-bold text-dark mb-0">Learning Roadmap</h6>
                <p className="text-muted small mb-0">Track learning path</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
