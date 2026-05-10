import { Link } from 'react-router-dom';
import './HomeDropdown.css';

export default function HomeDropdown() {
  return (
    <div className="home-dropdown">
      <ul className="home-dropdown-list">
        <li className="home-dropdown-item"><Link to="/profile">My Profile</Link></li>
        <li className="home-dropdown-item"><Link to="/reviews">My Reviews</Link></li>
        <li className="home-dropdown-item"><Link to="/bookings">My Bookings</Link></li>
        <li className="home-dropdown-item"><Link to="/settings">Settings</Link></li>
        <li className="home-dropdown-item home-dropdown-item--logout"><Link to="/logout">Log out</Link></li>
      </ul>
    </div>
  );
}
