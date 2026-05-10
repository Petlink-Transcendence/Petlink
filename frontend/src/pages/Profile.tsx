import { useEffect } from 'react';
import './Profile.css';

export default function Profile() {
  useEffect(() => {
    document.title = 'Profile | PetLink';
  }, []);

  return (
    <div className="profile-page">
    </div>
  );
}
