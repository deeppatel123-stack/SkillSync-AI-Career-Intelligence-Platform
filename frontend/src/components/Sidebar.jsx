import { Link, useLocation } from 'react-router-dom';
import { authApi } from '../utils/api';
import { clearSession, getSession } from '../utils/userSession';

const studentLinks = [
  { to: '/student/dashboard', icon: 'bi-grid-fill', label: 'Dashboard' },
  { to: '/student/profile', icon: 'bi-person-fill', label: 'My Profile' },
  { to: '/opportunities', icon: 'bi-search', label: 'Opportunities' },
  { to: '/student/saved', icon: 'bi-bookmark-star-fill', label: 'Saved Items' },
  { to: '/applications', icon: 'bi-file-text-fill', label: 'My Applications' },
  { to: '/student/interviews', icon: 'bi-calendar-event-fill', label: 'Interview Calendar' },
  { to: '/student/drives', icon: 'bi-building-gear', label: 'Campus Drives' },
  // AI & Learning
  { to: '/ai/profile-analysis', icon: 'bi-cpu-fill', label: 'Profile Analysis' },
  { to: '/ai/career-role', icon: 'bi-briefcase-fill', label: 'Career Recommendation' },
  { to: '/ai/skill-gap', icon: 'bi-exclamation-triangle-fill', label: 'Skill Gap Analysis' },
  { to: '/learning-hub/roadmap', icon: 'bi-signpost-2-fill', label: 'Learning Hub' },
  { to: '/resume', icon: 'bi-file-earmark-arrow-down-fill', label: 'Resume Builder' },
];

const collegeLinks = [
  { to: '/college/dashboard', icon: 'bi-grid-fill', label: 'Placement Dashboard' },
  { to: '/college/drives', icon: 'bi-building-gear', label: 'Campus Drives' },
  { to: '/college/students', icon: 'bi-people-fill', label: 'Student Directory' },
  { to: '/college/events', icon: 'bi-calendar-event-fill', label: 'College Events' },
  { to: '/opportunities', icon: 'bi-list-ul', label: 'Active Opportunities' },
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
  { to: '/profile', icon: 'bi-building-fill', label: 'Company Profile' },
];

const adminLinks = [
  { key: 'dashboard', icon: 'bi-grid-fill', label: 'Dashboard' },
  { key: 'opportunities', icon: 'bi-briefcase-fill', label: 'Opportunities' },
  { key: 'applications', icon: 'bi-file-text-fill', label: 'Applications' },
  { key: 'users', icon: 'bi-people-fill', label: 'All Users' },
  { key: 'profile', icon: 'bi-person-fill', label: 'Profile' },
];

export default function Sidebar({
  role,
  active = false,
  adminSection,
  onAdminSectionChange,
  onLogout,
}) {
  const location = useLocation();
  const session = getSession();
  const activeRole = role || session?.role || 'student';

  const isDarkAdmin = activeRole === 'admin' || activeRole === 'superadmin';

  if (isDarkAdmin) {
    return (
      <aside className={`sidebar ${active ? 'active' : ''}`} id="sidebar">
        <div className="sidebar-brand">
          <i className="bi bi-shield-lock-fill me-2 text-primary" /> Admin Panel
        </div>
        <div className="sidebar-menu">
          {adminLinks.map((link) => (
            <a
              key={link.key}
              href="#section"
              className={`sidebar-link ${adminSection === link.key ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onAdminSectionChange?.(link.key);
              }}
            >
              <i className={`bi ${link.icon}`} /> <span>{link.label}</span>
            </a>
          ))}
        </div>
        <div className="sidebar-footer">
          <a
            href="#logout"
            className="sidebar-link logout-link"
            onClick={(e) => {
              e.preventDefault();
              authApi.logout().catch(() => {});
              clearSession();
              onLogout?.();
            }}
          >
            <i className="bi bi-box-arrow-left" /> <span>Logout</span>
          </a>
        </div>
      </aside>
    );
  }

  let links = studentLinks;
  if (activeRole === 'college' || activeRole === 'organizer') links = collegeLinks;
  else if (activeRole === 'company') links = companyLinks;

  const roleTitle = activeRole === 'college' || activeRole === 'organizer' 
    ? 'College Portal' 
    : activeRole === 'company' 
    ? 'Recruiter Suite' 
    : 'SkillSync';

  return (
    <aside className={`sidebar ${active ? 'active' : ''}`} id="sidebar">
      <div className="sidebar-brand">
        <i className="bi bi-bezier2 me-2 text-primary" /> {roleTitle}
      </div>
      <div className="sidebar-menu">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to} className={`sidebar-link ${isActive ? 'active' : ''}`}>
              <i className={`bi ${link.icon}`} /> <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="sidebar-footer">
        <Link
          to="/login"
          className="sidebar-link logout-link"
          onClick={() => {
            authApi.logout().catch(() => {});
            clearSession();
            onLogout?.();
          }}
        >
          <i className="bi bi-box-arrow-left" /> <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}

