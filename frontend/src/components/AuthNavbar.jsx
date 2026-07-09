import { Link } from 'react-router-dom';

export default function AuthNavbar({ actionLabel, actionTo, actionIcon = 'bi-person-plus-fill' }) {
  return (
    <nav className="navbar navbar-light main-navbar">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-bezier2" /> <span>SkillSync</span>
        </Link>
        <Link to={actionTo} className="nav-link-btn">
          <i className={`bi ${actionIcon}`} /> {actionLabel}
        </Link>
      </div>
    </nav>
  );
}
