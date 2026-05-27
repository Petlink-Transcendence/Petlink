import './Notifications.css';
import { useEffect } from 'react';

export default function Notifications() {
    useEffect(() => {
        document.title = 'Notifications | Petlink';
    }, []);

    return (
        <div className="notifications-container">
            <h1>Notifications</h1>
            <p>You have no new notifications.</p>
        </div>
    )
}
