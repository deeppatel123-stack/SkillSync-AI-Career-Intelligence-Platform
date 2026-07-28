import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import SkillSelector from '../components/SkillSelector';
import { aiApi } from '../utils/aiApi';
import { getSession } from '../utils/userSession';
import '../styles/ai.css';

export default function SkillGapAnalysis() {
  const [skills, setSkills] = useState([]);
  const [targetRole, setTargetRole] = useState('');
  const [careers, setCareers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    aiApi.getCareers()
      .then((data) => setCareers(data.data || []))
      .catch(() => {});
    const session = getSession();
    if (!session) return;
    aiApi.getStudentProfile()
      .then((data) => {
        if (data.data?.skills?.length) setSkills(data.data.skills);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await aiApi.analyzeSkillGap({
        skills,
        targetRole,
      });
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getPriorityBadge(priority) {
    if (!priority) return '';
    const p = priority.toLowerCase();
    if (p === 'high') return 'ai-badge-danger';
    if (p === 'medium') return 'ai-badge-warning';
    return 'ai-badge-success';
  }

  return (
    <AppLayout role="student">
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="ai-card">
              <div className="ai-card-header">
                <i className="bi bi-exclamation-triangle" />
                <div>
                  <h3>Skill Gap Analysis</h3>
                  <p>Compare your current skills against what is required for your target career role</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="ai-form-label">Target Career Role *</label>
                    <select
                      className="ai-form-input"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      required
                    >
                      <option value="">Select a role...</option>
                      {careers.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <SkillSelector value={skills} onChange={setSkills} />
                    <p className="text-muted mt-2" style={{ fontSize: 13 }}>
                      Your skills are auto-loaded from your profile. Add or remove as needed.
                    </p>
                  </div>
                </div>

                <button type="submit" className="ai-btn-primary mt-3" disabled={loading || !targetRole}>
                  {loading ? 'Analyzing...' : 'Analyze Skill Gap'}
                </button>
              </form>

              {error && <div className="ai-error">{error}</div>}

              {loading && (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Comparing your skills...
                </div>
              )}

              {result && !result.error && (
                <div className="ai-result-box">
                  <h4 className="ai-result-title">Skill Gap Analysis Result</h4>

                  <div className="row g-4 mb-4">
                    <div className="col-md-4">
                      <div className="stat-card">
                        <div className="stat-icon icon-blue">
                          <i className="bi bi-check-circle" />
                        </div>
                        <div className="stat-info">
                          <h6 className="fw-bold">Acquired Skills</h6>
                          <p>{(result.skills_available || []).length} / {(result.skills_available || []).length + (result.skills_missing || []).length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="stat-card">
                        <div className="stat-icon icon-orange">
                          <i className="bi bi-book" />
                        </div>
                        <div className="stat-info">
                          <h6 className="fw-bold">Missing Skills</h6>
                          <p>{(result.skills_missing || []).length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="stat-card">
                        <div className="stat-icon icon-green">
                          <i className="bi bi-clock" />
                        </div>
                        <div className="stat-info">
                          <h6 className="fw-bold">Est. Learning Time</h6>
                          <p>{result.estimated_time || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {result.target_role && (
                    <p className="mb-3">
                      <strong>Target Role:</strong> {result.target_role}
                    </p>
                  )}

                  {result.current_readiness !== undefined && (
                    <div className="mb-4">
                      <label className="ai-result-label">Current Readiness</label>
                      <div className="ai-progress">
                        <div
                          className={`ai-progress-bar ${result.current_readiness >= 70 ? 'ai-progress-green' : result.current_readiness >= 40 ? 'ai-progress-orange' : 'ai-progress-red'}`}
                          style={{ width: `${result.current_readiness}%` }}
                        />
                      </div>
                      <p className="mt-2" style={{ fontSize: 14, color: '#2d3748' }}>{result.recommendation}</p>
                    </div>
                  )}

                  {result.skills_available && result.skills_available.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-bold text-success">Skills You Have</h6>
                      <div className="ai-skills-container">
                        {result.skills_available.map((s, i) => (
                          <span key={i} className="ai-skill-tag matched">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.learning_priority && result.learning_priority.length > 0 && (
                    <div>
                      <h6 className="fw-bold text-danger">Skills to Learn</h6>
                      <div className="mt-2">
                        {result.learning_priority.map((gap, i) => (
                          <div className="ai-company-card" key={i}>
                            <div className="ai-company-logo" style={{ background: '#fff5f5', color: '#e53e3e' }}>
                              <i className="bi bi-book" />
                            </div>
                            <div className="ai-company-info">
                              <div className="ai-company-name">{gap.skill}</div>
                              <div className="ai-company-detail">
                                {gap.time && <span>Est. time: {gap.time} &middot; </span>}
                                {gap.priority && (
                                  <span className={`ai-badge ${getPriorityBadge(gap.priority)}`}>
                                    {gap.priority}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
