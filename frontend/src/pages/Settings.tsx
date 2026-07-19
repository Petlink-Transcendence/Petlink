import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import './Settings.css';

interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'rabbit' | 'other';
  breed: string;
  age: string;
}

interface SettingsForm {
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
  accountMode: 'owner' | 'sitter';
  profileVisibility: string;
  bookingAlerts: boolean;
  messageAlerts: boolean;
  reviewAlerts: boolean;
  commentAlerts: boolean;
  connectionRequestAlerts: boolean;
  showAbout: boolean;
  showPets: boolean;
  showLookingFor: boolean;
  ownerPetTypes: string[];
  petsList: Pet[];
  lookingForServices: string[];
  yearsOfExperience: string;
  hourlyRate: string;
  sitterPetTypes: string[];
}

const initialSettings: SettingsForm = {
  avatarUrl: '',
  displayName: 'Jane Doe',
  username: 'janedoe123',
  email: 'jane.doe@example.com',
  city: 'Porto',
  country: 'Portugal',
  bio: 'Dog and cat mom. Always looking for the best care for my pets.',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  accountMode: 'owner',
  profileVisibility: 'Everyone',
  bookingAlerts: true,
  messageAlerts: true,
  reviewAlerts: true,
  commentAlerts: true,
  connectionRequestAlerts: true,
  showAbout: true,
  showPets: true,
  showLookingFor: true,
  ownerPetTypes: ['dogs', 'cats'],
  petsList: [],
  lookingForServices: ['Cat Sitter', 'Dog Walker'],
  sitterPetTypes: ['dogs', 'cats', 'small pets'],
};

const ownerPetTypeOptions = ['dogs', 'cats', 'rabbits', 'other'];
const lookingForOptions = ['Cat Sitter', 'Dog Walker', 'Home Visits', 'Overnight Stay'];
const sitterPetTypeOptions = ['dogs', 'cats', 'rabbits', 'small pets', 'big pets'];

const ageOptions = [
  '<1 yr',
  '1 yr',
  ...Array.from({ length: 11 }, (_, i) => `${i + 2} yrs`),
  '>12 yrs'
];

