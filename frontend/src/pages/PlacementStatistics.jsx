import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { aiApi } from '../utils/aiApi';
import '../styles/ai.css';

export default function PlacementStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    aiApi.getPlacementStatistics()
      .then((data) => {
        setStats(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <AppLayout role="organizer">
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="ai-card">
              <div className="ai-card-header">
                <i className="bi bi-bar-chart-fill" />
                <div>
                  <h3>Placement Statistics</h3>
                  <p>Real placement data from registered students</p>
                </div>
              </div>

              {loading && (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Loading statistics...
                </div>
              )}

              {error && <div className="ai-error">{error}</div>}

              {stats && !stats.error && (
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="stat-card">
                      <div className="stat-icon icon-blue">
                        <i className="bi bi-people-fill" />
                      </div>
                      <div className="stat-info">
                        <h3>{stats.total_students}</h3>
                        <p>Total Students</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <div className="stat-icon icon-green">
                        <i className="bi bi-check-circle-fill" />
                      </div>
                      <div className="stat-info">
                        <h3>{stats.placed_students}</h3>
                        <p>Placed Students</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <div className="stat-icon icon-orange">
                        <i className="bi bi-graph-up-arrow" />
                      </div>
                      <div className="stat-info">
                        <h3>{stats.placement_percentage}%</h3>
                        <p>Placement Rate</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <div className="stat-icon icon-blue">
                        <i className="bi bi-cpu" />
                      </div>
                      <div className="stat-info">
                        <h3>{stats.avg_cgpa}</h3>
                        <p>Average CGPA</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <div className="stat-icon icon-purple">
                        <i className="bi bi-file-text-fill" />
                      </div>
                      <div className="stat-info">
                        <h3>{stats.total_applications}</h3>
                        <p>Total Applications</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <div className="stat-icon icon-green">
                        <i className="bi bi-star-fill" />
                      </div>
                      <div className="stat-info">
                        <h3>{stats.avg_skills_per_student}</h3>
                        <p>Avg Skills / Student</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
