import { useEffect, useState } from 'react';
import './Notifications.css';
import './Admin.css';
import '../components/search/SearchSidebar.css';
import '../components/search/SearchResults.css';
import { ownerProfiles, sitterProfiles, type BaseProfile, type SitterProfileData } from '../data/profileData';

type AdminUserProfile = (BaseProfile | SitterProfileData) & {
    profileType: 'owner' | 'sitter';
};

const adminUsers: AdminUserProfile[] = [
    ...Object.values(ownerProfiles).map(profile => ({ ...profile, profileType: 'owner' as const })),
    ...Object.values(sitterProfiles).map(profile => ({ ...profile, profileType: 'sitter' as const })),
];

function normalizeUsername(username: string) {
    const trimmed = username.trim().toLowerCase();
    return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}

function getProfileLocation(profile: AdminUserProfile) {
    const aboutCard = profile.sidebarCards.find(card => card.title === 'About' && card.type === 'meta');
    return aboutCard?.items.find(item => item.includes('📍'))?.replace('📍 ', '') ?? 'Location not set';
}

export default function Admin() {
    const [userQuery, setUserQuery] = useState('');
    const [searchedUser, setSearchedUser] = useState('');
    const [selectedUser, setSelectedUser] = useState<AdminUserProfile | null>(null);
    const [deleteMessage, setDeleteMessage] = useState('');

    useEffect(() => {
        document.title = 'Admin | Petlink';
    }, []);

    const handleUserSearch = () => {
        const trimmedQuery = userQuery.trim();
        const matchedUser = trimmedQuery
            ? adminUsers.find(user => user.username.toLowerCase() === normalizeUsername(trimmedQuery))
            : null;

        setUserQuery(trimmedQuery);
        setSearchedUser(trimmedQuery);
        setSelectedUser(matchedUser ?? null);
        setDeleteMessage('');
    };

    const handleDeleteUser = () => {
        if (!selectedUser) return;

        setDeleteMessage(`User "${selectedUser.username}" deleted.`);
        setUserQuery('');
        setSearchedUser('');
        setSelectedUser(null);
    };

    return (
        <div className="notifications-container">
            <div className="notifications-box">
                <h2 className="notif-title">Admin page</h2>
                <div className="search-card admin-search-card">
                    <h3 className="search-card-title">Search by username</h3>
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Unique username"
                            value={userQuery}
                            onChange={e => setUserQuery(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleUserSearch(); }}
                        />
                        {userQuery && (
                            <button
                                className="search-clear"
                                onClick={() => {
                                    setUserQuery('');
                                    setSearchedUser('');
                                    setSelectedUser(null);
                                    setDeleteMessage('');
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button className="search-btn" onClick={handleUserSearch}>Search</button>
                </div>
                {searchedUser && selectedUser && (
                    <div className="result-card admin-user-card">
                        <div className="result-card-banner" />
                        <div className="result-avatar">{selectedUser.initials}</div>
                        <div className="result-info">
                            <span className="result-name">{selectedUser.name}</span>
                            <span className="admin-user-username">{selectedUser.username}</span>
                            <span className="result-role">{selectedUser.role}</span>
                            <span className="result-location">📍 {getProfileLocation(selectedUser)}</span>
                            <div className="admin-user-stats">
                                {selectedUser.stats.map(stat => (
                                    <span key={stat.label}>
                                        <strong>{stat.value}</strong> {stat.label}
                                    </span>
                                ))}
                            </div>
                            <p className="admin-user-bio">{selectedUser.bio}</p>
                        </div>
                    </div>
                )}
                {searchedUser && !selectedUser && (
                    <div className="empty-results-card admin-empty-card">
                        <span className="empty-results-icon">🔍</span>
                        <h3 className="empty-results-title">No user found for "{searchedUser}"</h3>
                        <p className="empty-results-text">Enter the exact unique username.</p>
                    </div>
                )}
                {selectedUser && (
                    <div className="admin-delete-panel">
                        <span className="admin-delete-copy">Selected username: {selectedUser.username}</span>
                        <button className="admin-delete-btn" onClick={handleDeleteUser}>
                            Delete user
                        </button>
                    </div>
                )}
                {deleteMessage && (
                    <span className="admin-delete-message">{deleteMessage}</span>
                )}
            </div>
        </div>
    );
}
