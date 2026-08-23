import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { userApi } from '../utils/api';

export default function SavedOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = () => {
    setLoading(true);
    userApi.getSaved()
      .then(res => {
        if (res.success) setOpportunities(res.opportunities || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleUnsave = (id) => {
    userApi.unsaveOpportunity(id)
      .then(res => {
        if (res.success) loadSaved();
      })
      .catch(err => console.error(err));
  };

  return (
    <AppLayout role="student">
      <div className="container-fluid px-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1"><i className="bi bi-bookmark-star-fill text-warning me-2" />Saved Opportunities</h3>
            <p className="text-muted mb-0">Bookmarked jobs, internships, and hackathons</p>
          </div>
          <Link to="/opportunities" className="btn btn-primary btn-sm">
            <i className="bi bi-search me-1" /> Browse All Opportunities
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : opportunities.length > 0 ? (
          <div className="row g-4">
            {opportunities.map(o => (
              <div key={o.id} className="col-lg-6">
                <div className="card shadow-sm border-0 h-100 p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-soft-primary text-primary text-uppercase me-2">{o.type}</span>
                      <h4 className="fw-bold text-dark mt-2 mb-1">{o.title}</h4>
                      <h6 className="text-muted mb-0"><i className="bi bi-building me-1" />{o.organizerName || 'Organization'}</h6>
                    </div>
                    <button className="btn btn-sm btn-outline-warning" onClick={() => handleUnsave(o.id)} title="Remove bookmark">
                      <i className="bi bi-bookmark-fill" />
                    </button>
                  </div>

                  <p className="text-muted small my-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {o.description}
                  </p>

                  <div className="row g-2 text-muted small bg-light p-2 rounded mb-3">
                    <div className="col-6"><i className="bi bi-geo-alt me-1" />{o.location || 'Remote'}</div>
                    <div className="col-6"><i className="bi bi-calendar-event me-1" />Deadline: {o.deadline}</div>
                  </div>

                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="badge bg-success text-uppercase">{o.status}</span>
                    <Link to={`/opportunities`} className="btn btn-sm btn-primary">
                      Apply Now <i className="bi bi-arrow-right ms-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card border-0 shadow-sm text-center py-5">
            <i className="bi bi-bookmark-x fs-1 text-muted d-block mb-2" />
            <h5>No Saved Opportunities</h5>
            <p className="text-muted">You haven't saved any opportunities yet. Browse opportunities and click the bookmark icon to save them for later.</p>
            <div className="mt-2">
              <Link to="/opportunities" className="btn btn-primary btn-sm">Explore Opportunities</Link>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
