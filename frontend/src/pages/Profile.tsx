import { useEffect, useState } from 'react';
import './Profile.css';

const user = {
  name: 'Jane Doe',
  username: '@janedoe123',
  role: 'Pet Owner',
  bio: 'Dog and cat mom. Always looking for the best care for my fur babies.',
  posts: 21,
  followers: 42,
  following: 100,
};

export default function Profile() {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    document.title = 'Profile | PetLink';
  }, []);

  return (
    <div className="profile-page">

      <div className="profile-cover">
        {imgError ? (
          <div className="profile-avatar">JD</div>
        ) : (
          <img
            className="profile-avatar"
            src="/profile-pic.png"
            alt="profile picture"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="profile-info-bar">
        <div className="profile-identity">
          <div className="profile-name-row">
            <h2 className="profile-name">{user.name}</h2>
            <span className="profile-role-tag">{user.role}</span>
          </div>
          <p className="profile-username">{user.username}</p>
          <p className="profile-bio">{user.bio}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{user.posts}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">{user.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">{user.following}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>

    </div>
  );
}
