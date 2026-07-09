import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({
  children,
  role = 'student',
  adminSection,
  onAdminSectionChange,
  onLogout,
}) {
  const [sidebarActive, setSidebarActive] = useState(false);

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
          role={role}
          active={sidebarActive}
          adminSection={adminSection}
          onAdminSectionChange={onAdminSectionChange}
          onLogout={onLogout}
        />
        <main className="main-content">{children}</main>
      </div>
    </>
  );
}
