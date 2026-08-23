import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { collegeApi } from '../utils/api';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [department, setDepartment] = useState('all');
  const [semester, setSemester] = useState('all');
  const [minCgpa, setMinCgpa] = useState('');
  const [placementStatus, setPlacementStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadStudents = () => {
    setLoading(true);
    collegeApi.getStudents({ department, semester, minCgpa, placementStatus, search })
      .then(res => {
        if (res.success) setStudents(res.students || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudents();
  }, [department, semester, minCgpa, placementStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadStudents();
  };

  return (
    <AppLayout role="college">
      <div className="container-fluid px-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1"><i className="bi bi-people-fill text-primary me-2" />Student Directory & Placement Management</h3>
            <p className="text-muted mb-0">View student profiles, academic performance, and placement status</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="card shadow-sm border-0 mb-4 p-3 bg-white">
          <form onSubmit={handleSearchSubmit} className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Search Student / Skill</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name, email, or skill..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button className="btn btn-primary" type="submit"><i className="bi bi-search" /></button>
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">Department / Branch</label>
              <select className="form-select" value={department} onChange={e => setDepartment(e.target.value)}>
                <option value="all">All Departments</option>
                <option value="Computer Science">Computer Science / IT</option>
                <option value="Electronics">Electronics / ECE</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold text-muted">Semester</label>
              <select className="form-select" value={semester} onChange={e => setSemester(e.target.value)}>
                <option value="all">All Semesters</option>
                <option value="Sem 1">Sem 1</option>
                <option value="Sem 2">Sem 2</option>
                <option value="Sem 3">Sem 3</option>
                <option value="Sem 4">Sem 4</option>
                <option value="Sem 5">Sem 5</option>
                <option value="Sem 6">Sem 6</option>
                <option value="Sem 7">Sem 7</option>
                <option value="Sem 8">Sem 8</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold text-muted">Min CGPA</label>
              <input
                type="number"
                step="0.5"
                className="form-control"
                placeholder="e.g. 7.5"
                value={minCgpa}
                onChange={e => setMinCgpa(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold text-muted">Placement Status</label>
              <select className="form-select" value={placementStatus} onChange={e => setPlacementStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="unplaced">Unplaced</option>
                <option value="placed">Placed</option>
                <option value="seeking">Seeking Opportunities</option>
              </select>
            </div>
          </form>
        </div>

        {/* Student List Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3">
            <h6 className="fw-bold mb-0 text-dark"><i className="bi bi-list-stars me-2" />Registered Students ({students.length})</h6>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
            ) : students.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Student</th>
                      <th>Department & Semester</th>
                      <th>CGPA</th>
                      <th>Skills</th>
                      <th>Placement Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div className="fw-bold text-dark">{s.name}</div>
                          <span className="small text-muted">{s.email}</span>
                        </td>
                        <td>
                          <div>{s.branch || s.degree || 'General'}</div>
                          <span className="small text-muted">{s.semester || 'N/A'}</span>
                        </td>
                        <td>
                          <span className={`badge ${parseFloat(s.cgpa || '0') >= 8.0 ? 'bg-success' : 'bg-primary'}`}>
                            {s.cgpa || 'N/A'}
                          </span>
                        </td>
                        <td>
                          {(s.skills || []).slice(0, 3).map(sk => (
                            <span key={sk} className="badge bg-light text-dark border me-1">{sk}</span>
                          ))}
                          {(s.skills || []).length > 3 && <span className="small text-muted">+{s.skills.length - 3}</span>}
                        </td>
                        <td>
                          {s.placementStatus === 'placed' ? (
                            <span className="badge bg-success"><i className="bi bi-check-circle me-1" />Placed</span>
                          ) : s.placementStatus === 'seeking' ? (
                            <span className="badge bg-warning text-dark"><i className="bi bi-search me-1" />Seeking</span>
                          ) : (
                            <span className="badge bg-secondary">Unplaced</span>
                          )}
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedStudent(s)}>
                            <i className="bi bi-eye me-1" /> View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-person-x fs-1 d-block mb-2" />
                No student profiles matching the search criteria.
              </div>
            )}
          </div>
        </div>

        {/* Student Profile Preview Modal */}
        {selectedStudent && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold"><i className="bi bi-person-badge me-2" />Student Profile - {selectedStudent.name}</h5>
                  <button className="btn-close" onClick={() => setSelectedStudent(null)} />
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Email:</strong> {selectedStudent.email}</p>
                      <p className="mb-1"><strong>Phone:</strong> {selectedStudent.phone || 'N/A'}</p>
                      <p className="mb-1"><strong>Department:</strong> {selectedStudent.branch || 'N/A'}</p>
                      <p className="mb-1"><strong>Degree & Semester:</strong> {selectedStudent.degree} - {selectedStudent.semester}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1"><strong>CGPA:</strong> {selectedStudent.cgpa || 'N/A'}</p>
                      <p className="mb-1"><strong>Passing Year:</strong> {selectedStudent.passingYear || 'N/A'}</p>
                      <p className="mb-1"><strong>Placement Status:</strong> <span className="badge bg-info text-capitalize">{selectedStudent.placementStatus}</span></p>
                    </div>
                    <div className="col-12 border-top pt-3">
                      <h6>Skills</h6>
                      {(selectedStudent.skills || []).map(s => <span key={s} className="badge bg-primary me-1 mb-1">{s}</span>)}
                    </div>
                    <div className="col-12 border-top pt-3">
                      <h6>Projects ({(selectedStudent.projects || []).length})</h6>
                      {(selectedStudent.projects || []).map((p, idx) => (
                        <div key={idx} className="p-2 bg-light rounded mb-2">
                          <strong>{p.title}</strong>
                          <p className="small text-muted mb-0">{p.technologies}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedStudent(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
