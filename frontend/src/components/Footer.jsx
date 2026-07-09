import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="modern-footer">
      <div className="container">
        <div className="footer-top">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="footer-brand-area">
                <h3>
                  <i className="bi bi-bezier2" /> SkillSync
                </h3>
                <p>
                  Bridging the gap between students, colleges, and companies through a unified platform for
                  opportunities and growth.
                </p>
                <div className="social-links">
                  <a href="#linkedin" aria-label="LinkedIn">
                    <i className="bi bi-linkedin" />
                  </a>
                  <a href="#twitter" aria-label="Twitter">
                    <i className="bi bi-twitter-x" />
                  </a>
                  <a href="#github" aria-label="GitHub">
                    <i className="bi bi-github" />
                  </a>
                  <a href="#instagram" aria-label="Instagram">
                    <i className="bi bi-instagram" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-6">
              <h5 className="footer-title">Platform</h5>
              <ul className="footer-links-list">
                <li>
                  <Link to="/opportunities">Browse Jobs</Link>
                </li>
                <li>
                  <Link to="/opportunities">Internships</Link>
                </li>
                <li>
                  <Link to="/opportunities">Hackathons</Link>
                </li>
                <li>
                  <Link to="/opportunities">Events</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-6">
              <h5 className="footer-title">Quick Links</h5>
              <ul className="footer-links-list">
                <li>
                  <Link to="/login">Sign In</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
                <li>
                  <Link to="/">About Us</Link>
                </li>
                <li>
                  <a href="#contact">Contact Support</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-6">
              <h5 className="footer-title">Subscribe to Newsletter</h5>
              <p className="small text-muted mb-3">Get the latest opportunities delivered to your inbox.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" aria-label="Email" />
                <button type="button" className="btn btn-primary">
                  <i className="bi bi-send" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <p className="mb-0">&copy; 2026 SkillSync. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <span className="dot" />
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
