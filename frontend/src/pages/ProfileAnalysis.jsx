import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { aiApi } from '../utils/aiApi';
import { getSession } from '../utils/userSession';
import '../styles/ai.css';

function parseItem(text) {
  const seps = [' with ', ' showcasing ', ' demonstrating ', ' showing ', ' displaying ', ' through ', ' featuring ', ' including '];
  for (const sep of seps) {
    const idx = text.indexOf(sep);
    if (idx > 0 && idx < text.length - sep.length) {
      const title = text.substring(0, idx).trim();
      const desc = text.substring(idx + sep.length).trim();
      return { title, desc: desc.charAt(0).toUpperCase() + desc.slice(1) };
    }
  }
  const words = text.split(' ');
  if (words.length <= 4) return { title: text, desc: '' };
  const t = words.slice(0, 3).join(' ');
  const d = words.slice(3).join(' ');
  return { title: t, desc: d.charAt(0).toUpperCase() + d.slice(1) };
}

function strengthIcon(text) {
  const t = ' ' + text.toLowerCase() + ' ';
  if (t.includes('skill')) return 'bi-code-square';
  if (t.includes('project')) return 'bi-folder';
  if (t.includes('internship')) return 'bi-briefcase';
  if (t.includes('certif')) return 'bi-patch-check';
  if (t.includes('academic') || t.includes('cgpa')) return 'bi-mortarboard';
  if (t.includes('github')) return 'bi-github';
  if (t.includes('portfolio')) return 'bi-globe';
  if (t.includes('language') || t.includes('prog')) return 'bi-translate';
  if (t.includes('communicat') || t.includes('soft') || t.includes('interpersonal')) return 'bi-people';
  if (t.includes('workshop') || t.includes('hackathon')) return 'bi-calendar-event';
  return 'bi-check-circle';
}

function improvementIcon(text) {
  const t = ' ' + text.toLowerCase() + ' ';
  if (t.includes('project')) return 'bi-folder';
  if (t.includes('internship')) return 'bi-briefcase';
  if (t.includes('certif')) return 'bi-patch-check';
  if (t.includes('github')) return 'bi-github';
  if (t.includes('linkedin')) return 'bi-linkedin';
  if (t.includes('portfolio')) return 'bi-globe';
  if (t.includes('language') || t.includes('prog')) return 'bi-translate';
  if (t.includes('soft') || t.includes('communicat')) return 'bi-people';
  if (t.includes('workshop') || t.includes('hackathon')) return 'bi-calendar-event';
  if (t.includes('skill') || t.includes('tech')) return 'bi-code-square';
  return 'bi-arrow-up-circle';
}

function recommendationIcon(text) {
  const t = ' ' + text.toLowerCase() + ' ';
  if (t.includes('docker') || t.includes('container')) return 'bi-box';
  if (t.includes('mern') || t.includes('project') || t.includes('full-stack') || t.includes('fullstack')) return 'bi-folder';
  if (t.includes('aws') || t.includes('cloud') || t.includes('gcp') || t.includes('azure')) return 'bi-cloud';
  if (t.includes('dsa') || t.includes('algorithm') || t.includes('data structure')) return 'bi-diagram-3';
  if (t.includes('portfolio')) return 'bi-globe';
  if (t.includes('blog') || t.includes('linkedin') || t.includes('medium') || t.includes('writ')) return 'bi-pencil';
  if (t.includes('open-source') || t.includes('github') || t.includes('contribu')) return 'bi-git';
  if (t.includes('bootcamp') || t.includes('course') || t.includes('enroll')) return 'bi-book';
  if (t.includes('certif') || t.includes('aws') || t.includes('google')) return 'bi-patch-check';
  if (t.includes('interview') || t.includes('leetcode') || t.includes('codeforces') || t.includes('platform')) return 'bi-laptop';
  if (t.includes('mentor') || t.includes('teach') || t.includes('commun')) return 'bi-megaphone';
  if (t.includes('hackathon') || t.includes('workshop')) return 'bi-calendar-event';
  return 'bi-lightbulb';
}

function categoryConfig(category) {
  switch (category) {
    case 'Excellent':
      return { tagline: 'Your profile demonstrates exceptional quality. You are highly employable and ready for competitive roles.', cls: 'ra-excellent' };
    case 'Good':
      return { tagline: 'Your profile demonstrates a solid technical foundation. Focus on a few improvements to become more competitive.', cls: 'ra-good' };
    case 'Average':
      return { tagline: 'Your profile shows potential. With targeted improvements you can significantly strengthen your profile.', cls: 'ra-average' };
    case 'Needs Improvement':
      return { tagline: 'Your profile is at an early stage. Consistent effort and structured planning will help you grow.', cls: 'ra-needs' };
    default:
      return { tagline: 'Profile analysis complete.', cls: '' };
  }
}

