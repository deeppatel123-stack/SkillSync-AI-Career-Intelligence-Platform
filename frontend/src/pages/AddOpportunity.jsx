import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { opportunityApi } from '../utils/api';

export default function AddOpportunity() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await opportunityApi.create({
        title: e.target.title.value.trim(),
        type: e.target.type.value,
        description: e.target.description.value.trim(),
        deadline: e.target.deadline.value,
        location: e.target.location.value.trim(),
        requirements: e.target.requirements.value.trim(),
        benefits: e.target.benefits.value.trim(),
      });
      navigate('/organizer/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout role="organizer">
      <div className="form-container mt-4">
        <div className="post-header">
          <i className="bi bi-plus-circle" />
          <span>Post New Opportunity</span>
        </div>
        <div className="form-card">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">
                Title <span className="required">*</span>
              </label>
              <input type="text" id="title" placeholder="e.g., Summer Internship Program 2024" required />
            </div>

            <div className="form-group">
              <label htmlFor="type">
                Opportunity Type <span className="required">*</span>
              </label>
              <select id="type" required defaultValue="">
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
              <textarea
                id="description"
                placeholder="Provide detailed information about this opportunity..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deadline">
                  Application Deadline <span className="required">*</span>
                </label>
                <input type="date" id="deadline" required min={today} />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input type="text" id="location" placeholder="e.g., Remote, On-site, Hybrid" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Requirements</label>
              <textarea id="requirements" placeholder="List the requirements, qualifications, or prerequisites..." />
            </div>

            <div className="form-group">
              <label htmlFor="benefits">Benefits/Perks</label>
              <textarea id="benefits" placeholder="List benefits, perks, or what participants will gain..." />
            </div>

            <div className="form-actions mt-4">
              <button type="submit" className="btn-primary-custom" disabled={loading}>
                <i className="bi bi-check-circle" /> {loading ? 'Posting...' : 'Post Opportunity'}
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
