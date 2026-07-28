import { useState } from 'react';

export default function ProjectManager({ value = [], onChange, label = 'Projects' }) {
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    technologies: '',
    githubLink: '',
    liveLink: '',
  });

  function addProject() {
    if (!newProject.title.trim()) return;

    onChange([
      ...value,
      {
        title: newProject.title.trim(),
        technologies: newProject.technologies.trim(),
        githubLink: newProject.githubLink.trim(),
        liveLink: newProject.liveLink.trim(),
      },
    ]);

    setNewProject({ title: '', technologies: '', githubLink: '', liveLink: '' });
    setShowForm(false);
  }

  function removeProject(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="ai-form-label">{label}</label>

      {/* List existing projects */}
      {value.length > 0 && (
        <div className="mb-2">
          {value.map((proj, index) => (
            <div
              key={index}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 14px', marginBottom: 8,
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                  {proj.title}
                </div>
                {proj.technologies && (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                    Tech: {proj.technologies}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  {proj.githubLink && (
                    <a href={proj.githubLink} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, color: 'var(--accent)' }}>
                      <i className="bi bi-github" /> GitHub
                    </a>
                  )}
                  {proj.liveLink && (
                    <a href={proj.liveLink} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, color: 'var(--accent)' }}>
                      <i className="bi bi-box-arrow-up-right" /> Live
                    </a>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeProject(index)}
                style={{
                  background: 'none', border: 'none', color: 'var(--error)',
                  cursor: 'pointer', padding: '4px', fontSize: 16,
                }}
              >
                <i className="bi bi-trash" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new project form */}
      {showForm ? (
        <div style={{
          background: 'var(--bg-primary)', border: '1px solid var(--accent)', borderRadius: 8,
          padding: 16, marginTop: 8,
        }}>
          <div className="row g-2">
            <div className="col-12">
              <input
                type="text"
                className="ai-form-input"
                placeholder="Project Title *"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
            </div>
            <div className="col-12">
              <input
                type="text"
                className="ai-form-input"
                placeholder="Technologies Used (comma separated)"
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
              />
            </div>
            <div className="col-6">
              <input
                type="url"
                className="ai-form-input"
                placeholder="GitHub Link (optional)"
                value={newProject.githubLink}
                onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
              />
            </div>
            <div className="col-6">
              <input
                type="url"
                className="ai-form-input"
                placeholder="Live Demo Link (optional)"
                value={newProject.liveLink}
                onChange={(e) => setNewProject({ ...newProject, liveLink: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button
              type="button"
              className="ai-btn-primary"
              onClick={addProject}
              disabled={!newProject.title.trim()}
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              Add Project
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
            background: 'var(--bg-secondary)',
            color: 'var(--accent)',
            border: '2px dashed var(--border-strong)',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginTop: 4,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.borderColor = 'var(--badge-blue-bg)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
        >
          <i className="bi bi-plus-circle me-1" /> Add Project
        </button>
      )}
    </div>
  );
}
