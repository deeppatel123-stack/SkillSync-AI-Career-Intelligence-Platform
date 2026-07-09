import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import AuthSidePanel from '../components/AuthSidePanel';
import { authApi } from '../utils/api';

export default function AdminRegister() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const form = e.target;
    const password = form.adminPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long!');
      return;
    }

    setLoading(true);
    try {
      await authApi.adminRegister({
        name: form.adminName.value.trim(),
        email: form.adminEmail.value.trim(),
        password,
        organization: form.organization.value.trim(),
        phone: form.adminPhone?.value?.trim() || '',
      });
      setSuccess('Admin account created successfully! You can now login.');
      form.reset();
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar actionLabel="Admin Login" actionTo="/admin/login" actionIcon="bi-box-arrow-in-right" />

      <div className="auth-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <div className="auth-container">
                <div className="row g-0">
                  <AuthSidePanel
                    title="Request Admin Access"
                    description="Register for administrator privileges to manage the SkillSync platform and oversee all users and content."
                    features={[
                      { icon: 'bi-shield-lock', text: 'Full Platform Control' },
                      { icon: 'bi-people', text: 'User Management' },
                      { icon: 'bi-bar-chart', text: 'Advanced Analytics' },
                    ]}
                  />

                  <div className="col-md-7">
                    <div className="auth-card">
                      <div className="auth-header">
                        <h3>
                          <i className="bi bi-person-plus-fill" /> Admin Registration
                        </h3>
                        <p className="text-muted">Create your administrator account</p>
                      </div>

                      {error && <div className="alert alert-danger">{error}</div>}
                      {success && <div className="alert alert-success">{success}</div>}

                      <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="input-group-custom">
                              <label htmlFor="adminName">
                                <i className="bi bi-person-fill" /> Full Name
                              </label>
                              <input id="adminName" name="adminName" className="form-control" placeholder="Enter your full name" required />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-group-custom">
                              <label htmlFor="adminEmail">
                                <i className="bi bi-envelope-fill" /> Admin Email
                              </label>
                              <input
                                id="adminEmail"
                                name="adminEmail"
                                type="email"
                                className="form-control"
                                placeholder="admin@organization.com"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="input-group-custom mt-3">
                          <label htmlFor="organization">
                            <i className="bi bi-building" /> Organization
                          </label>
                          <input
                            id="organization"
                            name="organization"
                            className="form-control"
                            placeholder="University/Organization Name"
                            required
                          />
                        </div>

                        <div className="row g-3 mt-1">
                          <div className="col-md-6">
                            <div className="input-group-custom password-group">
                              <label htmlFor="adminPassword">
                                <i className="bi bi-lock-fill" /> Password
                              </label>
                              <div className="password-input-wrapper">
                                <input
                                  id="adminPassword"
                                  name="adminPassword"
                                  type={showPassword ? 'text' : 'password'}
                                  className="form-control"
                                  placeholder="Create admin password"
                                  required
                                  minLength={8}
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
                                  placeholder="Re-enter password"
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

                        <div className="input-group-custom mt-3">
                          <label htmlFor="adminPhone">
                            <i className="bi bi-telephone-fill" /> Phone Number
                          </label>
                          <input id="adminPhone" name="adminPhone" type="tel" className="form-control" placeholder="+1 (555) 123-4567" />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-4 btn-auth" disabled={loading}>
                          <i className="bi bi-person-check-fill" /> {loading ? 'Registering...' : 'Register as Admin'}
                        </button>
                      </form>

                      <div className="auth-footer">
                        <p>
                          Already have admin access? <Link to="/admin/login">Login here</Link>
                        </p>
                        <p className="mt-2">
                          <Link to="/">← Back to Main Site</Link>
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
