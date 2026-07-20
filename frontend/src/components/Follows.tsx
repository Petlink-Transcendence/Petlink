import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Follows.css'

interface FollowsProps {
    onClose: () => void;
    initialTab?: 'followers' | 'following';
}

interface FollowUser {
    id: number;
    name: string;
    username: string;
    isFollowingBack: boolean;
    hasJustFollowed?: boolean;
}

export default function FollowsContainer({ onClose, initialTab = 'followers' }: FollowsProps) {
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
    const navigate = useNavigate();

    const [followers, setFollowers] = useState<FollowUser[]>([
        { id: 1, name: "Daniela Padilha", username: "@danielap", isFollowingBack: true },
        { id: 2, name: "Filipe Tootill", username: "@ftootill", isFollowingBack: true },
        { id: 3, name: "Rodrigo Silva", username: "@rodrigos", isFollowingBack: false },
        { id: 5, name: "João Vieira", username: "@jvieira", isFollowingBack: true },
    ]);

    const [following, setFollowing] = useState<FollowUser[]>([
        { id: 1, name: "Daniela Padilha", username: "@danielap", isFollowingBack: true },
        { id: 2, name: "Filipe Tootill", username: "@ftootill", isFollowingBack: true },
        { id: 6, name: "Ricardo Oliveira", username: "@ricardoo", isFollowingBack: true },
    ]);
    
    const currentList = activeTab === 'followers' ? followers : following;

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleFollowBackClick = (id: number) => {
        setFollowers(prev => 
            prev.map(user => user.id === id ? { ...user, hasJustFollowed: true } : user)
        );
    };

    const handleProfileNavigation = (userId: number) => {
        onClose();
        navigate(`/profile/${userId}`);
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
                    {currentList.length > 0 ? (
                        currentList.map((user) => (
                            <div key={user.id} className="follow-item-row">
                                
                                <div 
                                    className="follow-user-profile-target" 
                                    onClick={() => handleProfileNavigation(user.id)}
                                    title={`View ${user.name}'s profile`}
                                >
                                    <div className="follow-avatar-circle">
                                        {getInitials(user.name)}
                                    </div>
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
                                                    Connect
                                                </button>
                                            )}

                                            {!user.isFollowingBack && user.hasJustFollowed && (
                                                <span className="connection-requested-text">
                                                    Connection requested
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
                        <p className="no-follows-text">No users found here yet.</p>
                    )}
                </div>

            </div>
        </div>
    );
}