export default function ProfileAnalysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      setProfileLoading(false);
      return;
    }
    aiApi.getStudentProfile()
      .then((data) => {
        setProfile(data.data);
        const p = data.data || {};
        const hasSkills = (p.skills || []).length > 0;
        const hasProjects = (p.projects || []).length > 0;
        const hasInternships = (p.internships || []).length > 0;
        const hasCertifications = (p.certifications || []).length > 0;
        setProfileIncomplete(!hasSkills && !hasProjects && !hasInternships && !hasCertifications);
      })
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

  const cfg = result ? categoryConfig(result.category) : {};

  return (
    <AppLayout role="student">
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="ai-card">
              <div className="ai-card-header">
                <i className="bi bi-file-earmark-text" />
                <div>
                  <h3>Profile Analysis</h3>
                  <p>Get an AI-powered analysis of your professional profile based on your skills, projects, internships, certifications, and overall profile.</p>
                </div>
              </div>

              {profileLoading ? (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Loading your profile...
                </div>
              ) : (
                <>
                  {profileIncomplete ? (
                    <div className="ai-error" style={{ textAlign: 'center', padding: '24px' }}>
                      <i className="bi bi-exclamation-circle-fill" style={{ fontSize: 32, display: 'block', marginBottom: 12 }} />
                      <h6 style={{ color: '#9b2c2c' }}>Profile Incomplete</h6>
                      <p style={{ fontSize: 14, marginBottom: 16 }}>
                        Please add skills, projects, internships, or certifications to your profile before using Profile Analysis.
                      </p>
                      <Link to="/student/profile" className="ai-btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        <i className="bi bi-person-fill-gear" /> Complete Your Profile
                      </Link>
                    </div>
                  ) : (
                    <button
                      className="ai-btn-primary"
                      onClick={handleAnalyze}
                      disabled={loading || !profile}
                    >
                      {loading ? 'Analyzing...' : 'Analyze My Profile'}
                    </button>
                  )}

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
                  <i className="bi bi-arrow-repeat" /> Analyzing your profile...
                </div>
              )}

              {result && !result.error && (
                <div className="ai-result-box">
                  <div className={`ra-hero ${cfg.cls}`}>
                    <p className="ra-hero-label">Profile Analysis</p>
                    <div className="ra-hero-badge">
                      <span className="ra-hero-category">{result.category}</span>
                    </div>
                    {result.resume_score != null && (
                      <div className="ra-score">
                        <div className="ra-score-ring">
                          <svg viewBox="0 0 120 120" className="ra-score-svg">
                            <circle cx="60" cy="60" r="52" className="ra-score-track" />
                            <circle
                              cx="60" cy="60" r="52"
                              className="ra-score-fill"
                              strokeDasharray={`${(result.resume_score / 100) * 327} 327`}
                              strokeDashoffset="0"
                            />
                          </svg>
                          <div className="ra-score-value">{result.resume_score}</div>
                        </div>
                        <div className="ra-score-label">Profile Score</div>
                      </div>
                    )}
                    <p className="ra-hero-desc">{cfg.tagline}</p>
                  </div>

                  <div className="ra-grid">
                    {result.strengths && result.strengths.length > 0 && (
                      <div className="ra-card ra-card-green">
                        <div className="ra-card-header">
                          <div className="ra-card-icon ra-card-icon-green">
                            <i className="bi bi-check-circle-fill" />
                          </div>
                          <h5 className="ra-card-title">Strengths</h5>
                        </div>
                        <div className="ra-card-body">
                          {result.strengths.map((s, i) => {
                            const item = parseItem(s);
                            return (
                              <div key={i} className="ra-item">
                                <div className="ra-item-icon ra-item-icon-green">
                                  <i className={`bi ${strengthIcon(s)}`} />
                                </div>
                                <div className="ra-item-content">
                                  <div className="ra-item-title">{item.title}</div>
                                  {item.desc && <div className="ra-item-desc">{item.desc}</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {result.areas_for_improvement && result.areas_for_improvement.length > 0 && (
                      <div className="ra-card ra-card-orange">
                        <div className="ra-card-header">
                          <div className="ra-card-icon ra-card-icon-orange">
                            <i className="bi bi-exclamation-triangle-fill" />
                          </div>
                          <h5 className="ra-card-title">Areas for Improvement</h5>
                        </div>
                        <div className="ra-card-body">
                          {result.areas_for_improvement.map((s, i) => {
                            const item = parseItem(s);
                            return (
                              <div key={i} className="ra-item">
                                <div className="ra-item-icon ra-item-icon-orange">
                                  <i className={`bi ${improvementIcon(s)}`} />
                                </div>
                                <div className="ra-item-content">
                                  <div className="ra-item-title">{item.title}</div>
                                  {item.desc && <div className="ra-item-desc">{item.desc}</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {result.recommendations && result.recommendations.length > 0 && (
                      <div className="ra-card ra-card-blue">
                        <div className="ra-card-header">
                          <div className="ra-card-icon ra-card-icon-blue">
                            <i className="bi bi-lightbulb-fill" />
                          </div>
                          <h5 className="ra-card-title">Recommendations</h5>
                        </div>
                        <div className="ra-card-body">
                          {result.recommendations.slice(0, 5).map((s, i) => {
                            const item = parseItem(s);
                            return (
                              <div key={i} className="ra-item">
                                <div className="ra-item-icon ra-item-icon-blue">
                                  <i className={`bi ${recommendationIcon(s)}`} />
                                </div>
                                <div className="ra-item-content">
                                  <div className="ra-item-title">{item.title}</div>
                                  {item.desc && <div className="ra-item-desc">{item.desc}</div>}
                                </div>
                              </div>
                            );
                          })}
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
