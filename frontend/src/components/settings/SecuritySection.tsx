import type { SettingsForm } from '../../pages/Settings';
import '../../pages/Settings.css';

interface SecuritySectionProps {
    oauthProvider?: string | null;
    passwordSuccess?: string;
    passwordError: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    updateField: <K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) => void;
    handlePasswordSubmit?: () => void;
}

export default function SecuritySection({
    oauthProvider,
    passwordSuccess,
    passwordError,
    currentPassword,
    newPassword,
    confirmPassword,
    updateField,
    handlePasswordSubmit,
}: SecuritySectionProps) {
    return (
        <>
        {!oauthProvider && (
        <section className="settings-section" id="security">
          <div className="settings-section-header">
            <div>
              <h2>Security</h2>
              <p>Update the password you use to sign in.</p>
            </div>
          </div>

          <div>
            {passwordSuccess && (
              <p className="settings-saved" style={{ marginBottom: '1rem' }}>
                {passwordSuccess}
              </p>
            )}
            {passwordError && (
              <p className="settings-password-error">{passwordError}</p>
            )}
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                type="button"
                className="settings-primary-btn"
                onClick={handlePasswordSubmit}
              >
                Change password
              </button>
            </div>
          </div>
        </section>
      )}
    </>

    );
}