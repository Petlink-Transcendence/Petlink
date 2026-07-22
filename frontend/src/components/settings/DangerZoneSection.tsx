import '../../pages/Settings.css';

interface DangerZoneSectionProps {
  username: string;
  deleteConfirmation: string;
  deleteNotice: string;
  setDeleteConfirmation: (v: string) => void;
  handleDeleteAccount: () => void;
}

export default function DangerZoneSection({
  username,
  deleteConfirmation,
  deleteNotice,
  setDeleteConfirmation,
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
            }}
            autoComplete="off"
          />
        </label>

        {deleteNotice && <p className="settings-delete-notice">{deleteNotice}</p>}

        <button
          className="settings-danger-btn"
          type="button"
          disabled={deleteConfirmation !== username}
          onClick={handleDeleteAccount}
        >
          Delete my account
        </button>
      </div>
    </section>
  );
}
