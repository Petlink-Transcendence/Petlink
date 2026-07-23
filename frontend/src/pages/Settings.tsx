import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { getInitials, type BackendUser, type ProfileData, mapBackendToProfile } from './OwnerProfile';
import './Settings.css';
import ProfileSection from '../components/settings/ProfileSection';
import PetCareSection from '../components/settings/PetCareSection';
import PrivacySection from '../components/settings/PrivacySection';
import DangerZoneSection from '../components/settings/DangerZoneSection';
import SecuritySection from '../components/settings/SecuritySection';

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'rabbit' | 'other';
  breed: string;
  age: string;
}

export interface SettingsForm {
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
  accountMode: string;
  profileVisibility: string;
  bookingAlerts: boolean;
  messageAlerts: boolean;
  reviewAlerts: boolean;
  commentAlerts: boolean;
  connectionRequestAlerts: boolean;
  showAbout: boolean;
  showPets: boolean;
  showLookingFor: boolean;
  petsList: Pet[];
  lookingForServices: string[];
  yearsOfExperience: string;
  hourlyRate: string;
  sitterPetTypes: string[];
}

const initialSettings: SettingsForm = {
  avatarUrl: '',
  displayName: '',
  username: '',
  email: '',
  city: '',
  country: '',
  bio: '',
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
  petsList: [],
  lookingForServices: ['cat sitter', 'dog walker'],
  yearsOfExperience: '',
  hourlyRate: '',
  sitterPetTypes: ['dogs', 'cats', 'small pets'],
};

const resettableSettings: Pick<
  SettingsForm,
  | 'profileVisibility'
  | 'bookingAlerts'
  | 'messageAlerts'
  | 'reviewAlerts'
  | 'commentAlerts'
  | 'connectionRequestAlerts'
  | 'showAbout'
  | 'showPets'
  | 'showLookingFor'
> = {
  profileVisibility: 'Everyone',
  bookingAlerts: true,
  messageAlerts: true,
  reviewAlerts: true,
  commentAlerts: true,
  connectionRequestAlerts: true,
  showAbout: true,
  showPets: true,
  showLookingFor: true,
};

