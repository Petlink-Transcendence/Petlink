import { Link } from 'react-router-dom';
import './Header.css';
import HomeDropdown from './HomeDropdown';

export default function Header() {
  return (
    <header className="main-header">
      {/* Left Side: Logo */}
      <Link to="/login" className="header-logo">
        <img src="../public/favicon1.png" alt="PetLink" />
      </Link>
      
      {/* Right Side: Navigation Links */}
      <nav className="header-nav">
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
