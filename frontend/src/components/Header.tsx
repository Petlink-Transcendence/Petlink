import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Header.css';
import HomeDropdown from './HomeDropdown';

type CurrentUser = {
  username?: string;
  role?: string;
};

export default function Header() {
  const [canSeeAdmin, setCanSeeAdmin] = useState(false);
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
        <Link to="/notifications" className="nav-item">Notifications</Link>
        <Link to="/chat" className="nav-item">Chat </Link>
        <div className="home-dropdown-wrapper">
          <Link to="/" className="nav-item home-link">Account</Link>
          <HomeDropdown />
        </div>
      </nav>
    </header>
  );
}
