import './ProfileLeftSidebar.css';

type ProfileLeftSidebarProps = {
  memberSince: string;
  location: string;
  pets: string[];
  lookingFor: string[];
};

export default function ProfileLeftSidebar({ memberSince, location, pets, lookingFor }: ProfileLeftSidebarProps) {
  return (
    <aside className="profile-left">
      <div className="profile-card">
        <h3 className="card-title">About</h3>
        <p className="card-meta">📅 Member since {memberSince}</p>
        <p className="card-meta">📍 {location}</p>
      </div>

      <div className="profile-card">
        <h3 className="card-title">My Pets</h3>
        <div className="tag-list">
          {pets.map((p, i) => <span key={i} className="profile-tag">{p}</span>)}
        </div>
      </div>

      <div className="profile-card">
        <h3 className="card-title">Looking For</h3>
        <div className="tag-list">
          {lookingFor.map((s, i) => <span key={i} className="profile-tag">{s}</span>)}
        </div>
      </div>
    </aside>
  );
}
