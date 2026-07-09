import { useEffect, useMemo, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { applicationApi, opportunityApi } from '../utils/api';
import { getAppRole, getSession } from '../utils/userSession';

function OpportunityDetailModal({ opportunity, organizerName, onClose, showApply, onApply, hasApplied, deadlinePassed }) {
  if (!opportunity) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{opportunity.title}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <h6 className="text-muted">Opportunity Type</h6>
                  <p>
                    <span className={`type-badge ${opportunity.type}`}>{opportunity.type}</span>
                  </p>
                  <h6 className="text-muted">Description</h6>
                  <p>{opportunity.description}</p>
                  <h6 className="text-muted">Requirements</h6>
                  <p>{opportunity.requirements || 'Not specified'}</p>
                  <h6 className="text-muted">Benefits</h6>
                  <p>{opportunity.benefits || 'Not specified'}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted">Posted By</h6>
                  <p>{organizerName}</p>
                  <h6 className="text-muted">Location</h6>
                  <p>{opportunity.location || 'Not specified'}</p>
                  <h6 className="text-muted">Deadline</h6>
                  <p>{opportunity.deadline}</p>
                  <h6 className="text-muted">Status</h6>
                  <p>
                    {deadlinePassed ? (
                      <span className="badge bg-danger">Closed</span>
                    ) : (
                      <span className="badge bg-success">Open</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              {showApply && !deadlinePassed && !hasApplied && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    onApply();
                    onClose();
                  }}
                >
                  Apply Now
                </button>
              )}
              {showApply && hasApplied && (
                <button type="button" className="btn btn-success" disabled>
                  Applied
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

export default function ViewOpportunities() {
  const session = getSession();
  const sessionRole = session?.role;
  const isOrganizerView = sessionRole === 'college' || sessionRole === 'company';
  const layoutRole = isOrganizerView ? 'organizer' : getAppRole(sessionRole || 'student');

  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState(new Set());
  const [detailOpp, setDetailOpp] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [appCounts, setAppCounts] = useState({});

  useEffect(() => {
    const params = isOrganizerView
      ? { organizerId: session?.id }
      : { forStudent: 'true' };
    opportunityApi
      .list(params)
      .then((data) => setOpportunities(data.opportunities || []))
      .catch(() => setOpportunities([]));

    if (!isOrganizerView && session?.role === 'student') {
      applicationApi
        .list()
        .then((data) => {
          const ids = new Set((data.applications || []).map((a) => a.opportunityId));
          setApplied(ids);
        })
        .catch(() => {});
    }
    if (isOrganizerView) {
      applicationApi
        .list()
        .then((data) => {
          const counts = {};
          (data.applications || []).forEach((a) => {
            counts[a.opportunityId] = (counts[a.opportunityId] || 0) + 1;
          });
          setAppCounts(counts);
        })
        .catch(() => {});
    }
  }, [isOrganizerView, session?.id, session?.role]);

  const baseOpps = useMemo(() => opportunities, [opportunities]);

  const filtered = useMemo(() => {
    let data = baseOpps;
    if (typeFilter !== 'all') {
      data = data.filter((o) => o.type === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          (o.organizerName || '').toLowerCase().includes(q),
      );
    }
    return [...data].reverse();
  }, [baseOpps, typeFilter, search]);

  const getOrganizerName = (o) => o.organizerName || 'Unknown';

  const handleApply = async (oppId) => {
    try {
      const form = new FormData();
      form.append('opportunityId', oppId);
      await applicationApi.create(form);
      setApplied((prev) => new Set(prev).add(oppId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AppLayout role={layoutRole}>
      <div className="page-header">
        <div>
          <h2 className="page-title">{isOrganizerView ? 'My Posted Opportunities' : 'Opportunities'}</h2>
          <p className="page-subtitle">
            {isOrganizerView
              ? 'View your posted opportunities, application counts, and posting details'
              : 'Browse internships, jobs, hackathons & events tailored for you'}
          </p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="row g-3">
          <div className="col-lg-3 col-md-4 col-sm-12">
            <div className="filter-group">
              <label htmlFor="typeFilter">Type</label>
              <select
                id="typeFilter"
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="hackathon">Hackathon</option>
                <option value="internship">Internship</option>
                <option value="job">Job</option>
                <option value="event">Event</option>
              </select>
            </div>
          </div>
          <div className="col-lg-6 col-md-5 col-sm-12">
            <div className="filter-group">
              <label htmlFor="searchBox">Search</label>
              <input
                type="text"
                id="searchBox"
                className="form-control"
                placeholder="Search opportunities by title, type or organizer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-12">
            <div className="filter-group">
              <label>&nbsp;</label>
              <button type="button" className="btn btn-primary w-100">
                <i className="bi bi-funnel" /> Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="opportunity-list" id="opportunityList">
        {!filtered.length ? (
          <div className="opportunity-empty">
            <i className="bi bi-inbox" />
            <p>No opportunities found</p>
          </div>
        ) : (
          filtered.map((o) => {
            const organizerName = getOrganizerName(o);
            const deadlinePassed = new Date(o.deadline) < new Date() || o.status === 'closed';
            const hasApplied = applied.has(o.id);
            const appCount = appCounts[o.id] || 0;
            const reviewLabel =
              o.reviewStatus === 'approved'
                ? 'Approved'
                : o.reviewStatus === 'rejected'
                  ? 'Rejected'
                  : 'Pending Review';

            return (
              <article key={o.id} className="opportunity-list-item">
                <div className="opportunity-list-main">
                  <div className="opportunity-list-header">
                    <h3>{o.title}</h3>
                    <span className={`type-badge ${o.type}`}>{o.type}</span>
                  </div>
                  <p className="opportunity-list-desc">{o.description}</p>
                  <div className="opportunity-list-meta">
                    <span>
                      <i className="bi bi-building" /> {organizerName}
                    </span>
                    <span>
                      <i className="bi bi-geo-alt" /> {o.location || 'Not specified'}
                    </span>
                    <span>
                      <i className="bi bi-calendar-event" /> Deadline: {o.deadline}
                    </span>
                    {isOrganizerView && (
                      <span>
                        <i className="bi bi-people-fill" /> {appCount} Application{appCount !== 1 ? 's' : ''}
                      </span>
                    )}
                    {isOrganizerView && (
                      <span className={`badge ${o.reviewStatus === 'approved' ? 'bg-success' : o.reviewStatus === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                        {reviewLabel}
                      </span>
                    )}
                    {deadlinePassed && <span className="badge bg-danger">Closed</span>}
                  </div>
                </div>

                <div className="opportunity-list-actions">
                  {!isOrganizerView && !deadlinePassed && (
                    hasApplied ? (
                      <button type="button" className="btn btn-success opportunity-btn" disabled>
                        <i className="bi bi-check-circle" /> Applied
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary opportunity-btn"
                        onClick={() => handleApply(o.id)}
                      >
                        Apply Now
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-primary opportunity-btn"
                    onClick={() => setDetailOpp(o)}
                  >
                    <i className="bi bi-eye" /> View Details
                  </button>
                  {isOrganizerView && (
                    <button type="button" className="btn btn-outline-secondary opportunity-btn">
                      <i className="bi bi-pencil" /> Edit Post
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {detailOpp && (
        <OpportunityDetailModal
          opportunity={detailOpp}
          organizerName={getOrganizerName(detailOpp)}
          onClose={() => setDetailOpp(null)}
          showApply={!isOrganizerView}
          onApply={() => handleApply(detailOpp.id)}
          hasApplied={applied.has(detailOpp.id)}
          deadlinePassed={new Date(detailOpp.deadline) < new Date() || detailOpp.status === 'closed'}
        />
      )}
    </AppLayout>
  );
}
