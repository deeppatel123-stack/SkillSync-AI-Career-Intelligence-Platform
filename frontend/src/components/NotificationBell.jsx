import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationApi } from '../utils/api';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const load = () => {
    notificationApi
      .list()
      .then((data) => {
        setItems(data.notifications || []);
        setUnread(data.unreadCount || 0);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = async (n) => {
    if (!n.read) {
      setUnread((prev) => Math.max(0, prev - 1));
      setItems((prev) => prev.map((it) => (it.id === n.id ? { ...it, read: true } : it)));
      notificationApi.markRead(n.id).catch(() => {});
    }
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const handleMarkAll = async () => {
    await notificationApi.markAllRead().catch(() => {});
    setItems((prev) => prev.map((it) => ({ ...it, read: true })));
    setUnread(0);
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-outline-secondary position-relative"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
      >
        <i className="bi bi-bell" />
        {unread > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <strong>Notifications</strong>
            <button type="button" className="btn btn-sm btn-link p-0" onClick={handleMarkAll}>
              Mark all read
            </button>
          </div>
          <div className="notification-list">
            {!items.length ? (
              <p className="text-center text-muted p-3 mb-0">No notifications yet</p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`notification-item ${n.read ? '' : 'unread'}`}
                  onClick={() => handleItemClick(n)}
                >
                  <span className="notification-title">
                    {!n.read && <span className="dot" />}
                    {n.title}
                  </span>
                  <span className="notification-message">{n.message}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}