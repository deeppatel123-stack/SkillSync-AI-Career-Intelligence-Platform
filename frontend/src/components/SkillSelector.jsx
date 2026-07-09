import { useState } from 'react';

// Default skill list for selection
const DEFAULT_SKILLS = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular',
  'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'PostgreSQL', 'Firebase',
  'Python', 'Java', 'C', 'C++', 'C#', 'PHP', 'Django', 'Flask', 'FastAPI',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy',
  'Data Analysis', 'Data Visualization', 'Git', 'GitHub', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'Linux', 'REST API', 'GraphQL', 'Bootstrap', 'Tailwind CSS',
  'Figma', 'UI/UX', 'Android', 'Flutter', 'React Native',
  'Cyber Security', 'Networking', 'DevOps',
];

export default function SkillSelector({ value = [], onChange, label = 'Skills' }) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [customSkill, setCustomSkill] = useState('');

  // Filter skills based on search
  const filteredSkills = DEFAULT_SKILLS.filter(
    (s) => s.toLowerCase().includes(search.toLowerCase()) && !value.includes(s)
  );

  function addSkill(skill) {
    if (!value.includes(skill)) {
      onChange([...value, skill]);
    }
    setSearch('');
    setShowDropdown(false);
  }

  function removeSkill(skill) {
    onChange(value.filter((s) => s !== skill));
  }

  function addCustomSkill() {
    const trimmed = customSkill.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setCustomSkill('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (customSkill.trim()) {
        addCustomSkill();
      } else if (filteredSkills.length > 0) {
        addSkill(filteredSkills[0]);
      }
    }
  }

  return (
    <div>
      <label className="ai-form-label">{label}</label>

      {/* Selected skills as chips */}
      {value.length > 0 && (
        <div className="ai-skills-container mb-2">
          {value.map((skill) => (
            <span key={skill} className="ai-skill-tag matched" style={{ cursor: 'pointer' }}>
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                style={{
                  background: 'none', border: 'none', color: '#276749',
                  marginLeft: 6, padding: 0, cursor: 'pointer', fontWeight: 'bold',
                }}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="ai-form-input"
          placeholder={value.length === 0 ? 'Search or type skills...' : 'Add more skills...'}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onKeyDown={handleKeyDown}
        />

        {/* Dropdown */}
        {showDropdown && (
          <div
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
              maxHeight: 200, overflowY: 'auto', zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {/* Show filtered skills */}
            {filteredSkills.slice(0, 20).map((skill) => (
              <div
                key={skill}
                onMouseDown={() => addSkill(skill)}
                style={{
                  padding: '8px 12px', cursor: 'pointer', fontSize: 14,
                  borderBottom: '1px solid #f0f4f8',
                }}
                onMouseEnter={(e) => e.target.style.background = '#ebf8ff'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                {skill}
              </div>
            ))}

            {/* Custom skill input */}
            {search.trim() && !DEFAULT_SKILLS.some((s) => s.toLowerCase() === search.toLowerCase()) && (
              <div style={{ padding: '8px 12px', borderTop: '1px solid #e2e8f0', background: '#fffbeb' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#92400e' }}>
                    Add &quot;{search.trim()}&quot;
                  </span>
                  <button
                    type="button"
                    onMouseDown={() => {
                      setCustomSkill(search.trim());
                      addSkill(search.trim());
                    }}
                    style={{
                      background: '#4299e1', color: '#fff', border: 'none',
                      borderRadius: 4, padding: '4px 10px', cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {filteredSkills.length === 0 && !search.trim() && (
              <div style={{ padding: '12px', color: '#718096', fontSize: 13, textAlign: 'center' }}>
                Type to search or add custom skills
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
