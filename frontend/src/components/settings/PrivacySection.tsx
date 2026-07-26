import type { SettingsForm } from '../../pages/Settings';
import '../../pages/Settings.css';

interface PrivacySectionProps {
  userType: string;
  showAbout: boolean;
  showPets: boolean;
  showLookingFor: boolean;
  updateField: <K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) => void;
}

export default function PrivacySection({
  userType,
  showAbout,
  showPets,
  showLookingFor,
  updateField,
}: PrivacySectionProps) {
  return (
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
            checked={showAbout}
            onChange={(e) => updateField('showAbout', e.target.checked)}
          />
        </label>

        {userType === 'owner' && (
          <label className="settings-toggle-row">
            <span>
              <strong>Show Pets</strong>
              <small>Your pets or pets you petsit</small>
            </span>
            <input
              type="checkbox"
              checked={showPets}
              onChange={(e) => updateField('showPets', e.target.checked)}
            />
          </label>
        )}
        
        <label className="settings-toggle-row">
          <span>
            <strong>Show Looking For</strong>
            <small>What you're looking for at PetLink</small>
          </span>
          <input
            type="checkbox"
            checked={showLookingFor}
            onChange={(e) => updateField('showLookingFor', e.target.checked)}
          />
        </label>
      </div>
    </section>
  );
}
