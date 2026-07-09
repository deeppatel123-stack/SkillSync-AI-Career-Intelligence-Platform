import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { aiApi } from '../utils/aiApi';
import '../styles/ai.css';

export default function ResumeScore() {
  const [formData, setFormData] = useState({
    skills: '',
    projects: '',
    internships: '',
    certifications: '',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const toList = (str) => str.split(',').map((s) => s.trim()).filter(Boolean);

      const data = await aiApi.scoreResume({
        skills: toList(formData.skills),
        projects: toList(formData.projects),
        internships: toList(formData.internships),
        certifications: toList(formData.certifications),
      });
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getGradeClass(grade) {
    if (grade === 'A') return 'ai-badge-success';
    if (grade === 'B') return 'ai-badge-info';
    if (grade === 'C') return 'ai-badge-warning';
    return 'ai-badge-danger';
  }

  return (
    <AppLayout role="student">
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="ai-card">
              <div className="ai-card-header">
                <i className="bi bi-file-earmark-text" />
                <div>
                  <h3>Resume Score</h3>
                  <p>Get your resume evaluated by AI</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="ai-form-label">Skills (comma separated)</label>
                    <input
                      type="text"
                      className="ai-form-input"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="Python, JavaScript, React"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ai-form-label">Projects (comma separated)</label>
                    <input
                      type="text"
                      className="ai-form-input"
                      name="projects"
                      value={formData.projects}
                      onChange={handleChange}
                      placeholder="E-commerce, Chat App, Portfolio"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ai-form-label">Internships (comma separated)</label>
                    <input
                      type="text"
                      className="ai-form-input"
                      name="internships"
                      value={formData.internships}
                      onChange={handleChange}
                      placeholder="Google, Microsoft"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ai-form-label">Certifications (comma separated)</label>
                    <input
                      type="text"
                      className="ai-form-input"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      placeholder="AWS, Google Analytics"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="ai-btn-primary mt-4"
                  disabled={loading}
                >
                  {loading ? 'Scoring...' : 'Score My Resume'}
                </button>
              </form>

              {error && <div className="ai-error">{error}</div>}

              {loading && (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Evaluating your resume...
                </div>
              )}

              {result && !result.error && (
                <div className="ai-result-box">
                  <h4 className="ai-result-title">Resume Score</h4>

                  <div className="text-center mb-3">
                    <div className={`ai-score-circle ${result.total_score >= 70 ? 'ai-score-high' : result.total_score >= 40 ? 'ai-score-medium' : 'ai-score-low'}`}>
                      {result.total_score}
                    </div>
                    <p className="mt-2">
                      Grade: <span className={`ai-badge ${getGradeClass(result.grade)}`}>{result.grade}</span>
                    </p>
                  </div>

                  <div className="ai-result-item">
                    <span className="ai-result-label">Skills Score</span>
                    <span className="ai-result-value">{result.breakdown.skills}</span>
                  </div>
                  <div className="ai-result-item">
                    <span className="ai-result-label">Projects Score</span>
                    <span className="ai-result-value">{result.breakdown.projects}</span>
                  </div>
                  <div className="ai-result-item">
                    <span className="ai-result-label">Internships Score</span>
                    <span className="ai-result-value">{result.breakdown.internships}</span>
                  </div>
                  <div className="ai-result-item">
                    <span className="ai-result-label">Certifications Score</span>
                    <span className="ai-result-value">{result.breakdown.certifications}</span>
                  </div>
                  <div className="ai-result-item">
                    <span className="ai-result-label">Resume Completion</span>
                    <span className="ai-result-value">{result.resume_completion}%</span>
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
