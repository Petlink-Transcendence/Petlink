import { type ChangeEvent } from 'react';
import type { SettingsForm } from '../../pages/Settings';
import '../../pages/Settings.css';

export interface ProfileSectionProps {
  avatarUrl: string;
  displayName: string;
  username: string;
  email: string;
  city: string;
  country: string;
  bio: string;
  profileInitials: string;
  avatarError?: string;
  updateField: <K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) => void;
  handleAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileSection({
  avatarUrl,
  displayName,
  username,
  email,
  city,
  country,
  bio,
  profileInitials,
  avatarError,
  updateField,
  handleAvatarChange,
}: ProfileSectionProps) {
  return (
    <>
      <section className="settings-section" id="profile">
        <div className="settings-section-header">
          <div>
            <h2>Profile details</h2>
            <p>Public account information</p>
          </div>
        </div>

        <div className="settings-avatar-panel">
          <div className="settings-avatar-preview">
            {avatarUrl ? <img src={avatarUrl} alt="" /> : profileInitials}
          </div>
          <div className="settings-avatar-copy">
            <h3>Profile avatar</h3>
            <p>Add or change the photo shown on your PetLink profile.</p>
            <label className="settings-avatar-button">
              Choose photo
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </label>
            {avatarError && (
              <p className="settings-avatar-error">
                {avatarError}
              </p>
            )}
          </div>
        </div>

        <div className="settings-grid">
          <label className="settings-field">
            <span>Display name</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => updateField('displayName', e.target.value)}
            />
          </label>
          <label className="settings-field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => updateField('username', e.target.value)}
            />
          </label>
        </div>

        <div className="settings-contact-row">
          <label className="settings-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </label>

          <div className="settings-location-row">
            <label className="settings-field settings-compact-field">
              <span>Location</span>
              <input
                type="text"
                value={city}
                onChange={(e) => updateField('city', e.target.value)}
              />
            </label>
            <label className="settings-field settings-compact-field">
              <span>Country</span>
              <input
                type="text"
                value={country}
                onChange={(e) => updateField('country', e.target.value)}
              />
            </label>
          </div>
        </div>

        <label className="settings-field">
          <span>Bio</span>
          <textarea
            value={bio}
            rows={4}
            onChange={(e) => updateField('bio', e.target.value)}
          />
        </label>
      </section>
    </>
  );
}
