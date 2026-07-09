import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import SkillSelector from '../components/SkillSelector';
import CertificationSelector from '../components/CertificationSelector';
import ProjectManager from '../components/ProjectManager';
import InternshipManager from '../components/InternshipManager';
import { aiApi } from '../utils/aiApi';
import '../styles/ai.css';

export default function PlacementPrediction() {
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [cgpa, setCgpa] = useState('');
  const [aptitudeScore, setAptitudeScore] = useState('');
  const [communicationScore, setCommunicationScore] = useState('');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Send arrays to backend - it will convert counts for Django
      const data = await aiApi.predictPlacement({
        cgpa: Number(cgpa),
        skills: skills,
        certifications: certifications,
        projects: projects,
        internships: internships,
        aptitudeScore: Number(aptitudeScore || 0),
        communicationScore: Number(communicationScore || 0),
      });
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getScoreClass(score) {
    if (score >= 70) return 'ai-progress-green';
    if (score >= 40) return 'ai-progress-orange';
    return 'ai-progress-red';
  }

  return (
    <AppLayout role="student">
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="ai-card">
              <div className="ai-card-header">
                <i className="bi bi-graph-up-arrow" />
                <div>
                  <h3>Placement Prediction</h3>
                  <p>Predict your placement chances using AI based on your profile</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Basic Info */}
                  <div className="col-md-4">
                    <label className="ai-form-label">CGPA (0-10) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="ai-form-input"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      required
                      min="0"
                      max="10"
                      placeholder="e.g. 8.5"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Aptitude Score (0-100)</label>
                    <input
                      type="number"
                      className="ai-form-input"
                      value={aptitudeScore}
                      onChange={(e) => setAptitudeScore(e.target.value)}
                      min="0"
                      max="100"
                      placeholder="e.g. 85"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Communication Score (0-100)</label>
                    <input
                      type="number"
                      className="ai-form-input"
                      value={communicationScore}
                      onChange={(e) => setCommunicationScore(e.target.value)}
                      min="0"
                      max="100"
                      placeholder="e.g. 78"
                    />
                  </div>

                  {/* Skills */}
                  <div className="col-12">
                    <SkillSelector value={skills} onChange={setSkills} />
                  </div>

                  {/* Certifications */}
                  <div className="col-12">
                    <CertificationSelector value={certifications} onChange={setCertifications} />
                  </div>

                  {/* Projects */}
                  <div className="col-12">
                    <ProjectManager value={projects} onChange={setProjects} />
                  </div>

                  {/* Internships */}
                  <div className="col-12">
                    <InternshipManager value={internships} onChange={setInternships} />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="ai-btn-primary"
                    disabled={loading || !cgpa}
                  >
                    {loading ? 'Predicting...' : 'Predict Placement'}
                  </button>
                </div>
              </form>

              {error && <div className="ai-error">{error}</div>}

              {loading && (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Analyzing your profile...
                </div>
              )}

              {result && !result.error && (
                <div className="ai-result-box">
                  <h4 className="ai-result-title">Prediction Result</h4>

                  <div className="text-center mb-3">
                    <div className={`ai-score-circle ${result.placement_probability >= 70 ? 'ai-score-high' : result.placement_probability >= 40 ? 'ai-score-medium' : 'ai-score-low'}`}>
                      {result.placement_probability}%
                    </div>
                    <p className="mt-2 fw-bold">
                      {result.is_high_chance ? 'High Placement Chance' : 'Needs Improvement'}
                    </p>
                  </div>

                  <div className="ai-result-item">
                    <span className="ai-result-label">Placement Probability</span>
                    <span className="ai-result-value">{result.placement_probability}%</span>
                  </div>
                  <div className="ai-result-item">
                    <span className="ai-result-label">Confidence</span>
                    <span className="ai-result-value">{result.confidence}%</span>
                  </div>
                  <div className="ai-result-item">
                    <span className="ai-result-label">Prediction</span>
                    <span className={`ai-badge ${result.is_high_chance ? 'ai-badge-success' : 'ai-badge-warning'}`}>
                      {result.is_high_chance ? 'Placed' : 'Not Placed'}
                    </span>
                  </div>
                  <div className="ai-result-item">
                    <span className="ai-result-label">Message</span>
                    <span className="text-muted">{result.message}</span>
                  </div>

                  <div className="mt-3">
                    <label className="ai-result-label">Placement Probability</label>
                    <div className="ai-progress">
                      <div
                        className={`ai-progress-bar ${getScoreClass(result.placement_probability)}`}
                        style={{ width: `${result.placement_probability}%` }}
                      />
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
