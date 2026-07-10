import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { demoStudent } from '../data/mockData';
import { opportunityApi } from '../utils/api';
import { getSession } from '../utils/userSession';

export default function StudentDashboard() {
  const currentUser = getSession() || demoStudent;
  const [stats, setStats] = useState({
    totalApplications: 0,
    availableOpportunities: 0,
    shortlisted: 0,
    eventsJoined: 0,
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    opportunityApi
      .dashboardStats()
      .then((data) => {
        setStats(data.stats);
        setRecent(data.recentOpportunities || []);
      })
      .catch(() => {});
  }, []);

  // AI feature links for students
  const aiFeatures = [
    {
      to: '/ai/placement-prediction',
      icon: 'bi-graph-up-arrow',
      title: 'Placement Prediction',
      desc: 'Predict your placement chances using AI',
      color: 'icon-blue',
    },
    {
      to: '/ai/career-recommendation',
      icon: 'bi-compass',
      title: 'Career Recommendation',
      desc: 'Find the best career path for your skills',
      color: 'icon-purple',
    },
    {
      to: '/ai/trending-skills',
      icon: 'bi-graph-up',
      title: 'Trending Skills',
      desc: 'See in-demand skills and what to learn next',
      color: 'icon-blue',
    },
    {
      to: '/ai/learning-roadmap',
      icon: 'bi-signpost-2',
      title: 'Learning Roadmap',
      desc: 'Get a personalized learning plan',
      color: 'icon-orange',
    },
  ];

  return (
    <AppLayout role="student">
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="welcome-box">
              <div className="welcome-content">
                <h2>Welcome back, {currentUser.name} 👋</h2>
                <p className="text-muted">
                  Explore opportunities, track applications, and use AI tools
                </p>
              </div>
              <div className="welcome-icon">
                <i className="bi bi-person-circle" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="row mt-4 g-4">
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <i className="bi bi-briefcase-fill" />
              </div>
              <div className="stat-info">
                <h3>{stats.totalApplications}</h3>
                <p>Total Applications</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <i className="bi bi-eye-fill" />
              </div>
              <div className="stat-info">
                <h3>{stats.availableOpportunities}</h3>
                <p>Available Opportunities</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-green">
                <i className="bi bi-check-circle-fill" />
              </div>
              <div className="stat-info">
                <h3>{stats.shortlisted}</h3>
                <p>Shortlisted</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <i className="bi bi-calendar-event-fill" />
              </div>
              <div className="stat-info">
                <h3>{stats.eventsJoined}</h3>
                <p>Events Joined</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features Section */}
        <div className="row mt-4">
          <div className="col-12">
            <h4 className="section-title">
              <i className="bi bi-robot me-2" />
              AI-Powered Tools
            </h4>
          </div>
          {aiFeatures.map((feature) => (
            <div className="col-lg-4 col-md-6" key={feature.to}>
              <Link to={feature.to} className="action-card">
                <div className={`action-icon ${feature.color}`}>
                  <i className={`bi ${feature.icon}`} />
                </div>
                <div className="action-content">
                  <h5>{feature.title}</h5>
                  <p>{feature.desc}</p>
                </div>
                <i className="bi bi-arrow-right action-arrow" />
              </Link>
            </div>
          ))}
        </div>

        {/* Regular Actions */}
        <div className="row mt-4 g-4">
          <div className="col-lg-4 col-md-6">
            <Link to="/opportunities" className="action-card">
              <div className="action-icon icon-blue">
                <i className="bi bi-search" />
              </div>
              <div className="action-content">
                <h5>Browse Opportunities</h5>
                <p>Discover internships, jobs, and more</p>
              </div>
              <i className="bi bi-arrow-right action-arrow" />
            </Link>
          </div>
          <div className="col-lg-4 col-md-6">
            <Link to="/applications" className="action-card">
              <div className="action-icon icon-blue">
                <i className="bi bi-file-earmark-text-fill" />
              </div>
              <div className="action-content">
                <h5>My Applications</h5>
                <p>Track all your application status</p>
              </div>
              <i className="bi bi-arrow-right action-arrow" />
            </Link>
          </div>
          <div className="col-lg-4 col-md-6">
            <Link to="/student/profile" className="action-card">
              <div className="action-icon icon-green">
                <i className="bi bi-person-fill-gear" />
              </div>
              <div className="action-content">
                <h5>Student Profile</h5>
                <p>Manage skills, projects, internships & more</p>
              </div>
              <i className="bi bi-arrow-right action-arrow" />
            </Link>
          </div>
          <div className="col-lg-4 col-md-6 mx-auto">
            <Link to="/profile" className="action-card">
              <div className="action-icon icon-blue">
                <i className="bi bi-gear-fill" />
              </div>
              <div className="action-content">
                <h5>Account Settings</h5>
                <p>Update your account information</p>
              </div>
              <i className="bi bi-arrow-right action-arrow" />
            </Link>
          </div>
        </div>

        {/* Recent Opportunities */}
        <div className="row mt-4">
          <div className="col-12">
            <h4 className="section-title">Recent Opportunities</h4>
            <div className="mt-3">
              {recent.length ? (
                recent.map((o) => (
                  <div className="card mb-2" key={o.id}>
                    <div className="card-body py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">{o.title}</h6>
                        <span className="badge bg-secondary text-uppercase">
                          {o.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No opportunities yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
