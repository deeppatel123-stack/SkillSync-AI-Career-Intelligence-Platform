import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import SkillSelector from '../components/SkillSelector';
import CertificationSelector from '../components/CertificationSelector';
import ProjectManager from '../components/ProjectManager';
import InternshipManager from '../components/InternshipManager';
import { aiApi } from '../utils/aiApi';
import { getSession, setSession } from '../utils/userSession';
import '../styles/ai.css';

export default function StudentProfile() {
  const navigate = useNavigate();
  const currentUser = getSession();

  // Redirect if not logged in
  if (!currentUser || currentUser.role !== 'student') {
    navigate('/login');
    return null;
  }

  // ============ Profile State ============
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    collegeName: '',
    degree: '',
    branch: '',
    semester: '',
    passingYear: '',
    cgpa: '',
    skills: [],
    certifications: [],
    projects: [],
    internships: [],
    languages: [],
    github: '',
    linkedin: '',
    portfolio: '',
    bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ============ Load Profile ============
  useEffect(() => {
    aiApi.getStudentProfile()
      .then((data) => {
        const p = data.data || {};
        setProfile({
          name: p.name || '',
          phone: p.phone || '',
          dateOfBirth: p.dateOfBirth || '',
          gender: p.gender || '',
          address: p.address || '',
          city: p.city || '',
          state: p.state || '',
          country: p.country || '',
          collegeName: p.collegeName || '',
          degree: p.degree || '',
          branch: p.branch || '',
          semester: p.semester || '',
          passingYear: p.passingYear || '',
          cgpa: p.cgpa || '',
          skills: p.skills || [],
          certifications: p.certifications || [],
          projects: p.projects || [],
          internships: p.internships || [],
          languages: p.languages || [],
          github: p.github || '',
          linkedin: p.linkedin || '',
          portfolio: p.portfolio || '',
          bio: p.bio || '',
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setMessage({ type: 'danger', text: 'Failed to load profile.' });
      });
  }, []);

  // ============ Save Profile ============
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const data = await aiApi.updateStudentProfile(profile);
      // Update session with new name if changed
      if (data.data) {
        const updated = { ...currentUser, name: data.data.name };
        setSession(updated);
      }
      setMessage({ type: 'success', text: 'Profile saved successfully!' });

      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  // ============ Handle simple field changes ============
  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  // ============ Language handling ============
  const languageOptions = ['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Punjabi', 'French', 'German', 'Spanish'];

  function toggleLanguage(lang) {
    if (profile.languages.includes(lang)) {
      setProfile({ ...profile, languages: profile.languages.filter((l) => l !== lang) });
    } else {
      setProfile({ ...profile, languages: [...profile.languages, lang] });
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
      <div className="container-fluid px-3">
        <div className="row">
          <div className="col-12">
            <div className="ai-card">
              <div className="ai-card-header">
                <i className="bi bi-person-fill" />
                <div>
                  <h3>Student Profile</h3>
                  <p>Complete your profile to get better career recommendations and placement predictions</p>
                </div>
              </div>

              {message.text && (
                <div className={`alert alert-${message.type} py-2`} role="alert">
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* ======== Personal Information ======== */}
                <h5 className="fw-bold mt-3 mb-3" style={{ color: '#2c5282' }}>
                  <i className="bi bi-person-lines-fill me-2" />Personal Information
                </h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="ai-form-label">Full Name *</label>
                    <input type="text" className="ai-form-input" name="name"
                      value={profile.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Mobile Number</label>
                    <input type="text" className="ai-form-input" name="phone"
                      value={profile.phone} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Date of Birth</label>
                    <input type="date" className="ai-form-input" name="dateOfBirth"
                      value={profile.dateOfBirth} onChange={handleChange} />
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
                    <input type="text" className="ai-form-input" name="address"
                      value={profile.address} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">City</label>
                    <input type="text" className="ai-form-input" name="city"
                      value={profile.city} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">State</label>
                    <input type="text" className="ai-form-input" name="state"
                      value={profile.state} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Country</label>
                    <input type="text" className="ai-form-input" name="country"
                      value={profile.country} onChange={handleChange} />
                  </div>
                </div>

                {/* ======== Education ======== */}
                <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                  <i className="bi bi-book-fill me-2" />Education
                </h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="ai-form-label">College Name</label>
                    <input type="text" className="ai-form-input" name="collegeName"
                      value={profile.collegeName} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Degree</label>
                    <input type="text" className="ai-form-input" name="degree"
                      value={profile.degree} onChange={handleChange} placeholder="B.Tech, B.Sc, etc." />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Branch / Major</label>
                    <input type="text" className="ai-form-input" name="branch"
                      value={profile.branch} onChange={handleChange} placeholder="Computer Science" />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Current Semester</label>
                    <input type="text" className="ai-form-input" name="semester"
                      value={profile.semester} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Passing Year</label>
                    <input type="text" className="ai-form-input" name="passingYear"
                      value={profile.passingYear} onChange={handleChange} placeholder="2026" />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">CGPA</label>
                    <input type="number" step="0.1" className="ai-form-input" name="cgpa"
                      value={profile.cgpa} onChange={handleChange} min="0" max="10" />
                  </div>
                </div>

                {/* ======== Skills ======== */}
                <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                  <i className="bi bi-tools me-2" />Skills
                </h5>
                <SkillSelector value={profile.skills} onChange={(val) => setProfile({ ...profile, skills: val })} />

                {/* ======== Certifications ======== */}
                <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                  <i className="bi bi-patch-check-fill me-2" />Certifications
                </h5>
                <CertificationSelector value={profile.certifications}
                  onChange={(val) => setProfile({ ...profile, certifications: val })} />

                {/* ======== Projects ======== */}
                <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                  <i className="bi bi-code-square me-2" />Projects
                </h5>
                <ProjectManager value={profile.projects}
                  onChange={(val) => setProfile({ ...profile, projects: val })} />

                {/* ======== Internships ======== */}
                <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                  <i className="bi bi-briefcase-fill me-2" />Internships
                </h5>
                <InternshipManager value={profile.internships}
                  onChange={(val) => setProfile({ ...profile, internships: val })} />

                {/* ======== Languages ======== */}
                <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                  <i className="bi bi-chat-dots-fill me-2" />Languages
                </h5>
                <div className="ai-skills-container mb-3">
                  {languageOptions.map((lang) => (
                    <span
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`ai-skill-tag ${profile.languages.includes(lang) ? 'matched' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {lang}
                      {profile.languages.includes(lang) ? ' ✓' : ''}
                    </span>
                  ))}
                </div>

                {/* ======== Social Links ======== */}
                <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                  <i className="bi bi-link-45deg me-2" />Social Links
                </h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="ai-form-label">GitHub URL</label>
                    <input type="url" className="ai-form-input" name="github"
                      value={profile.github} onChange={handleChange} placeholder="https://github.com/username" />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">LinkedIn URL</label>
                    <input type="url" className="ai-form-input" name="linkedin"
                      value={profile.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
                  </div>
                  <div className="col-md-4">
                    <label className="ai-form-label">Portfolio URL</label>
                    <input type="url" className="ai-form-input" name="portfolio"
                      value={profile.portfolio} onChange={handleChange} placeholder="https://yourportfolio.com" />
                  </div>
                </div>

                {/* ======== Bio ======== */}
                <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2c5282' }}>
                  <i className="bi bi-quote me-2" />About / Bio
                </h5>
                <textarea
                  className="ai-form-input"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Write a short bio about yourself..."
                  style={{ minHeight: 80 }}
                />

                {/* ======== Save ======== */}
                <div className="mt-4">
                  <button type="submit" className="ai-btn-primary" disabled={saving}>
                    {saving ? (
                      <><i className="bi bi-arrow-repeat me-1" /> Saving...</>
                    ) : (
                      <><i className="bi bi-check-lg me-1" /> Save Profile</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
