import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { aiApi } from '../utils/aiApi';
import '../styles/ai.css';

export default function CandidateRanking() {
  const [applicantsText, setApplicantsText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Parse text into applicant objects
      const lines = applicantsText
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => {
          const parts = line.split('|').map((p) => p.trim());
          return {
            name: parts[0] || 'Unknown',
            skills: parts[1] ? parts[1].split(',').map((s) => s.trim()) : [],
            projects: parts[2] ? parts[2].split(',').map((s) => s.trim()) : [],
            internships: parts[3] ? parts[3].split(',').map((s) => s.trim()) : [],
            certifications: parts[4] ? parts[4].split(',').map((s) => s.trim()) : [],
          };
        });

      if (lines.length === 0) {
        setError('Please enter at least one applicant.');
        setLoading(false);
        return;
      }

      const data = await aiApi.rankCandidates({ applicants: lines });
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout role="organizer">
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="ai-card">
              <div className="ai-card-header">
                <i className="bi bi-trophy" />
                <div>
                  <h3>Candidate Ranking</h3>
                  <p>Rank applicants by resume score automatically</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="ai-form-label">
                    Enter Applicants (one per line, format: Name | Skills | Projects | Internships | Certifications)
                  </label>
                  <textarea
                    className="ai-form-input"
                    rows="6"
                    value={applicantsText}
                    onChange={(e) => setApplicantsText(e.target.value)}
                    placeholder={`John Doe | Python, JavaScript, React | E-commerce, Chat App | Google, Microsoft | AWS, Azure${''}
Jane Smith | Java, Spring, SQL | Banking App | Amazon | Oracle${''}
Bob Wilson | HTML, CSS, JS | Portfolio | Infosys | Google Analytics`}
                    required
                    style={{ minHeight: 150, fontFamily: 'monospace', fontSize: 13 }}
                  />
                </div>

                <button
                  type="submit"
                  className="ai-btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Ranking...' : 'Rank Candidates'}
                </button>
              </form>

              {error && <div className="ai-error">{error}</div>}

              {loading && (
                <div className="ai-loading">
                  <i className="bi bi-arrow-repeat" /> Ranking candidates...
                </div>
              )}

              {result && !result.error && (
                <div className="ai-result-box">
                  <h4 className="ai-result-title">
                    Ranked Applicants ({result.totalApplicants} total)
                  </h4>

                  {result.rankedApplicants.map((applicant, index) => (
                    <div className="ai-company-card" key={index}>
                      <div className="ai-company-logo" style={{ background: index === 0 ? '#f0fff4' : '#ebf8ff' }}>
                        <span className="fw-bold">#{index + 1}</span>
                      </div>
                      <div className="ai-company-info">
                        <div className="ai-company-name">{applicant.name}</div>
                        <div className="ai-company-detail">
                          Skills: {Array.isArray(applicant.skills) ? applicant.skills.join(', ') : 'N/A'}
                        </div>
                        <div className="ai-company-detail">
                          Grade: <span className={`ai-badge ${applicant.resumeGrade === 'A' ? 'ai-badge-success' : applicant.resumeGrade === 'B' ? 'ai-badge-info' : 'ai-badge-warning'}`}>
                            {applicant.resumeGrade}
                          </span>
                        </div>
                      </div>
                      <div className={`ai-company-score ${index === 0 ? 'text-success' : ''}`}>
                        {applicant.resumeScore}
                      </div>
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
