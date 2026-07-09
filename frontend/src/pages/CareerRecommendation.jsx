import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import SkillSelector from '../components/SkillSelector';
import { aiApi } from '../utils/aiApi';
import '../styles/ai.css';

export default function CareerRecommendation() {
  const [skills, setSkills] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Send selected skills to backend - it will map them to ML features
      const data = await aiApi.recommendCareer({ skills });
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
                <i className="bi bi-compass" />
                <div>
                  <h3>Career Recommendation</h3>
                  <p>
                    Select the skills you know and we will recommend the best career path for you
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12">
                    <SkillSelector value={skills} onChange={setSkills} />
                    <p className="text-muted mt-2" style={{ fontSize: 13 }}>
                      Select all the skills you are comfortable with. The more skills you select,
                      the better the recommendation will be.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="ai-btn-primary mt-3"
                  disabled={loading || skills.length === 0}
                >
                  {loading ? 'Analyzing...' : 'Get Recommendations'}
                </button>
              </form>

              {error && <div className="ai-error">{error}</div>}

              {loading && (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Finding the best career for you...
                </div>
              )}

              {result && !result.error && (
                <div className="ai-result-box">
                  <h4 className="ai-result-title">Recommended Career Path</h4>

                  <div className="text-center mb-4">
                    <div className="ai-score-circle ai-score-high" style={{ width: 100, height: 100, fontSize: 28 }}>
                      {result.confidence}%
                    </div>
                    <h5 className="mt-3 fw-bold">{result.top_recommendation}</h5>
                    <p className="text-muted">Top Recommendation</p>
                  </div>

                  <h6 className="fw-bold mb-3">All Recommendations</h6>
                  {result.recommendations && result.recommendations.map((rec, index) => (
                    <div className="ai-company-card" key={index}>
                      <div className="ai-company-logo">
                        <i className="bi bi-star-fill" />
                      </div>
                      <div className="ai-company-info">
                        <div className="ai-company-name">{rec.career}</div>
                        <div className="ai-company-detail">Match Score</div>
                      </div>
                      <div className="ai-company-score">{rec.match_percentage}%</div>
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
