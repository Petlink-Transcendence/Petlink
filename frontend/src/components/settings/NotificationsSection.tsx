import type { SettingsForm } from '../../pages/Settings';
import '../../pages/Settings.css';

interface NotificationsSectionProps {
    bookingAlerts: boolean;
    messageAlerts: boolean;
    reviewAlerts: boolean;
    commentAlerts: boolean;
    connectionRequestAlerts: boolean;
    updateField: <K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) => void;
}

export default function NotificationsSection({
    bookingAlerts,
    messageAlerts,
    reviewAlerts,
    commentAlerts,
    connectionRequestAlerts,
    updateField,
}: NotificationsSectionProps) {
    return (
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
                        checked={bookingAlerts}
                        onChange={(e) => updateField('bookingAlerts', e.target.checked)}
                    />
                </label>

                <label className="settings-toggle-row">
                    <span>
                        <strong>Messages</strong>
                        <small>New messages and direct replies</small>
                    </span>
                    <input
                        type="checkbox"
                        checked={messageAlerts}
                        onChange={(e) => updateField('messageAlerts', e.target.checked)}
                    />
                </label>

                <label className="settings-toggle-row">
                    <span>
                        <strong>Reviews</strong>
                        <small>New reviews and service ratings</small>
                    </span>
                    <input
                        type="checkbox"
                        checked={reviewAlerts}
                        onChange={(e) => updateField('reviewAlerts', e.target.checked)}
                    />
                </label>

                <label className="settings-toggle-row">
                    <span>
                        <strong>Comments and likes</strong>
                        <small>New comments and likes on your posts</small>
                    </span>
                    <input
                        type="checkbox"
                        checked={commentAlerts}
                        onChange={(e) => updateField('commentAlerts', e.target.checked)}
                    />
                </label>

                <label className="settings-toggle-row">
                    <span>
                        <strong>Connection requests</strong>
                        <small>New connection requests from other users</small>
                    </span>
                    <input
                        type="checkbox"
                        checked={connectionRequestAlerts}
                        onChange={(e) => updateField('connectionRequestAlerts', e.target.checked)}
                    />
                </label>
            </div>
        </section>
    );
}