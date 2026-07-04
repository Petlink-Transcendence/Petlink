import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Profile.css';

import ProfileCover from '../components/profile/ProfileCover';
import ProfileInfoBar from '../components/profile/ProfileInfoBar';
import ProfileLeftSidebar from '../components/profile/ProfileLeftSidebar';
import ProfileContent from '../components/profile/ProfileContent';
import SitterAvailabilityPanel from '../components/profile/SitterAvailabilityPanel';
import NewBookingPopup from '../components/bookings/NewBookingPopup';
import UpdateAvailabilityPopup, { type AvailabilityFormData } from '../components/bookings/UpdateAvailabilityPopup';
import { getInitials, formatMemberSince } from './OwnerProfile';
import { formatAvailabilityRate } from '../utils/availabilityRates';

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
  created_at?: string | null;
  experience?: string | null;
  price?: string | number | null;
  pet_types?: string[] | null;
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

type SitterAvailability = {
  status: 'Accepting' | 'Not available';
  location: string;
  responseTime: string;
  capacity: string;
  windows: { label: string; time: string }[];
  services: { name: string; rate: string; detail: string }[];
};

interface ProfileSitterData {
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
  experience?: string;
  price?: string | number;
  pet_types?: string[];
  availability: SitterAvailability;
}

function formatPetType(type: string): string {
  return type.replace(/\b\w/g, letter => letter.toUpperCase());
}

function formatServiceName(service: string) {
  return service.replace(/\b\w/g, letter => letter.toUpperCase());
}

function formatServiceDetail(availability: AvailabilityFormData) {
  if (availability.notes) {
    return availability.notes;
  }

  return `${availability.timeSlots} from ${availability.startDate} to ${availability.endDate}`;
}

function mapBackendToSitterProfile(data: BackendUser): ProfileSitterData {
  const name = data.name || data.username || 'Jane Doe';
  const username = data.username ? `@${data.username}` : `@user-${data.id}`;

  return {
    id: String(data.id),
    name,
    username,
    role: data.user_type === 'sitter' ? 'Pet Sitter' : data.user_type === 'owner' ? 'Pet Owner' : (data.role || 'User'),
    bio: data.description || 'No bio available.',
    initials: getInitials(name),
    imageUrl: data.avatar ? data.avatar.startsWith('http') ? data.avatar : `http://localhost:8080${data.avatar}` : undefined,
    stats: [
      { value: data.rating ?? 'N/A', label: 'Rating' },
      { value: data.followers_count ?? 0, label: 'Followers' },
      { value: data.following_count ?? 0, label: 'Following' },
    ],
    sidebarCards: [
      {
        title: 'About',
        type: 'meta',
        items: [
          data.created_at ? `📅 Member since ${formatMemberSince(data.created_at)}` : '📅 Unknown profile creation date',
          data.city ? `📍 ${data.city}` : '📍 Location not set',
          data.country ? `🌍 ${data.country}` : '🌍 Country not set',
          data.experience ? `🐾 Experience: ${data.experience}` : '🐾 Experience not set',
          data.price ? `💰 Price: ${data.price}` : '💰 Price not set',
        ],
      },
      {
        title: 'Pet Types',
        type: 'tags',
        items: data.pet_types && data.pet_types.length > 0 ? data.pet_types.map(type => formatPetType(type)) : ['No pet types specified'],
      },
    ],
    /* Uncoment and integrate when backend provides posts, reviews and availability*/
    // posts: [],
    // reviews: [],
    /* end of uncomment */
    /* Hardcoded - to be removed when backend provides posts and reviews */
    posts: [
      { id: 1, text: 'Available for sitting for this weekend? DM me 🐱', time: '1h ago', likes: 12 },
      { id: 2, text: 'Just went on a long walk with Buddy. Such a joy!', time: '3 days ago', likes: 27 },
    ],
    reviews: [
      { id: 1, author: 'Ana C.', rating: 5, text: `${username} is a wonderful pet sitter!`, time: '2 weeks ago' },
      { id: 2, author: 'Miguel R.', rating: 5, text: 'Always on time and very communicative. A pleasure to work with.', time: '1 month ago' },
      { id: 3, author: 'Sara M.', rating: 4, text: `Great experience. Buddy is a handful but ${username} made it easy.`, time: '2 months ago' },
    ], 
    availability: {
      status: 'Accepting',
      location: 'Porto + 8 km',
      responseTime: '< 1 hour',
      capacity: '2 bookings/day',
      windows: [
        { label: 'Mon - Fri', time: '09:00 - 12:00' },
        { label: 'Saturday', time: '14:00 - 18:00' },
        { label: 'Sunday', time: 'On request' },
      ],
      services: [
        { name: 'Cat Sitting', rate: '20 EUR', detail: 'Daily visits, feeding, litter care' },
        { name: 'Home Visits', rate: '15 EUR', detail: 'Short check-ins for cats and small pets' },
        { name: 'Grooming', rate: '18 EUR', detail: 'Coat brushing and basic care' },
        { name: 'Overnight Stay', rate: '45 EUR', detail: 'In-home care for longer bookings' },
      ],
    },
    /* end of hardcode */
  };
}

