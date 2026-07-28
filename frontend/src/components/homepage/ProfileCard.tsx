import './ProfileCard.css'
import { useEffect, useState } from 'react'
import { useParams, useNavigate} from 'react-router-dom';
import FollowsContainer from '../Follows.tsx'

interface BackendUser {
  id: number;
  username?: string;
  name?: string;
  avatar?: string | null;
  description?: string | null;
  posts_count?: number;
  followers_count?: number;
  following_count?: number;
}

type ProfileStat = {
  value: string | number;
  label: string;
};

interface ProfileData {
  id: string;
  username: string;
  name: string;
  bio: string;
  initials: string;
  imageUrl?: string;
  stats: ProfileStat[];
}

function getInitials(name: string): string {
	const parts = name.split(' ').filter(Boolean);
	if (parts.length === 1) return parts[0][0].toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function mapBackendUserToProfileData(user: BackendUser): ProfileData {
  const name = user.name || user.username || 'Jane Doe';
  const username = user.username ? `@${user.username}` : `@user-${user.id}`;
  return {
    id: String(user.id),
    name,
    username,
    bio: user.description || 'No bio available',
    initials: getInitials(name),
    imageUrl: user.avatar || undefined,
    stats: [
      { value: user.posts_count ?? '0', label: 'Posts' },
      { value: user.followers_count ?? 0, label: 'Connections' },
    ]
  }
}

export default function ProfileCard() {
  const [isFollowsOpen, setIsFollowsOpen] = useState(false);
  const [followsTab, setFollowsTab] = useState<'followers' | 'following'>('followers');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [ profileCard, setProfileCard ] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);

  const openFollowsPopup = (tabName: 'followers' | 'following') => {
    setFollowsTab(tabName);
    setIsFollowsOpen(true);
  };

  useEffect(() => {
    const fetchProfileCardData = async () => {
      setLoading(true);
      setError('');

      const endpoint = `/auth/me/`;
      try {
        const token = localStorage.getItem('access') || localStorage.getItem('access_token');
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json', 
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data.');
        }

        const data: BackendUser = await response.json();
        const profileData = mapBackendUserToProfileData(data);
        setProfileCard(profileData);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile card.');
        console.error("Fetch error details:", err);
        } finally {
        setLoading(false);
      }
  };
  
  fetchProfileCardData();
  }, [id]);

  if (loading) return <div className="profile-status-msg">⏳ Fetching real backend data...</div>;
  if (error) return <div className="profile-status-msg error">❌ Error: {error}</div>;
  if (!profileCard) return <div className="profile-status-msg error">⚠️ No profile data returned from backend.</div>;


	return (
		<div className="profile-card-container">
        <div className="profile-card">
          {profileCard.imageUrl && !imgError ? (
          <img
            className="profile-pic"
            src={profileCard.imageUrl}
            alt="profile picture"
            onError={() => setImgError(true)}
          />
          ) : (
            <div className="profile-pic">{profileCard.initials}</div>
          )}
          <div className="profile-info">
          <h4 className="name">{profileCard.name}</h4>
          <p className="username">{profileCard.username}</p>
          <p className="bio">{profileCard.bio}</p>
          <hr className="divider" />
            <div className="stats">
              <div className='stats-group' onClick={() => navigate('/profile')}>
                <p className="nbr">{profileCard.stats.find(s => s.label === 'Posts')?.value ?? 0}</p>
                <p className='stats-label'>Posts</p>
              </div>
              <div className='stats-group' onClick={() => openFollowsPopup('followers')}>
                <p className='nbr'>{profileCard.stats.find(s => s.label === 'Connections')?.value ?? 0}</p>
                <p className='stats-label'>Connections</p>
              </div>
            </div>
          </div>
        </div>

      {isFollowsOpen && (
        <FollowsContainer 
        initialTab={followsTab}
        onClose={() => setIsFollowsOpen(false)} />
      )}
    </div>
	);
}