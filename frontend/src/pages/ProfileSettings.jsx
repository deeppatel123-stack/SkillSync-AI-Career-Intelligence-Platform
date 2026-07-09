import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { demoStudent } from '../data/mockData';
import { authApi, userApi } from '../utils/api';
import { formatRoleLabel, getAppRole, getSession, setSession } from '../utils/userSession';

export default function ProfileSettings() {
  const session = getSession();
  const profileUser = session || demoStudent;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profileUser.name,
    email: profileUser.email,
    role: formatRoleLabel(profileUser.role || 'student'),
    userId: profileUser.id,
    phone: profileUser.phone || '',
    bio: profileUser.bio || '',
    location: profileUser.location || '',
    website: profileUser.website || '',
  });

  useEffect(() => {
    authApi
      .me()
      .then((data) => {
        const u = data.user;
        setForm({
          name: u.name,
          email: u.email,
          role: formatRoleLabel(u.role),
          userId: u.id,
          phone: u.phone || '',
          bio: u.bio || '',
          location: u.location || '',
          website: u.website || '',
        });
        setSession(u);
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <AppLayout role={getAppRole(profileUser.role || 'student')}>
      <div className="page-header">
        <div className="header-title-area">
          <i className="bi bi-person-circle" />
          <div>
            <h2 className="page-title">Profile & Settings</h2>
            <p className="page-subtitle">Manage your profile information and account settings</p>
          </div>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-card-main">
          <div className="card-header-custom">
            <div className="card-header-title">
              <i className="bi bi-person-vcard" />
              <span>Profile Information</span>
            </div>
            {!editing && (
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setEditing(true)}>
                <i className="bi bi-pencil-square" /> Edit Profile
              </button>
            )}
          </div>

          <div className="card-body-custom">
            <div className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control-custom"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" className="form-control-custom" value={form.email} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="role">Account Type</label>
                <input type="text" id="role" className="form-control-custom" value={form.role} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="userId">User ID</label>
                <input type="text" id="userId" className="form-control-custom" value={form.userId} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  className="form-control-custom"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="form-group form-group-full">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  className="form-control-custom"
                  value={form.bio}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  className="form-control-custom"
                  value={form.location}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  className="form-control-custom"
                  value={form.website}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </div>

            {editing && (
              <div className="mt-4 d-flex gap-3">
                <button
                  type="button"
                  className="btn-save"
                  onClick={async () => {
                    try {
                      const data = await userApi.updateProfile({
                        name: form.name,
                        phone: form.phone,
                        bio: form.bio,
                        location: form.location,
                        website: form.website,
                      });
                      setSession(data.user);
                      setEditing(false);
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                >
                  <i className="bi bi-check-circle" /> Save Changes
                </button>
                <button type="button" className="btn-cancel" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="account-actions-card">
          <div className="settings-header">
            <i className="bi bi-gear" />
            <span>Account Actions</span>
          </div>

          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-header">
                <h6>Account Created</h6>
              </div>
              <p id="createdAt">Jan 22, 2026</p>
            </div>

            <div className="settings-item">
              <div className="settings-item-header">
                <h6>Delete Account</h6>
                <button type="button" className="btn-icon-outline danger" aria-label="Delete account">
                  <i className="bi bi-trash" />
                </button>
              </div>
              <p>Permanently delete your account</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
