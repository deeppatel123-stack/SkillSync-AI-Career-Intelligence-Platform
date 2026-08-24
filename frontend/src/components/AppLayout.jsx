import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';
import { getSession } from '../utils/userSession';

export default function AppLayout({
  children,
  role,
  adminSection,
  onAdminSectionChange,
  onLogout,
}) {
  const [sidebarActive, setSidebarActive] = useState(false);
  const session = getSession();
  
  // Resolve actual role from session if role prop is missing or ambiguous ('organizer')
  let resolvedRole = role;
  if (!resolvedRole || resolvedRole === 'organizer') {
    resolvedRole = session?.role || 'student';
  }

  const toggleSidebar = () => setSidebarActive((prev) => !prev);
  const closeSidebar = () => setSidebarActive(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) closeSidebar();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarActive ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarActive]);

  return (
    <>
      <button type="button" className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
        <i className="bi bi-list" />
      </button>
      <div
        className={`sidebar-overlay ${sidebarActive ? 'active' : ''}`}
        id="sidebarOverlay"
        onClick={closeSidebar}
        role="presentation"
      />

      <div className="app-layout">
        <Sidebar
          role={resolvedRole}
          active={sidebarActive}
          adminSection={adminSection}
          onAdminSectionChange={onAdminSectionChange}
          onLogout={onLogout}
        />
        <main className="main-content">
          <div className="d-flex justify-content-end align-items-center mb-3 gap-2" style={{ minHeight: 44 }}>
            <NotificationBell />
            <ThemeToggle />
          </div>
          {children}
        </main>
      </div>
    </>
  );
}

