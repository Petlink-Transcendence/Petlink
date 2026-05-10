import { useEffect } from 'react';
import './Profile.css';
import ProfileCover from '../components/profile/ProfileCover';
import ProfileInfoBar from '../components/profile/ProfileInfoBar';
import ProfileLeftSidebar from '../components/profile/ProfileLeftSidebar';
import ProfileContent from '../components/profile/ProfileContent';
import ProfileToggle from '../components/profile/ProfileToggle';

const user = {
  name: 'Jane Doe',
  username: '@janedoe123',
  role: 'Pet Owner',
  bio: 'Dog and cat mom. Always looking for the best care for my fur babies.',
};

const stats = [
  { value: 21,  label: 'Posts'     },
  { value: 42,  label: 'Followers' },
  { value: 100, label: 'Following' },
];

const sidebarCards = [
  { title: 'About',       type: 'meta' as const, items: ['📅 Member since March 2023', '📍 Porto, PT'] },
  { title: 'My Pets',     type: 'tags' as const, items: ['Luna | Bengal Cat | 2yr', 'Buddy | Golden Retriever | 4yr'] },
  { title: 'Looking For', type: 'tags' as const, items: ['Cat Sitter', 'Dog Walker', 'Home Visits', 'Overnight Stay'] },
];

const posts = [
  { id: 1, text: 'Available sitters for this weekend? DM me 🐱', time: '1h ago',     likes: 12 },
  { id: 2, text: 'Just went on a long walk with Buddy. Such a joy!', time: '3 days ago', likes: 27 },
];

const reviews = [
  { id: 1, author: 'Ana C.',    rating: 5, text: 'Jane is a wonderful pet owner. Luna and Buddy are so well behaved!', time: '2 weeks ago'  },
  { id: 2, author: 'Miguel R.', rating: 5, text: 'Always on time and very communicative. A pleasure to work with.',    time: '1 month ago'  },
  { id: 3, author: 'Sara M.',   rating: 4, text: 'Great experience. Buddy is a handful but Jane made it easy.',        time: '2 months ago' },
];

export default function Profile() {
  useEffect(() => {
    document.title = 'Profile | PetLink';
  }, []);

  return (
    <div className="profile-page">
      <ProfileToggle active="owner" />
      <ProfileCover initials="JD" />
      <ProfileInfoBar
        name={user.name}
        username={user.username}
        role={user.role}
        bio={user.bio}
        stats={stats}
      />
      <div className="profile-body">
        <ProfileLeftSidebar cards={sidebarCards} />
        <ProfileContent posts={posts} reviews={reviews} />
      </div>
    </div>
  );
}
