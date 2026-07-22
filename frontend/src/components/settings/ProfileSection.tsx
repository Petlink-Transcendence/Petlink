import { type ChangeEvent } from 'react';
import type { SettingsForm } from '../../pages/Settings';
import '../../pages/Settings.css';

interface ProfileSectionProps {
  avatarUrl: string;
  displayName: string;
  username: string;
  email: string;
  city: string;
  country: string;
  bio: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  profileInitials: string;
  passwordError: string;
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
  currentPassword,
  newPassword,
  confirmPassword,
  profileInitials,
  passwordError,
  updateField,
  handleAvatarChange,
}: ProfileSectionProps) {
  return (
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

      <div className="settings-password-panel">
        <div className="settings-password-header">
          <h3>Change password</h3>
          <p>Update the password you use to sign in.</p>
        </div>

        <div className="settings-grid">
          <label className="settings-field">
            <span>Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => updateField('currentPassword', e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <label className="settings-field">
            <span>New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => updateField('newPassword', e.target.value)}
              autoComplete="new-password"
            />
          </label>
        </div>

        <label className="settings-field settings-confirm-password">
          <span>Confirm new password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {passwordError && <p className="settings-password-error">{passwordError}</p>}
      </div>
    </section>
  );
}
