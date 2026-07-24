import { Link, useLocation } from 'react-router-dom';
import { authApi } from '../utils/api';
import { clearSession } from '../utils/userSession';

const studentLinks = [
  { to: '/student/dashboard', icon: 'bi-grid-fill', label: 'Dashboard' },
  { to: '/student/profile', icon: 'bi-person-fill', label: 'My Profile' },
  { to: '/opportunities', icon: 'bi-search', label: 'Opportunities' },
  { to: '/applications', icon: 'bi-file-text-fill', label: 'Applications' },
  // AI Features
  { to: '/ai/resume-analysis', icon: 'bi-file-earmark-text', label: 'Resume Analysis' },
  { to: '/ai/career-role', icon: 'bi-briefcase-fill', label: 'Career Recommendation' },
  { to: '/ai/skill-gap', icon: 'bi-exclamation-triangle', label: 'Skill Gap Analysis' },
  { to: '/ai/trending-skills', icon: 'bi-graph-up', label: 'Trending Skills' },
  // Learning Hub
  { to: '/learning-hub/roadmap', icon: 'bi-signpost-2', label: 'Learning Hub' },
];

const organizerLinks = [
  { to: '/organizer/dashboard', icon: 'bi-grid-fill', label: 'Dashboard' },
  { to: '/opportunities/add', icon: 'bi-plus-circle-fill', label: 'Post Opportunity' },
  { to: '/opportunities', icon: 'bi-list-ul', label: 'My Opportunities' },
  { to: '/applications', icon: 'bi-file-text-fill', label: 'Review Applications' },
  { to: '/ai/placement-statistics', icon: 'bi-bar-chart-fill', label: 'Placement Stats' },
  { to: '/profile', icon: 'bi-person-fill', label: 'Profile' },
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

  if (role === 'admin') {
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

  const links = role === 'student' ? studentLinks : organizerLinks;

  return (
    <aside className={`sidebar ${active ? 'active' : ''}`} id="sidebar">
      <h3>
        <i className="bi bi-bezier2" /> SkillSync
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
