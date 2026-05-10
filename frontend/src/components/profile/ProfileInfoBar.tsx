import './ProfileInfoBar.css';

type ProfileInfoBarProps = {
  name: string;
  username: string;
  role: string;
  bio: string;
  posts: number;
  followers: number;
  following: number;
};

export default function ProfileInfoBar({ name, username, role, bio, posts, followers, following }: ProfileInfoBarProps) {
  return (
    <div className="profile-info-bar">
      <div className="profile-identity">
        <div className="profile-name-row">
          <h2 className="profile-name">{name}</h2>
          <span className="profile-role-tag">{role}</span>
        </div>
        <p className="profile-username">{username}</p>
        <p className="profile-bio">{bio}</p>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{posts}</span>
          <span className="stat-label">Posts</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">{followers}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">{following}</span>
          <span className="stat-label">Following</span>
        </div>
      </div>
    </div>
  );
}
