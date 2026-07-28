import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    aiApi.getStudentProfile()
      .then((data) => {
        const p = data.data;
        const hasSkills = (p.skills || []).length > 0;
        setProfileIncomplete(!hasSkills);
        if (hasSkills) setSkills(p.skills);
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
                  <h3>AI Career Recommendation</h3>
                  <p>Get a personalized career recommendation based on your skills, projects, and interests</p>
                </div>
              </div>

              {profileIncomplete ? (
                <div className="ai-error" style={{ textAlign: 'center', padding: '24px' }}>
                  <i className="bi bi-exclamation-circle-fill" style={{ fontSize: 32, display: 'block', marginBottom: 12 }} />
                  <h6 style={{ color: '#9b2c2c' }}>Profile Incomplete</h6>
                  <p style={{ fontSize: 14, marginBottom: 16 }}>
                    Please add at least one skill to your profile before using Career Recommendation.
                  </p>
                  <Link to="/student/profile" className="ai-btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    <i className="bi bi-person-fill-gear" /> Complete Your Profile
                  </Link>
                </div>
              ) : (
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
                  {loading ? 'Recommending...' : 'Get AI Recommendation'}
                </button>
              </form>
              )}

              {error && <div className="ai-error">{error}</div>}

              {loading && (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Analyzing your profile with AI...
                </div>
              )}

              {result && !result.error && (
                <div className="ai-result-box">
                  <div className="cr-hero-v2">
                    <p className="cr-hero-v2-label">AI Career Recommendation</p>
                    <h2 className="cr-hero-v2-role">{result.recommended_role}</h2>
                    <p className="cr-hero-v2-quote">
                      &ldquo;Based on your profile, <strong>{result.recommended_role}</strong> is the most suitable career path for you.&rdquo;
                    </p>
                  </div>

                  {result.why_this_role && (
                    <div className="cr-section-v2">
                      <h5 className="cr-section-v2-title">
                        <i className="bi bi-question-circle" /> Why This Role?
                      </h5>
                      <p className="cr-text-v2">{result.why_this_role}</p>
                    </div>
                  )}

                  {result.skill_gaps && result.skill_gaps.length > 0 && (
                    <div className="cr-section-v2" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                      <h5 className="cr-section-v2-title">
                        <i className="bi bi-arrow-up-circle" /> Skills to Improve
                      </h5>
                      <div className="cr-chips-v2">
                        {result.skill_gaps.map((s, i) => (
                          <span key={i} className="cr-chip-v2">{s}</span>
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
