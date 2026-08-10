import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLoggedInUserId } from '../utils/auth';
import './Profile.css';

import ProfileCover from '../components/profile/ProfileCover';
import ProfileInfoBar from '../components/profile/ProfileInfoBar';
import ProfileLeftSidebar from '../components/profile/ProfileLeftSidebar';
import ProfileContent, { type BackendPost } from '../components/profile/ProfileContent';
import SitterAvailabilityPanel from '../components/profile/SitterAvailabilityPanel';
import NewBookingPopup from '../components/bookings/NewBookingPopup';
import UpdateAvailabilityPopup, {
  type AvailabilityFormData,
  type AvailabilityTimeSlot,
} from '../components/bookings/UpdateAvailabilityPopup';
import UpdateServicesPopup, { type ServiceRateFormData } from '../components/bookings/UpdateServicesPopup';
import { getInitials, formatMemberSince } from './OwnerProfile';

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
  sitter_pet_types?: string[] | null;
  show_about?: boolean | null;
  show_looking_for?: boolean | null;
  availability_status?: 'Accepting' | 'Not available' | null;
  availability_location?: string | null;
  availability_capacity?: string | null;
  available_times?: AvailabilityTimeSlot[] | null;
}

interface BackendAvailability {
  id: number;
  user: number;
  start_date: string;
  end_date: string;
  time_slots: string;
  price: string | number;
  currency?: string;
  notes?: string | null;
}

interface BackendService {
  id: number;
  user: number;
  type: string;
  description?: string | null;
  price: string | number;
  currency?: string;
  price_unit: string;
  is_active: boolean;
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
  capacity: string;
  windows: { label: string; time: string }[];
  services: ServiceRateFormData[];
};

interface ProfileSitterData {
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
  experience?: string;
  price?: string | number;
  sitter_pet_types?: string[];
  availability: SitterAvailability;
  show_about?: boolean | null;
  show_looking_for?: boolean | null;
}

function formatPetType(type: string): string {
  return type.replace(/\b\w/g, letter => letter.toUpperCase());
}

