import { Link, NavLink } from 'react-router-dom';

export default function PublicNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light main-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-bezier2" /> <span>SkillSync</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="ms-auto nav-pill">
            <NavLink className="nav-link" to="/" end>
              <i className="bi bi-house-door-fill" /> Home
            </NavLink>
            <NavLink className="nav-link" to="/login">
              <i className="bi bi-box-arrow-in-right" /> Login
            </NavLink>
            <NavLink className="nav-link" to="/admin/login">
              <i className="bi bi-shield-lock" /> Admin
            </NavLink>
            <NavLink
              className={({ isActive }) => `nav-link register-btn${isActive ? ' active' : ''}`}
              to="/register"
            >
              <i className="bi bi-person-plus-fill" /> Register
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
