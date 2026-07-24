import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import SkillSelector from '../components/SkillSelector';
import { aiApi } from '../utils/aiApi';
import { getSession } from '../utils/userSession';
import '../styles/ai.css';

const domainOptions = [
  { value: 0, label: 'Frontend Development' },
  { value: 1, label: 'Backend Development' },
  { value: 2, label: 'Full Stack Development' },
  { value: 3, label: 'Data Analytics' },
  { value: 4, label: 'AI / Machine Learning' },
  { value: 5, label: 'DevOps' },
  { value: 6, label: 'Quality Assurance' },
  { value: 7, label: 'UI/UX Design' },
  { value: 8, label: 'Cyber Security' },
];

export default function CareerRoleRecommendation() {
  const [skills, setSkills] = useState([]);
  const [projectsCount, setProjectsCount] = useState('');
  const [internshipCount, setInternshipCount] = useState('');
  const [certificationCount, setCertificationCount] = useState('');
  const [interestedDomain, setInterestedDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    aiApi.getStudentProfile()
      .then((data) => {
        const p = data.data;
        if (p.skills && p.skills.length) setSkills(p.skills);
        if (p.projects) setProjectsCount(String(p.projects.length));
        if (p.internships) setInternshipCount(String(p.internships.length));
        if (p.certifications) setCertificationCount(String(p.certifications.length));
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await aiApi.recommendCareerRole({
        skills,
        projectsCount: Number(projectsCount || 0),
        internshipCount: Number(internshipCount || 0),
        certificationCount: Number(certificationCount || 0),
        interestedDomain: Number(interestedDomain || 0),
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
                <i className="bi bi-briefcase-fill" />
                <div>
                  <h3>Career Role Recommendation</h3>
                  <p>Get a professional career role recommendation based on your skills and interests</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-4">
                    <label className="ai-form-label">Projects Count</label>
                    <input
                      type="number" min="0" max="20" className="ai-form-input"
                      value={projectsCount} onChange={(e) => setProjectsCount(e.target.value)}
                      placeholder="e.g. 3"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Internship Count</label>
                    <input
                      type="number" min="0" max="10" className="ai-form-input"
                      value={internshipCount} onChange={(e) => setInternshipCount(e.target.value)}
                      placeholder="e.g. 1"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Certification Count</label>
                    <input
                      type="number" min="0" max="20" className="ai-form-input"
                      value={certificationCount} onChange={(e) => setCertificationCount(e.target.value)}
                      placeholder="e.g. 2"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ai-form-label">Interested Domain *</label>
                    <select
                      className="ai-form-input"
                      value={interestedDomain}
                      onChange={(e) => setInterestedDomain(e.target.value)}
                      required
                    >
                      <option value="">Select domain...</option>
                      {domainOptions.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
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

                <button type="submit" className="ai-btn-primary mt-3" disabled={loading || !interestedDomain}>
                  {loading ? 'Recommending...' : 'Get Recommendation'}
                </button>
              </form>

              {error && <div className="ai-error">{error}</div>}

              {loading && (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Analyzing your profile...
                </div>
              )}

              {result && !result.error && (
                <div className="ai-result-box">
                  <h4 className="ai-result-title">Career Recommendation</h4>

                  <div className="text-center mb-4">
                    <h5 className="fw-bold text-primary">{result.primary_recommendation}</h5>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold">Why this role?</h6>
                    <p style={{ fontSize: 14, color: '#2d3748' }}>{result.reason}</p>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <h6 className="fw-bold">Key Skills Required</h6>
                      <div className="ai-skills-container">
                        {(result.key_skills || []).map((s, i) => (
                          <span key={i} className="ai-skill-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-6">
                    <h6 className="fw-bold">Alternative Roles</h6>
                    <ul style={{ fontSize: 14 }}>
                      {(result.alternative_roles || []).map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                    </div>
                  </div>

                  {result.confidence && (
                    <div>
                      <label className="ai-result-label">Match Confidence</label>
                      <div className="ai-progress">
                        <div
                          className={`ai-progress-bar ${result.confidence >= 80 ? 'ai-progress-green' : result.confidence >= 60 ? 'ai-progress-orange' : 'ai-progress-red'}`}
                          style={{ width: `${result.confidence}%` }}
                        />
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
