import './ProfileInfoBar.css';
import React from 'react'; 
import { useState } from 'react'
import FollowsContainer from '../Follows.tsx'

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
  const [isFollowsOpen, setisFollowsOpen] = useState(false);
  const [activeFollowsTab, setActiveFollowsTab] = useState<'followers' | 'following'>('followers');

  const handleStatClick = (label: string) => {
    const lowerLabel = label.toLocaleLowerCase();

    if (lowerLabel === 'posts' ||
        lowerLabel === 'rating' ||
        lowerLabel === 'reviews' ||
        lowerLabel === 'bookings') { 
      return; 
    }
    if (lowerLabel == 'following'){
      setActiveFollowsTab('following');
    } else {
      setActiveFollowsTab('followers');
    }
    
    setisFollowsOpen(true);
  }

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
        {stats.map((s, i) => {
          const isPosts = s.label.toLowerCase() === 'posts';
          const isReviews = s.label.toLowerCase() === 'reviews';
          const isRating = s.label.toLowerCase() === 'rating';
          const isBookings = s.label.toLowerCase() === 'bookings';
          
          return (
            <React.Fragment key={`stat-group-${s.label}`}>
              {i > 0 && <div className="stat-divider" />}
              <div 
                className={`stat-item ${(isPosts || isReviews || isRating || isBookings) ? 'non-clickable' : 'clickable'}`} 
                onClick={() => handleStatClick(s.label)}
              >
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </React.Fragment>
          );
        })}  
      </div>

      {isFollowsOpen && (
        <FollowsContainer 
        initialTab={activeFollowsTab} 
        onClose={() => setisFollowsOpen(false)} />
      )}
    </div>
  );
}
