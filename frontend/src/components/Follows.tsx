import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Follows.css'

interface FollowsProps {
    onClose: () => void;
    initialTab?: 'followers' | 'following';
    targetUserId?: number;
}

interface BackendFollowUser {
    id: number;
    name?: string;
    username?: string;
    user_type?: string;
    avatar?: string | null;
}

interface FollowUser {
    id: number;
    name: string;
    username: string;
    user_type?: string;
    avatar?: string | null;
    isFollowingBack: boolean;
    hasJustFollowed?: boolean;
}

export default function FollowsContainer({ onClose, initialTab = 'followers', targetUserId }: FollowsProps) {
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [following, setFollowing] = useState<FollowUser[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConnections = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('access') || localStorage.getItem('access_token');
                
                // Determine target user id
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

                setFollowers(followersData.map(u => ({
                    id: u.id,
                    name: u.name || u.username || `User ${u.id}`,
                    username: u.username ? `@${u.username}` : `@user-${u.id}`,
                    user_type: u.user_type,
                    avatar: u.avatar,
                    isFollowingBack: followingIds.has(u.id)
                })));

                setFollowing(followingData.map(u => ({
                    id: u.id,
                    name: u.name || u.username || `User ${u.id}`,
                    username: u.username ? `@${u.username}` : `@user-${u.id}`,
                    user_type: u.user_type,
                    avatar: u.avatar,
                    isFollowingBack: followerIds.has(u.id)
                })));
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

    const currentList = activeTab === 'followers' ? followers : following;

    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return 'U';
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const handleFollowBackClick = async (id: number) => {
        try {
            const token = localStorage.getItem('access') || localStorage.getItem('access_token');
            const res = await fetch(`/api/users/${id}/follow/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });
            if (res.ok) {
                window.dispatchEvent(new Event('connectionUpdated'));
                setFollowers(prev =>
                    prev.map(user => user.id === id ? { ...user, isFollowingBack: true, hasJustFollowed: true } : user)
                );
            }
        } catch (err) {
            console.error('Error connecting back:', err);
        }
    };

    const handleProfileNavigation = (user: FollowUser) => {
        onClose();
        const isSitter = user.user_type === 'provider' || user.user_type === 'sitter';
        const path = isSitter ? `/sitterprofile/${user.id}` : `/ownerprofile/${user.id}`;
        navigate(path);
    };

    return (
        <div className='follows-overlay' onClick={onClose}>
            <div className='follows-container' onClick={(e) => e.stopPropagation()}>
                
                <div className='follows-header'>
                    <div className="follows-tabs">
                        <button 
                            type="button" 
                            className={`tab-btn ${activeTab === 'followers' ? 'active' : ''}`}
                            onClick={() => setActiveTab('followers')}
                        >
                            Followers
                        </button>
                        <button 
                            type="button" 
                            className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
                            onClick={() => setActiveTab('following')}
                        >
                            Following
                        </button>
                    </div>
                    <button type="button" className='close-btn' onClick={onClose}>&times;</button>
                </div>

                <div className="follows-body-list">
                    {loading ? (
                        <p className="no-follows-text">Loading connections...</p>
                    ) : currentList.length > 0 ? (
                        currentList.map((user) => (
                            <div key={user.id} className="follow-item-row">
                                
                                <div 
                                    className="follow-user-profile-target" 
                                    onClick={() => handleProfileNavigation(user)}
                                    title={`View ${user.name}'s profile`}
                                >
                                    {user.avatar && user.avatar !== '/static/avatars/profile-pic.png' ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="follow-avatar-circle"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="follow-avatar-circle">
                                            {getInitials(user.name)}
                                        </div>
                                    )}
                                    <div className="follow-user-meta">
                                        <span className="follow-name">{user.name}</span>
                                        <span className="follow-username">{user.username}</span>
                                    </div>
                                </div>

                                <div className="follow-action-zone">
                                    {activeTab === 'followers' ? (
                                        <>
                                            {user.isFollowingBack && (
                                                <span className="follow-status-text static-friends">Connected</span>
                                            )}

                                            {!user.isFollowingBack && !user.hasJustFollowed && (
                                                <button 
                                                    className="follow-btn-action primary follow-back-btn"
                                                    onClick={() => handleFollowBackClick(user.id)}
                                                >
                                                    Connect back
                                                </button>
                                            )}

                                            {!user.isFollowingBack && user.hasJustFollowed && (
                                                <span className="connection-requested-text">
                                                    Connected
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="follow-status-text static-following">Connected</span>
                                    )}
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className="no-follows-text">No connections found here yet.</p>
                    )}
                </div>

            </div>
        </div>
    );
}