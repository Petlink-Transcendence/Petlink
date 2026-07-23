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
}

export interface BackendPet {
  id: number;
  name: string;
  type: string;
  breed?: string | null;
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
  role: string;
  bio: string;
  initials: string;
  imageUrl?: string;
  stats: ProfileStat[];
  sidebarCards: ProfileSidebarCard[];
  posts: ProfilePost[];
  reviews: ProfileReview[];
  looking_for?: string[];
}

export function getInitials(name: string): string {
	const parts = name.split(' ').filter(Boolean);
	if (parts.length === 1) return parts[0][0].toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatMemberSince(isoDate: string): string {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString('en-US', options);
}

function formatPetLabel(pet: BackendPet): string {
  const nameLabel = pet.name ? `${pet.name[0].toUpperCase()}${pet.name.slice(1)}` : 'Unnamed Pet';
  return pet.breed ? `${nameLabel} | ${pet.type} | ${pet.breed}` : `${pet.name} | ${pet.type}`;
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
    role: data.user_type === 'owner' ? 'Pet Owner' : data.user_type === 'sitter' ? 'Pet Sitter' : (data.role || 'User'),
    bio: data.description || 'No bio available.',
    initials: getInitials(name),
    imageUrl: data.avatar || undefined,
    stats: [
      { value: data.rating ?? 'N/A', label: 'Rating' },
      { value: data.followers_count ?? 0, label: 'Connections' },
    ],
    sidebarCards: [
      {title: 'About',
        type: 'meta',
        items: [
          data.created_at ? `📅 Member since ${formatMemberSince(data.created_at)}` : '📅 Unknown profile creation date',
          data.city ? `📍 ${data.city}` : '📍 Location not set',
          data.country ? `🌍 ${data.country}` : '🌍 Country not set',
        ],
      },
      {title: 'My Pets',
        type: 'tags',
        items: petItems,
      },
      {title: 'Looking for',
        type: 'tags',
        items: data.looking_for && data.looking_for.length > 0 ? data.looking_for.map(item => item.charAt(0).toUpperCase() + item.slice(1)) : ['No preferences set'],
      },
    ],
   /* Uncoment and integrate when backend provides posts and reviews */
    // posts: [],
    // reviews: [],
    /* end of uncomment */
    /* Hardcoded - to be removed when backend provides posts and reviews */
    posts: [
      { id: 1, text: 'Available sitters for this weekend? DM me 🐱', time: '1h ago', likes: 12 },
      { id: 2, text: 'Just went on a long walk with Buddy. Such a joy!', time: '3 days ago', likes: 27 },
    ],
    reviews: [
      { id: 1, author: 'Ana C.', rating: 5, text: `${username} is a wonderful pet owner. Luna and Buddy are so well behaved!`, time: '2 weeks ago' },
      { id: 2, author: 'Miguel R.', rating: 5, text: 'Always on time and very communicative. A pleasure to work with.', time: '1 month ago' },
      { id: 3, author: 'Sara M.', rating: 4, text: `Great experience. Buddy is a handful but ${username} made it easy.`, time: '2 months ago' },
    ], 
    /* end of hardcode */
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

      setProfile(mapBackendToProfile(mergedData, petsData));
    
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
