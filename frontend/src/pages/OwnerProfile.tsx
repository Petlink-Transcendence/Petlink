import { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import './Profile.css';

import ProfileCover from '../components/profile/ProfileCover';
import ProfileInfoBar from '../components/profile/ProfileInfoBar';
import ProfileLeftSidebar from '../components/profile/ProfileLeftSidebar';
import ProfileContent from '../components/profile/ProfileContent';
import ProfileToggle from '../components/profile/ProfileToggle';

interface BackendUser {
  id: number;
  username?: string;
  name?: string;
  user_type?: string;
  role?: string;
  avatar?: string | null;
  description?: string | null;
  city?: string | null;
  country?: string | null;
  rating?: string | number | null;
  followers_count?: number;
  following_count?: number;
}

type ProfileStat = {
  value: string | number;
  label: string;
};

type ProfileSidebarCard =
  | { title: string; type: 'meta'; items: string[] }
  | { title: string; type: 'tags'; items: string[] };

type ProfilePost = {
  id: number;
  text: string;
  time: string;
  likes: number;
};

type ProfileReview = {
  id: number;
  author: string;
  rating: number;
  text: string;
  time: string;
};

interface ProfileData {
  id: string;
  username: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  imageUrl?: string;
  stats: ProfileStat[];
  sidebarCards: ProfileSidebarCard[];
  posts: ProfilePost[];
  reviews: ProfileReview[];
}

function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase();
}

function mapBackendToProfile(data: BackendUser): ProfileData {
  const name = data.name || data.username || 'Unknown User';
  return {
    id: String(data.id),
    name,
    username: data.username ? `@${data.username}` : `@user-${data.id}`,
    role: data.user_type === 'owner' ? 'Pet Owner' : data.user_type === 'sitter' ? 'Pet Sitter' : (data.role || 'User'),
    bio: data.description || 'No bio available.',
    initials: getInitials(name),
    imageUrl: data.avatar ? data.avatar.startsWith('http') ? data.avatar : `http://localhost:8080${data.avatar}` : undefined,
    stats: [
      { value: data.rating ?? 'N/A', label: 'Rating' },
      { value: data.followers_count ?? 0, label: 'Followers' },
      { value: data.following_count ?? 0, label: 'Following' },
    ],
    sidebarCards: [
      {title: 'About',
        type: 'meta',
        items: [
          data.city ? `📍 ${data.city}` : '📍 Location not set',
          data.country ? `🌍 ${data.country}` : '🌍 Country not set',
        ],
      },
    ],
    posts: [],
    reviews: [],
  };
}

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connections, setConnections] = useState<Record<string, boolean>>({});

  const isOwnProfile = !id;
  const isConnected = profile ? Boolean(connections[profile.id]) : false;
  
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError('');

      const endpoint = id 
        ? `http://localhost:8080/api/users/${id}/`
        : `http://localhost:8080/auth/me/`;
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

      let mergedData: BackendUser = data;

      if (!id && data.id) {
        const publicResponse = await fetch(`http://localhost:8080/api/users/${data.id}/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (publicResponse.ok) {
          const publicData: BackendUser = await publicResponse.json();
          mergedData = { ...data, ...publicData };
        }
      }

      setProfile(mapBackendToProfile(mergedData));
    
  } catch (err: any) {
    setError(err.message || 'Failed to load profile.');
    console.error("Fetch error details:", err);
    } finally {
      setLoading(false);
    }
  };

    fetchProfileData();
  }, [id]);

  useEffect(() => {
    if (profile?.name) {
      document.title = `${profile.name} | PetLink`;
    }
  }, [profile?.name]);
  
  const handleConnectionToggle = () => {
    if (!profile) return;
    setConnections(currentConnections => ({
      ...currentConnections,
      [profile.id]: !currentConnections[profile.id],
    }));
  };

  const handleMessageClick = () => {
    if (!profile) return;
    navigate('/chat', {
      state: {
        contact: {
          id: Number(profile.id),
          name: profile.name,
          role: profile.role,
        },
      },
    });
  };

  if (loading) return <div className="profile-status-msg">⏳ Fetching real backend data...</div>;
  if (error) return <div className="profile-status-msg error">❌ Error: {error}</div>;
  if (!profile) return <div className="profile-status-msg error">⚠️ No profile data returned from backend.</div>;

  return (
    <div className="profile-page">
      {isOwnProfile && <ProfileToggle active="owner" />}
      <ProfileCover initials={profile.initials} imageUrl={profile.imageUrl} />
      <ProfileInfoBar
        name={profile.name}
        username={profile.username}
        role={profile.role}
        bio={profile.bio}
        stats={profile.stats}
        actions={isOwnProfile
          ? [{ label: 'Edit Profile', variant: 'secondary', onClick: () => navigate('/settings') }]
          : [
            {
              label: isConnected ? 'Disconnect' : 'Connect',
              variant: 'primary',
              onClick: handleConnectionToggle,
            },
            { label: 'Message', variant: 'secondary', onClick: handleMessageClick },
          ]
        }
      />
      <div className="profile-body">
        <ProfileLeftSidebar cards={profile.sidebarCards} />
        <ProfileContent
          posts={profile.posts}
          reviews={profile.reviews}
          authorName={profile.name}
          authorInitials={profile.initials}
          showCreatePost={isOwnProfile}
        />
      </div>
    </div>
  );
}
