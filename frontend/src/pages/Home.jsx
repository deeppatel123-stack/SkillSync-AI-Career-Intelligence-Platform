import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import { opportunityApi } from '../utils/api';

export default function Home() {
  const [oppCount, setOppCount] = useState(0);

  useEffect(() => {
    opportunityApi.count().then((data) => setOppCount(data.count)).catch(() => { });
  }, []);

  return (
    <>
      <PublicNavbar />

      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 hero-content">
              <h1 className="hero-title">
                Connect. Collaborate.
                <br /> <span className="gradient-text">Succeed Together.</span>
              </h1>

              <p className="hero-text">
                SkillSync bridges Students, Colleges and Companies. Discover amazing opportunities, build your
                network, and accelerate your career journey with our all-in-one platform.
              </p>

              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg hero-btn-primary">
                  <i className="bi bi-rocket-takeoff-fill" /> Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline-primary btn-lg hero-btn-outline">
                  <i className="bi bi-box-arrow-in-right" /> Sign In
                </Link>
              </div>

              <div className="stats-row">
                <div className="stat-item">
                  <h3>5,000+</h3>
                  <p>Active Students</p>
                </div>
                <div className="stat-item">
                  <h3>200+</h3>
                  <p>Partners</p>
                </div>
                <div className="stat-item">
                  <h3>{oppCount > 0 ? `${oppCount}+` : '1,500+'}</h3>
                  <p>Opportunities</p>
                </div>
              </div>
            </div>

            <div className="col-lg-5 hero-cards">
              <div className="row">
                <div className="col-6 mb-4">
                  <div className="float-card card-1">
                    <div className="icon-wrapper icon-blue">
                      <i className="bi bi-briefcase-fill" />
                    </div>
                    <h4>Jobs</h4>
                    <p>Full-time Positions</p>
                  </div>
                </div>
                <div className="col-6 mb-4">
                  <div className="float-card card-2">
                    <div className="icon-wrapper icon-blue">
                      <i className="bi bi-building" />
                    </div>
                    <h4>Internships</h4>
                    <p>Gain Experience</p>
                  </div>
                </div>
                <div className="col-6 mb-4">
                  <div className="float-card card-3">
                    <div className="icon-wrapper icon-green">
                      <i className="bi bi-code-slash" />
                    </div>
                    <h4>Hackathons</h4>
                    <p>Compete & Win</p>
                  </div>
                </div>
                <div className="col-6 mb-4">
                  <div className="float-card card-4">
                    <div className="icon-wrapper icon-orange">
                      <i className="bi bi-calendar-event-fill" />
                    </div>
                    <h4>Events</h4>
                    <p>Network & Learn</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title-large">Why Choose SkillSync?</h2>
            <p className="section-subtitle-large">Everything you need to succeed in one platform</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="why-card">
                <div className="card-icon-wrapper">
                  <i className="bi bi-person-fill" />
                </div>
                <h4>For Students</h4>
                <p className="card-description">
                  Browse and apply for hackathons, internships, jobs, and events. Track your applications and stay
                  updated with real-time notifications.
                </p>
                <ul className="benefit-list">
                  <li>
                    <i className="bi bi-check-circle-fill" /> Easy application tracking
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill" /> Personalized recommendations
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill" /> Direct company connections
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="why-card">
                <div className="card-icon-wrapper">
                  <i className="bi bi-building" />
                </div>
                <h4>For Colleges</h4>
                <p className="card-description">
                  Publish academic events, meetups, hackathons, and placement drives. Manage student applications
                  efficiently.
                </p>
                <ul className="benefit-list">
                  <li>
                    <i className="bi bi-check-circle-fill" /> Event management tools
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill" /> Student analytics
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill" /> Automated notifications
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mx-auto">
              <div className="why-card">
                <div className="card-icon-wrapper">
                  <i className="bi bi-briefcase-fill" />
                </div>
                <h4>For Companies</h4>
                <p className="card-description">
                  Post internships, job openings, and hackathons. Connect with talented students and manage
                  applications seamlessly.
                </p>
                <ul className="benefit-list">
                  <li>
                    <i className="bi bi-check-circle-fill" /> Talent pool access
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill" /> Application management
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill" /> Brand visibility
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Get Started?</h2>
              <p>Join thousands of students, colleges, and companies already using SkillSync to shape the future</p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/register" className="btn btn-light btn-lg cta-btn">
                  <i className="bi bi-rocket-takeoff-fill" /> Create Your Free Account
                </Link>
                <Link to="/admin/login" className="btn btn-outline-light btn-lg cta-btn">
                  <i className="bi bi-shield-lock" /> Admin Portal
                </Link>
              </div>
              <p className="cta-note">No credit card required • Free forever • Join in 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
