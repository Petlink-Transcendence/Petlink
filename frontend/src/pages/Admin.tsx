import { useEffect, useState } from 'react';
import '../components/search/SearchSidebar.css';
import './Admin.css';

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
    if (user.user_type === 'sitter') return 'Pet Sitter';
    if (user.user_type === 'owner') return 'Pet Owner';
    return user.user_type || 'User';
}

function formatProfileTagValue(value: string) {
    return value
        .replace(/[_-]/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .replace(/\bCats\b/g, 'Cat')
        .replace(/\bDogs\b/g, 'Dog')
        .replace(/\bRabbits\b/g, 'Rabbit');
}

function getProfileTag(user: AdminUserProfile) {
    const isSitter = user.user_type === 'provider' || user.user_type === 'sitter';
    const firstPetType = user.pet_types?.find(Boolean);
    const firstLookingFor = user.looking_for?.find(Boolean);

    if (isSitter && firstPetType) {
        return `${formatProfileTagValue(firstPetType)} Sitter`;
    }

    if (user.user_type === 'owner' && firstPetType) {
        return `${formatProfileTagValue(firstPetType)} Owner`;
    }

    if (user.user_type === 'owner' && firstLookingFor) {
        return formatProfileTagValue(firstLookingFor);
    }

    return getDisplayRole(user);
}

function getProfileTags(user: AdminUserProfile) {
    const tags = [
        getProfileTag(user),
        ...(user.pet_types ?? []).map(formatProfileTagValue),
        ...(user.looking_for ?? []).map(formatProfileTagValue),
    ];

    return Array.from(new Set(tags.filter(Boolean))).slice(0, 5);
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
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

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
            const response = await fetch('/auth/users/?is_active=true', {
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
            setIsDeleteConfirmOpen(false);
        } catch {
            setSearchError('Error connecting to the server.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <main className="admin-page">
            <div className="admin-shell">
                <header className="admin-heading">
                    <div>
                        <p className="admin-kicker">Admin</p>
                        <h1>User management</h1>
                    </div>
                </header>

                <section className="admin-grid" aria-label="Admin user controls">
                    <aside className="admin-panel admin-search-panel">
                        <div className="admin-panel-header">
                            <h2>Find user</h2>
                            <p>Search by the exact unique username stored in the database.</p>
                        </div>

                        <div className="admin-search-form">
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
                                            setIsDeleteConfirmOpen(false);
                                        }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <button className="search-btn admin-search-btn" onClick={handleUserSearch} disabled={isSearching}>
                                {isSearching ? 'Searching...' : 'Search'}
                            </button>
                        </div>

                        {searchError && (
                            <span className="admin-error-message">{searchError}</span>
                        )}

                        {deleteMessage && (
                            <span className="admin-delete-message">{deleteMessage}</span>
                        )}
                    </aside>

                    <div className="admin-panel admin-result-panel">
                        <div className="admin-panel-header">
                            <h2>Profile details</h2>
                            <p>Review the user information before taking account actions.</p>
                        </div>

                        {!searchedUser && !selectedUser && (
                            <div className="admin-empty-state">
                                <span className="admin-empty-icon">🔍</span>
                                <h3>No user selected</h3>
                                <p>Search a username to load the matching database profile.</p>
                            </div>
                        )}

                        {searchedUser && !selectedUser && !isSearching && !searchError && (
                            <div className="admin-empty-state">
                                <span className="admin-empty-icon">🔍</span>
                                <h3>No user found for "{searchedUser}"</h3>
                                <p>Enter the exact unique username.</p>
                            </div>
                        )}

                        {searchedUser && selectedUser && (
                            <>
                                <div className="admin-user-card">
                                    <div className="admin-user-banner" />
                                    <div className="admin-user-avatar">
                                        {selectedUser.avatar ? (
                                            <img src={selectedUser.avatar} alt={selectedUser.name || selectedUser.username} />
                                        ) : (
                                            getInitials(selectedUser.name, selectedUser.username)
                                        )}
                                    </div>
                                    <div className="admin-user-info">
                                        <span className="admin-profile-tag">{getProfileTag(selectedUser)}</span>
                                        <div className="admin-identity">
                                            <div>
                                                <span className="admin-field-label">Name</span>
                                                <strong>{selectedUser.name || selectedUser.username}</strong>
                                            </div>
                                            <div>
                                                <span className="admin-field-label">Username</span>
                                                <strong>{selectedUser.username}</strong>
                                            </div>
                                        </div>

                                        <div className="admin-detail-grid">
                                            <div>
                                                <span className="admin-field-label">Email</span>
                                                <strong>{selectedUser.email}</strong>
                                            </div>
                                            <div>
                                                <span className="admin-field-label">Location</span>
                                                <strong>{getProfileLocation(selectedUser)}</strong>
                                            </div>
                                            <div>
                                                <span className="admin-field-label">Role</span>
                                                <strong>{selectedUser.role}</strong>
                                            </div>
                                            <div>
                                                <span className="admin-field-label">Joined</span>
                                                <strong>{formatJoinedDate(selectedUser.created_at)}</strong>
                                            </div>
                                            <div>
                                                <span className="admin-field-label">Status</span>
                                                <strong>{selectedUser.online_status || 'unknown'}</strong>
                                            </div>
                                            <div>
                                                <span className="admin-field-label">Rating</span>
                                                <strong>{selectedUser.rating || 'No rating'}</strong>
                                            </div>
                                        </div>

                                        <div className="admin-profile-tags" aria-label="Profile tags">
                                            {getProfileTags(selectedUser).map(tag => (
                                                <span key={tag}>{tag}</span>
                                            ))}
                                        </div>

                                        <div className="admin-bio-block">
                                            <span className="admin-field-label">Bio</span>
                                            <p>{selectedUser.description || 'This user has no profile description.'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="admin-danger-panel">
                                    <div>
                                        <h3>Delete user</h3>
                                        <p>This will soft-delete the selected account from PetLink.</p>
                                    </div>
                                    <button className="admin-delete-btn" onClick={() => setIsDeleteConfirmOpen(true)} disabled={isDeleting}>
                                        Delete user
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
            {isDeleteConfirmOpen && selectedUser && (
                <div className="admin-modal-backdrop" role="presentation">
                    <div className="admin-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-user-title">
                        <div className="admin-confirm-icon">!</div>
                        <div className="admin-confirm-copy">
                            <h2 id="delete-user-title">Delete this account?</h2>
                            <p>
                                You are about to delete <strong>{selectedUser.name || selectedUser.username}</strong> ({selectedUser.username}).
                                This account will no longer be active in PetLink.
                            </p>
                        </div>
                        <div className="admin-confirm-actions">
                            <button
                                className="admin-cancel-btn"
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="admin-delete-btn"
                                onClick={handleDeleteUser}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Confirm delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
