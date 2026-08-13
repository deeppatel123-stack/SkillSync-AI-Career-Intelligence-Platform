import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { aiApi } from '../utils/aiApi';
import { getSession } from '../utils/userSession';
import '../styles/resume.css';

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const currentUser = getSession();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') {
      navigate('/login');
      return;
    }
    aiApi
      .getStudentProfile()
      .then((data) => {
        setProfile(data.data || {});
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setProfile({});
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !currentUser || currentUser.role !== 'student') {
    return (
      <AppLayout role="student">
        <div className="ai-loading"><i className="bi bi-arrow-repeat" /> Loading resume...</div>
      </AppLayout>
    );
  }

  const p = profile || {};

  return (
    <AppLayout role="student">
      <div className="container-fluid px-3" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="page-header">
          <div>
            <h2 className="page-title">Resume Builder</h2>
            <p className="page-subtitle">Your resume is generated from your profile. Click Print to save as PDF.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            <i className="bi bi-printer me-1" /> Print / Save PDF
          </button>
        </div>

        <div className="resume-sheet">
          <header className="resume-header">
            <h1>{p.name || 'Your Name'}</h1>
            <p>
              {[p.degree, p.branch].filter(Boolean).join(' - ')}
              {p.collegeName ? ` | ${p.collegeName}` : ''}
            </p>
            <p className="resume-contact">
              {p.phone && <span><i className="bi bi-telephone" /> {p.phone}</span>}
              {currentUser?.email && <span><i className="bi bi-envelope" /> {currentUser.email}</span>}
              {p.city && <span><i className="bi bi-geo-alt" /> {p.city}{p.state ? `, ${p.state}` : ''}</span>}
            </p>
            <p className="resume-links">
              {p.github && <span><i className="bi bi-github" /> {p.github}</span>}
              {p.linkedin && <span><i className="bi bi-linkedin" /> {p.linkedin}</span>}
              {p.portfolio && <span><i className="bi bi-globe2" /> {p.portfolio}</span>}
            </p>
          </header>

          {p.bio && (
            <section>
              <h2>Summary</h2>
              <p>{p.bio}</p>
            </section>
          )}

          <section>
            <h2>Education</h2>
            <div className="resume-row">
              <div>
                <strong>{p.degree || 'Degree'}{p.branch ? ` - ${p.branch}` : ''}</strong>
                <p>{p.collegeName || ''}</p>
              </div>
              <div className="resume-meta">
                {p.semester && <span>Semester: {p.semester}</span>}
                {p.passingYear && <span>Passing Year: {p.passingYear}</span>}
                {p.cgpa && <span>CGPA: {p.cgpa}</span>}
              </div>
            </div>
          </section>

          {p.skills?.length > 0 && (
            <section>
              <h2>Skills</h2>
              <div className="resume-skill-tags">
                {p.skills.map((s) => <span key={s}>{s}</span>)}
              </div>
            </section>
          )}

          {p.projects?.length > 0 && (
            <section>
              <h2>Projects</h2>
              {p.projects.map((proj, i) => (
                <div className="resume-row" key={i}>
                  <div>
                    <strong>{proj.title}</strong>
                    {proj.technologies && <p>{proj.technologies}</p>}
                  </div>
                  <div className="resume-meta">
                    {proj.githubLink && <a href={proj.githubLink}>GitHub</a>}
                    {proj.liveLink && <a href={proj.liveLink}>Live</a>}
                  </div>
                </div>
              ))}
            </section>
          )}

          {p.internships?.length > 0 && (
            <section>
              <h2>Internships</h2>
              {p.internships.map((inv, i) => (
                <div className="resume-row" key={i}>
                  <div>
                    <strong>{inv.role} @ {inv.company}</strong>
                    {inv.description && <p>{inv.description}</p>}
                  </div>
                  <div className="resume-meta">
                    {inv.duration && <span>{inv.duration}</span>}
                    {inv.mode && <span>{inv.mode}</span>}
                  </div>
                </div>
              ))}
            </section>
          )}

          {p.certifications?.length > 0 && (
            <section>
              <h2>Certifications</h2>
              <ul>
                {p.certifications.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </section>
          )}

          {p.languages?.length > 0 && (
            <section>
              <h2>Languages</h2>
              <p>{p.languages.join(', ')}</p>
            </section>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
