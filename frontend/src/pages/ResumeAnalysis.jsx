import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { aiApi } from '../utils/aiApi';
import { getSession } from '../utils/userSession';
import '../styles/ai.css';

export default function ResumeAnalysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      setProfileLoading(false);
      return;
    }
    aiApi.getStudentProfile()
      .then((data) => setProfile(data.data))
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []);

  async function handleAnalyze() {
    setLoading(true);
    setError('');
    setResult(null);

    const p = profile || {};
    const skills = p.skills || [];
    const projects = p.projects || [];
    const internships = p.internships || [];
    const certifications = p.certifications || [];

    try {
      const data = await aiApi.analyzeResume({
        skills,
        projects,
        internships,
        certifications,
        educationLevel: 3,
        hasPortfolio: p.portfolio ? true : false,
        hasGithub: p.github ? true : false,
        hasLinkedin: p.linkedin ? true : false,
        languages: p.languages || [],
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
                <i className="bi bi-file-earmark-text" />
                <div>
                  <h3>Resume Analysis</h3>
                  <p>Get a professional analysis of your resume profile with strengths, improvements, and recommendations</p>
                </div>
              </div>

              {profileLoading ? (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Loading your profile...
                </div>
              ) : (
                <>
                  <div className="row g-4 mb-4">
                    <div className="col-md-3">
                      <div className="stat-card">
                        <div className="stat-icon icon-blue">
                          <i className="bi bi-code-square" />
                        </div>
                        <div className="stat-info">
                          <h6 className="fw-bold">Skills</h6>
                          <p>{(profile?.skills || []).length} skills</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="stat-card">
                        <div className="stat-icon icon-blue">
                          <i className="bi bi-folder" />
                        </div>
                        <div className="stat-info">
                          <h6 className="fw-bold">Projects</h6>
                          <p>{(profile?.projects || []).length} projects</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="stat-card">
                        <div className="stat-icon icon-blue">
                          <i className="bi bi-briefcase" />
                        </div>
                        <div className="stat-info">
                          <h6 className="fw-bold">Internships</h6>
                          <p>{(profile?.internships || []).length} internships</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="stat-card">
                        <div className="stat-icon icon-blue">
                          <i className="bi bi-patch-check" />
                        </div>
                        <div className="stat-info">
                          <h6 className="fw-bold">Certifications</h6>
                          <p>{(profile?.certifications || []).length} certifications</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="ai-btn-primary"
                    onClick={handleAnalyze}
                    disabled={loading || !profile}
                  >
                    {loading ? 'Analyzing...' : 'Analyze My Resume'}
                  </button>

                  {!profile && !profileLoading && (
                    <p className="text-muted mt-2" style={{ fontSize: 13 }}>
                      Complete your student profile first to get accurate analysis.
                    </p>
                  )}
                </>
              )}

              {error && <div className="ai-error">{error}</div>}

              {loading && (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Analyzing your resume profile...
                </div>
              )}

              {result && !result.error && (
                <div className="ai-result-box">
                  <h4 className="ai-result-title">Resume Analysis Report</h4>

                  <div className="mb-4">
                    <h6 className="fw-bold">Summary</h6>
                    <p style={{ fontSize: 14, color: '#2d3748' }}>{result.summary}</p>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <h6 className="fw-bold text-success">Strengths</h6>
                      <ul style={{ fontSize: 14 }}>
                        {(result.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold text-danger">Areas for Improvement</h6>
                      <ul style={{ fontSize: 14 }}>
                        {(result.improvements || []).map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold">Recommendations</h6>
                    <ul style={{ fontSize: 14 }}>
                      {(result.recommendations || []).map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h6 className="fw-bold">Suitable Roles</h6>
                    <div className="ai-skills-container">
                      {(result.suitable_roles || []).map((role, i) => (
                        <span key={i} className="ai-skill-tag">{role}</span>
                      ))}
                    </div>
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
