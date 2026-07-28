import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import SkillSelector from '../components/SkillSelector';
import ProjectManager from '../components/ProjectManager';
import InternshipManager from '../components/InternshipManager';
import { aiApi } from '../utils/aiApi';
import { getSession, setSession } from '../utils/userSession';
import '../styles/ai.css';

const languageOptions = ['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Punjabi', 'French', 'German', 'Spanish'];

export default function StudentProfile() {
  const navigate = useNavigate();
  const currentUser = getSession();

  if (!currentUser || currentUser.role !== 'student') {
    navigate('/login');
    return null;
  }

  const [profile, setProfile] = useState({
    name: '', phone: '', dateOfBirth: '', gender: '', address: '', city: '', state: '', country: '',
    collegeName: '', degree: '', branch: '', semester: '', passingYear: '', cgpa: '',
    skills: [], certifications: [], projects: [], internships: [], languages: [],
    github: '', linkedin: '', portfolio: '', bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    aiApi.getStudentProfile()
      .then((data) => {
        const p = data.data || {};
        setProfile({
          name: p.name || '', phone: p.phone || '', dateOfBirth: p.dateOfBirth || '', gender: p.gender || '',
          address: p.address || '', city: p.city || '', state: p.state || '', country: p.country || '',
          collegeName: p.collegeName || '', degree: p.degree || '', branch: p.branch || '',
          semester: p.semester || '', passingYear: p.passingYear || '', cgpa: p.cgpa || '',
          skills: p.skills || [], certifications: p.certifications || [],
          projects: p.projects || [], internships: p.internships || [], languages: p.languages || [],
          github: p.github || '', linkedin: p.linkedin || '', portfolio: p.portfolio || '', bio: p.bio || '',
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        showToast('Failed to load profile.', 'danger');
      });
  }, []);

  function showToast(text, type = 'success') {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await aiApi.updateStudentProfile(profile);
      if (data.data) {
        const updated = { ...currentUser, name: data.data.name };
        setSession(updated);
      }
      showToast('Profile saved successfully!');
      setEditMode(false);
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  function toggleLanguage(lang) {
    const current = profile.languages;
    if (current.includes(lang)) {
      setProfile({ ...profile, languages: current.filter((l) => l !== lang) });
    } else {
      setProfile({ ...profile, languages: [...current, lang] });
    }
  }

  if (loading) {
    return (
      <AppLayout role="student">
        <div className="ai-loading"><i className="bi bi-arrow-repeat" /> Loading profile...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role="student">
      <div className="container-fluid px-3" style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Toast notification */}
        {toast && (
          <div style={{
            position: 'fixed', top: 20, right: 20, zIndex: 9999,
            background: toast.type === 'danger' ? '#fee2e2' : '#d1fae5',
            color: toast.type === 'danger' ? '#991b1b' : '#065f46',
            border: `1px solid ${toast.type === 'danger' ? '#fecaca' : '#a7f3d0'}`,
            borderRadius: 12, padding: '14px 20px', fontWeight: 600, fontSize: 15,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <i className={`bi ${toast.type === 'danger' ? 'bi-exclamation-circle' : 'bi-check-circle-fill'}`} style={{ fontSize: 18 }} />
            {toast.text}
          </div>
        )}

        {/* Profile hero */}
        <div style={{
          background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
          borderRadius: 16, padding: '32px 36px', marginTop: 24, marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4299e1, #63b3ed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: '#fff',
            }}>
              {(profile.name || currentUser?.name || '?')[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 22 }}>{profile.name || currentUser?.name || 'Student'}</h3>
              <p style={{ margin: '4px 0 0', opacity: 0.75, fontSize: 14 }}>
                {profile.degree ? `${profile.degree}${profile.branch ? ` - ${profile.branch}` : ''}` : ''}
                {profile.collegeName ? ` | ${profile.collegeName}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            style={{
              background: editMode ? '#fff' : 'rgba(255,255,255,0.15)',
              color: editMode ? '#1a202c' : '#fff',
              border: 'none', borderRadius: 10, padding: '10px 20px',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              backdropFilter: 'blur(8px)',
            }}
          >
            <i className={`bi ${editMode ? 'bi-eye' : 'bi-pencil-square'}`} />
            {editMode ? 'View Profile' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Mode */}
        {editMode ? (
          <div className="ai-card">
            <div className="ai-card-header">
              <i className="bi bi-pencil-square" />
              <div>
                <h3>Edit Profile</h3>
                <p>Update your information below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <h5 className="fw-bold mt-2 mb-3" style={{ color: '#2c5282' }}>
                <i className="bi bi-person-lines-fill me-2" />Personal Information
              </h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="ai-form-label">Full Name *</label>
                  <input type="text" className="ai-form-input" name="name" value={profile.name} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">Mobile Number</label>
                  <input type="text" className="ai-form-input" name="phone" value={profile.phone} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">Date of Birth</label>
                  <input type="date" className="ai-form-input" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">Gender</label>
                  <select className="ai-form-input" name="gender" value={profile.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="ai-form-label">Address</label>
                  <input type="text" className="ai-form-input" name="address" value={profile.address} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">City</label>
                  <input type="text" className="ai-form-input" name="city" value={profile.city} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">State</label>
                  <input type="text" className="ai-form-input" name="state" value={profile.state} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">Country</label>
                  <input type="text" className="ai-form-input" name="country" value={profile.country} onChange={handleChange} />
                </div>
              </div>

              <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                <i className="bi bi-book-fill me-2" />Education
              </h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="ai-form-label">College Name</label>
                  <input type="text" className="ai-form-input" name="collegeName" value={profile.collegeName} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">Degree</label>
                  <input type="text" className="ai-form-input" name="degree" value={profile.degree} onChange={handleChange} placeholder="B.Tech, B.Sc, etc." />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">Branch / Major</label>
                  <input type="text" className="ai-form-input" name="branch" value={profile.branch} onChange={handleChange} placeholder="Computer Science" />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">Current Semester</label>
                  <input type="text" className="ai-form-input" name="semester" value={profile.semester} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">Passing Year</label>
                  <input type="text" className="ai-form-input" name="passingYear" value={profile.passingYear} onChange={handleChange} placeholder="2026" />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">CGPA</label>
                  <input type="number" step="0.1" className="ai-form-input" name="cgpa" value={profile.cgpa} onChange={handleChange} min="0" max="10" />
                </div>
              </div>

              <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                <i className="bi bi-tools me-2" />Skills
              </h5>
              <SkillSelector value={profile.skills} onChange={(val) => setProfile({ ...profile, skills: val })} />

              <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                <i className="bi bi-code-square me-2" />Projects
              </h5>
              <ProjectManager value={profile.projects} onChange={(val) => setProfile({ ...profile, projects: val })} />

              <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                <i className="bi bi-briefcase-fill me-2" />Internships
              </h5>
              <InternshipManager value={profile.internships} onChange={(val) => setProfile({ ...profile, internships: val })} />

              <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                <i className="bi bi-chat-dots-fill me-2" />Languages
              </h5>
              <div className="ai-skills-container mb-3">
                {languageOptions.map((lang) => (
                  <span key={lang} onClick={() => toggleLanguage(lang)}
                    className={`ai-skill-tag ${profile.languages.includes(lang) ? 'matched' : ''}`}
                    style={{ cursor: 'pointer' }}>
                    {lang}{profile.languages.includes(lang) ? ' ✓' : ''}
                  </span>
                ))}
              </div>

              <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                <i className="bi bi-link-45deg me-2" />Social Links
              </h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="ai-form-label">GitHub URL</label>
                  <input type="url" className="ai-form-input" name="github" value={profile.github} onChange={handleChange} placeholder="https://github.com/username" />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">LinkedIn URL</label>
                  <input type="url" className="ai-form-input" name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="col-md-4">
                  <label className="ai-form-label">Portfolio URL</label>
                  <input type="url" className="ai-form-input" name="portfolio" value={profile.portfolio} onChange={handleChange} placeholder="https://yourportfolio.com" />
                </div>
              </div>

              <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                <i className="bi bi-quote me-2" />About / Bio
              </h5>
              <textarea className="ai-form-input" name="bio" value={profile.bio} onChange={handleChange} rows="3"
                placeholder="Write a short bio about yourself..." style={{ minHeight: 80 }} />

              <div className="mt-4 d-flex gap-2">
                <button type="submit" className="ai-btn-primary" disabled={saving}>
                  {saving ? <><i className="bi bi-arrow-repeat me-1" /> Saving...</> : <><i className="bi bi-check-lg me-1" /> Save Profile</>}
                </button>
                <button type="button" className="ai-btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          /* View Mode */
          <div className="row g-4">

            {/* About section */}
            {profile.bio && (
              <div className="col-12">
                <div className="ai-card">
                  <h5 style={{ fontWeight: 700, color: '#1a202c', marginBottom: 12 }}>
                    <i className="bi bi-quote me-2" style={{ color: '#4299e1' }} />About
                  </h5>
                  <p style={{ color: '#4a5568', lineHeight: 1.7, margin: 0 }}>{profile.bio}</p>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="col-md-6">
              <div className="ai-card h-100">
                <h5 style={{ fontWeight: 700, color: '#1a202c', marginBottom: 16 }}>
                  <i className="bi bi-person-lines-fill me-2" style={{ color: '#4299e1' }} />Personal Details
                </h5>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {renderRow('Full Name', profile.name)}
                    {renderRow('Phone', profile.phone)}
                    {renderRow('Date of Birth', profile.dateOfBirth)}
                    {renderRow('Gender', profile.gender)}
                    {renderRow('Address', profile.address)}
                    {renderRow('City', profile.city)}
                    {renderRow('State', profile.state)}
                    {renderRow('Country', profile.country)}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Education */}
            <div className="col-md-6">
              <div className="ai-card h-100">
                <h5 style={{ fontWeight: 700, color: '#1a202c', marginBottom: 16 }}>
                  <i className="bi bi-book-fill me-2" style={{ color: '#4299e1' }} />Education
                </h5>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {renderRow('College', profile.collegeName)}
                    {renderRow('Degree', profile.degree)}
                    {renderRow('Branch', profile.branch)}
                    {renderRow('Semester', profile.semester)}
                    {renderRow('Passing Year', profile.passingYear)}
                    {renderRow('CGPA', profile.cgpa)}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Social Links */}
            {(profile.github || profile.linkedin || profile.portfolio) && (
              <div className="col-md-6">
                <div className="ai-card h-100">
                  <h5 style={{ fontWeight: 700, color: '#1a202c', marginBottom: 16 }}>
                    <i className="bi bi-link-45deg me-2" style={{ color: '#4299e1' }} />Social Links
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {profile.github && <SocialLink icon="bi-github" label="GitHub" url={profile.github} />}
                    {profile.linkedin && <SocialLink icon="bi-linkedin" label="LinkedIn" url={profile.linkedin} />}
                    {profile.portfolio && <SocialLink icon="bi-globe2" label="Portfolio" url={profile.portfolio} />}
                  </div>
                </div>
              </div>
            )}

            {/* Languages */}
            {profile.languages.length > 0 && (
              <div className="col-md-6">
                <div className="ai-card h-100">
                  <h5 style={{ fontWeight: 700, color: '#1a202c', marginBottom: 16 }}>
                    <i className="bi bi-chat-dots-fill me-2" style={{ color: '#4299e1' }} />Languages
                  </h5>
                  <div className="ai-skills-container">
                    {profile.languages.map((l) => (
                      <span key={l} className="ai-skill-tag matched">{l}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Skills */}
            {profile.skills.length > 0 && (
              <div className="col-12">
                <div className="ai-card">
                  <h5 style={{ fontWeight: 700, color: '#1a202c', marginBottom: 16 }}>
                    <i className="bi bi-tools me-2" style={{ color: '#4299e1' }} />Skills
                  </h5>
                  <div className="ai-skills-container">
                    {profile.skills.map((s) => (
                      <span key={s} className="ai-skill-tag">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Projects */}
            {profile.projects.length > 0 && (
              <div className="col-12">
                <div className="ai-card">
                  <h5 style={{ fontWeight: 700, color: '#1a202c', marginBottom: 16 }}>
                    <i className="bi bi-code-square me-2" style={{ color: '#4299e1' }} />Projects
                  </h5>
                  <div className="row g-3">
                    {profile.projects.map((proj, i) => (
                      <div className="col-md-6" key={i}>
                        <div style={{ background: '#f7fafc', borderRadius: 10, padding: 16, border: '1px solid #e2e8f0' }}>
                          <h6 style={{ fontWeight: 700, color: '#1a202c', marginBottom: 6 }}>{proj.title}</h6>
                          {proj.technologies && (
                            <p style={{ fontSize: 13, color: '#718096', marginBottom: 8 }}>
                              <i className="bi bi-cpu me-1" />{proj.technologies}
                            </p>
                          )}
                          <div style={{ display: 'flex', gap: 8 }}>
                            {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#4299e1' }}><i className="bi bi-github me-1" />Code</a>}
                            {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#4299e1' }}><i className="bi bi-box-arrow-up-right me-1" />Live</a>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Internships */}
            {profile.internships.length > 0 && (
              <div className="col-12">
                <div className="ai-card">
                  <h5 style={{ fontWeight: 700, color: '#1a202c', marginBottom: 16 }}>
                    <i className="bi bi-briefcase-fill me-2" style={{ color: '#4299e1' }} />Internships
                  </h5>
                  <div className="row g-3">
                    {profile.internships.map((inv, i) => (
                      <div className="col-md-6" key={i}>
                        <div style={{ background: '#f7fafc', borderRadius: 10, padding: 16, border: '1px solid #e2e8f0' }}>
                          <h6 style={{ fontWeight: 700, color: '#1a202c', marginBottom: 4 }}>{inv.role} @ {inv.company}</h6>
                          <p style={{ fontSize: 13, color: '#718096', margin: 0 }}>
                            {inv.duration && <><i className="bi bi-clock me-1" />{inv.duration}</>}
                            {inv.mode && <><span className="mx-2">|</span>{inv.mode}</>}
                          </p>
                          {inv.description && <p style={{ fontSize: 13, color: '#4a5568', marginTop: 8, marginBottom: 0 }}>{inv.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!profile.bio && !profile.skills.length && !profile.certifications.length && !profile.projects.length && !profile.internships.length && (
              <div className="col-12 text-center py-5">
                <div style={{ fontSize: 48, color: '#cbd5e0', marginBottom: 16 }}>
                  <i className="bi bi-person" />
                </div>
                <h5 style={{ color: '#718096' }}>No profile details yet</h5>
                <p style={{ color: '#a0aec0', marginBottom: 20 }}>Fill in your profile to showcase your skills and experience.</p>
                <button className="ai-btn-primary" onClick={() => setEditMode(true)}>
                  <i className="bi bi-pencil-square me-1" /> Complete Profile
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </AppLayout>
  );
}

function renderRow(label, value) {
  if (!value) return null;
  return (
    <tr>
      <td style={{ padding: '6px 12px 6px 0', color: '#718096', fontSize: 14, whiteSpace: 'nowrap', verticalAlign: 'top', fontWeight: 500 }}>{label}</td>
      <td style={{ padding: '6px 0', color: '#2d3748', fontSize: 14, fontWeight: 600 }}>{value}</td>
    </tr>
  );
}

function SocialLink({ icon, label, url }) {
  const displayUrl = url.length > 35 ? url.substring(0, 35) + '...' : url;
  return (
    <a href={url} target="_blank" rel="noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', borderRadius: 10, background: '#f7fafc',
        textDecoration: 'none', color: '#2d3748', border: '1px solid #e2e8f0',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#ebf8ff'; e.currentTarget.style.borderColor = '#90cdf4'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#f7fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
    >
      <i className={`bi ${icon}`} style={{ fontSize: 20, color: '#4299e1' }} />
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
        <div style={{ fontSize: 12, color: '#718096' }}>{displayUrl}</div>
      </div>
      <i className="bi bi-box-arrow-up-right" style={{ marginLeft: 'auto', fontSize: 14, color: '#a0aec0' }} />
    </a>
  );
}
