import { useEffect } from 'react';
import './Notifications.css';

export default function Admin() {
    useEffect(() => {
        document.title = 'Admin | Petlink';
    }, []);

    return (
        <div className="notifications-container">
            <div className="notifications-box">
                <h2 className="notif-title">Admin page</h2>
            </div>
        </div>
    );
}
