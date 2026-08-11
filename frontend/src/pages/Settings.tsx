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
  userType: string;
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
  userType: 'owner',
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
  | 'showAbout'
  | 'showPets'
  | 'showLookingFor'
> = {
  showAbout: true,
  showPets: true,
  showLookingFor: true,
};

function compressImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    if (file.size <= 1 * 1024 * 1024) {
      return resolve(file);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxHeight) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export default function Settings() {
  const [form, setForm] = useState<SettingsForm>(initialSettings);
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [saved, setSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [inlineError, setInlineError] = useState('');
  const [avatarError, setAvatarError] = useState('');
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

      const userType = data.user_type;
      const initialMode = userType === 'owner' ? 'owner' : 'sitter';

      const backendData = data as BackendUser & { 
        email?: string; 
        user_type?: string; 
        id?: number; 
        experience?: number | null; 
        price?: number | string | null; 
        sitter_pet_types?: string[]; 
        looking_for?: string[];
        show_about?: boolean;
        show_pets?: boolean;
        show_looking_for?: boolean;
      };

      let petsData: Pet[] = [];
      if (data.id) {
        try {
          const petsRes = await fetch(`/api/users/${data.id}/pets/`, {
            headers: { 'Content-Type': 'application/json' }
          });
          if (petsRes.ok) {
            const rawPets = await petsRes.json();
            petsData = rawPets.map((p: any) => ({
              id: String(p.id),
              name: p.name,
              type: p.type as Pet['type'],
              breed: p.breed || '',
              age: p.age || '',
            }));
          }
        } catch {
          // non-critical, continue without pets
        }
      }

      setForm((prev) => ({
        ...prev,
        displayName: data.name || mappedProfile.name,
        username: (data.username || mappedProfile.username).replace('@', ''),
        email: data.email || '',
        city: data.city || '',
        country: data.country || '',
        avatarUrl: data.avatar || mappedProfile.imageUrl || '',
        bio: data.description || (mappedProfile.bio !== 'No bio available.' ? mappedProfile.bio : ''),
        userType: initialMode,
        yearsOfExperience: backendData.experience != null ? String(backendData.experience) : '',
        hourlyRate: backendData.price != null ? String(backendData.price) : '',
        sitterPetTypes: (backendData.sitter_pet_types ?? prev.sitterPetTypes).map((s: string) => s.toLowerCase()),
        lookingForServices: (backendData.looking_for ?? prev.lookingForServices).map((s: string) => s.toLowerCase()),
        showAbout: backendData.show_about ?? prev.showAbout,
        showPets: backendData.show_pets ?? prev.showPets,
        showLookingFor: backendData.show_looking_for ?? prev.showLookingFor,
        petsList: petsData,
      }));

    } catch (err: any) {
      setError(err.message || 'Failed to load account data.');
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
      } catch {
        /* ignore */
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

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (JPEG, PNG, WEBP).');
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setAvatarError('Selected image is too large. Maximum file size is 10MB.');
      event.target.value = '';
      return;
    }

    setAvatarError('');

    try {
      const processedFile = await compressImage(file);
      if (processedFile.size > 5 * 1024 * 1024) {
        setAvatarError('Image file is too large (max 5MB). Please select a smaller photo.');
        event.target.value = '';
        return;
      }

      const nextAvatarUrl = URL.createObjectURL(processedFile);
      setAvatarFile(processedFile);

      setForm((current) => {
        if (current.avatarUrl.startsWith('blob:')) {
          URL.revokeObjectURL(current.avatarUrl);
        }
        return { ...current, avatarUrl: nextAvatarUrl };
      });
    } catch {
      setAvatarError('Failed to process image file. Please try another photo.');
      event.target.value = '';
    }
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

  async function handleAddPet() {
    if (!newPetName.trim()) return;

    try {
      const token = localStorage.getItem('access') || localStorage.getItem('access_token');
      const response = await fetch('/api/pets/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          name: newPetName.trim(),
          type: newPetType,
          breed: newPetBreed.trim() || null,
          age: newPetAge,
        }),
      });

      if (!response.ok) {
        setInlineError('Failed to add pet. Please try again.');
        return;
      }

      const created = await response.json();
      const newPet: Pet = {
        id: String(created.id),
        name: created.name,
        type: created.type as Pet['type'],
        breed: created.breed || '',
        age: created.age || newPetAge,
      };

      updateField('petsList', [...form.petsList, newPet]);
      setNewPetName('');
      setNewPetBreed('');
      setNewPetType('dog');
      setNewPetAge('<1 yr');
    } catch {
      setInlineError('Failed to add pet. Please try again.');
    }
  }

  async function handleRemovePet(id: string) {
    try {
      const token = localStorage.getItem('access') || localStorage.getItem('access_token');
      const response = await fetch(`/api/pets/${id}/`, {
        method: 'DELETE',
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
      });

      if (!response.ok && response.status !== 204) {
        setInlineError('Failed to remove pet. Please try again.');
        return;
      }

      updateField('petsList', form.petsList.filter((pet) => pet.id !== id));
    } catch {
      setInlineError('Failed to remove pet. Please try again.');
    }
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
      if (!response.ok || data.old_password || data.new_password || (data.detail && data.detail !== "Password updated successfully.")) {
        setPasswordError(data.old_password?.[0] || data.new_password?.[0] || data.detail || data.error || 'Failed to update password.');
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
    setSaved(false);

    if (avatarError) {
      setInlineError(avatarError);
      return;
    }

    if (!userId) {
      setInlineError('Cannot save: user ID not loaded.');
      return;
    }

    if (!form.displayName.trim()) {
      setInlineError('Display name cannot be empty.');
      return;
    }

    if (!form.email.trim()) {
      setInlineError('Email cannot be empty.');
      return;
    }

    if (!form.username.trim()) {
      setInlineError('Username cannot be empty.');
      return;
    }

    if (form.bio && form.bio.length > 500) {
      setInlineError('Bio cannot exceed 500 characters.');
      return;
    }

    // Pre-check username/email availability to prevent 400 Bad Request browser console errors
    try {
      const checkRes = await fetch(`/auth/check-availability/?username=${encodeURIComponent(form.username.trim())}&email=${encodeURIComponent(form.email.trim())}&exclude_user_id=${userId}`);
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.username_taken) {
          setInlineError('Username already taken.');
          return;
        }
        if (checkData.email_taken) {
          setInlineError('Email already in use.');
          return;
        }
      }
    } catch {
      // Ignore pre-check fetch failure and fallback to direct PATCH
    }

    try {
      const token = localStorage.getItem('access') || localStorage.getItem('access_token');
      const patchBody = {
          username: form.username,
          email: form.email,
          name: form.displayName,
          description: form.bio,
          city: form.city,
          country: form.country,
          experience: form.yearsOfExperience || null,
          price: form.hourlyRate || null,
          looking_for: form.lookingForServices,
          sitter_pet_types: form.sitterPetTypes,
          show_about: form.showAbout,
          show_pets: form.showPets,
          show_looking_for: form.showLookingFor
      };
      const response = await fetch(`/auth/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(patchBody),
      });

      if (!response.ok) {
        let message = `Server error ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.username) {
            message = Array.isArray(errorData.username) ? errorData.username[0] : String(errorData.username);
          } else if (errorData.email) {
            message = Array.isArray(errorData.email) ? errorData.email[0] : String(errorData.email);
          } else if (errorData.description) {
            message = Array.isArray(errorData.description) ? errorData.description[0] : String(errorData.description);
          } else if (errorData.detail) {
            message = Array.isArray(errorData.detail) ? errorData.detail[0] : String(errorData.detail);
          } else {
            const firstError = Object.values(errorData)[0];
            message = Array.isArray(firstError) ? firstError[0] : String(firstError);
          }
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
        if (!avatarResponse.ok) {
          let avatarErrMsg = 'Failed to upload avatar image.';
          try {
            const errJson = await avatarResponse.json();
            if (errJson.avatar) {
              avatarErrMsg = Array.isArray(errJson.avatar) ? errJson.avatar[0] : String(errJson.avatar);
            } else if (errJson.detail) {
              avatarErrMsg = errJson.detail;
            }
          } catch {
            if (avatarResponse.status === 413) {
              avatarErrMsg = 'Image file size is too large (max 5MB).';
            }
          }
          setInlineError(avatarErrMsg);
          setAvatarError(avatarErrMsg);
          return;
        }
        setAvatarFile(null);
        setAvatarError('');
      }
    } catch {
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
            avatarError={avatarError}
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
            userType={form.userType}
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

          <PrivacySection
            userType={form.userType}
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
