import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import ProfileCover from '../components/profile/ProfileCover';
import ProfileInfoBar from '../components/profile/ProfileInfoBar';
import ProfileLeftSidebar from '../components/profile/ProfileLeftSidebar';
import ProfileContent from '../components/profile/ProfileContent';
import ProfileToggle from '../components/profile/ProfileToggle';
import SitterAvailabilityPanel from '../components/profile/SitterAvailabilityPanel';
import NewBookingPopup from '../components/bookings/NewBookingPopup';
import UpdateAvailabilityPopup, { type AvailabilityFormData } from '../components/bookings/UpdateAvailabilityPopup';
import { currentSitterProfileId, getSitterProfile } from '../data/profileData';
import { formatAvailabilityRate } from '../utils/availabilityRates';

function formatServiceName(service: string) {
  return service.replace(/\b\w/g, letter => letter.toUpperCase());
}

function formatServiceDetail(availability: AvailabilityFormData) {
  if (availability.notes) {
    return availability.notes;
  }

  return `${availability.timeSlots} from ${availability.startDate} to ${availability.endDate}`;
}

function formatAvailabilityLocation(location: string) {
  return location.replace(/\s*\+\s*\d+\s*km\b/i, '').trim();
}

export default function SitterProfile() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const profile = getSitterProfile(profileId);
  const isOwnProfile = !profileId || profileId === currentSitterProfileId;
  const [connections, setConnections] = useState<Record<string, boolean>>({});
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'Accepting' | 'Not available'>(profile.availability.status);
  const [availabilityLocation, setAvailabilityLocation] = useState(formatAvailabilityLocation(profile.availability.location));
  const [availabilityCapacity, setAvailabilityCapacity] = useState(profile.availability.capacity);
  const [currentServiceRates, setCurrentServiceRates] = useState(profile.availability.services);
  const isConnected = Boolean(connections[profile.id]);

  const handleConnectionToggle = () => {
    setConnections(currentConnections => ({
      ...currentConnections,
      [profile.id]: !currentConnections[profile.id],
    }));
  };

  const handleMessageClick = () => {
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

  useEffect(() => {
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

  return (
    <div className="profile-page">
      {isOwnProfile && <ProfileToggle active="sitter" />}
      <ProfileCover initials={profile.initials} imageUrl={profile.imageUrl} />
      <ProfileInfoBar
        name={profile.name}
        username={profile.username}
        role={profile.role}
        bio={profile.bio}
        stats={profile.stats}
        actions={isOwnProfile
          ? [{ label: 'Edit Profile', variant: 'secondary' }]
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
