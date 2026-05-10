import { useEffect } from 'react';
import './Profile.css';
import ProfileCover from '../components/profile/ProfileCover';
import ProfileInfoBar from '../components/profile/ProfileInfoBar';
import ProfileLeftSidebar from '../components/profile/ProfileLeftSidebar';

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
      </div>
    </div>
  );
}
