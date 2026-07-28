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

  const allMissing = result?.skills_missing || [];
  const hasMissing = allMissing.length > 0;
  const allPresent = result?.skills_available || [];

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
                <div className="ai-result-box" style={{ marginTop: 24 }}>

                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 12,
                    padding: '28px 20px',
                    marginBottom: 32,
                    textAlign: 'center',
                  }}>
                    <p style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                      color: 'var(--text-muted)',
                      marginBottom: 6,
                    }}>
                      SKILL GAP ANALYSIS
                    </p>
                    <h2 style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      marginBottom: 10,
                      marginTop: 0,
                    }}>
                      {result.target_role}
                    </h2>
                    <p style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      margin: 0,
                    }}>
                      You currently possess {result.present_count} of {result.total_required} required skills for this career path.
                    </p>
                  </div>

                  {hasMissing && (
                    <div style={{ marginBottom: 32 }}>
                      <h5 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 12 }}>
                        Missing Skills
                      </h5>
                      <div className="ai-skills-container" style={{ gap: 10 }}>
                        {allMissing.map((s, i) => (
                          <span key={i} className="ai-skill-tag missing" style={{ fontSize: 14, padding: '6px 18px' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!hasMissing && (
                    <div style={{
                      background: 'var(--success-bg)',
                      borderRadius: 12,
                      padding: '24px 20px',
                      marginBottom: 32,
                      textAlign: 'center',
                    }}>
                      <i className="bi bi-check-circle-fill" style={{ fontSize: 32, color: 'var(--success-text)', display: 'block', marginBottom: 10 }} />
                      <h5 style={{ fontSize: 16, fontWeight: 700, color: 'var(--success-text)', margin: 0 }}>
                        Excellent! You already possess all core skills required for this role.
                      </h5>
                    </div>
                  )}

                  {allPresent.length > 0 && (
                    <div style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      borderLeft: '4px solid var(--success)',
                      borderRadius: 12,
                      padding: '20px',
                      marginBottom: 32,
                    }}>
                      <h5 style={{ fontSize: 15, fontWeight: 700, color: 'var(--success-text)', margin: 0, marginBottom: 4 }}>
                        Current Skills
                      </h5>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, marginBottom: 12 }}>
                        Skills already present in your profile.
                      </p>
                      <div className="ai-skills-container">
                        {allPresent.map((s, i) => (
                          <span key={i} className="ai-skill-tag matched">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasMissing && (
                    <div style={{ marginBottom: 32 }}>
                      <h5 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 4 }}>
                        Recommended Skills to Learn
                      </h5>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, marginBottom: 12 }}>
                        Focus on these skills to improve your career readiness.
                      </p>
                      <div className="ai-skills-container">
                        {allMissing.map((s, i) => (
                          <span key={i} className="ai-skill-tag" style={{
                            background: 'var(--warning-bg)',
                            color: 'var(--warning-text)',
                          }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.summary && (
                    <div
                      className="ai-company-card"
                      style={{
                        borderLeft: '4px solid var(--accent)',
                        padding: '20px',
                        marginBottom: 0,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <i className="bi bi-info-circle" style={{ fontSize: 18, color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                          {result.summary}
                        </p>
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
