import { useState } from 'react';

const DEFAULT_CERTIFICATIONS = [
  'AWS Cloud Practitioner', 'AWS Solutions Architect', 'Google Cloud',
  'Microsoft Azure', 'Meta Frontend Developer', 'Meta Backend Developer',
  'IBM Python', 'IBM Data Science', 'Coursera Python', 'NPTEL',
  'Cisco CCNA', 'Oracle Java', 'MongoDB Associate',
  'React Certification', 'Node.js Certification', 'Django Certification',
  'Flutter Certification', 'Kubernetes Administrator', 'Docker Associate',
  'CompTIA Security+', 'CEH', 'PMP', 'Scrum Master',
];

export default function CertificationSelector({ value = [], onChange, label = 'Certifications' }) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = DEFAULT_CERTIFICATIONS.filter(
    (c) => c.toLowerCase().includes(search.toLowerCase()) && !value.includes(c)
  );

  function addCert(cert) {
    if (!value.includes(cert)) {
      onChange([...value, cert]);
    }
    setSearch('');
    setShowDropdown(false);
  }

  function removeCert(cert) {
    onChange(value.filter((c) => c !== cert));
  }

  return (
    <div>
      <label className="ai-form-label">{label}</label>

      {value.length > 0 && (
        <div className="ai-skills-container mb-2">
          {value.map((cert) => (
            <span key={cert} className="ai-skill-tag matched" style={{ cursor: 'pointer' }}>
              {cert}
              <button
                type="button"
                onClick={() => removeCert(cert)}
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

      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="ai-form-input"
          placeholder={value.length === 0 ? 'Search or add certifications...' : 'Add more...'}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (search.trim()) {
                addCert(search.trim());
              }
            }
          }}
        />

        {showDropdown && (
          <div
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
              maxHeight: 200, overflowY: 'auto', zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {filtered.slice(0, 15).map((cert) => (
              <div
                key={cert}
                onMouseDown={() => addCert(cert)}
                style={{
                  padding: '8px 12px', cursor: 'pointer', fontSize: 14,
                  borderBottom: '1px solid #f0f4f8',
                }}
                onMouseEnter={(e) => e.target.style.background = '#ebf8ff'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                {cert}
              </div>
            ))}

            {search.trim() && !DEFAULT_CERTIFICATIONS.some(
              (c) => c.toLowerCase() === search.toLowerCase()
            ) && (
              <div style={{ padding: '8px 12px', borderTop: '1px solid #e2e8f0', background: '#fffbeb' }}>
                <button
                  type="button"
                  onMouseDown={() => addCert(search.trim())}
                  style={{
                    background: 'none', border: 'none', color: '#92400e',
                    cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  }}
                >
                  + Add &quot;{search.trim()}&quot;
                </button>
              </div>
            )}

            {filtered.length === 0 && !search.trim() && (
              <div style={{ padding: '12px', color: '#718096', fontSize: 13, textAlign: 'center' }}>
                Type to search or add custom certifications
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
