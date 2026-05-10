import './ProfileInfoBar.css';

type Stat = { value: string | number; label: string };

type ProfileInfoBarProps = {
  name: string;
  username: string;
  role: string;
  bio: string;
  stats: Stat[];
};

export default function ProfileInfoBar({ name, username, role, bio, stats }: ProfileInfoBarProps) {
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
        {stats.map((s, i) => (
          <>
            {i > 0 && <div key={`div-${i}`} className="stat-divider" />}
            <div key={s.label} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
