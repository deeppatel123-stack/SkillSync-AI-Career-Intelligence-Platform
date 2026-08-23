import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { interviewApi } from '../utils/api';
import { getSession } from '../utils/userSession';

export default function InterviewsPage() {
  const session = getSession();
  const role = session?.role || 'student';
  const isRecruiter = role === 'company' || role === 'superadmin';

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const loadInterviews = () => {
    setLoading(true);
    interviewApi.list()
      .then(res => {
        if (res.success) setInterviews(res.interviews || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    interviewApi.updateStatus(id, { status: newStatus })
      .then(res => {
        if (res.success) {
          setMsg(`Interview marked as ${newStatus}`);
          loadInterviews();
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <AppLayout role={role}>
      <div className="container-fluid px-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1"><i className="bi bi-calendar-check text-primary me-2" />Scheduled Interviews & Agenda</h3>
            <p className="text-muted mb-0">Upcoming technical, HR, and screening interviews</p>
          </div>
        </div>

        {msg && <div className="alert alert-success alert-dismissible fade show">{msg}</div>}

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : interviews.length > 0 ? (
          <div className="row g-4">
            {interviews.map(inv => (
              <div key={inv.id} className="col-lg-6">
                <div className="card shadow-sm border-0 h-100 p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-soft-primary text-primary text-uppercase me-2">{inv.interviewType} Round</span>
                      <span className={`badge ${inv.status === 'completed' ? 'bg-success' : inv.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                        {inv.status}
                      </span>
                      <h4 className="fw-bold text-dark mt-2 mb-1">{inv.jobTitle}</h4>
                      <h6 className="text-muted mb-0"><i className="bi bi-building me-1" />{inv.companyName}</h6>
                    </div>
                    {isRecruiter && (
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light border" type="button" data-bs-toggle="dropdown">
                          <i className="bi bi-three-dots-vertical" />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li><button className="dropdown-item" onClick={() => handleUpdateStatus(inv.id, 'completed')}>Mark Completed</button></li>
                          <li><button className="dropdown-item text-danger" onClick={() => handleUpdateStatus(inv.id, 'cancelled')}>Cancel Interview</button></li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="bg-light p-3 rounded my-3">
                    <div className="row g-2 text-muted small">
                      <div className="col-6"><i className="bi bi-person me-1" />Candidate: <strong>{inv.studentName}</strong></div>
                      <div className="col-6"><i className="bi bi-person-badge me-1" />Interviewer: <strong>{inv.interviewerName}</strong></div>
                      <div className="col-12"><i className="bi bi-calendar3 me-1" />Scheduled At: <strong className="text-dark">{new Date(inv.scheduledAt).toLocaleString()}</strong></div>
                    </div>
                  </div>

                  {inv.notes && <p className="small text-muted mb-3"><strong>Notes:</strong> {inv.notes}</p>}

                  <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                    {inv.meetingLink ? (
                      <a href={inv.meetingLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm fw-semibold">
                        <i className="bi bi-camera-video me-1" /> Join Interview Call
                      </a>
                    ) : (
                      <span className="small text-muted"><i className="bi bi-link-45deg me-1" />Link will be updated prior to call</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card border-0 shadow-sm text-center py-5">
            <i className="bi bi-calendar-x fs-1 text-muted d-block mb-2" />
            <h5>No Scheduled Interviews</h5>
            <p className="text-muted">You have no upcoming scheduled interviews at this time.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
