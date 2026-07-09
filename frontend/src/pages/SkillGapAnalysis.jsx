import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { aiApi } from '../utils/aiApi';
import '../styles/ai.css';

export default function SkillGapAnalysis() {
  const [skills, setSkills] = useState('');
  const [targetCareer, setTargetCareer] = useState('');
  const [careers, setCareers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    aiApi.getCareers()
      .then((data) => setCareers(data.data || []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const data = await aiApi.analyzeSkillGap({
        skills: skillsList,
        targetCareer: targetCareer,
      });
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout role="student">
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="ai-card">
              <div className="ai-card-header">
                <i className="bi bi-clipboard-data" />
                <div>
                  <h3>Skill Gap Analysis</h3>
                  <p>Find out what skills you need for your dream career</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="ai-form-label">Your Skills (comma separated)</label>
                    <input
                      type="text"
                      className="ai-form-input"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="HTML, CSS, JavaScript, Python"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ai-form-label">Target Career</label>
                    <select
                      className="ai-form-input"
                      value={targetCareer}
                      onChange={(e) => setTargetCareer(e.target.value)}
                      required
                    >
                      <option value="">Select a career...</option>
                      {careers.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="ai-btn-primary mt-4"
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Analyze Skill Gap'}
                </button>
              </form>

              {error && <div className="ai-error">{error}</div>}

              {loading && (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Analyzing your skills...
                </div>
              )}

              {result && !result.error && (
                <div className="ai-result-box">
                  <h4 className="ai-result-title">
                    Skill Gap for {result.target_career}
                  </h4>

                  <div className="text-center mb-3">
                    <div className={`ai-score-circle ${result.match_percentage >= 60 ? 'ai-score-high' : result.match_percentage >= 30 ? 'ai-score-medium' : 'ai-score-low'}`}>
                      {result.match_percentage}%
                    </div>
                    <p className="mt-2">Match Score</p>
                  </div>

                  {/* Required Skills */}
                  <h6 className="fw-bold mt-3">Required Skills</h6>
                  <div className="ai-skills-container">
                    {result.required_skills.matched.map((s) => (
                      <span className="ai-skill-tag matched" key={s}>{s} ✓</span>
                    ))}
                    {result.required_skills.missing.map((s) => (
                      <span className="ai-skill-tag missing" key={s}>{s} ✗</span>
                    ))}
                  </div>

                  {/* Recommended Skills */}
                  <h6 className="fw-bold mt-3">Recommended Skills</h6>
                  <div className="ai-skills-container">
                    {result.recommended_skills.matched.map((s) => (
                      <span className="ai-skill-tag matched" key={s}>{s} ✓</span>
                    ))}
                    {result.recommended_skills.missing.map((s) => (
                      <span className="ai-skill-tag missing" key={s}>{s} ✗</span>
                    ))}
                  </div>

                  {result.missing_skills.length > 0 && (
                    <div className="mt-3">
                      <p className="fw-bold text-danger">
                        You need to learn {result.total_missing_skills} more skills
                      </p>
                      <a
                        href={`/ai/learning-roadmap?career=${encodeURIComponent(result.target_career)}`}
                        className="ai-btn-primary d-inline-block text-decoration-none"
                      >
                        Get Learning Roadmap
                      </a>
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
