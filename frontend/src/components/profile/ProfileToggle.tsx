import { Link } from 'react-router-dom';
import './ProfileToggle.css';

type ProfileToggleProps = {
  active: 'owner' | 'sitter';
};

export default function ProfileToggle({ active }: ProfileToggleProps) {
  return (
    <div className="profile-toggle">
      <Link
        to="/profile"
        className={`toggle-btn ${active === 'owner' ? 'active' : ''}`}
      >
        Pet Owner
      </Link>
      <Link
        to="/sitterprofile"
        className={`toggle-btn ${active === 'sitter' ? 'active' : ''}`}
      >
        Pet Sitter
      </Link>
    </div>
  );
}
