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
                background: '#f7fafc', border: '1px solid #e2e8f0',
                borderRadius: 8, padding: '10px 14px', marginBottom: 8,
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a202c' }}>
                  {proj.title}
                </div>
                {proj.technologies && (
                  <div style={{ fontSize: 13, color: '#718096', marginTop: 2 }}>
                    Tech: {proj.technologies}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  {proj.githubLink && (
                    <a href={proj.githubLink} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, color: '#4299e1' }}>
                      <i className="bi bi-github" /> GitHub
                    </a>
                  )}
                  {proj.liveLink && (
                    <a href={proj.liveLink} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, color: '#38a169' }}>
                      <i className="bi bi-box-arrow-up-right" /> Live
                    </a>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeProject(index)}
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

      {/* Add new project form */}
      {showForm ? (
        <div style={{
          background: '#fff', border: '1px solid #4299e1', borderRadius: 8,
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
          className="ai-btn-secondary"
          onClick={() => setShowForm(true)}
          style={{ padding: '8px 16px', fontSize: 13, marginTop: 4 }}
        >
          <i className="bi bi-plus-circle me-1" /> Add Project
        </button>
      )}
    </div>
  );
}
