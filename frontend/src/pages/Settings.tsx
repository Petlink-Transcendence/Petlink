import { useEffect, useState, type FormEvent } from 'react';
import './Settings.css';

interface SettingsForm {
  displayName: string;
  username: string;
  email: string;
  location: string;
  bio: string;
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
}

const initialSettings: SettingsForm = {
  displayName: 'Jane Doe',
  username: 'janedoe123',
  email: 'jane.doe@example.com',
  location: 'Porto, PT',
  bio: 'Dog and cat mom. Always looking for the best care for my pets.',
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
};

const services = ['Cat Sitter', 'Dog Walker', 'Home Visits', 'Overnight Stay'];

export default function Settings() {
  const [form, setForm] = useState<SettingsForm>(initialSettings);
  const [selectedServices, setSelectedServices] = useState<string[]>(['Cat Sitter', 'Dog Walker']);
  const [saved, setSaved] = useState(false);
  
  const [activeSection, setActiveSection] = useState<string>('profile');

  useEffect(() => {
    document.title = 'Settings | PetLink';
  }, []);

  function updateField<Key extends keyof SettingsForm>(key: Key, value: SettingsForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleService(service: string) {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service]
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setForm(initialSettings);
    setSelectedServices(['Cat Sitter', 'Dog Walker']);
    setActiveSection('profile');
    setSaved(false);
  }

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <p className="settings-kicker">Account</p>
        <h1>
          My <span>Settings</span>
        </h1>
      </div>

      <form className="settings-layout" onSubmit={handleSubmit}>
        <aside className="settings-menu" aria-label="Settings sections">
          <div className="settings-profile-summary">
            <div className="settings-avatar">JD</div>
            <div>
              <strong>{form.displayName}</strong>
              <span>@{form.username}</span>
            </div>
          </div>

          <a 
            className={`settings-menu-item ${activeSection === 'profile' ? 'active' : ''}`} 
            href="#profile"
            onClick={() => setActiveSection('profile')}
          >
            Profile
          </a>
          <a 
            className={`settings-menu-item ${activeSection === 'care' ? 'active' : ''}`} 
            href="#care"
            onClick={() => setActiveSection('care')}
          >
            Pet care
          </a>
          <a 
            className={`settings-menu-item ${activeSection === 'notifications' ? 'active' : ''}`} 
            href="#notifications"
            onClick={() => setActiveSection('notifications')}
          >
            Notifications
          </a>
          <a 
            className={`settings-menu-item ${activeSection === 'privacy' ? 'active' : ''}`} 
            href="#privacy"
            onClick={() => setActiveSection('privacy')}
          >
            Privacy
          </a>
        </aside>

        <main className="settings-main">
          <section className="settings-section" id="profile">
            <div className="settings-section-header">
              <div>
                <h2>Profile details</h2>
                <p>Public account information</p>
              </div>
            </div>

            <div className="settings-grid">
              <label className="settings-field">
                <span>Display name</span>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(event) => updateField('displayName', event.target.value)}
                />
              </label>

              <label className="settings-field">
                <span>Username</span>
                <input
                  type="text"
                  value={form.username}
                  onChange={(event) => updateField('username', event.target.value)}
                />
              </label>

              <label className="settings-field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                />
              </label>

              <label className="settings-field">
                <span>Location</span>
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => updateField('location', event.target.value)}
                />
              </label>
            </div>

            <label className="settings-field">
              <span>Bio</span>
              <textarea
                value={form.bio}
                rows={4}
                onChange={(event) => updateField('bio', event.target.value)}
              />
            </label>
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
                  {mode === 'owner' ? 'Owner' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            <div className="settings-service-list">
              {services.map((service) => (
                <label className="settings-check-row" key={service}>
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => toggleService(service)}
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
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
                <span>
                  <strong>Booking requests</strong>
                  <small>New bookings or applications</small>
                </span>
                <input
                  type="checkbox"
                  checked={form.bookingAlerts}
                  onChange={(event) => updateField('bookingAlerts', event.target.checked)}
                />
              </label>

              <label className="settings-toggle-row">
                <span>
                  <strong>Messages</strong>
                  <small>New messages and direct replies</small>
                </span>
                <input
                  type="checkbox"
                  checked={form.messageAlerts}
                  onChange={(event) => updateField('messageAlerts', event.target.checked)}
                />
              </label>

              <label className="settings-toggle-row">
                <span>
                  <strong>Reviews</strong>
                  <small>New reviews and service ratings</small>
                </span>
                <input
                  type="checkbox"
                  checked={form.reviewAlerts}
                  onChange={(event) => updateField('reviewAlerts', event.target.checked)}
                />
              </label>

              <label className="settings-toggle-row">
                <span>
                  <strong>Comments and likes</strong>
                  <small>New comments and likes on your posts</small>
                </span>
                <input
                  type="checkbox"
                  checked={form.commentAlerts}
                  onChange={(event) => updateField('commentAlerts', event.target.checked)}
                />
              </label>

              <label className="settings-toggle-row">
                <span>
                  <strong>Connection requests</strong>
                  <small>New connection requests from other users</small>
                </span>
                <input
                  type="checkbox"
                  checked={form.connectionRequestAlerts}
                  onChange={(event) => updateField('connectionRequestAlerts', event.target.checked)}
                />
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
                <span>
                  <strong>Show About</strong>
                  <small>About you</small>
                </span>
                <input
                  type="checkbox"
                  checked={form.showAbout}
                  onChange={(event) => updateField('showAbout', event.target.checked)}
                />
              </label>

              <label className="settings-toggle-row">
                <span>
                  <strong>Show Pets</strong>
                  <small>Your pets or pets you petsit</small>
                </span>
                <input
                  type="checkbox"
                  checked={form.showPets}
                  onChange={(event) => updateField('showPets', event.target.checked)}
                />
              </label>

              <label className="settings-toggle-row">
                <span>
                  <strong>Show Looking For</strong>
                  <small>What you're looking for at PetLink</small>
                </span>
                <input
                  type="checkbox"
                  checked={form.showLookingFor}
                  onChange={(event) => updateField('showLookingFor', event.target.checked)}
                />
              </label>
            </div>
          </section>

          <div className="settings-actions">
            {saved && <span className="settings-saved">Changes saved</span>}
            <button className="settings-secondary-btn" type="button" onClick={handleReset}>
              Reset
            </button>
            <button className="settings-primary-btn" type="submit">
              Save changes
            </button>
          </div>
        </main>
      </form>
    </div>
  );
}
