import { Link, useNavigate } from 'react-router-dom';
import './HomeDropdown.css';

export default function HomeDropdown() {
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 1. Prevents the default <a> tag behavior (jumping to the top of the page)
    e.preventDefault();

    // 2. Remove the JWT tokens from the browser's storage
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    // 3. Redirect the user back to the login page
    navigate('/login');
  };

  return (
    <div className="home-dropdown">
      <ul className="home-dropdown-list">
        <li className="home-dropdown-item">
          <Link to="/profile">My Profile</Link>
        </li>
        <li className="home-dropdown-item">
          <Link to="/reviews">My Reviews</Link>
        </li>
        <li className="home-dropdown-item">
          <Link to="/bookings">My Bookings</Link>
        </li>
        <li className="home-dropdown-item">
          <Link to="/settings">Settings</Link>
        </li>

        {/* Restored the <a> tag so your CSS targets it perfectly */}
        <li className="home-dropdown-item home-dropdown-item--logout">
          <a href="/" onClick={handleLogout}>Log out</a>
        </li>
      </ul>
    </div>
  );
}