export function mapBackendToSitterProfile(data: BackendUser): ProfileSitterData {
  const name = data.name || data.username || 'Jane Doe';
  const username = data.username ? `@${data.username}` : `@user-${data.id}`;
  const persistedWindows = Array.isArray(data.available_times)
    ? data.available_times
        .filter(window => window && typeof window === 'object')
        .map(window => ({ label: String(window.label || ''), time: String(window.time || '') }))
        .filter(window => window.label && window.time)
    : [];

  return {
    id: String(data.id),
    name,
    username,
    user_type: data.user_type === 'provider' ? 'Pet Sitter' : data.user_type === 'owner' ? 'Pet Owner' : (data.user_type || ''),
    role: data.role || '',
    bio: data.description || 'No bio available.',
    initials: getInitials(name),
    imageUrl: data.avatar || undefined,
    show_about: data.show_about ?? true,
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
          data.experience ? `🐾 Experience: ${data.experience}` : '🐾 Experience not set',
          data.price ? `💰 Price: ${data.price}` : '💰 Price not set',
        ],
      }] : []),
      ...(data.show_looking_for !== false ? [{
        title: 'Pet Types',
        type: 'tags' as const,
        items: data.sitter_pet_types && data.sitter_pet_types.length > 0 ? data.sitter_pet_types.map(type => formatPetType(type)) : ['No pet types specified'],
      }] : []),
    ],
    posts: [],
    reviews: [],
    availability: {
      status: data.availability_status || 'Not available',
      location: data.availability_location || '',
      capacity: data.availability_capacity || '',
      windows: persistedWindows,
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

function parseAvailabilityNotes(notes?: string | null) {
  const values = { location: '', capacity: '' };

  for (const part of (notes || '').split(';')) {
    const [key, ...valueParts] = part.split(':');
    const value = valueParts.join(':').trim();

    if (key?.trim().toLowerCase() === 'location') values.location = value;
    if (key?.trim().toLowerCase() === 'capacity') values.capacity = value;
  }

  return values;
}

const serviceLabels: Record<string, string> = {
  dog_walking: 'Dog Walking',
  cat_sitting: 'Cat Sitting',
  home_visits: 'Home Visits',
  overnight_stay: 'Overnight Stay',
  grooming: 'Grooming',
};

function mapBackendServices(records: BackendService[], profileId: string): ServiceRateFormData[] {
  return records
    .filter(service => service.user === Number(profileId) && service.is_active)
    .map(service => ({
      id: service.id,
      name: serviceLabels[service.type] || service.type,
      rate: `${service.price} ${service.currency || 'EUR'}${service.price_unit ? ` ${service.price_unit.replace('per_', 'per ')}` : ''}`,
      detail: service.description || '',
    }));
}

function getServiceType(name: string) {
  const normalizedName = name.trim().toLowerCase().replace(/\s+/g, '_');
  const aliases: Record<string, string> = {
    dog_walking: 'dog_walking',
    dog_walk: 'dog_walking',
    cat_sitting: 'cat_sitting',
    cat_sitting_service: 'cat_sitting',
    home_visits: 'home_visits',
    home_visit: 'home_visits',
    overnight_stay: 'overnight_stay',
    overnight: 'overnight_stay',
    grooming: 'grooming',
  };

  return aliases[normalizedName];
}

function getServicePayload(service: ServiceRateFormData) {
  const amount = service.rate.match(/\d+(?:[.,]\d+)?/)?.[0]?.replace(',', '.') || '';
  const currency = service.rate.match(/\b(€|EUR|USD|GBP)\b/i)?.[0].toUpperCase() || 'EUR';
  const normalizedRate = service.rate.toLowerCase();
  const priceUnit = normalizedRate.includes('day') || normalizedRate.includes('overnight')
    ? 'per_day'
    : normalizedRate.includes('hour')
      ? 'per_hour'
      : 'per_session';

  return {
    type: getServiceType(service.name),
    description: service.detail,
    price: amount,
    currency: currency === '€' ? 'EUR' : currency,
    price_unit: priceUnit,
  };
}

function mapBackendAvailability(
  records: BackendAvailability[],
  profile: ProfileSitterData,
): Pick<SitterAvailability, 'status' | 'location' | 'capacity' | 'windows'> {
  const today = new Date().toISOString().slice(0, 10);
  const currentRecords = records.filter(record => (
    record.start_date <= today && record.end_date >= today
  ));

  if (currentRecords.length === 0) {
    return {
      status: 'Not available',
      location: '',
      capacity: '',
      windows: [],
    };
  }

  const notes = parseAvailabilityNotes(currentRecords[0].notes);
  const windows = currentRecords.flatMap(record => record.time_slots
    .split(/\r?\n/)
    .map(slot => slot.trim())
    .filter(Boolean)
    .map((slot, index) => {
      const labeledSlot = slot.match(/^(.+?):\s*(.+)$/);
      return labeledSlot
        ? { label: labeledSlot[1].trim(), time: labeledSlot[2].trim() }
        : { label: `Availability ${index + 1}`, time: slot };
    }));

  return {
    status: 'Accepting',
    location: formatAvailabilityLocation(notes.location || profile.sidebarCards[0]?.items.find(item => item.startsWith('📍'))?.replace('📍 ', '') || ''),
    capacity: notes.capacity,
    windows,
  };
}

function hasProfileAvailability(data: BackendUser) {
  return Boolean(
    data.availability_status === 'Accepting' ||
    data.availability_location ||
    data.availability_capacity ||
    (data.available_times && data.available_times.length > 0),
  );
}

export default function SitterProfile() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileSitterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connections, setConnections] = useState<Record<string, { following: boolean, follower: boolean, connected: boolean }>>({});
  const [currentUserType, setCurrentUserType] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      fetch('/auth/me/', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(u => { if (u) setCurrentUserType(u.user_type); })
        .catch(() => {});
    }
  }, []);

  const loggedInUserId = getLoggedInUserId();
  const isOwnProfile = !profileId || (profile && profile.id === loggedInUserId);
  const connState = profile ? connections[profile.id] : null;



  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'Accepting' | 'Not available'>(profile?.availability.status || 'Not available');
  const [availabilityLocation, setAvailabilityLocation] = useState('');
  const [availabilityCapacity, setAvailabilityCapacity] = useState('');
  const [availabilityWindows, setAvailabilityWindows] = useState<AvailabilityTimeSlot[]>([]);
  const [currentServiceRates, setCurrentServiceRates] = useState<ServiceRateFormData[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError('');

      const endpoint = profileId
        ? `/api/users/${profileId}/`
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

        if (!profileId && data.id) {
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

        if (mergedData.id && (mergedData as any).is_following !== undefined) {
          setConnections(prev => ({
            ...prev,
            [mergedData.id]: {
              following: Boolean((mergedData as any).is_following),
              follower: Boolean((mergedData as any).is_follower),
              connected: Boolean((mergedData as any).is_connected)
            }
          }));
        }

        let nextProfile = mapBackendToSitterProfile(mergedData);
        const availabilityResponse = await fetch(`/api/availability/${mergedData.id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        // Availability records predate the profile availability fields. Use them
        // only as a read fallback for existing data; new edits are stored on User.
        if (availabilityResponse.ok && !hasProfileAvailability(mergedData)) {
          const availabilityRecords: BackendAvailability[] = await availabilityResponse.json();
          nextProfile = {
            ...nextProfile,
            availability: {
              ...nextProfile.availability,
              ...mapBackendAvailability(availabilityRecords, nextProfile),
            },
          };
        }

        const servicesResponse = await fetch('/api/services/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        if (servicesResponse.ok) {
          const serviceRecords: BackendService[] = await servicesResponse.json();
          nextProfile = {
            ...nextProfile,
            availability: {
              ...nextProfile.availability,
              services: mapBackendServices(serviceRecords, nextProfile.id),
            },
          };
        }

        setProfile(nextProfile);
      } catch {
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
    const handleConnectionUpdate = () => fetchProfileData();
    window.addEventListener('connectionUpdated', handleConnectionUpdate);
    return () => {
      window.removeEventListener('connectionUpdated', handleConnectionUpdate);
    };
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
          user_type: profile.user_type,
        },
      },
    });
  };

  const handleConnectionToggle = async () => {
    if (!profile) return;
    const targetId = profile.id;
    const prevState = connState || { following: false, follower: false, connected: false };
    const isCurrentlyFollowing = prevState.connected || prevState.following;
    const method = isCurrentlyFollowing ? 'DELETE' : 'POST';

    // Update the UI immediately while persisting the change remotely.
    setConnections(prev => ({
      ...prev,
      [targetId]: {
        ...prevState,
        following: !isCurrentlyFollowing,
        follower: (isCurrentlyFollowing && prevState.connected) ? false : prevState.follower,
        connected: !isCurrentlyFollowing ? prevState.follower : false,
      },
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
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        if (data.error) {
          throw new Error(data.error);
        }
        window.dispatchEvent(new Event('connectionUpdated'));
      } else {
        throw new Error(`Connection update failed with status ${response.status}`);
      }
    } catch {
      // Revert optimistic update
      setConnections(prev => ({
        ...prev,
        [targetId]: prevState,
      }));
    }
  };

  useEffect(() => {
    if (!profile) return;
    document.title = `${profile.name} | PetLink`;
    setAvailabilityStatus(profile.availability.status);
    setAvailabilityLocation(formatAvailabilityLocation(profile.availability.location));
    setAvailabilityCapacity(profile.availability.capacity);
    setAvailabilityWindows(profile.availability.windows);
    setCurrentServiceRates(profile.availability.services);
  }, [profile]);

  const saveProfileAvailability = async (payload: {
    status: 'Accepting' | 'Not available';
    location: string;
    capacity: string;
    available_times: AvailabilityTimeSlot[];
  }) => {
    if (!profile) return;

    const token = localStorage.getItem('access') || localStorage.getItem('access_token');
    const response = await fetch(`/auth/users/${profile.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        availability_status: payload.status,
        availability_location: payload.location,
        availability_capacity: payload.capacity,
        available_times: payload.available_times,
      }),
    });

    if (!response.ok) {
      throw new Error(`Unable to save availability (server returned ${response.status}).`);
    }
  };

  const handleAvailabilitySave = async (availability: AvailabilityFormData) => {
    await saveProfileAvailability({
      status: 'Accepting',
      location: formatAvailabilityLocation(availability.location),
      capacity: availability.capacity,
      available_times: availability.availableTimes,
    });
    setAvailabilityStatus('Accepting');
    setAvailabilityLocation(formatAvailabilityLocation(availability.location));
    setAvailabilityCapacity(availability.capacity);
    setAvailabilityWindows(availability.availableTimes);
  };

  const handleAvailabilityToggle = async () => {
    const nextStatus = availabilityStatus === 'Accepting' ? 'Not available' : 'Accepting';

    try {
      await saveProfileAvailability({
        status: nextStatus,
        location: availabilityLocation,
        capacity: availabilityCapacity,
        available_times: availabilityWindows,
      });
      setAvailabilityStatus(nextStatus);
    } catch {
      /* ignore */
    }
  };

  const handleServiceAdd = async (service: ServiceRateFormData) => {
    const token = localStorage.getItem('access') || localStorage.getItem('access_token');
    const payload = getServicePayload(service);

    if (!payload.type || !payload.price) {
      throw new Error(`Unsupported service or invalid price: ${service.name}`);
    }

    const response = await fetch('/api/services/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let detail = '';
      try {
        const errorData = await response.json();
        detail = Object.values(errorData).flat().join(' ');
      } catch {
        // Keep the user-facing fallback below when the response is not JSON.
      }
      throw new Error(detail || `Unable to add ${service.name}.`);
    }

    const savedService: BackendService = await response.json();
    const savedFormService = mapBackendServices([savedService], profile?.id || '')[0];

    if (!savedFormService) {
      throw new Error(`Unable to read the new ${service.name} service.`);
    }

    setCurrentServiceRates(currentServices => [...currentServices, savedFormService]);
    return savedFormService;
  };

  const handleServiceRemove = async (service: ServiceRateFormData) => {
    if (!service.id) return;

    const token = localStorage.getItem('access') || localStorage.getItem('access_token');
    const response = await fetch(`/api/services/${service.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to remove ${service.name}.`);
    }

    setCurrentServiceRates(currentServices => currentServices.filter(currentService => currentService.id !== service.id));
  };

  if (loading) return <div className="profile-status-msg">⏳ Fetching real backend data...</div>;
  if (error) return <div className="profile-status-msg error">❌ Error: {error}</div>;
  if (!profile) return <div className="profile-status-msg error">⚠️ No profile data returned from backend.</div>;

  const getConnectionButtonLabel = () => {
    if (!connState) return 'Connect';
    if (connState.connected) return 'Disconnect';
    if (connState.following) return 'Waiting approval';
    if (connState.follower) return 'Connect back';
    return 'Connect';
  };

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
          ? [{ label: 'Edit Profile', variant: 'secondary',  onClick: () => navigate('/settings') }]
          : [
            ...(currentUserType === 'owner' ? [{ label: 'Make a booking', variant: 'primary' as const, onClick: () => setIsNewBookingOpen(true) }] : []),
            {
              label: getConnectionButtonLabel(),
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
            capacity={availabilityCapacity}
            windows={availabilityWindows}
            services={currentServiceRates}
            canEdit={isOwnProfile}
            onAvailabilityToggle={handleAvailabilityToggle}
            onUpdateAvailability={() => setIsAvailabilityOpen(true)}
            onUpdateServices={() => setIsServicesOpen(true)}
          />
        </ProfileLeftSidebar>
        <ProfileContent
          profileUserId={Number(profile.id)}
          authorName={profile.name}
          authorInitials={profile.initials}
          showCreatePost={isOwnProfile}
        />
      </div>
      {isNewBookingOpen && (
        <NewBookingPopup
          onClose={() => setIsNewBookingOpen(false)}
          providerId={Number(profile.id)}
          initialSitter={profile.name}
        />
      )}
      {isAvailabilityOpen && (
        <UpdateAvailabilityPopup
          onClose={() => setIsAvailabilityOpen(false)}
          initialLocation={availabilityLocation}
          initialCapacity={availabilityCapacity}
          initialAvailableTimes={availabilityWindows}
          onSaveAvailability={handleAvailabilitySave}
        />
      )}
      {isServicesOpen && (
        <UpdateServicesPopup
          services={currentServiceRates}
          onClose={() => setIsServicesOpen(false)}
          onAddService={handleServiceAdd}
          onRemoveService={handleServiceRemove}
        />
      )}
    </div>
  );
}
