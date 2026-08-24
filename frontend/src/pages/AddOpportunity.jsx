import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { opportunityApi } from '../utils/api';
import { getSession, getDashboardPath } from '../utils/userSession';

export default function AddOpportunity() {
  const navigate = useNavigate();
  const session = getSession();
  const role = session?.role || 'company';
  const { id } = useParams();
  const isEdit = Boolean(id);
  const today = new Date().toISOString().split('T')[0];
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [form, setForm] = useState({
    title: '', type: '', description: '', deadline: '',
    location: '', requirements: '', benefits: '',
  });

  useEffect(() => {
    if (!id) return;
    opportunityApi.get(id)
      .then((data) => {
        const o = data.opportunity || data;
        setForm({
          title: o.title || '',
          type: o.type || '',
          description: o.description || '',
          deadline: o.deadline ? o.deadline.split('T')[0] : '',
          location: o.location || '',
          requirements: o.requirements || '',
          benefits: o.benefits || '',
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await opportunityApi.update(id, form);
      } else {
        await opportunityApi.create(form);
      }
      navigate(getDashboardPath(role));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AppLayout role={role}>
        <div className="form-container mt-4">
          <div className="ai-loading"><i className="bi bi-arrow-repeat" /> Loading opportunity...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role={role}>
      <div className="form-container mt-4">
        <div className="post-header">
          <i className={`bi ${isEdit ? 'bi-pencil' : 'bi-plus-circle'}`} />
          <span>{isEdit ? 'Edit Opportunity' : 'Post New Opportunity'}</span>
        </div>
        <div className="form-card">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">
                Title <span className="required">*</span>
              </label>
              <input type="text" id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g., Summer Internship Program 2024" required />
            </div>

            <div className="form-group">
              <label htmlFor="type">
                Opportunity Type <span className="required">*</span>
              </label>
              <select id="type" name="type" value={form.type} onChange={handleChange} required>
                <option value="">Select type</option>
                <option value="hackathon">Hackathon</option>
                <option value="internship">Internship</option>
                <option value="job">Job</option>
                <option value="event">Event</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description <span className="required">*</span>
              </label>
              <textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Provide detailed information about this opportunity..." required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deadline">
                  Application Deadline <span className="required">*</span>
                </label>
                <input type="date" id="deadline" name="deadline" value={form.deadline} onChange={handleChange} required min={today} />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input type="text" id="location" name="location" value={form.location} onChange={handleChange} placeholder="e.g., Remote, On-site, Hybrid" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Requirements</label>
              <textarea id="requirements" name="requirements" value={form.requirements} onChange={handleChange} placeholder="List the requirements, qualifications, or prerequisites..." />
            </div>

            <div className="form-group">
              <label htmlFor="benefits">Benefits/Perks</label>
              <textarea id="benefits" name="benefits" value={form.benefits} onChange={handleChange} placeholder="List benefits, perks, or what participants will gain..." />
            </div>

            <div className="form-actions mt-4">
              <button type="submit" className="btn-primary-custom" disabled={loading || fetching}>
                <i className="bi bi-check-circle" /> {loading ? (isEdit ? 'Updating...' : 'Posting...') : (isEdit ? 'Update Opportunity' : 'Post Opportunity')}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                <i className="bi bi-x-circle" /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
