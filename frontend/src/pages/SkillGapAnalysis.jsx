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

  const missingSkills = result?.skills_missing || [];

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
                  <p>Identify the important skills you are missing for your recommended career path.</p>
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
                  <div className="sg-hero">
                    <p className="sg-hero-label">Skill Gap Analysis</p>
                    {missingSkills.length > 0 ? (
                      <>
                        <h2 className="sg-hero-title">Missing Skills</h2>
                        <div className="sg-hero-chips">
                          {missingSkills.map((s, i) => (
                            <span key={i} className="sg-chip sg-chip-missing">{s}</span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="sg-hero-title sg-hero-complete">All Skills Covered</h2>
                        <div className="sg-hero-chips">
                          {(result.skills_available || []).map((s, i) => (
                            <span key={i} className="sg-chip sg-chip-present">{s}</span>
                          ))}
                        </div>
                      </>
                    )}
                    <p className="sg-hero-desc">
                      Based on your current profile and the requirements for <strong>{result.target_role}</strong>, these are the skills you should focus on.
                    </p>
                  </div>

                  <div className="sg-grid">
                    {result.skills_available && result.skills_available.length > 0 && (
                      <div className="sg-card sg-card-green">
                        <div className="sg-card-header">
                          <div className="sg-card-icon sg-card-icon-green">
                            <i className="bi bi-check-circle-fill" />
                          </div>
                          <h5 className="sg-card-title">Current Skills</h5>
                        </div>
                        <div className="sg-card-body">
                          <div className="sg-chips">
                            {result.skills_available.map((s, i) => (
                              <span key={i} className="sg-chip sg-chip-present">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {missingSkills.length > 0 && (
                      <div className="sg-card sg-card-orange">
                        <div className="sg-card-header">
                          <div className="sg-card-icon sg-card-icon-orange">
                            <i className="bi bi-book-fill" />
                          </div>
                          <h5 className="sg-card-title">Recommended Skills to Learn</h5>
                        </div>
                        <div className="sg-card-body">
                          <div className="sg-chips">
                            {missingSkills.map((s, i) => (
                              <span key={i} className="sg-chip sg-chip-missing">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
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
