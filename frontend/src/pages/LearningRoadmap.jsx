import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { aiApi } from '../utils/aiApi';
import '../styles/ai.css';

export default function LearningRoadmap() {
  const [searchParams] = useSearchParams();
  const careerFromUrl = searchParams.get('career') || '';

  const [career, setCareer] = useState(careerFromUrl);
  const [careers, setCareers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    aiApi.getCareers()
      .then((data) => setCareers(data.data || []))
      .catch(() => {});
  }, []);

  // If career is passed via URL, auto-fetch
  useEffect(() => {
    if (careerFromUrl) {
      fetchRoadmap(careerFromUrl);
    }
  }, [careerFromUrl]);

  async function fetchRoadmap(careerName) {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await aiApi.generateLearningRoadmap({ career: careerName });
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    fetchRoadmap(career);
  }

  return (
    <AppLayout role="student">
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="ai-card">
              <div className="ai-card-header">
                <i className="bi bi-signpost-2" />
                <div>
                  <h3>Learning Roadmap</h3>
                  <p>Get a step-by-step learning plan for your dream career</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="ai-form-label">Select Career</label>
                    <select
                      className="ai-form-input"
                      value={career}
                      onChange={(e) => setCareer(e.target.value)}
                      required
                    >
                      <option value="">Select a career...</option>
                      {careers.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button
                      type="submit"
                      className="ai-btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? 'Generating...' : 'Generate Roadmap'}
                    </button>
                  </div>
                </div>
              </form>

              {error && <div className="ai-error">{error}</div>}

              {loading && (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Creating your personalized roadmap...
                </div>
              )}

              {result && !result.error && (
                <div className="mt-4">
                  <div className="text-center mb-4">
                    <h4 className="fw-bold">{result.title}</h4>
                    <p className="text-muted">{result.description}</p>
                    <span className="ai-badge ai-badge-info">
                      Duration: {result.duration}
                    </span>
                  </div>

                  {result.phases.map((phase, index) => (
                    <div className="ai-roadmap-phase" key={index}>
                      <h5>
                        <i className="bi bi-flag-fill me-2" style={{ color: '#4299e1' }} />
                        {phase.name}
                      </h5>
                      {phase.topics.map((topic, tIndex) => (
                        <div className="ai-roadmap-topic" key={tIndex}>
                          <i className="bi bi-check-circle-fill" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
