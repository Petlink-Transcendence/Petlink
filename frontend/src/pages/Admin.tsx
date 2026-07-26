import { useEffect, useState } from 'react';
import './Notifications.css';
import './Admin.css';
import '../components/search/SearchSidebar.css';
import '../components/search/SearchResults.css';

type AdminUserProfile = {
    id: number;
    username: string;
    email: string;
    name: string;
    user_type: string;
    role: string;
    avatar?: string | null;
    description?: string | null;
    city?: string | null;
    country?: string | null;
    rating?: string | number | null;
    online_status?: string | null;
    created_at?: string;
    experience?: string | number | null;
    price?: string | number | null;
    pet_types?: string[] | null;
    looking_for?: string[] | null;
    oauth_provider?: string | null;
};

function normalizeUsername(username: string) {
    const trimmed = username.trim().toLowerCase();
    return trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
}

function getInitials(name: string, username: string) {
    const source = name.trim() || username.trim();
    return source
        .split(' ')
        .filter(Boolean)
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function getDisplayRole(user: AdminUserProfile) {
    if (user.user_type === 'provider') return 'Pet Sitter';
    if (user.user_type === 'owner') return 'Pet Owner';
    return user.user_type || 'User';
}

function getProfileLocation(user: AdminUserProfile) {
    return [user.city, user.country].filter(Boolean).join(', ') || 'Location not set';
}

function formatJoinedDate(date?: string) {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function Admin() {
    const [userQuery, setUserQuery] = useState('');
    const [searchedUser, setSearchedUser] = useState('');
    const [selectedUser, setSelectedUser] = useState<AdminUserProfile | null>(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [searchError, setSearchError] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        document.title = 'Admin | Petlink';
    }, []);

    const handleUserSearch = async () => {
        const trimmedQuery = userQuery.trim();

        setUserQuery(trimmedQuery);
        setSearchedUser(trimmedQuery);
        setSelectedUser(null);
        setDeleteMessage('');
        setSearchError('');

        if (!trimmedQuery) return;

        const token = localStorage.getItem('access');
        if (!token) {
            setSearchError('You need to be logged in as an admin to search users.');
            return;
        }

        try {
            setIsSearching(true);
            const response = await fetch('/auth/users/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                setSearchError(response.status === 403
                    ? 'Only admin users can search database profiles.'
                    : 'Could not search users right now.');
                return;
            }

            const users = await response.json() as AdminUserProfile[];
            const normalizedQuery = normalizeUsername(trimmedQuery);
            const matchedUser = users.find(user => user.username.toLowerCase() === normalizedQuery);

            setSelectedUser(matchedUser ?? null);
        } catch {
            setSearchError('Error connecting to the server.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        const token = localStorage.getItem('access');
        if (!token) {
            setSearchError('You need to be logged in as an admin to delete users.');
            return;
        }

        try {
            setIsDeleting(true);
            setSearchError('');

            const response = await fetch(`/auth/users/${selectedUser.id}/delete/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                setSearchError(response.status === 403
                    ? 'Only admin users can delete users.'
                    : 'Could not delete this user.');
                return;
            }

            setDeleteMessage(`User "${selectedUser.username}" deleted.`);
            setUserQuery('');
            setSearchedUser('');
            setSelectedUser(null);
        } catch {
            setSearchError('Error connecting to the server.');
        } finally {
            setIsDeleting(false);
        }
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
                                    setSearchError('');
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button className="search-btn" onClick={handleUserSearch} disabled={isSearching}>
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </div>
                {searchError && (
                    <span className="admin-error-message">{searchError}</span>
                )}
                {searchedUser && selectedUser && (
                    <div className="result-card admin-user-card">
                        <div className="result-card-banner" />
                        <div className="result-avatar">
                            {selectedUser.avatar ? (
                                <img src={selectedUser.avatar} alt={selectedUser.name || selectedUser.username} />
                            ) : (
                                getInitials(selectedUser.name, selectedUser.username)
                            )}
                        </div>
                        <div className="result-info">
                            <span className="result-name">{selectedUser.name || selectedUser.username}</span>
                            <span className="admin-user-username">{selectedUser.username}</span>
                            <span className="result-role">{getDisplayRole(selectedUser)}</span>
                            <span className="result-location">📍 {getProfileLocation(selectedUser)}</span>
                            <span className="admin-user-email">{selectedUser.email}</span>
                            <div className="admin-user-stats">
                                <span><strong>{selectedUser.role}</strong> role</span>
                                <span><strong>{selectedUser.online_status || 'unknown'}</strong> status</span>
                                <span><strong>{formatJoinedDate(selectedUser.created_at)}</strong> joined</span>
                                {selectedUser.rating && <span><strong>{selectedUser.rating}</strong> rating</span>}
                            </div>
                            <p className="admin-user-bio">
                                {selectedUser.description || 'This user has no profile description.'}
                            </p>
                        </div>
                    </div>
                )}
                {searchedUser && !selectedUser && !isSearching && !searchError && (
                    <div className="empty-results-card admin-empty-card">
                        <span className="empty-results-icon">🔍</span>
                        <h3 className="empty-results-title">No user found for "{searchedUser}"</h3>
                        <p className="empty-results-text">Enter the exact unique username.</p>
                    </div>
                )}
                {selectedUser && (
                    <div className="admin-delete-panel">
                        <span className="admin-delete-copy">Selected username: {selectedUser.username}</span>
                        <button className="admin-delete-btn" onClick={handleDeleteUser} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete user'}
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
