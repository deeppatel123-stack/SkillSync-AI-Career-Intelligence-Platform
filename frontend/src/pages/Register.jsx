import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import AuthSidePanel from '../components/AuthSidePanel';
import { authApi } from '../utils/api';
import { getDashboardPath, setSession } from '../utils/userSession';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const role = e.target.role.value;

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (!role) {
      setError('Please select a role (Student, College, or Company).');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const data = await authApi.register({
        name: e.target.name.value.trim(),
        email: e.target.email.value.trim(),
        password,
        role,
      });
      setSession(data.user);
      navigate(getDashboardPath(role));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar actionLabel="Login" actionTo="/login" actionIcon="bi-box-arrow-in-right" />

      <div className="auth-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <div className="auth-container">
                <div className="row g-0">
                  <AuthSidePanel
                    title="Create Your Account"
                    description="Join SkillSync to explore internships, jobs, hackathons and events curated just for you."
                    features={[
                      { icon: 'bi-check-circle-fill', text: 'One profile, all opportunities' },
                      { icon: 'bi-check-circle-fill', text: 'Connect with colleges & companies' },
                      { icon: 'bi-check-circle-fill', text: 'Track your progress easily' },
                    ]}
                  />

                  <div className="col-md-7">
                    <div className="auth-card">
                      <div className="auth-header">
                        <h3>
                          <i className="bi bi-person-plus-fill" /> Create Account
                        </h3>
                        <p className="text-muted">Fill in your details to get started</p>
                      </div>

                      {error && <div className="alert alert-danger">{error}</div>}

                      <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="input-group-custom">
                              <label htmlFor="name">
                                <i className="bi bi-person-fill" /> Full Name
                              </label>
                              <input id="name" name="name" className="form-control" placeholder="Enter your full name" required />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-group-custom">
                              <label htmlFor="email">
                                <i className="bi bi-envelope-fill" /> Email Address
                              </label>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                className="form-control"
                                placeholder="your.email@example.com"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="input-group-custom mt-3">
                          <label htmlFor="role">
                            <i className="bi bi-people-fill" /> Select Role
                          </label>
                          <select id="role" name="role" className="form-select" required defaultValue="">
                            <option value="">Select Role</option>
                            <option value="student">Student</option>
                            <option value="college">College</option>
                            <option value="company">Company</option>
                          </select>
                          <small className="text-muted d-block mt-1">
                            Choose College or Company to post and manage opportunities.
                          </small>
                        </div>

                        <div className="row g-3 mt-1">
                          <div className="col-md-6">
                            <div className="input-group-custom password-group">
                              <label htmlFor="password">
                                <i className="bi bi-lock-fill" /> Password
                              </label>
                              <div className="password-input-wrapper">
                                <input
                                  id="password"
                                  name="password"
                                  type={showPassword ? 'text' : 'password'}
                                  className="form-control"
                                  placeholder="Create a password"
                                  required
                                />
                                <button
                                  type="button"
                                  className="password-toggle-btn"
                                  onClick={() => setShowPassword((prev) => !prev)}
                                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                  <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-group-custom password-group">
                              <label htmlFor="confirmPassword">
                                <i className="bi bi-lock-fill" /> Confirm Password
                              </label>
                              <div className="password-input-wrapper">
                                <input
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  className="form-control"
                                  placeholder="Re-enter your password"
                                  required
                                />
                                <button
                                  type="button"
                                  className="password-toggle-btn"
                                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                  <i className={showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-4 btn-auth" disabled={loading}>
                          <i className="bi bi-person-plus-fill" /> {loading ? 'Creating...' : 'Create Account'}
                        </button>
                      </form>

                      <div className="auth-footer">
                        <p>
                          Already have an account? <Link to="/login">Login here</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
