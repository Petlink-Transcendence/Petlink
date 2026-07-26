import { useEffect, useState } from 'react';
import './Notifications.css';
import '../components/search/SearchSidebar.css';

export default function Admin() {
    const [userQuery, setUserQuery] = useState('');

    useEffect(() => {
        document.title = 'Admin | Petlink';
    }, []);

    const handleUserSearch = () => {
        setUserQuery(userQuery.trim());
    };

    return (
        <div className="notifications-container">
            <div className="notifications-box">
                <h2 className="notif-title">Admin page</h2>
                <div className="search-card">
                    <h3 className="search-card-title">Search user</h3>
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Name, role, location..."
                            value={userQuery}
                            onChange={e => setUserQuery(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleUserSearch(); }}
                        />
                        {userQuery && (
                            <button className="search-clear" onClick={() => setUserQuery('')}>✕</button>
                        )}
                    </div>
                    <button className="search-btn" onClick={handleUserSearch}>Search</button>
                </div>
            </div>
        </div>
    );
}
