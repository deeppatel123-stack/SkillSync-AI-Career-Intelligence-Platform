import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { collegeApi } from '../utils/api';
import { getSession } from '../utils/userSession';

export default function CollegeDashboard() {
  const session = getSession();
  const currentUser = session || { name: 'College Administrator', role: 'college' };
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeOpportunities: 0,
    totalDrives: 0,
    totalEvents: 0,
    placedStudents: 0,
    placementRate: 0,
    departmentBreakdown: {},
  });
  const [recentDrives, setRecentDrives] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    collegeApi.getStats()
      .then(res => {
        if (res.success) {
          setStats(res.stats || {});
          setRecentDrives(res.recentDrives || []);
          setRecentEvents(res.recentEvents || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout role="college">
      <div className="container-fluid px-3">
        {/* Welcome Header */}
        <div className="row">
          <div className="col-12">
            <div className="welcome-box bg-gradient-primary text-white p-4 rounded-3 shadow-sm d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold mb-1"><i className="bi bi-bank me-2" />{currentUser.organization || currentUser.name} Placement Cell</h2>
                <p className="mb-0 text-white-50">Academic Student Opportunity & Campus Recruitment Portal</p>
              </div>
              <div className="d-flex gap-2">
                <Link to="/college/drives" className="btn btn-light btn-sm fw-semibold">
                  <i className="bi bi-plus-lg me-1" /> New Campus Drive
                </Link>
                <Link to="/opportunities/add" className="btn btn-outline-light btn-sm fw-semibold">
                  <i className="bi bi-megaphone me-1" /> Post Opportunity
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="stat-card p-3 bg-white rounded-3 shadow-sm border-start border-4 border-primary">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-blue me-3">
                  <i className="bi bi-people-fill fs-3 text-primary" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{loading ? '...' : stats.totalStudents}</h3>
                  <span className="text-muted small">Registered Students</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stat-card p-3 bg-white rounded-3 shadow-sm border-start border-4 border-success">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-green me-3">
                  <i className="bi bi-trophy-fill fs-3 text-success" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{loading ? '...' : `${stats.placementRate}%`}</h3>
                  <span className="text-muted small">Placement Rate ({stats.placedStudents} Placed)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stat-card p-3 bg-white rounded-3 shadow-sm border-start border-4 border-warning">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-orange me-3">
                  <i className="bi bi-building-gear fs-3 text-warning" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{loading ? '...' : stats.totalDrives}</h3>
                  <span className="text-muted small">Campus Recruitment Drives</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stat-card p-3 bg-white rounded-3 shadow-sm border-start border-4 border-info">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">
                  <i className="bi bi-calendar-event fs-3 text-info" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{loading ? '...' : stats.totalEvents}</h3>
                  <span className="text-muted small">College Events & Fairs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Department Stats & Recent Drives */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold"><i className="bi bi-bar-chart-line text-primary me-2" />Department Placement Breakdown</h5>
                <Link to="/college/students" className="btn btn-sm btn-outline-primary">View Student Directory</Link>
              </div>
              <div className="card-body">
                {Object.keys(stats.departmentBreakdown || {}).length > 0 ? (
                  Object.entries(stats.departmentBreakdown).map(([dept, data]) => {
                    const pct = data.count ? Math.round((data.placed / data.count) * 100) : 0;
                    return (
                      <div className="mb-3" key={dept}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-semibold text-dark">{dept}</span>
                          <span className="small text-muted">{data.placed} / {data.count} Placed ({pct}%)</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div
                            className="progress-bar bg-success progress-bar-striped"
                            role="progressbar"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-graph-up fs-2 d-block mb-2" />
                    No department data registered yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold"><i className="bi bi-building-check text-success me-2" />Upcoming Campus Drives</h5>
                <Link to="/college/drives" className="btn btn-sm btn-link">View All</Link>
              </div>
              <div className="card-body p-0">
                {recentDrives.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {recentDrives.map(drive => (
                      <div key={drive.id} className="list-group-item p-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="fw-bold mb-0 text-primary">{drive.companyName} - {drive.role}</h6>
                          <span className="badge bg-soft-primary text-primary">{drive.mode}</span>
                        </div>
                        <p className="text-muted small mb-1"><i className="bi bi-calendar3 me-1" />Drive Date: {drive.driveDate} | Min CGPA: {drive.minCgpa}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="badge bg-light text-dark border">{drive.department}</span>
                          <span className="small text-success fw-semibold">{drive.registeredStudentsCount} Registered</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted p-3">
                    <i className="bi bi-calendar-x fs-2 d-block mb-2" />
                    No drives scheduled yet. <br />
                    <Link to="/college/drives" className="btn btn-sm btn-primary mt-2">Create First Drive</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <Link to="/college/students" className="card shadow-sm border-0 text-decoration-none p-3 h-100 hover-lift">
              <div className="d-flex align-items-center">
                <div className="p-3 bg-light text-primary rounded-3 me-3">
                  <i className="bi bi-people-fill fs-2" />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Student Management</h6>
                  <p className="text-muted small mb-0">Search & filter students by CGPA, branch, and placement status.</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link to="/college/drives" className="card shadow-sm border-0 text-decoration-none p-3 h-100 hover-lift">
              <div className="d-flex align-items-center">
                <div className="p-3 bg-light text-success rounded-3 me-3">
                  <i className="bi bi-building-gear fs-2" />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Campus Recruitment Drives</h6>
                  <p className="text-muted small mb-0">Organize placement drives and track student registrations.</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link to="/college/events" className="card shadow-sm border-0 text-decoration-none p-3 h-100 hover-lift">
              <div className="d-flex align-items-center">
                <div className="p-3 bg-light text-info rounded-3 me-3">
                  <i className="bi bi-calendar-event-fill fs-2" />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">College Career Events</h6>
                  <p className="text-muted small mb-0">Schedule career fairs, workshops, and placement prep sessions.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