export default function Settings() {
  const [form, setForm] = useState<SettingsForm>(initialSettings);
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [saved, setSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteNotice, setDeleteNotice] = useState('');

  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<Pet['type']>('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');

  useEffect(() => {
    document.title = 'Settings | PetLink';
  }, []);

  useEffect(() => {
    return () => {
      if (form.avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(form.avatarUrl);
      }
    };
  }, [form.avatarUrl]);

  const profileInitials = form.displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join('') || form.username.slice(0, 2).toUpperCase();

  function updateField<Key extends keyof SettingsForm>(key: Key, value: SettingsForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextAvatarUrl = URL.createObjectURL(file);

    setForm((current) => {
      if (current.avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(current.avatarUrl);
      }
      return { ...current, avatarUrl: nextAvatarUrl };
    });
  }

  function toggleTagField(key: 'ownerPetTypes' | 'lookingForServices' | 'sitterPetTypes', tag: string) {
    setForm((current) => {
      const currentTags = current[key] as string[];
      const updatedTags = currentTags.includes(tag)
        ? currentTags.filter((item) => item !== tag)
        : [...currentTags, tag];
      return { ...current, [key]: updatedTags };
    });
  }

  function handleAddPet() {
    if (!newPetName.trim()) return;
    
    const formattedAge = newPetAge.includes('yr') ? newPetAge.replace('yrs', 'years old').replace('yr', 'year old') : newPetAge;

    const newPet: Pet = {
      id: Date.now().toString(),
      name: newPetName.trim(),
      type: newPetType,
      breed: newPetBreed.trim() || 'Unknown',
      age: formattedAge,
    };

    updateField('petsList', [...form.petsList, newPet]);
    setNewPetName('');
    setNewPetBreed('');
    setNewPetType('dog');
    setNewPetAge('<1 yr');
  }

  function handleRemovePet(id: string) {
    updateField('petsList', form.petsList.filter((pet) => pet.id !== id));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const passwordFieldsChanged = Boolean(
      form.currentPassword || form.newPassword || form.confirmPassword
    );

    if (passwordFieldsChanged) {
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        setPasswordError('Fill in all password fields to change your password.');
        return;
      }

      if (form.newPassword.length < 8) {
        setPasswordError('New password must be at least 8 characters.');
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        setPasswordError('New password and confirmation do not match.');
        return;
      }
    }

    setPasswordError('');
    setForm((current) => ({
      ...current,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setForm(initialSettings);
    setActiveSection('profile');
    setSaved(false);
    setPasswordError('');
    setDeleteNotice('');
  }

  function handleDeleteAccount() {
    if (deleteConfirmation !== form.username) return;

    setDeleteNotice('Connect delete endpoint here.');
  }

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <p className="settings-kicker">Account</p>
        <h1>My <span>Settings</span></h1>
      </div>

      <form className="settings-layout" onSubmit={handleSubmit}>
        <aside className="settings-menu" aria-label="Settings sections">
          <div className="settings-profile-summary">
            <div className="settings-avatar">
              {form.avatarUrl ? <img src={form.avatarUrl} alt="" /> : profileInitials}
            </div>
            <div>
              <strong>{form.displayName}</strong>
              <span>@{form.username}</span>
            </div>
          </div>

          <a className={`settings-menu-item ${activeSection === 'profile' ? 'active' : ''}`} href="#profile" onClick={() => setActiveSection('profile')}>Profile</a>
          <a className={`settings-menu-item ${activeSection === 'care' ? 'active' : ''}`} href="#care" onClick={() => setActiveSection('care')}>Pet care</a>
          <a className={`settings-menu-item ${activeSection === 'notifications' ? 'active' : ''}`} href="#notifications" onClick={() => setActiveSection('notifications')}>Notifications</a>
          <a className={`settings-menu-item ${activeSection === 'privacy' ? 'active' : ''}`} href="#privacy" onClick={() => setActiveSection('privacy')}>Privacy</a>
          <a className={`settings-menu-item settings-danger-menu-item ${activeSection === 'danger' ? 'active' : ''}`} href="#danger" onClick={() => setActiveSection('danger')}>Danger zone</a>
        </aside>

        <main className="settings-main">
          <section className="settings-section" id="profile">
            <div className="settings-section-header">
              <div>
                <h2>Profile details</h2>
                <p>Public account information</p>
              </div>
            </div>

            <div className="settings-avatar-panel">
              <div className="settings-avatar-preview">
                {form.avatarUrl ? <img src={form.avatarUrl} alt="" /> : profileInitials}
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
                <input type="text" value={form.displayName} onChange={(e) => updateField('displayName', e.target.value)} />
              </label>
              <label className="settings-field">
                <span>Username</span>
                <input type="text" value={form.username} onChange={(e) => updateField('username', e.target.value)} />
              </label>
            </div>

            <div className="settings-contact-row">
              <label className="settings-field">
                <span>Email</span>
                <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
              </label>

              <div className="settings-location-row">
                <label className="settings-field settings-compact-field">
                  <span>City</span>
                  <input type="text" value={form.city} onChange={(e) => updateField('city', e.target.value)} />
                </label>
                <label className="settings-field settings-compact-field">
                  <span>Country</span>
                  <input type="text" value={form.country} onChange={(e) => updateField('country', e.target.value)} />
                </label>
              </div>
            </div>

            <label className="settings-field">
              <span>Bio</span>
              <textarea value={form.bio} rows={4} onChange={(e) => updateField('bio', e.target.value)} />
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
                    value={form.currentPassword}
                    onChange={(e) => updateField('currentPassword', e.target.value)}
                    autoComplete="current-password"
                  />
                </label>
                <label className="settings-field">
                  <span>New password</span>
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={(e) => updateField('newPassword', e.target.value)}
                    autoComplete="new-password"
                  />
                </label>
              </div>

              <label className="settings-field settings-confirm-password">
                <span>Confirm new password</span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                />
              </label>

              {passwordError && <p className="settings-password-error">{passwordError}</p>}
            </div>
          </section>

          <section className="settings-section" id="care">
            <div className="settings-section-header">
              <div>
                <h2>Pet care</h2>
                <p>Profile mode, pets and service preferences</p>
              </div>
            </div>

            <div className="settings-segmented" aria-label="Account mode">
              {(['owner', 'sitter'] as const).map((mode) => (
                <button
                  className={form.accountMode === mode ? 'active' : ''}
                  key={mode}
                  type="button"
                  onClick={() => updateField('accountMode', mode)}
                >
                  {mode === 'owner' ? 'Owner' : 'Sitter'}
                </button>
              ))}
            </div>

            {form.accountMode === 'owner' && (
              <div className="mode-specific-fields owner-mode animate-fade-in">
                
                <div className="settings-input-group">
                  <span className="settings-group-label">My Pets are:</span>
                  <div className="settings-service-list">
                    {ownerPetTypeOptions.map((type) => (
                      <label className="settings-check-row" key={type}>
                        <input
                          type="checkbox"
                          checked={form.ownerPetTypes.includes(type)}
                          onChange={() => toggleTagField('ownerPetTypes', type)}
                        />
                        <span className="capitalize-text">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="settings-input-group">
                  <span className="settings-group-label">Manage My Pets:</span>
                  
                  <div className="add-pet-inline-form">
                    <input 
                      type="text" 
                      placeholder="Pet name" 
                      value={newPetName}
                      onChange={(e) => setNewPetName(e.target.value)}
                      className="pet-input-field pet-name-input"
                    />
                    <select 
                      value={newPetType} 
                      onChange={(e) => setNewPetType(e.target.value as Pet['type'])}
                      className="pet-input-field pet-type-select"
                    >
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="rabbit">Rabbit</option>
                      <option value="other">Other</option>
                    </select>
                    <input 
                      type="text"
                      placeholder="Breed"
                      value={newPetBreed}
                      onChange={(e) => setNewPetBreed(e.target.value)}
                      className="pet-input-field pet-breed-input"
                    />
                    <select
                      value={newPetAge}
                      onChange={(e) => setNewPetAge(e.target.value)}
                      className="pet-input-field pet-age-select"
                    >
                      {ageOptions.map((age) => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                    <button type="button" className="add-pet-btn" onClick={handleAddPet}>+ Add</button>
                  </div>

                  <div className="added-pets-badge-list">
                    {form.petsList.map((pet) => (
                      <div key={pet.id} className="pet-badge-item">
                        <span>
                          {pet.name} | <span className="capitalize-text">{pet.type}</span> | {pet.breed} | {pet.age}
                        </span>
                        <button type="button" className="remove-pet-badge" onClick={() => handleRemovePet(pet.id)}>×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="settings-input-group">
                  <span className="settings-group-label">I am looking for:</span>
                  <div className="settings-service-list">
                    {lookingForOptions.map((service) => (
                      <label className="settings-check-row" key={service}>
                        <input
                          type="checkbox"
                          checked={form.lookingForServices.includes(service)}
                          onChange={() => toggleTagField('lookingForServices', service)}
                        />
                        <span>{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {form.accountMode === 'sitter' && (
              <div className="mode-specific-fields sitter-mode animate-fade-in">
                
                <div className="settings-grid">
                  <label className="settings-field sitter-open-field">
                    <span>Years of Experience</span>
                    <input 
                      type="text" 
                      placeholder=" +3 years" 
                      value={form.yearsOfExperience}
                      onChange={(e) => updateField('yearsOfExperience', e.target.value)}
                      className="pet-input-field"
                    />
                  </label>
                  <label className="settings-field sitter-open-field">
                    <span>Price per Hour (€)</span>
                    <input 
                      type="text" 
                      placeholder="10-15" 
                      value={form.hourlyRate}
                      onChange={(e) => updateField('hourlyRate', e.target.value)}
                      className="pet-input-field"
                    />
                  </label>
                </div>

                <div className="settings-input-group">
                  <span className="settings-group-label">I can pet-sit:</span>
                  <div className="settings-service-list">
                    {sitterPetTypeOptions.map((type) => (
                      <label className="settings-check-row" key={type}>
                        <input
                          type="checkbox"
                          checked={form.sitterPetTypes.includes(type)}
                          onChange={() => toggleTagField('sitterPetTypes', type)}
                        />
                        <span className="capitalize-text">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </section>

          <section className="settings-section" id="notifications">
            <div className="settings-section-header">
              <div>
                <h2>Notifications</h2>
                <p>Messages, bookings, reviews, comments, likes and new connections</p>
              </div>
            </div>

            <div className="settings-preference-list">
              <label className="settings-toggle-row">
                <span><strong>Booking requests</strong><small>New bookings or applications</small></span>
                <input type="checkbox" checked={form.bookingAlerts} onChange={(e) => updateField('bookingAlerts', e.target.checked)} />
              </label>
              <label className="settings-toggle-row">
                <span><strong>Messages</strong><small>New messages and direct replies</small></span>
                <input type="checkbox" checked={form.messageAlerts} onChange={(e) => updateField('messageAlerts', e.target.checked)} />
              </label>
              <label className="settings-toggle-row">
                <span><strong>Reviews</strong><small>New reviews and service ratings</small></span>
                <input type="checkbox" checked={form.reviewAlerts} onChange={(e) => updateField('reviewAlerts', e.target.checked)} />
              </label>
              <label className="settings-toggle-row">
                <span><strong>Comments and likes</strong><small>New comments and likes on your posts</small></span>
                <input type="checkbox" checked={form.commentAlerts} onChange={(e) => updateField('commentAlerts', e.target.checked)} />
              </label>
              <label className="settings-toggle-row">
                <span><strong>Connection requests</strong><small>New connection requests from other users</small></span>
                <input type="checkbox" checked={form.connectionRequestAlerts} onChange={(e) => updateField('connectionRequestAlerts', e.target.checked)} />
              </label>
            </div>
          </section>

          <section className="settings-section" id="privacy">
            <div className="settings-section-header">
              <div>
                <h2>Privacy</h2>
                <p>Profile sections visibility</p>
              </div>
            </div>

            <div className="settings-preference-list">
              <label className="settings-toggle-row">
                <span><strong>Show About</strong><small>About you</small></span>
                <input type="checkbox" checked={form.showAbout} onChange={(e) => updateField('showAbout', e.target.checked)} />
              </label>
              <label className="settings-toggle-row">
                <span><strong>Show Pets</strong><small>Your pets or pets you petsit</small></span>
                <input type="checkbox" checked={form.showPets} onChange={(e) => updateField('showPets', e.target.checked)} />
              </label>
              <label className="settings-toggle-row">
                <span><strong>Show Looking For</strong><small>What you're looking for at PetLink</small></span>
                <input type="checkbox" checked={form.showLookingFor} onChange={(e) => updateField('showLookingFor', e.target.checked)} />
              </label>
            </div>
          </section>

          <section className="settings-section settings-danger-zone" id="danger">
            <div className="settings-section-header">
              <div>
                <h2>Danger zone</h2>
                <p>Permanent account actions</p>
              </div>
            </div>

            <div className="settings-danger-content">
              <div>
                <h3>Delete account</h3>
                <p>
                  This will remove your profile, pets, bookings, messages and account access.
                  Type your username to confirm.
                </p>
              </div>

              <label className="settings-field settings-delete-confirm">
                <span>Confirm username</span>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => {
                    setDeleteConfirmation(e.target.value);
                    setDeleteNotice('');
                  }}
                  placeholder={form.username}
                  autoComplete="off"
                />
              </label>

              {deleteNotice && <p className="settings-delete-notice">{deleteNotice}</p>}

              <button
                className="settings-danger-btn"
                type="button"
                disabled={deleteConfirmation !== form.username}
                onClick={handleDeleteAccount}
              >
                Delete my account
              </button>
            </div>
          </section>

          <div className="settings-actions">
            {saved && <span className="settings-saved">Changes saved</span>}
            <button className="settings-secondary-btn" type="button" onClick={handleReset}>Reset</button>
            <button className="settings-primary-btn" type="submit">Save changes</button>
          </div>
        </main>
      </form>
    </div>
  );
}