import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { demoOrganizer } from '../data/mockData';
import { opportunityApi } from '../utils/api';
import { getSession } from '../utils/userSession';

export default function OrganizerDashboard() {
  const session = getSession();
  const currentUser = session || demoOrganizer;
  const [stats, setStats] = useState({ activeOpportunities: 0, totalApplications: 0, pendingReview: 0, responseRate: 0 });
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

  return (
    <AppLayout role="organizer">
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="welcome-box">
              <div className="welcome-content">
                <h2>Welcome back, {currentUser.name} 👋</h2>
                <p className="text-muted">Manage opportunities and review applications efficiently</p>
              </div>
              <div className="welcome-icon">
                <i className="bi bi-person-badge" />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4 g-4">
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <i className="bi bi-clipboard-check-fill" />
              </div>
              <div className="stat-info">
                <h3>{stats.activeOpportunities}</h3>
                <p>Active Opportunities</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <i className="bi bi-people-fill" />
              </div>
              <div className="stat-info">
                <h3>{stats.totalApplications}</h3>
                <p>Total Applications</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-green">
                <i className="bi bi-patch-check-fill" />
              </div>
              <div className="stat-info">
                <h3>{stats.pendingReview}</h3>
                <p>Pending Review</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <i className="bi bi-graph-up-arrow" />
              </div>
              <div className="stat-info">
                <h3>{stats.responseRate}%</h3>
                <p>Response Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <h4 className="section-title">My Recent Posts</h4>
            <div className="mt-3">
              {recent.length ? (
                recent.map((o) => (
                  <div className="card mb-2" key={o.id}>
                    <div className="card-body py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">{o.title}</h6>
                        <span className="badge bg-info text-uppercase">{o.type}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No opportunities posted yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="row mt-4 g-4">
          <div className="col-lg-4 col-md-6">
            <Link to="/opportunities/add" className="action-card">
              <div className="action-icon icon-blue">
                <i className="bi bi-plus-circle-fill" />
              </div>
              <div className="action-content">
                <h5>Create Opportunity</h5>
                <p>Post new jobs, internships & events</p>
              </div>
              <i className="bi bi-arrow-right action-arrow" />
            </Link>
          </div>
          <div className="col-lg-4 col-md-6">
            <Link to="/opportunities" className="action-card">
              <div className="action-icon icon-blue">
                <i className="bi bi-list-ul" />
              </div>
              <div className="action-content">
                <h5>View All Opportunities</h5>
                <p>Manage your posted opportunities</p>
              </div>
              <i className="bi bi-arrow-right action-arrow" />
            </Link>
          </div>
          <div className="col-lg-4 col-md-6 mx-auto">
            <Link to="/applications" className="action-card">
              <div className="action-icon icon-green">
                <i className="bi bi-file-earmark-bar-graph-fill" />
              </div>
              <div className="action-content">
                <h5>Review Applications</h5>
                <p>Check submitted applications</p>
              </div>
              <i className="bi bi-arrow-right action-arrow" />
            </Link>
          </div>
        </div>

        {/* AI Tools for Organizers */}
        <div className="row mt-4">
          <div className="col-12">
            <h4 className="section-title">
              <i className="bi bi-robot me-2" />
              AI Hiring Tools
            </h4>
          </div>
          <div className="col-lg-4 col-md-6">
            <Link to="/ai/candidate-ranking" className="action-card">
              <div className="action-icon icon-purple">
                <i className="bi bi-trophy" />
              </div>
              <div className="action-content">
                <h5>Candidate Ranking</h5>
                <p>AI-powered applicant ranking system</p>
              </div>
              <i className="bi bi-arrow-right action-arrow" />
            </Link>
          </div>
          <div className="col-lg-4 col-md-6">
            <Link to="/ai/placement-statistics" className="action-card">
              <div className="action-icon icon-blue">
                <i className="bi bi-bar-chart-fill" />
              </div>
              <div className="action-content">
                <h5>Placement Statistics</h5>
                <p>View placement data and trends</p>
              </div>
              <i className="bi bi-arrow-right action-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
