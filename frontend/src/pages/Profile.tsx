import { useEffect } from 'react';
import './Profile.css';
import ProfileCover from '../components/profile/ProfileCover';
import ProfileInfoBar from '../components/profile/ProfileInfoBar';
import ProfileLeftSidebar from '../components/profile/ProfileLeftSidebar';
import ProfileContent from '../components/profile/ProfileContent';

const user = {
  name: 'Jane Doe',
  username: '@janedoe123',
  role: 'Pet Owner',
  bio: 'Dog and cat mom. Always looking for the best care for my fur babies.',
  location: 'Porto, PT',
  memberSince: 'March 2023',
  posts: 21,
  followers: 42,
  following: 100,
};

const pets = ['Luna | Bengal Cat | 2yr', 'Buddy | Golden Retriever | 4yr'];
const lookingFor = ['Cat Sitter', 'Dog Walker', 'Home Visits', 'Overnight Stay'];

const posts = [
  { id: 1, text: 'Available sitters for this weekend? DM me 🐱', time: '1h ago', likes: 12 },
  { id: 2, text: 'Just went on a long walk with Buddy. Such a joy!', time: '3 days ago', likes: 27 },
];

const reviews = [
  { id: 1, author: 'Ana C.',   rating: 5, text: 'Jane is a wonderful pet owner. Luna and Buddy are so well behaved!',  time: '2 weeks ago'  },
  { id: 2, author: 'Miguel R.', rating: 5, text: 'Always on time and very communicative. A pleasure to work with.',       time: '1 month ago'  },
  { id: 3, author: 'Sara M.',  rating: 4, text: 'Great experience. Buddy is a handful but Jane made it easy.',            time: '2 months ago' },
];

export default function Profile() {
  useEffect(() => {
    document.title = 'Profile | PetLink';
  }, []);

  return (
    <div className="profile-page">
      <ProfileCover initials="JD" />
      <ProfileInfoBar
        name={user.name}
        username={user.username}
        role={user.role}
        bio={user.bio}
        posts={user.posts}
        followers={user.followers}
        following={user.following}
      />
      <div className="profile-body">
        <ProfileLeftSidebar
          memberSince={user.memberSince}
          location={user.location}
          pets={pets}
          lookingFor={lookingFor}
        />
        <ProfileContent posts={posts} reviews={reviews} />
      </div>
    </div>
  );
}
