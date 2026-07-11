import { useState } from 'react';

export default function InternshipManager({ value = [], onChange, label = 'Internships' }) {
  const [showForm, setShowForm] = useState(false);
  const [newInternship, setNewInternship] = useState({
    company: '',
    role: '',
    duration: '',
    mode: '',
    description: '',
  });

  function addInternship() {
    if (!newInternship.company.trim() || !newInternship.role.trim()) return;

    onChange([
      ...value,
      {
        company: newInternship.company.trim(),
        role: newInternship.role.trim(),
        duration: newInternship.duration.trim(),
        mode: newInternship.mode.trim(),
        description: newInternship.description.trim(),
      },
    ]);

    setNewInternship({ company: '', role: '', duration: '', mode: '', description: '' });
    setShowForm(false);
  }

  function removeInternship(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="ai-form-label">{label}</label>

      {/* List existing internships */}
      {value.length > 0 && (
        <div className="mb-2">
          {value.map((intern, index) => (
            <div
              key={index}
              style={{
                background: '#f7fafc', border: '1px solid #e2e8f0',
                borderRadius: 8, padding: '10px 14px', marginBottom: 8,
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a202c' }}>
                  {intern.role} @ {intern.company}
                </div>
                <div style={{ fontSize: 13, color: '#718096', marginTop: 2 }}>
                  {intern.duration && <span>{intern.duration} | </span>}
                  {intern.mode && <span>{intern.mode}</span>}
                </div>
                {intern.description && (
                  <div style={{ fontSize: 13, color: '#4a5568', marginTop: 4 }}>
                    {intern.description}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeInternship(index)}
                style={{
                  background: 'none', border: 'none', color: '#e53e3e',
                  cursor: 'pointer', padding: '4px', fontSize: 16,
                }}
              >
                <i className="bi bi-trash" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new internship form */}
      {showForm ? (
        <div style={{
          background: '#fff', border: '1px solid #4299e1', borderRadius: 8,
          padding: 16, marginTop: 8,
        }}>
          <div className="row g-2">
            <div className="col-6">
              <input
                type="text"
                className="ai-form-input"
                placeholder="Company Name *"
                value={newInternship.company}
                onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
              />
            </div>
            <div className="col-6">
              <input
                type="text"
                className="ai-form-input"
                placeholder="Role / Position *"
                value={newInternship.role}
                onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
              />
            </div>
            <div className="col-6">
              <input
                type="text"
                className="ai-form-input"
                placeholder="Duration (e.g., 3 months)"
                value={newInternship.duration}
                onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
              />
            </div>
            <div className="col-6">
              <select
                className="ai-form-input"
                value={newInternship.mode}
                onChange={(e) => setNewInternship({ ...newInternship, mode: e.target.value })}
              >
                <option value="">Select Mode</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="col-12">
              <textarea
                className="ai-form-input"
                placeholder="Description (optional)"
                rows="2"
                value={newInternship.description}
                onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                style={{ minHeight: 60 }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button
              type="button"
              className="ai-btn-primary"
              onClick={addInternship}
              disabled={!newInternship.company.trim() || !newInternship.role.trim()}
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              Add Internship
            </button>
            <button
              type="button"
              className="ai-btn-secondary"
              onClick={() => setShowForm(false)}
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 600,
            background: '#f7fafc',
            color: '#4299e1',
            border: '2px dashed #cbd5e0',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginTop: 4,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#ebf8ff'; e.currentTarget.style.borderColor = '#90cdf4'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#f7fafc'; e.currentTarget.style.borderColor = '#cbd5e0'; }}
        >
          <i className="bi bi-plus-circle me-1" /> Add Internship
        </button>
      )}
    </div>
  );
}
