import { useEffect } from 'react';
import './Profile.css';
import ProfileCover from '../components/profile/ProfileCover';
import ProfileInfoBar from '../components/profile/ProfileInfoBar';
import ProfileLeftSidebar from '../components/profile/ProfileLeftSidebar';
import ProfileContent from '../components/profile/ProfileContent';
import ProfileToggle from '../components/profile/ProfileToggle';

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
  { title: 'Services',   type: 'tags' as const, items: ['Cat Sitting', 'Home Visits', 'Grooming', 'Overnight Stay'] },
  { title: 'Pet Types',  type: 'tags' as const, items: ['Cats', 'Small Pets', 'Rabbits'] },
];

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
  useEffect(() => {
    document.title = 'Ana Costa | PetLink';
  }, []);

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
          { label: 'Follow', variant: 'primary' },
          { label: 'Message', variant: 'secondary' },
        ]}
      />
      <div className="profile-body">
        <ProfileLeftSidebar cards={sidebarCards} />
        <ProfileContent posts={posts} reviews={reviews} authorName={user.name} authorInitials="AC" />
      </div>
    </div>
  );
}