export default function Settings() {
  const [form, setForm] = useState<SettingsForm>(initialSettings);
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [saved, setSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [inlineError, setInlineError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteNotice, setDeleteNotice] = useState('');
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<Pet['type']>('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('<1 yr');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profile, setAccountData] = useState<ProfileData | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [oauthProvider, setOauthProvider] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Settings | PetLink';
  }, []);

  useEffect(() => {
  const fetchProfileData = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access') || localStorage.getItem('access_token');

      const response = await fetch(`/auth/me/`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json', 
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch account data.');
      }
      const data: BackendUser & { email?: string; user_type?: string; id?: number } = await response.json();
    
      setUserId(data.id ?? null);
      const mappedProfile = mapBackendToProfile(data);
      setAccountData(mappedProfile);

      const userRole = data.user_type;
      const initialMode = userRole === 'owner' ? 'owner' : 'sitter';

      const backendData = data as BackendUser & { email?: string; user_type?: string; id?: number; experience?: number | null; price?: number | string | null; sitter_pet_types?: string[]; looking_for?: string[] };
      setForm((prev) => ({
        ...prev,
        displayName: data.name || mappedProfile.name,
        username: (data.username || mappedProfile.username).replace('@', ''),
        email: data.email || '',
        city: data.city || '',
        country: data.country || '',
        avatarUrl: data.avatar || mappedProfile.imageUrl || '',
        bio: data.description || (mappedProfile.bio !== 'No bio available.' ? mappedProfile.bio : ''),
        accountMode: initialMode,
        yearsOfExperience: backendData.experience != null ? String(backendData.experience) : '',
        hourlyRate: backendData.price != null ? String(backendData.price) : '',
        sitterPetTypes: (backendData.sitter_pet_types ?? prev.sitterPetTypes).map((s: string) => s.toLowerCase()),
        lookingForServices: (backendData.looking_for ?? prev.lookingForServices).map((s: string) => s.toLowerCase()),
      }));

    } catch (err: any) {
      setError(err.message || 'Failed to load account data.');
      console.error("Fetch error details:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfileData();
}, []);

  useEffect(() => {
    return () => {
      if (form.avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(form.avatarUrl);
      }
    };
  }, [form.avatarUrl]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem('access');
        const res = await fetch('/auth/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOauthProvider(data.oauth_provider || null);
          setForm(current => ({
            ...current,
            username: data.username,
            displayName: data.name || current.displayName,
            email: data.email || current.email
          }));
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
      }
    }
    fetchUser();
  }, []);

  const profileInitials = form.displayName
    ? getInitials(form.displayName)
    : profile?.initials || 'U';

  function updateField<Key extends keyof SettingsForm>(key: Key, value: SettingsForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextAvatarUrl = URL.createObjectURL(file);
    setAvatarFile(file);

    setForm((current) => {
      if (current.avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(current.avatarUrl);
      }
      return { ...current, avatarUrl: nextAvatarUrl };
    });
  }

  function toggleTagField(key: 'lookingForServices' | 'sitterPetTypes', tag: string) {
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

  async function handlePasswordSubmit() {
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
    
    try {
      const token = localStorage.getItem('access') || localStorage.getItem('access_token');
      const response = await fetch('/auth/password/change/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          old_password: form.currentPassword,
          new_password: form.newPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setPasswordError(data.old_password?.[0] || data.new_password?.[0] || data.detail || 'Failed to update password.');
        return;
      }
    } catch (err) {
      setPasswordError('Error connecting to server.');
      return;
    }
    
    setPasswordSuccess('Password changed successfully.');
    window.setTimeout(() => setPasswordSuccess(''), 3000);
    setPasswordError('');
    setForm((current) => ({
      ...current,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) {
      setInlineError('Cannot save: user ID not loaded.');
      return;
    }

    try {
      const token = localStorage.getItem('access') || localStorage.getItem('access_token');
      const response = await fetch(`/auth/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          username: form.username,
          name: form.displayName,
          description: form.bio,
          city: form.city,
          country: form.country,
          experience: form.yearsOfExperience || null,
          price: form.hourlyRate || null,
          looking_for: form.lookingForServices,
          sitter_pet_types: form.sitterPetTypes,
        }),
      });

      if (!response.ok) {
        let message = `Server error ${response.status}`;
        try {
          const errorData = await response.json();
          const firstError = Object.values(errorData)[0];
          message = Array.isArray(firstError) ? firstError[0] : String(firstError);
        } catch {
          message = response.statusText || message;
        }
        setInlineError(message);
        return;
      }

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const avatarResponse = await fetch(`/auth/users/${userId}/avatar/`, {
          method: 'POST',
          headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
          body: formData,
        });
        if (avatarResponse.ok) {
          setAvatarFile(null);
        }
      }
    } catch (err) {
      console.error('Settings save failed:', err);
      setInlineError('Failed to save changes. Please try again.');
      return;
    }

    setSaved(true);
    setInlineError('');
    window.setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setForm((current) => ({ ...current, ...resettableSettings }));
    setSaved(false);
    setInlineError('');
    setDeleteNotice('');
  }
  
  async function handleDeleteAccount() {
    if (!deleteConfirmation) return;

    if (oauthProvider && deleteConfirmation !== form.username) {
      setDeleteNotice('Username does not match.');
      return;
    }

    try {
      const token = localStorage.getItem('access');
      const response = await fetch('/auth/me/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(oauthProvider ? {} : { password: deleteConfirmation })
      });

      if (response.ok) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/';
      } else {
        const data = await response.json();
        setDeleteNotice(data.detail || 'Failed to delete account.');
      }
    } catch (err) {
      setDeleteNotice('Error connecting to server.');
    }
  }

  if (loading) return <div className="profile-status-msg">⏳ Fetching real backend data...</div>;
  if (error) return <div className="profile-status-msg error">❌ Error: {error}</div>;
  if (!profile) return <div className="profile-status-msg error">⚠️ No profile data returned from backend.</div>;

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
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt={form.displayName || profile.name} />
              ) : (
                profileInitials
              )}
            </div>
            <div>
              <strong>{form.displayName || profile.name}</strong>
              <span>@{form.username || profile.username.replace('@', '')}</span>
            </div>
          </div>

          <a className={`settings-menu-item ${activeSection === 'profile' ? 'active' : ''}`} href="#profile" onClick={() => setActiveSection('profile')}>Profile</a>
          {!oauthProvider && <a className={`settings-menu-item ${activeSection === 'security' ? 'active' : ''}`} href="#security" onClick={() => setActiveSection('security')}>Security</a>}          
          <a className={`settings-menu-item ${activeSection === 'care' ? 'active' : ''}`} href="#care" onClick={() => setActiveSection('care')}>Pet care</a>
          <a className={`settings-menu-item ${activeSection === 'notifications' ? 'active' : ''}`} href="#notifications" onClick={() => setActiveSection('notifications')}>Notifications</a>
          <a className={`settings-menu-item ${activeSection === 'privacy' ? 'active' : ''}`} href="#privacy" onClick={() => setActiveSection('privacy')}>Privacy</a>
          <a className={`settings-menu-item settings-danger-menu-item ${activeSection === 'danger' ? 'active' : ''}`} href="#danger" onClick={() => setActiveSection('danger')}>Danger zone</a>
        </aside>

        <main className="settings-main">
          <ProfileSection
            avatarUrl={form.avatarUrl}
            displayName={form.displayName}
            username={form.username}
            email={form.email}
            city={form.city}
            country={form.country}
            bio={form.bio}
            profileInitials={profileInitials}
            updateField={updateField}
            handleAvatarChange={handleAvatarChange}
          />

          <SecuritySection
            oauthProvider={oauthProvider}
            passwordSuccess={passwordSuccess}
            passwordError={passwordError}
            currentPassword={form.currentPassword}
            newPassword={form.newPassword}
            confirmPassword={form.confirmPassword}
            updateField={updateField}
            handlePasswordSubmit={handlePasswordSubmit}
          />

          <PetCareSection
            accountMode={form.accountMode}
            petsList={form.petsList}
            lookingForServices={form.lookingForServices}
            yearsOfExperience={form.yearsOfExperience}
            hourlyRate={form.hourlyRate}
            sitterPetTypes={form.sitterPetTypes}
            newPetName={newPetName}
            newPetType={newPetType}
            newPetBreed={newPetBreed}
            newPetAge={newPetAge}
            setNewPetName={setNewPetName}
            setNewPetType={setNewPetType}
            setNewPetBreed={setNewPetBreed}
            setNewPetAge={setNewPetAge}
            toggleTagField={toggleTagField}
            handleAddPet={handleAddPet}
            handleRemovePet={handleRemovePet}
            updateField={updateField}
          />

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

          <PrivacySection
            showAbout={form.showAbout}
            showPets={form.showPets}
            showLookingFor={form.showLookingFor}
            updateField={updateField}
          />

          <DangerZoneSection
            username={form.username}
            deleteConfirmation={deleteConfirmation}
            deleteNotice={deleteNotice}
            oauthProvider={oauthProvider}
            setDeleteConfirmation={(v) => {
              setDeleteConfirmation(v);
              setDeleteNotice('');
            }}
            setDeleteNotice={setDeleteNotice}
            handleDeleteAccount={handleDeleteAccount}
          />

          <div className="settings-actions">
            {inlineError && <span className="settings-password-error">{inlineError}</span>}
            {saved && <span className="settings-saved">Changes saved</span>}
            <button className="settings-secondary-btn" type="button" onClick={handleReset}>Reset</button>
            <button className="settings-primary-btn" type="submit">Save changes</button>
          </div>
        </main>
      </form>
    </div>
  );
}
