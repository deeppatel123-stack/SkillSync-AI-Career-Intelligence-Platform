import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import AuthSidePanel from '../components/AuthSidePanel';
import { authApi } from '../utils/api';
import { setSession } from '../utils/userSession';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const email = e.target.adminEmail.value;
      const password = e.target.adminPassword.value;
      const data = await authApi.adminLogin({ email, password });
      setSession(data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar actionLabel="Admin Register" actionTo="/admin/register" actionIcon="bi-person-plus-fill" />

      <div className="auth-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="auth-container">
                <div className="row g-0">
                  <AuthSidePanel
                    title="Admin Portal Access"
                    description="Secure login for platform administrators to manage the entire SkillSync system."
                    features={[
                      { icon: 'bi-shield-lock', text: 'Platform Management' },
                      { icon: 'bi-people', text: 'User Administration' },
                      { icon: 'bi-bar-chart', text: 'Analytics & Reports' },
                    ]}
                  />

                  <div className="col-md-7">
                    <div className="auth-card">
                      <div className="auth-header">
                        <h3>
                          <i className="bi bi-shield-lock" /> Admin Sign In
                        </h3>
                        <p className="text-muted">Enter your admin credentials to access the dashboard</p>
                      </div>

                      {error && <div className="alert alert-danger">{error}</div>}

                      <form onSubmit={handleSubmit}>
                        <div className="input-group-custom">
                          <label htmlFor="adminEmail">
                            <i className="bi bi-envelope-fill" /> Admin Email
                          </label>
                          <input
                            id="adminEmail"
                            type="email"
                            className="form-control"
                            placeholder="admin@skillsync.com"
                            required
                          />
                        </div>

                        <div className="input-group-custom password-group">
                          <label htmlFor="adminPassword">
                            <i className="bi bi-lock-fill" /> Password
                          </label>
                          <div className="password-input-wrapper">
                            <input
                              id="adminPassword"
                              type={showPassword ? 'text' : 'password'}
                              className="form-control"
                              placeholder="Enter admin password"
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

                        <button type="submit" className="btn btn-primary w-100 btn-auth" disabled={loading}>
                          <i className="bi bi-box-arrow-in-right" /> {loading ? 'Signing in...' : 'Access Admin Dashboard'}
                        </button>
                      </form>

                      <div className="auth-footer">
                        <p>
                          Don&apos;t have an admin account? <Link to="/admin/register">Register here</Link>
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
