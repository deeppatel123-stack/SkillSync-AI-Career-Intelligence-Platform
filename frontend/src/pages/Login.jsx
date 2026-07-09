import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import AuthSidePanel from '../components/AuthSidePanel';
import { authApi } from '../utils/api';
import { getDashboardPath, setSession } from '../utils/userSession';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const email = e.target.loginEmail.value;
      const password = e.target.loginPassword.value;
      const data = await authApi.login({ email, password });
      setSession(data.user);
      navigate(getDashboardPath(data.user.role));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar actionLabel="Create Account" actionTo="/register" actionIcon="bi-person-plus-fill" />

      <div className="auth-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="auth-container">
                <div className="row g-0">
                  <AuthSidePanel
                    title="Welcome Back!"
                    description="Login to access your personalized dashboard and explore thousands of opportunities waiting for you."
                    features={[
                      { icon: 'bi-check-circle-fill', text: 'Track your applications' },
                      { icon: 'bi-check-circle-fill', text: 'Discover new opportunities' },
                      { icon: 'bi-check-circle-fill', text: 'Connect with companies' },
                    ]}
                  />

                  <div className="col-md-7">
                    <div className="auth-card">
                      <div className="auth-header">
                        <h3>
                          <i className="bi bi-box-arrow-in-right" /> Sign In
                        </h3>
                        <p className="text-muted">Enter your credentials to continue</p>
                      </div>

                      {error && <div className="alert alert-danger">{error}</div>}

                      <form onSubmit={handleSubmit}>
                        <div className="input-group-custom">
                          <label htmlFor="loginEmail">
                            <i className="bi bi-envelope-fill" /> Email Address
                          </label>
                          <input
                            id="loginEmail"
                            type="email"
                            className="form-control"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>

                        <div className="input-group-custom password-group">
                          <label htmlFor="loginPassword">
                            <i className="bi bi-lock-fill" /> Password
                          </label>
                          <div className="password-input-wrapper">
                            <input
                              id="loginPassword"
                              type={showPassword ? 'text' : 'password'}
                              className="form-control"
                              placeholder="Enter your password"
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
                          <i className="bi bi-box-arrow-in-right" /> {loading ? 'Logging in...' : 'Login to Account'}
                        </button>
                      </form>

                      <div className="auth-footer">
                        <p>
                          Don&apos;t have an account? <Link to="/register">Create one now</Link>
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
