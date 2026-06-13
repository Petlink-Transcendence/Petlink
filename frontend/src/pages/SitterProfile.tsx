import { useEffect, useState } from 'react';
import './Profile.css';
import ProfileCover from '../components/profile/ProfileCover';
import ProfileInfoBar from '../components/profile/ProfileInfoBar';
import ProfileLeftSidebar from '../components/profile/ProfileLeftSidebar';
import ProfileContent from '../components/profile/ProfileContent';
import ProfileToggle from '../components/profile/ProfileToggle';
import SitterAvailabilityPanel from '../components/profile/SitterAvailabilityPanel';
import NewBookingPopup from '../components/bookings/NewBookingPopup';
import UpdateAvailabilityPopup, { type AvailabilityFormData } from '../components/bookings/UpdateAvailabilityPopup';

const user = {
  name: 'Ana Costa',
  username: '@anacosta_sitter',
  role: 'Cat Sitter',
  bio: 'Passionate animal lover with 5+ years of experience caring for cats and small pets. Available for sitting, grooming, and daily visits.',
};

const stats = [
  { value: '4.9', label: 'Rating'   },
  { value: 38,    label: 'Reviews'  },
  { value: 124,   label: 'Bookings' },
];

const sidebarCards = [
  { title: 'About',      type: 'meta' as const, items: ['📅 Member since January 2022', '📍 Porto, PT', '⭐ 5+ years experience', '💶 15€–20€ / hour'] },
  { title: 'Pet Types',  type: 'tags' as const, items: ['Cats', 'Small Pets', 'Rabbits'] },
];

const availabilityWindows = [
  { label: 'Mon - Fri', time: '09:00 - 12:00' },
  { label: 'Saturday', time: '14:00 - 18:00' },
  { label: 'Sunday', time: 'On request' },
];

const serviceRates = [
  { name: 'Cat Sitting', rate: '20 EUR', detail: 'Daily visits, feeding, litter care' },
  { name: 'Home Visits', rate: '15 EUR', detail: 'Short check-ins for cats and small pets' },
  { name: 'Grooming', rate: '18 EUR', detail: 'Coat brushing and basic care' },
  { name: 'Overnight Stay', rate: '45 EUR', detail: 'In-home care for longer bookings' },
];

function formatServiceName(service: string) {
  return service.replace(/\b\w/g, letter => letter.toUpperCase());
}

function formatServiceDetail(availability: AvailabilityFormData) {
  if (availability.notes) {
    return availability.notes;
  }

  return `${availability.timeSlots} from ${availability.startDate} to ${availability.endDate}`;
}

const posts = [
  { id: 1, text: 'Available for sitting this weekend! DM me 🐱',                      time: '2h ago',     likes: 19 },
  { id: 2, text: 'Just finished a week with two beautiful Bengals. Such a joy! 🐈',   time: '4 days ago', likes: 34 },
  { id: 3, text: 'Reminder: I offer overnight stays for cats with special needs 🏠',  time: '1 week ago', likes: 22 },
];

const reviews = [
  { id: 1, author: 'Jane D.',  rating: 5, text: 'Ana was wonderful with Luna. She sent daily updates and photos. Would definitely book again!', time: '2 weeks ago'  },
  { id: 2, author: 'Mark S.',  rating: 5, text: 'Very professional and caring. My cats loved her. The house was spotless when I came back.',    time: '1 month ago'  },
  { id: 3, author: 'Sofia R.', rating: 4, text: 'Great service, very communicative throughout the stay. Will book again for sure.',             time: '2 months ago' },
  { id: 4, author: 'Tiago F.', rating: 5, text: 'Ana took amazing care of my rabbit. Highly recommend her to anyone looking for a sitter.',     time: '3 months ago' },
];

export default function SitterProfile() {
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'Accepting' | 'Not available'>('Accepting');
  const [currentServiceRates, setCurrentServiceRates] = useState(serviceRates);

  useEffect(() => {
    document.title = 'Ana Costa | PetLink';
  }, []);

  const handleAvailabilitySave = (availability: AvailabilityFormData) => {
    const detail = formatServiceDetail(availability);
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
          rate: availability.price,
          detail,
        };
      });

      const existingServices = new Set(nextServices.map(service => service.name.toLowerCase()));
      const newServices = updatedServices
        .filter(service => !existingServices.has(service.toLowerCase()))
        .map(service => ({
          name: service,
          rate: availability.price,
          detail,
        }));

      return [...nextServices, ...newServices];
    });

    setAvailabilityStatus('Accepting');
  };

  return (
    <div className="profile-page">
      <ProfileToggle active="sitter" />
      <ProfileCover initials="AC" />
      <ProfileInfoBar
        name={user.name}
        username={user.username}
        role={user.role}
        bio={user.bio}
        stats={stats}
        actions={[
          { label: 'Make a booking', variant: 'primary', onClick: () => setIsNewBookingOpen(true) },
          { label: 'Message', variant: 'secondary' },
        ]}
      />
      <div className="profile-body">
        <ProfileLeftSidebar cards={sidebarCards}>
          <SitterAvailabilityPanel
            status={availabilityStatus}
            location="Porto + 8 km"
            responseTime="< 1 hour"
            capacity="2 bookings/day"
            windows={availabilityWindows}
            services={currentServiceRates}
            onAvailabilityToggle={() => {
              setAvailabilityStatus(currentStatus =>
                currentStatus === 'Accepting' ? 'Not available' : 'Accepting'
              );
            }}
            onUpdateAvailability={() => setIsAvailabilityOpen(true)}
          />
        </ProfileLeftSidebar>
        <ProfileContent posts={posts} reviews={reviews} authorName={user.name} authorInitials="AC" />
      </div>
      {isNewBookingOpen && (
        <NewBookingPopup
          onClose={() => setIsNewBookingOpen(false)}
          onCreateBooking={() => undefined}
          initialSitter={user.name}
        />
      )}
      {isAvailabilityOpen && (
        <UpdateAvailabilityPopup
          onClose={() => setIsAvailabilityOpen(false)}
          onSaveAvailability={handleAvailabilitySave}
        />
      )}
    </div>
  );
}
