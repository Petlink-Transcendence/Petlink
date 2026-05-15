import { useState } from 'react';
import './ProfileCover.css';

type ProfileCoverProps = {
  initials: string;
  imageUrl?: string;
};

export default function ProfileCover({ initials, imageUrl }: ProfileCoverProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="profile-cover">
      {imageUrl && !imgError ? (
        <img
          className="profile-avatar"
          src={imageUrl}
          alt="profile picture"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="profile-avatar">{initials}</div>
      )}
    </div>
  );
}
