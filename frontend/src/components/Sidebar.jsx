import { Link, useLocation } from 'react-router-dom';
import { authApi } from '../utils/api';
import { clearSession } from '../utils/userSession';

const studentLinks = [
  { to: '/student/dashboard', icon: 'bi-grid-fill', label: 'Dashboard' },
  { to: '/student/profile', icon: 'bi-person-fill', label: 'My Profile' },
  { to: '/opportunities', icon: 'bi-search', label: 'Opportunities' },
  { to: '/student/saved', icon: 'bi-bookmark-star-fill', label: 'Saved Items' },
  { to: '/applications', icon: 'bi-file-text-fill', label: 'My Applications' },
  { to: '/student/interviews', icon: 'bi-calendar-event-fill', label: 'Interview Calendar' },
  { to: '/student/drives', icon: 'bi-building-gear', label: 'Campus Drives' },
  // AI & Learning
  { to: '/ai/profile-analysis', icon: 'bi-file-earmark-text', label: 'Profile Analysis' },
  { to: '/ai/career-role', icon: 'bi-briefcase-fill', label: 'Career Recommendation' },
  { to: '/ai/skill-gap', icon: 'bi-exclamation-triangle', label: 'Skill Gap Analysis' },
  { to: '/learning-hub/roadmap', icon: 'bi-signpost-2', label: 'Learning Hub' },
  { to: '/resume', icon: 'bi-file-earmark-arrow-down', label: 'Resume Builder' },
];

const collegeLinks = [
  { to: '/college/dashboard', icon: 'bi-grid-fill', label: 'Placement Dashboard' },
  { to: '/college/drives', icon: 'bi-building-gear', label: 'Campus Drives' },
  { to: '/college/students', icon: 'bi-people-fill', label: 'Student Directory' },
  { to: '/college/events', icon: 'bi-calendar-event', label: 'College Events' },
  { to: '/opportunities', icon: 'bi-list-ul', label: 'Opportunities' },
  { to: '/opportunities/add', icon: 'bi-plus-circle-fill', label: 'Post Opportunity' },
  { to: '/applications', icon: 'bi-file-text-fill', label: 'Applications' },
  { to: '/profile', icon: 'bi-person-badge-fill', label: 'College Profile' },
];

const companyLinks = [
  { to: '/company/dashboard', icon: 'bi-speedometer2', label: 'Recruitment Dashboard' },
  { to: '/opportunities/add', icon: 'bi-plus-circle-fill', label: 'Post Job / Internship' },
  { to: '/opportunities', icon: 'bi-briefcase-fill', label: 'My Active Postings' },
  { to: '/applications', icon: 'bi-diagram-3-fill', label: 'Recruitment Pipeline' },
  { to: '/company/candidates', icon: 'bi-person-search', label: 'Candidate Search' },
  { to: '/company/interviews', icon: 'bi-calendar-check-fill', label: 'Scheduled Interviews' },
  { to: '/profile', icon: 'bi-building', label: 'Company Profile' },
];

const adminLinks = [
  { key: 'dashboard', icon: 'bi-grid-fill', label: 'Dashboard' },
  { key: 'opportunities', icon: 'bi-briefcase-fill', label: 'Opportunities' },
  { key: 'applications', icon: 'bi-file-text-fill', label: 'Applications' },
  { key: 'users', icon: 'bi-people-fill', label: 'All Users' },
  { key: 'profile', icon: 'bi-person-fill', label: 'Profile' },
];

export default function Sidebar({
  role = 'student',
  active = false,
  adminSection,
  onAdminSectionChange,
  onLogout,
}) {
  const location = useLocation();

  if (role === 'admin' || role === 'superadmin') {
    return (
      <aside className={`sidebar ${active ? 'active' : ''}`} id="sidebar">
        <h3>
          <i className="bi bi-shield-lock" /> Admin Panel
        </h3>
        {adminLinks.map((link) => (
          <a
            key={link.key}
            href="#section"
            className={adminSection === link.key ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              onAdminSectionChange?.(link.key);
            }}
          >
            <i className={`bi ${link.icon}`} /> {link.label}
          </a>
        ))}
        <a
          href="#logout"
          className="logout-link"
          onClick={(e) => {
            e.preventDefault();
            onLogout?.();
          }}
        >
          <i className="bi bi-box-arrow-left" /> Logout
        </a>
      </aside>
    );
  }

  let links = studentLinks;
  if (role === 'college') links = collegeLinks;
  else if (role === 'company') links = companyLinks;
  else if (role === 'organizer') links = collegeLinks;

  const roleTitle = role === 'college' ? 'College Portal' : role === 'company' ? 'Recruiter Suite' : 'SkillSync';

  return (
    <aside className={`sidebar ${active ? 'active' : ''}`} id="sidebar">
      <h3>
        <i className="bi bi-bezier2" /> {roleTitle}
      </h3>
      {links.map((link) => (
        <Link key={link.to} to={link.to} className={location.pathname === link.to ? 'active' : ''}>
          <i className={`bi ${link.icon}`} /> {link.label}
        </Link>
      ))}
      <Link
        to="/login"
        className="logout-link"
        onClick={() => {
          authApi.logout().catch(() => { });
          clearSession();
          onLogout?.();
        }}
      >
        <i className="bi bi-box-arrow-left" /> Logout
      </Link>
    </aside>
  );
}
