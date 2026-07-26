import '../../pages/Settings.css';

interface DangerZoneSectionProps {
  username: string;
  deleteConfirmation: string;
  deleteNotice: string;
  oauthProvider?: string | null;
  setDeleteConfirmation: (v: string) => void;
  setDeleteNotice: (v: string) => void;
  handleDeleteAccount: () => void;
}

export default function DangerZoneSection({
  username,
  deleteConfirmation,
  deleteNotice,
  oauthProvider,
  setDeleteConfirmation,
  setDeleteNotice,
  handleDeleteAccount,
}: DangerZoneSectionProps) {
  return (
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
            {oauthProvider ? " Type your username to confirm." : " Type your password to confirm."}
          </p>
        </div>

        <label className="settings-field settings-delete-confirm">
          <span>{oauthProvider ? "Confirm username" : "Confirm password"}</span>
          <input
            type={oauthProvider ? "text" : "password"}
            value={deleteConfirmation}
            onChange={(e) => {
              setDeleteConfirmation(e.target.value);
              setDeleteNotice('');
            }}
            placeholder={oauthProvider ? username : "Enter your password"}
            autoComplete="new-password"
          />
        </label>

        {deleteNotice && <p className="settings-delete-notice">{deleteNotice}</p>}

        <button
          className="settings-danger-btn"
          type="button"
          disabled={!deleteConfirmation || (!!oauthProvider && deleteConfirmation !== username)}
          onClick={handleDeleteAccount}
        >
          Delete my account
        </button>
      </div>
    </section>
  );
}
