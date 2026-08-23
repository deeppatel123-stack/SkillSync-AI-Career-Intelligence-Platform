import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { collegeApi } from '../utils/api';
import { getSession } from '../utils/userSession';

export default function CampusDrives() {
  const session = getSession();
  const role = session?.role || 'student';
  const isCollege = role === 'college' || role === 'superadmin';
  
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    type: 'placement',
    companyName: '',
    role: '',
    department: 'All Departments',
    minCgpa: '0',
    requiredSkills: '',
    driveDate: '',
    deadline: '',
    mode: 'on-campus',
    venue: '',
    selectionProcess: 'Aptitude Test -> Technical Interview -> HR Round',
  });

  const loadDrives = () => {
    setLoading(true);
    collegeApi.getDrives()
      .then(res => {
        if (res.success) setDrives(res.drives || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDrives();
  }, []);

  const handleCreateDrive = (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    collegeApi.createDrive(form)
      .then(res => {
        if (res.success) {
          setMsg('Campus drive created successfully!');
          setShowModal(false);
          setForm({
            title: '', type: 'placement', companyName: '', role: '',
            department: 'All Departments', minCgpa: '0', requiredSkills: '',
            driveDate: '', deadline: '', mode: 'on-campus', venue: '',
            selectionProcess: 'Aptitude Test -> Technical Interview -> HR Round',
          });
          loadDrives();
        }
      })
      .catch(err => setError(err.message || 'Failed to create drive'));
  };

  const handleRegister = (driveId) => {
    setMsg('');
    setError('');
    collegeApi.registerDrive(driveId)
      .then(res => {
        if (res.success) {
          setMsg('Registered for campus drive successfully!');
          loadDrives();
        }
      })
      .catch(err => setError(err.message || 'Registration failed'));
  };

  const handleDelete = (driveId) => {
    if (!window.confirm('Are you sure you want to delete this drive?')) return;
    collegeApi.deleteDrive(driveId)
      .then(res => {
        if (res.success) {
          setMsg('Drive deleted successfully.');
          loadDrives();
        }
      })
      .catch(err => setError(err.message || 'Could not delete drive'));
  };

  return (
    <AppLayout role={role}>
      <div className="container-fluid px-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1"><i className="bi bi-building-gear text-primary me-2" />Campus Recruitment Drives</h3>
            <p className="text-muted mb-0">Placement drives, company visits, and internship drives</p>
          </div>
          {isCollege && (
            <button className="btn btn-primary fw-semibold" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-lg me-1" /> Post Campus Drive
            </button>
          )}
        </div>

        {msg && <div className="alert alert-success alert-dismissible fade show">{msg}</div>}
        {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}

        {/* Drives List */}
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : drives.length > 0 ? (
          <div className="row g-4">
            {drives.map(d => {
              const studentCgpa = parseFloat(session?.cgpa || '0');
              const eligibleCgpa = studentCgpa >= d.minCgpa;
              return (
                <div key={d.id} className="col-lg-6">
                  <div className="card shadow-sm border-0 h-100 p-3 position-relative">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge bg-soft-primary text-primary text-uppercase me-2">{d.type}</span>
                        <span className="badge bg-light text-dark border">{d.mode}</span>
                        <h4 className="fw-bold text-dark mt-2 mb-1">{d.companyName}</h4>
                        <h6 className="text-primary mb-0">{d.role}</h6>
                      </div>
                      {isCollege && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(d.id)}>
                          <i className="bi bi-trash" />
                        </button>
                      )}
                    </div>

                    <div className="row g-2 my-2 bg-light p-2 rounded text-muted small">
                      <div className="col-6"><i className="bi bi-diagram-2 me-1" />Dept: <strong>{d.department}</strong></div>
                      <div className="col-6"><i className="bi bi-award me-1" />Min CGPA: <strong>{d.minCgpa}</strong></div>
                      <div className="col-6"><i className="bi bi-calendar-event me-1" />Drive Date: <strong>{d.driveDate}</strong></div>
                      <div className="col-6"><i className="bi bi-clock-history me-1" />Deadline: <strong>{d.deadline}</strong></div>
                    </div>

                    {d.requiredSkills && d.requiredSkills.length > 0 && (
                      <div className="mb-2">
                        <span className="small text-muted me-2">Required Skills:</span>
                        {d.requiredSkills.map(s => <span key={s} className="badge bg-secondary me-1">{s}</span>)}
                      </div>
                    )}

                    <p className="small text-muted mb-3"><i className="bi bi-gear-wide-connected me-1" />Process: {d.selectionProcess}</p>

                    <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                      <span className="small text-success fw-semibold"><i className="bi bi-people me-1" />{d.registeredStudentsCount} Registered</span>
                      {!isCollege && (
                        eligibleCgpa ? (
                          <button className="btn btn-sm btn-success fw-semibold" onClick={() => handleRegister(d.id)}>
                            <i className="bi bi-check-circle me-1" /> Register Now
                          </button>
                        ) : (
                          <span className="badge bg-warning text-dark"><i className="bi bi-exclamation-triangle me-1" />Min CGPA {d.minCgpa} Required</span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card border-0 shadow-sm text-center py-5">
            <i className="bi bi-building-x fs-1 text-muted d-block mb-2" />
            <h5>No Campus Drives Posted Yet</h5>
            <p className="text-muted">Check back soon for upcoming company placement drives.</p>
          </div>
        )}

        {/* Create Drive Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Post New Campus Recruitment Drive</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <form onSubmit={handleCreateDrive}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Drive Title</label>
                        <input type="text" className="form-control" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. TCS CodeVita Campus Drive 2026" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Company Name</label>
                        <input type="text" className="form-control" required value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} placeholder="e.g. Tata Consultancy Services" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Role Offered</label>
                        <input type="text" className="form-control" required value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. System Engineer" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Drive Type</label>
                        <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                          <option value="placement">Full-time Placement</option>
                          <option value="internship">Internship Drive</option>
                          <option value="company_visit">Company Visit</option>
                          <option value="drive">Pool Drive</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Eligible Department</label>
                        <input type="text" className="form-control" value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="CSE, IT, ECE or All" />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Minimum CGPA</label>
                        <input type="number" step="0.1" className="form-control" value={form.minCgpa} onChange={e => setForm({...form, minCgpa: e.target.value})} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Mode</label>
                        <select className="form-select" value={form.mode} onChange={e => setForm({...form, mode: e.target.value})}>
                          <option value="on-campus">On Campus</option>
                          <option value="online">Online / Remote</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Drive Date</label>
                        <input type="date" className="form-control" required value={form.driveDate} onChange={e => setForm({...form, driveDate: e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Application Deadline</label>
                        <input type="date" className="form-control" required value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Required Skills (Comma separated)</label>
                        <input type="text" className="form-control" value={form.requiredSkills} onChange={e => setForm({...form, requiredSkills: e.target.value})} placeholder="Java, Python, SQL, DSA" />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Create Campus Drive</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
