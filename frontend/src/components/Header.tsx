import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Header.css';
import HomeDropdown from './HomeDropdown';
import { getLoggedInUserId } from '../utils/auth';

type CurrentUser = {
  username?: string;
  role?: string;
};

interface BackendNotification {
  read: boolean;
}

export default function Header() {
  const [canSeeAdmin, setCanSeeAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('access');

    if (!token) {
      setCanSeeAdmin(false);
      return;
    }

    const loadCurrentUser = async () => {
      try {
        const response = await fetch('/auth/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setCanSeeAdmin(false);
          return;
        }

        const user = await response.json() as CurrentUser;
        setCanSeeAdmin(user.username === 'Admin' && user.role === 'admin');
      } catch {
        setCanSeeAdmin(false);
      }
    };

    loadCurrentUser();
  }, [location.pathname]);

  // Fetch unread count on mount and whenever the route changes
  useEffect(() => {
    const userId = getLoggedInUserId();
    if (!userId) {
      setUnreadCount(0);
      return;
    }

    fetch(`/notifications/${userId}/`)
      .then(res => res.ok ? res.json() as Promise<BackendNotification[]> : Promise.resolve([]))
      .then(data => setUnreadCount(data.filter(n => !n.read).length))
      .catch(() => {});
  }, [location.pathname]);

  useEffect(() => {
    const fetchCount = () => {
      const userId = getLoggedInUserId();
      if (!userId) return;
      fetch(`/notifications/${userId}/`)
        .then(res => res.ok ? res.json() as Promise<BackendNotification[]> : Promise.resolve([]))
        .then(data => setUnreadCount(data.filter(n => !n.read).length))
        .catch(() => {});
    };

    const onNew = () => setUnreadCount(count => count + 1);
    const onRead = () => setUnreadCount(0);
    const onUpdate = () => fetchCount();

    window.addEventListener('newNotification', onNew);
    window.addEventListener('notificationsRead', onRead);
    window.addEventListener('connectionUpdated', onUpdate);
    window.addEventListener('postsUpdated', onUpdate);

    return () => {
      window.removeEventListener('newNotification', onNew);
      window.removeEventListener('notificationsRead', onRead);
      window.removeEventListener('connectionUpdated', onUpdate);
      window.removeEventListener('postsUpdated', onUpdate);
    };
  }, []);

  return (
    <header className="main-header">
      {/* Left Side: Logo */}
      <Link to="/login" className="header-logo">
        <img src="../public/favicon1.png" alt="PetLink" />
      </Link>
      
      {/* Right Side: Navigation Links */}
      <nav className="header-nav">
        {canSeeAdmin && <Link to="/adminpage" className="nav-item">Admin</Link>}
        <Link to="/search" className="nav-item">Search</Link>
        <Link to="/notifications" className="nav-item notif-nav-item">
          Notifications
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
          )}
        </Link>
        <Link to="/chat" className="nav-item">Chat </Link>
        <div className="home-dropdown-wrapper">
          <Link to="/" className="nav-item home-link">Account</Link>
          <HomeDropdown />
        </div>
      </nav>
    </header>
  );
}

