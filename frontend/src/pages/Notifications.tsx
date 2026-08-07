import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedInUserId } from '../utils/auth';
import ConnectionsContainer from '../components/Connections.tsx';
import './Notifications.css';

interface BackendNotification {
    id: number;
    type: 'new_connection' | 'new_message' | 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'new_review' | 'new_comment' | 'new_like';
    content: string;
    reference_id: number | null;
    reference_type: string | null;
    read: boolean;
    created_at: string;
}

interface WsNotificationDetail {
    type: string;
    content: string;
    reference_id: number | null;
    reference_type: string | null;
}

function timeAgo(isoString: string): string {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(isoString).toLocaleDateString();
}

const TYPE_ICON: Record<string, string> = {
    new_message: '💬',
    new_review: '⭐',
    new_connection: '🤝',
    booking_request: '📅',
    booking_confirmed: '📅',
    booking_cancelled: '📅',
    new_comment: '📣',
    new_like: '❤️',
};

export default function Notifications() {
    useEffect(() => {
        document.title = 'Notifications | Petlink';
    }, []);

    const navigate = useNavigate();
    const userId = getLoggedInUserId();

    const [notifications, setNotifications] = useState<BackendNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFollows, setShowFollows] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`/notifications/${userId}/`);
            if (!res.ok) throw new Error('Failed to load notifications');
            const data = await res.json() as BackendNotification[];
            setNotifications(data);
        } catch {
            setError('Could not load notifications.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        if (!userId || loading) return;
        fetch(`/notifications/${userId}/read-all/`, { method: 'PUT' })
            .then(() => {
                window.dispatchEvent(new CustomEvent('notificationsRead'));
            })
            .catch(() => {/* non-critical */});
    }, [userId, loading]);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent<WsNotificationDetail>).detail;
            const incoming: BackendNotification = {
                id: Date.now(), // temporary id until next fetch
                type: detail.type as BackendNotification['type'],
                content: detail.content,
                reference_id: detail.reference_id,
                reference_type: detail.reference_type,
                read: false,
                created_at: new Date().toISOString(),
            };
            setNotifications(prev => [incoming, ...prev]);
        };

        const handleUpdate = (e: Event) => {
            const detail = (e as CustomEvent<any>).detail;

            if (detail.action === 'unfollow') {
                setNotifications(prev => prev.filter(n => 
                    !(n.type === 'new_connection' && n.reference_id === detail.follower_id)
                ));
            } else if (detail.action === 'unliked') {
                setNotifications(prev => prev.filter(n => !(n.type === 'new_like' && n.reference_type === 'post' && n.reference_id === detail.post_id)));
            } else if (detail.action === 'comment_deleted') {
                setNotifications(prev => {
                    const idx = prev.findIndex(n => n.type === 'new_comment' && n.reference_type === 'post' && n.reference_id === detail.post_id);
                    if (idx !== -1) {
                        const next = [...prev];
                        next.splice(idx, 1);
                        return next;
                    }
                    return prev;
                });
            }
            
            fetchNotifications();
        };

        window.addEventListener('newNotification', handler);
        window.addEventListener('postsUpdated', handleUpdate);
        window.addEventListener('connectionUpdated', handleUpdate);

        return () => {
            window.removeEventListener('newNotification', handler);
            window.removeEventListener('postsUpdated', handleUpdate);
            window.removeEventListener('connectionUpdated', handleUpdate);
        };
    }, [fetchNotifications]);

    const handleClick = async (notif: BackendNotification) => {
        if (!notif.read) {
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
            await fetch(`/notifications/${notif.id}/read/`, { method: 'PUT' }).catch(() => {/* non-critical */});
        }

        switch (notif.type) {
            case 'new_message':
                navigate('/chat', { state: { openChatId: notif.reference_id } });
                break;
            case 'new_review':
                navigate('/reviews');
                break;
            case 'new_connection':
                setShowFollows(true);
                break;
            case 'booking_request':
            case 'booking_confirmed':
            case 'booking_cancelled':
                navigate('/bookings');
                break;
            case 'new_comment':
            case 'new_like':
                if (notif.reference_type === 'post' && notif.reference_id) {
                    navigate(`/posts/${notif.reference_id}`);
                }
                break;
        }
    };

    if (!userId) {
        return (
            <div className="notifications-container">
                <div className="notifications-box">
                    <p className="no-notifications">Please log in to see your notifications.</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="notifications-container">
            <div className='notifications-box'>
                <h2 className='notif-title'>My <span className='notif-title-notfications'>Notifications</span></h2>

                <div className='notifications-list'>
                    {loading ? (
                        <p className="no-notifications">Loading…</p>
                    ) : error ? (
                        <p className="no-notifications">{error}</p>
                    ) : notifications.length === 0 ? (
                        <p className="no-notifications">All caught up! No new notifications.</p>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`notification-item ${!notif.read ? 'unread' : ''}`}
                                onClick={() => handleClick(notif)}
                            >
                                <div className={`notif-icon ${notif.type}`}>
                                    {TYPE_ICON[notif.type] ?? '🔔'}
                                </div>

                                <div className='notif-content'>
                                    <p className='notif-text'>{notif.content}</p>
                                    <span className='notif-time'>{timeAgo(notif.created_at)}</span>
                                </div>

                                {!notif.read && <div className='unread-dot' />}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {showFollows && (
            <ConnectionsContainer
                onClose={() => setShowFollows(false)}
                initialTab='pending'
            />
        )}
        </>
    );
}
