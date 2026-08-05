import { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import './Profile.css';

import ProfileCover from '../components/profile/ProfileCover';
import ProfileInfoBar from '../components/profile/ProfileInfoBar';
import ProfileLeftSidebar from '../components/profile/ProfileLeftSidebar';
import ProfileContent from '../components/profile/ProfileContent';

export interface BackendUser {
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
  created_at?: string | null;
  looking_for?: string[] | null;
  sitter_pet_types?: string[] | null;
  show_about?: boolean | null;
  show_pets?: boolean | null;
  show_looking_for?: boolean | null;
}

export interface BackendPet {
  id: number;
  name: string;
  type: string;
  breed?: string | null;
  age?: string | null;
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

export interface ProfileData {
  id: string;
  username: string;
  name: string;
  user_type?: string;
  role: string;
  bio: string;
  initials: string;
  imageUrl?: string;
  stats: ProfileStat[];
  sidebarCards: ProfileSidebarCard[];
  posts: ProfilePost[];
  reviews: ProfileReview[];
  looking_for?: string[];
  show_about?: boolean | null;
  show_pets?: boolean | null;
  show_looking_for?: boolean | null;
}

export function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return 'U';
	if (parts.length === 1) return parts[0][0].toUpperCase();
	return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function formatMemberSince(isoDate: string): string {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString('en-US', options);
}

function formatPetLabel(pet: BackendPet): string {
  const nameLabel = pet.name ? `${pet.name[0].toUpperCase()}${pet.name.slice(1)}` : 'Unnamed Pet';
  const base = pet.breed ? `${nameLabel} | ${pet.type} | ${pet.breed}` : `${nameLabel} | ${pet.type}`;
  return pet.age ? `${base} | ${pet.age}` : base;
}

function getPets(pets: BackendPet[]): BackendPet[] {
  const petsByKey = new Map<string, BackendPet>();

  for (const pet of pets) {
    const key = `${pet.name.trim().toLowerCase()}|${pet.type.trim().toLowerCase()}`;
    const existing = petsByKey.get(key);

    if (!existing || (!existing.breed && pet.breed)) {
      petsByKey.set(key, pet);
    }
  }

  return Array.from(petsByKey.values());
}

export function mapBackendToProfile(data: BackendUser, pets: BackendPet[] = []): ProfileData {
  const name = data.name || data.username || 'Jane Doe';
  const username = data.username ? `@${data.username}` : `@user-${data.id}`;
  const uniquePets = getPets(pets);
  const petItems = uniquePets.length ? uniquePets.map(formatPetLabel) : ['No pets added yet'];
  return {
    id: String(data.id),
    name,
    username,
    user_type: data.user_type === 'owner' ? 'Pet Owner' : data.user_type === 'provider' ? 'Pet Sitter' : (data.user_type || ''),
    role: data.role || '',
    bio: data.description || 'No bio available.',
    initials: getInitials(name),
    imageUrl: data.avatar || undefined,
    show_about: data.show_about ?? true,
    show_pets: data.show_pets ?? true,
    show_looking_for: data.show_looking_for ?? true,
    stats: [
      { value: data.rating ?? 'N/A', label: 'Rating' },
      { value: data.followers_count ?? 0, label: 'Connections' },
    ],
    sidebarCards: [
      ...(data.show_about !== false ? [{
        title: 'About',
        type: 'meta' as const,
        items: [
          data.created_at ? `📅 Member since ${formatMemberSince(data.created_at)}` : '📅 Unknown profile creation date',
          data.city ? `📍 ${data.city}` : '📍 Location not set',
          data.country ? `🌍 ${data.country}` : '🌍 Country not set',
        ],
      }] : []),
      ...(data.show_pets !== false ? [{
        title: 'My Pets',
        type: 'tags' as const,
        items: petItems,
      }] : []),
      ...(data.show_looking_for !== false ? [{
        title: 'Looking for',
        type: 'tags' as const,
        items: data.looking_for && data.looking_for.length > 0 ? data.looking_for.map(item => item.charAt(0).toUpperCase() + item.slice(1)) : ['No preferences set'],
      }] : []),
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
    const fetchProfileData = async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      setError('');

      const endpoint = id 
        ? `/api/users/${id}/`
        : `/auth/me/`;
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
        const publicResponse = await fetch(`/api/users/${data.id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        if (publicResponse.ok) {
          const publicData: BackendUser = await publicResponse.json();
          mergedData = { ...data, ...publicData };
        }
      }

      let petsData: BackendPet[] = [];
      if (mergedData.id) {
        const petsResponse = await fetch(`/api/users/${mergedData.id}/pets/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (petsResponse.ok) {
          petsData = await petsResponse.json();
        }
      }

      if (mergedData.id && (mergedData as any).is_following !== undefined) {
        setConnections(prev => ({
          ...prev,
          [mergedData.id]: Boolean((mergedData as any).is_following || (mergedData as any).is_connected)
        }));
      }

      setProfile(mapBackendToProfile(mergedData, petsData));
    
  } catch (err: any) {
    setError(err.message || 'Failed to load profile.');
    console.error("Fetch error details:", err);
    } finally {
      setLoading(false);
    }
  };

    fetchProfileData();
    const handleConnectionUpdate = () => fetchProfileData(true);
    window.addEventListener('connectionUpdated', handleConnectionUpdate);
    return () => window.removeEventListener('connectionUpdated', handleConnectionUpdate);
  }, [id]);

  useEffect(() => {
    if (profile?.name) {
      document.title = `${profile.name} | PetLink`;
    }
  }, [profile?.name]);

  const handleMessageClick = () => {
    if (!profile) return;
    navigate('/chat', {
      state: {
        contact: {
          id: Number(profile.id),
          name: profile.name,
          user_type: profile.user_type || '',
        },
      },
    });
  };

  const handleConnectionToggle = async () => {
    if (!profile) return;
    const targetId = profile.id;
    const currentlyConnected = Boolean(connections[targetId]);
    const method = currentlyConnected ? 'DELETE' : 'POST';

    // Update the UI immediately while persisting the change remotely.
    setConnections(prev => ({
      ...prev,
      [targetId]: !currentlyConnected,
    }));

    try {
      const token = localStorage.getItem('access') || localStorage.getItem('access_token');
      const response = await fetch(`/api/users/${targetId}/follow/`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        window.dispatchEvent(new Event('connectionUpdated'));
      } else {
        throw new Error(`Connection update failed with status ${response.status}`);
      }
    } catch (err) {
      console.error('Failed to toggle connection:', err);
      // Roll back the optimistic update when persistence fails.
      setConnections(prev => ({
        ...prev,
        [targetId]: currentlyConnected,
      }));
    }
  };

  if (loading) return <div className="profile-status-msg">⏳ Fetching real backend data...</div>;
  if (error) return <div className="profile-status-msg error">❌ Error: {error}</div>;
  if (!profile) return <div className="profile-status-msg error">⚠️ No profile data returned from backend.</div>;

  return (
    <div className="profile-page">
      <ProfileCover initials={profile.initials} imageUrl={profile.imageUrl} />
      <ProfileInfoBar
        name={profile.name}
        username={profile.username}
        user_type={profile.user_type}
        bio={profile.bio}
        stats={profile.stats}
        actions={isOwnProfile
          ? [{ label: 'Edit Profile', variant: 'secondary', onClick: () => navigate('/settings') }]
          : [
            {
              label: isConnected ? 'Waiting approval' : 'Connect',
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
          profileUserId={Number(profile.id)}
          authorName={profile.name}
          authorInitials={profile.initials}
          showCreatePost={isOwnProfile}
        />
      </div>
    </div>
  );
}
