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
        {/* Clean Placement Cell Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
          <div>
            <h3 className="fw-bold mb-1 text-dark">
              {currentUser.organization || currentUser.name} Placement Cell
            </h3>
            <p className="text-muted mb-0">Academic Student Opportunity & Campus Recruitment Portal</p>
          </div>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <Link to="/college/drives" className="btn btn-primary btn-sm fw-semibold px-3">
              <i className="bi bi-plus-lg me-1" /> New Campus Drive
            </Link>
            <Link to="/opportunities/add" className="btn btn-outline-secondary btn-sm fw-semibold px-3">
              <i className="bi bi-megaphone me-1" /> Post Opportunity
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="card-box p-3 shadow-sm h-100 d-flex align-items-center">
              <div className="stat-icon icon-blue me-3">
                <i className="bi bi-people-fill" />
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-primary">{loading ? '...' : stats.totalStudents}</h3>
                <span className="text-muted small fw-medium">Registered Students</span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card-box p-3 shadow-sm h-100 d-flex align-items-center">
              <div className="stat-icon icon-green me-3">
                <i className="bi bi-trophy-fill" />
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-primary">{loading ? '...' : `${stats.placementRate}%`}</h3>
                <span className="text-muted small fw-medium">Placement Rate ({stats.placedStudents} Placed)</span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card-box p-3 shadow-sm h-100 d-flex align-items-center">
              <div className="stat-icon icon-orange me-3">
                <i className="bi bi-building-gear" />
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-primary">{loading ? '...' : stats.totalDrives}</h3>
                <span className="text-muted small fw-medium">Recruitment Drives</span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card-box p-3 shadow-sm h-100 d-flex align-items-center">
              <div className="stat-icon icon-blue me-3">
                <i className="bi bi-calendar-event" />
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-primary">{loading ? '...' : stats.totalEvents}</h3>
                <span className="text-muted small fw-medium">Events & Fairs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Department Stats & Recent Drives */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div className="card-box shadow-sm h-100 p-3">
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-bar-chart-line text-primary me-2" />
                  Department Placement Breakdown
                </h5>
                <Link to="/college/students" className="btn btn-sm btn-outline-primary fw-semibold">
                  View Student Directory
                </Link>
              </div>
              <div>
                {Object.keys(stats.departmentBreakdown || {}).length > 0 ? (
                  Object.entries(stats.departmentBreakdown).map(([dept, data]) => {
                    const pct = data.count ? Math.round((data.placed / data.count) * 100) : 0;
                    return (
                      <div className="mb-3" key={dept}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-semibold">{dept}</span>
                          <span className="small text-muted">{data.placed} / {data.count} Placed ({pct}%)</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-graph-up fs-2 d-block mb-2 text-muted" />
                    No department data registered yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card-box shadow-sm h-100 p-3">
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-building-check text-primary me-2" />
                  Upcoming Campus Drives
                </h5>
                <Link to="/college/drives" className="btn btn-sm btn-link text-decoration-none">View All</Link>
              </div>
              <div>
                {recentDrives.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {recentDrives.map(drive => (
                      <div key={drive.id} className="list-group-item bg-transparent px-0 py-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="fw-bold mb-0 text-primary">{drive.companyName} - {drive.role}</h6>
                          <span className="badge bg-primary-subtle text-primary">{drive.mode}</span>
                        </div>
                        <p className="text-muted small mb-1"><i className="bi bi-calendar3 me-1" />Drive Date: {drive.driveDate} | Min CGPA: {drive.minCgpa}</p>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span className="badge bg-light text-dark border">{drive.department}</span>
                          <span className="small text-success fw-semibold">{drive.registeredStudentsCount} Registered</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-calendar-x fs-2 d-block mb-2 text-muted" />
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
            <Link to="/college/students" className="card-box shadow-sm text-decoration-none p-3 h-100 d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-blue me-3">
                  <i className="bi bi-people-fill" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Student Management</h6>
                  <p className="text-muted small mb-0">Search & filter students by CGPA, branch, and placement status.</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link to="/college/drives" className="card-box shadow-sm text-decoration-none p-3 h-100 d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-green me-3">
                  <i className="bi bi-building-gear" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Campus Recruitment Drives</h6>
                  <p className="text-muted small mb-0">Organize placement drives and track student registrations.</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link to="/college/events" className="card-box shadow-sm text-decoration-none p-3 h-100 d-block">
              <div className="d-flex align-items-center">
                <div className="stat-icon icon-orange me-3">
                  <i className="bi bi-calendar-event-fill" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">College Career Events</h6>
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
