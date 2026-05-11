import './ProfileInfoBar.css';

type Stat = { value: string | number; label: string };
type Action = { label: string; variant: 'primary' | 'secondary' };

type ProfileInfoBarProps = {
  name: string;
  username: string;
  role: string;
  bio: string;
  stats: Stat[];
  actions?: Action[];
};

export default function ProfileInfoBar({ name, username, role, bio, stats, actions }: ProfileInfoBarProps) {
  return (
    <div className="profile-info-bar">
      <div className="profile-info-top">
        <div className="profile-avatar-offset" />
        {actions && actions.length > 0 && (
          <div className="profile-actions">
            {actions.map(a => (
              <button key={a.label} className={`action-btn ${a.variant}`}>{a.label}</button>
            ))}
          </div>
        )}
      </div>

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
