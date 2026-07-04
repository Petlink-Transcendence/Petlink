import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import ProfileCover from '../components/profile/ProfileCover';
import ProfileInfoBar from '../components/profile/ProfileInfoBar';
import ProfileLeftSidebar from '../components/profile/ProfileLeftSidebar';
import ProfileContent from '../components/profile/ProfileContent';
import ProfileToggle from '../components/profile/ProfileToggle';
import { currentOwnerProfileId, getOwnerProfile } from '../data/profileData';

export default function Profile() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const profile = getOwnerProfile(profileId);
  const isOwnProfile = !profileId || profileId === currentOwnerProfileId;
  const [connections, setConnections] = useState<Record<string, boolean>>({});
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
  }, [profile.name]);

  return (
    <div className="profile-page">
      {isOwnProfile && <ProfileToggle active="owner" />}
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
              onClick: handleConnectionToggle,
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