function formatAvailabilityLocation(location: string) {
  return location.replace(/\s*\+\s*\d+\s*km\b/i, '').trim();
}

export default function SitterProfile() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileSitterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connections, setConnections] = useState<Record<string, boolean>>({});

  const isOwnProfile = !profileId;
  const isConnected = profile ? Boolean(connections[profile.id]) : false;

  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'Accepting' | 'Not available'>(profile?.availability.status || 'Not available');
  const [availabilityLocation, setAvailabilityLocation] = useState('');
  const [availabilityCapacity, setAvailabilityCapacity] = useState('');
  const [currentServiceRates, setCurrentServiceRates] = useState<{ name: string; rate: string; detail: string }[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError('');

      const endpoint = profileId
        ? `http://localhost:8080/api/users/${profileId}/`
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

        if (!profileId && data.id) {
          const publicResponse = await fetch(`http://localhost:8080/api/users/${data.id}/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });

          if (publicResponse.ok) {
            const publicData: BackendUser = await publicResponse.json();
            mergedData = { ...data, ...publicData };
          }
        }

        setProfile(mapBackendToSitterProfile(mergedData));
      } catch (err: any) {
        setError(err.message || 'Failed to load profile.');
        console.error("Fetch error details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId]);
  
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

  const handleConnectionToggle = () => {
    if (!profile) return;

    setConnections(currentConnections => ({
      ...currentConnections,
      [profile.id]: !currentConnections[profile.id],
    }));
  };

  useEffect(() => {
    if (!profile) return;
    document.title = `${profile.name} | PetLink`;
    setAvailabilityStatus(profile.availability.status);
    setAvailabilityLocation(formatAvailabilityLocation(profile.availability.location));
    setAvailabilityCapacity(profile.availability.capacity);
    setCurrentServiceRates(profile.availability.services);
  }, [profile]);

  const handleAvailabilitySave = (availability: AvailabilityFormData) => {
    if (availability.serviceTypes.length > 0) {
      const detail = formatServiceDetail(availability);
      const rate = formatAvailabilityRate(availability.price);
      const updatedServices = availability.serviceTypes.map(formatServiceName);

      setCurrentServiceRates(currentServices => {
        const nextServices = currentServices.map(service => {
          const matchingService = updatedServices.find(
            updatedService => updatedService.toLowerCase() === service.name.toLowerCase()
          );

          if (!matchingService) {
            return service;
          }

          return {
            name: matchingService,
            rate,
            detail,
          };
        });

        const existingServices = new Set(nextServices.map(service => service.name.toLowerCase()));
        const newServices = updatedServices
          .filter(service => !existingServices.has(service.toLowerCase()))
          .map(service => ({
            name: service,
            rate,
            detail,
          }));

        return [...nextServices, ...newServices];
      });
    }

    setAvailabilityStatus('Accepting');
    setAvailabilityLocation(formatAvailabilityLocation(availability.location));
    setAvailabilityCapacity(availability.capacity);
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
          ? [{ label: 'Edit Profile', variant: 'secondary',  onClick: () => navigate('/settings') }]
          : [
            { label: 'Make a booking', variant: 'primary', onClick: () => setIsNewBookingOpen(true) },
            {
              label: isConnected ? 'Disconnect' : 'Connect',
              variant: 'secondary',
              onClick: handleConnectionToggle,
            },
            { label: 'Message', variant: 'secondary', onClick: handleMessageClick },
          ]
        }
      />
      <div className="profile-body">
        <ProfileLeftSidebar cards={profile.sidebarCards}>
          <SitterAvailabilityPanel
            status={availabilityStatus}
            location={availabilityLocation}
            responseTime={profile.availability.responseTime}
            capacity={availabilityCapacity}
            windows={profile.availability.windows}
            services={currentServiceRates}
            canEdit={isOwnProfile}
            onAvailabilityToggle={() => {
              setAvailabilityStatus(currentStatus =>
                currentStatus === 'Accepting' ? 'Not available' : 'Accepting'
              );
            }}
            onUpdateAvailability={() => setIsAvailabilityOpen(true)}
          />
        </ProfileLeftSidebar>
        <ProfileContent
          posts={profile.posts}
          reviews={profile.reviews}
          authorName={profile.name}
          authorInitials={profile.initials}
          showCreatePost={isOwnProfile}
        />
      </div>
      {isNewBookingOpen && (
        <NewBookingPopup
          onClose={() => setIsNewBookingOpen(false)}
          onCreateBooking={() => undefined}
          initialSitter={profile.name}
        />
      )}
      {isAvailabilityOpen && (
        <UpdateAvailabilityPopup
          onClose={() => setIsAvailabilityOpen(false)}
          initialLocation={availabilityLocation}
          initialCapacity={availabilityCapacity}
          onSaveAvailability={handleAvailabilitySave}
        />
      )}
    </div>
  );
}
