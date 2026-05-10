import { useState } from 'react';
import './ProfileCover.css';

type ProfileCoverProps = {
  initials: string;
};

export default function ProfileCover({ initials }: ProfileCoverProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="profile-cover">
      {imgError ? (
        <div className="profile-avatar">{initials}</div>
      ) : (
        <img
          className="profile-avatar"
          src="/profile-pic.png"
          alt="profile picture"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}
