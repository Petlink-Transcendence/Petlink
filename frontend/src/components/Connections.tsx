import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedInUserId } from '../utils/auth';
import './Connections.css'

interface FollowsProps {
    onClose: () => void;
    initialTab?: 'connections' | 'pending';
    targetUserId?: number;
}

interface BackendFollowUser {
    id: number;
    name?: string;
    username?: string;
    user_type?: string;
    avatar?: string | null;
}

interface ConnectionUser {
    id: number;
    name: string;
    username: string;
    user_type?: string;
    avatar?: string | null;
    requestType?: 'incoming' | 'outgoing';
}

export default function ConnectionsContainer({ onClose, initialTab = 'connections', targetUserId }: FollowsProps) {
    const [activeTab, setActiveTab] = useState<'connections' | 'pending'>(initialTab);
    const [connections, setConnections] = useState<ConnectionUser[]>([]);
    const [pendingRequests, setPendingRequests] = useState<ConnectionUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConnections = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('access') || localStorage.getItem('access_token');
                const loggedInId = getLoggedInUserId();

                let uid = targetUserId;
                if (!uid) {
                    const meRes = await fetch('/auth/me/', {
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token && { 'Authorization': `Bearer ${token}` })
                        }
                    });
                    if (meRes.ok) {
                        const meData = await meRes.json();
                        uid = meData.id;
                    }
                }

                if (!uid) return;

                const ownProfileCheck = Boolean(!targetUserId || (loggedInId && String(targetUserId) === String(loggedInId)));
                setIsOwnProfile(ownProfileCheck);

                const [followersRes, followingRes] = await Promise.all([
                    fetch(`/api/users/${uid}/followers/`, {
                        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
                    }),
                    fetch(`/api/users/${uid}/following/`, {
                        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
                    })
                ]);

                let followersData: BackendFollowUser[] = [];
                let followingData: BackendFollowUser[] = [];

                if (followersRes.ok) followersData = await followersRes.json();
                if (followingRes.ok) followingData = await followingRes.json();

                const followingIds = new Set(followingData.map(u => u.id));
                const followerIds = new Set(followersData.map(u => u.id));

                // 1. Mutual connections (users present in both followers and following)
                const mutualUsers = followersData.filter(u => followingIds.has(u.id));

                setConnections(mutualUsers.map(u => ({
                    id: u.id,
                    name: u.name || u.username || `User ${u.id}`,
                    username: u.username ? `@${u.username}` : `@user-${u.id}`,
                    user_type: u.user_type,
                    avatar: u.avatar
                })));

                // 2. Incoming Requests (Followers that I have not followed back yet)
                const incoming = followersData
                    .filter(u => !followingIds.has(u.id))
                    .map(u => ({
                        id: u.id,
                        name: u.name || u.username || `User ${u.id}`,
                        username: u.username ? `@${u.username}` : `@user-${u.id}`,
                        user_type: u.user_type,
                        avatar: u.avatar,
                        requestType: 'incoming' as const
                    }));

                // 3. Outgoing Requests (Users I follow who have not followed me back yet)
                const outgoing = followingData
                    .filter(u => !followerIds.has(u.id))
                    .map(u => ({
                        id: u.id,
                        name: u.name || u.username || `User ${u.id}`,
                        username: u.username ? `@${u.username}` : `@user-${u.id}`,
                        user_type: u.user_type,
                        avatar: u.avatar,
                        requestType: 'outgoing' as const
                    }));

                setPendingRequests([...incoming, ...outgoing]);
            } catch (err) {
                console.error('Error fetching connections:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
        const handleUpdate = () => fetchConnections();
        window.addEventListener('connectionUpdated', handleUpdate);
        return () => window.removeEventListener('connectionUpdated', handleUpdate);
    }, [targetUserId]);

    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return 'U';
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const handleProfileNavigation = (user: ConnectionUser) => {
        onClose();
        const isSitter = user.user_type === 'provider' || user.user_type === 'sitter';
        const path = isSitter ? `/sitterprofile/${user.id}` : `/ownerprofile/${user.id}`;
        navigate(path);
    };

    const handleAcceptConnection = async (userId: number) => {
        try {
            const token = localStorage.getItem('access') || localStorage.getItem('access_token');
            const res = await fetch(`/api/users/${userId}/follow/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });
            if (res.ok) {
                window.dispatchEvent(new Event('connectionUpdated'));
            }
        } catch (err) {
            console.error('Error accepting connection:', err);
        }
    };

    const currentList = activeTab === 'connections' || !isOwnProfile ? connections : pendingRequests;

    return (
        <div className='connections-overlay' onClick={onClose}>
            <div className='connections-container' onClick={(e) => e.stopPropagation()}>

                <div className='connections-header'>
                    {isOwnProfile ? (
                        <div className="connections-tabs">
                            <button
                                type="button"
                                className={`tab-btn ${activeTab === 'connections' ? 'active' : ''}`}
                                onClick={() => setActiveTab('connections')}
                            >
                                Connections ({connections.length})
                            </button>
                            <button
                                type="button"
                                className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                                onClick={() => setActiveTab('pending')}
                            >
                                Pending ({pendingRequests.length})
                            </button>
                        </div>
                    ) : (
                        <h2 className="connections-title">Connections</h2>
                    )}
                    <button type="button" className='close-btn' onClick={onClose}>&times;</button>
                </div>

                <div className="connections-body-list">
                    {loading ? (
                        <p className="no-connections-text">Loading connections...</p>
                    ) : currentList.length > 0 ? (
                        currentList.map((user) => (
                            <div key={user.id} className="connection-item-row">

                                <div
                                    className="connection-user-profile-target"
                                    onClick={() => handleProfileNavigation(user)}
                                    title={`View ${user.name}'s profile`}
                                >
                                    {user.avatar && user.avatar !== '/static/avatars/profile-pic.png' ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="connection-avatar-circle"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="connection-avatar-circle">
                                            {getInitials(user.name)}
                                        </div>
                                    )}
                                    <div className="connection-user-meta">
                                        <span className="connection-name">{user.name}</span>
                                        <span className="connection-username">{user.username}</span>
                                    </div>
                                </div>

                                <div className="connection-action-zone">
                                    {activeTab === 'pending' && isOwnProfile ? (
                                        user.requestType === 'incoming' ? (
                                            <button
                                                className="connection-btn-action primary"
                                                onClick={() => handleAcceptConnection(user.id)}
                                            >
                                                Connect back
                                            </button>
                                        ) : (
                                            <span className="static-pending">Pending</span>
                                        )
                                    ) : (
                                        <span className="connection-status-text static-friends">Connected</span>
                                    )}
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className="no-connections-text">
                            {activeTab === 'pending' && isOwnProfile
                                ? 'No pending connection requests.'
                                : 'No connections found here yet.'}
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}
