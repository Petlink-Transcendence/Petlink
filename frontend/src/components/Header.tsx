import { Link } from 'react-router-dom';
import './Header.css'

export default function Header() {
  return (
    <header className="main-header">
      {/* Left Side: Logo */}
      <Link to="/" className="header-logo">
        <img src="../public/favicon1.png" alt="PetLink" />
      </Link>
      
      {/* Right Side: Navigation Links */}
      <nav className="header-nav">
        <Link to="/login" className="nav-item">Login</Link>
        <Link to="/notifications" className="nav-item">Notifications</Link>
        <Link to="/" className="nav-item home-link">Home</Link>
      </nav>
    </header>
  );
}
