import { useState, useRef } from 'react';
import AppLayout from '../components/AppLayout';
import SkillSelector from '../components/SkillSelector';
import { aiApi } from '../utils/aiApi';
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
  const [validationMsg, setValidationMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const domainRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const internshipsRef = useRef(null);
  const certsRef = useRef(null);

  function validate() {
    const errors = {};
    if (!skills || skills.length === 0) errors.skills = true;
    if (interestedDomain === '') errors.interestedDomain = true;
    if (projectsCount === '') errors.projectsCount = true;
    if (internshipCount === '') errors.internshipCount = true;
    if (certificationCount === '') errors.certificationCount = true;
    return errors;
  }

  function focusFirst(errors) {
    if (errors.interestedDomain) { domainRef.current?.focus(); return; }
    if (errors.skills) { skillsRef.current?.querySelector('input')?.focus(); return; }
    if (errors.projectsCount) { projectsRef.current?.focus(); return; }
    if (errors.internshipCount) { internshipsRef.current?.focus(); return; }
    if (errors.certificationCount) { certsRef.current?.focus(); return; }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    const errors = validate();
    setFieldErrors(errors);
    setValidationMsg('');

    if (Object.keys(errors).length > 0) {
      setValidationMsg('Please enter your skills, projects, internships, certifications, and interested domain to receive an AI career recommendation.');
      focusFirst(errors);
      return;
    }

    setLoading(true);

    try {
      const data = await aiApi.recommendCareerRole({
        skills,
        projectsCount: Number(projectsCount),
        internshipCount: Number(internshipCount),
        certificationCount: Number(certificationCount),
        interestedDomain: Number(interestedDomain),
      });
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function inputClass(base, field) {
    return fieldErrors[field] ? `${base} cr-input-error` : base;
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
                  <p>Enter your skills, experience, and interests to receive an AI-powered career recommendation.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-4">
                    <label className="ai-form-label">Projects Count *</label>
                    <input
                      ref={projectsRef}
                      type="number" min="0" max="20"
                      className={inputClass('ai-form-input', 'projectsCount')}
                      value={projectsCount} onChange={(e) => { setProjectsCount(e.target.value); setFieldErrors((prev) => ({ ...prev, projectsCount: false })); }}
                      placeholder="e.g. 3"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Internship Count *</label>
                    <input
                      ref={internshipsRef}
                      type="number" min="0" max="10"
                      className={inputClass('ai-form-input', 'internshipCount')}
                      value={internshipCount} onChange={(e) => { setInternshipCount(e.target.value); setFieldErrors((prev) => ({ ...prev, internshipCount: false })); }}
                      placeholder="e.g. 1"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Certification Count *</label>
                    <input
                      ref={certsRef}
                      type="number" min="0" max="20"
                      className={inputClass('ai-form-input', 'certificationCount')}
                      value={certificationCount} onChange={(e) => { setCertificationCount(e.target.value); setFieldErrors((prev) => ({ ...prev, certificationCount: false })); }}
                      placeholder="e.g. 2"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ai-form-label">Interested Domain *</label>
                    <select
                      ref={domainRef}
                      className={inputClass('ai-form-input', 'interestedDomain')}
                      value={interestedDomain}
                      onChange={(e) => { setInterestedDomain(e.target.value); setFieldErrors((prev) => ({ ...prev, interestedDomain: false })); }}
                    >
                      <option value="">Select domain...</option>
                      {domainOptions.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <div ref={skillsRef}>
                      <SkillSelector value={skills} onChange={(v) => { setSkills(v); setFieldErrors((prev) => ({ ...prev, skills: false })); }} />
                    </div>
                    <p className="text-muted mt-2" style={{ fontSize: 13 }}>
                      Enter the programming languages, frameworks, and tools you know.
                    </p>
                  </div>
                </div>

                {validationMsg && (
                  <div className="ai-error" style={{ marginTop: 16 }}>
                    <i className="bi bi-exclamation-circle-fill me-2" />
                    {validationMsg}
                  </div>
                )}

                <button type="submit" className="ai-btn-primary mt-3" disabled={loading}>
                  {loading ? 'Recommending...' : 'Get AI Recommendation'}
                </button>
              </form>

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
                    <div className="cr-section-v2">
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

                  {result.suitable_jobs && result.suitable_jobs.length > 0 && (
                    <div className="cr-section-v2" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                      <h5 className="cr-section-v2-title">
                        <i className="bi bi-briefcase" /> Suitable Job Positions
                      </h5>
                      <div className="cr-chips-v2">
                        {result.suitable_jobs.map((job, i) => (
                          <span key={i} className="cr-chip-v2 cr-chip-v2-blue">{job}</span>
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
