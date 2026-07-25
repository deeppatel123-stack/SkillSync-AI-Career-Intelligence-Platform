import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function AuthNavbar({ actionLabel, actionTo, actionIcon = 'bi-person-plus-fill' }) {
  return (
    <nav className="navbar navbar-light main-navbar">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-bezier2" /> <span>SkillSync</span>
        </Link>
        <div className="d-flex align-items-center gap-2">
          <ThemeToggle />
          <Link to={actionTo} className="nav-link-btn">
            <i className={`bi ${actionIcon}`} /> {actionLabel}
          </Link>
        </div>
      </div>
    </nav>
  );
}
