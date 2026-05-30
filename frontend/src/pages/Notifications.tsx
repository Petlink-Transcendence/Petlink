import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

interface Notification {
    id: number;
    type: 'message' | 'review' | 'comment' | 'like' | 'application' | 'booking' | 'connection';
    text: string;
    senderName: string; // Added to easily reference the sender's name
    senderId: number;
    time: string;
    isUnread: boolean;
    connectionStatus?: 'accepted' | 'declined'; // Track connection actions
}

export default function Notifications() {
    useEffect(() => {
        document.title = 'Notifications | Petlink';
    }, []);

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, type: 'message', text: 'Daniela sent you a message: "I will be there at 2pm..."', senderName: 'Daniela', senderId: 1, time: '1 hour ago', isUnread: true },
        { id: 2, type: 'review', text: 'Rodrigo left you a 5-star review: "Great cat sitter!"', senderName: 'Rodrigo', senderId: 3, time: '6 hours ago', isUnread: true },
        { id: 3, type: 'comment', text: 'Daniela left a comment on your post.', senderName: 'Daniela', senderId: 1, time: '6 hours ago', isUnread: true },
        { id: 4, type: 'like', text: 'Daniela liked your post.', senderName: 'Daniela', senderId: 1, time: 'Yesterday', isUnread: false },
        { id: 5, type: 'application', text: 'Ricado applied to your service request.', senderName: 'Ricado', senderId: 6, time: 'Yesterday', isUnread: false },
        { id: 6, type: 'booking', text: 'Filipe booked your service.', senderName: 'Filipe', senderId: 2, time: '2 days ago', isUnread: false },
        { id: 7, type: 'connection', text: 'João wants to connect with you.', senderName: 'João', senderId: 5, time: '2 days ago', isUnread: true },
    ]);

    // Marks a notification as read instantly before navigating
    const handleNotificationClick = (notification: Notification) => {
        setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, isUnread: false } : n)
        );

        switch (notification.type) {
            case 'message':
                navigate('/chat', { state: { openChatId: notification.senderId} });
                break;
            case 'review':
                navigate('/reviews');
                break;
            case 'comment':
                navigate('/profile');
                break;
            case 'like':
                navigate('/profile');
                break;
            case 'application':
                navigate('/bookings');
                break;
            case 'booking':
                navigate('/bookings');
                break;
            case 'connection':
                if (notification.senderId) navigate(`/profile/${notification.senderId}`);
                break;
            default:
                break;
        }
    };

    const handleConnectionAction = (e: React.MouseEvent, id: number, action: 'accept' | 'decline') => {
        e.stopPropagation();         
        setNotifications(prev =>
            prev.map(n => 
                n.id === id 
                    ? { ...n, isUnread: false, connectionStatus: action === 'accept' ? 'accepted' : 'declined' } 
                    : n
            )
        );
    };

    return (
        <div className="notifications-container">
            <div className='notifications-box'>
                <h2 className='notif-title'>My <span className='notif-title-notfications'>Notifications</span></h2>

                <div className='notifications-list'>
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`notification-item ${notif.isUnread ? 'unread' : ''}`}
                                onClick={() => handleNotificationClick(notif)}
                            >
                                <div className={`notif-icon ${notif.type}`}>
                                    {notif.type === 'message' && '💬'}
                                    {notif.type === 'review' && '⭐'}
                                    {notif.type === 'comment' && '📢'}
                                    {notif.type === 'like' && '❤️'}
                                    {notif.type === 'application' && '📄'}
                                    {notif.type === 'booking' && '📅'}                    
                                    {notif.type === 'connection' && '🤝'}
                                </div>

                                <div className='notif-content'>
                                    <p className='notif-text'>{notif.text}</p>
                                    <span className='notif-time'>{notif.time}</span>

                                    {notif.type === 'connection' && (
                                        <div className='notif-actions'>
                                            {!notif.connectionStatus ? (
                                                <>
                                                    <button
                                                        className='notif-btn accept'
                                                        onClick={(e) => handleConnectionAction(e, notif.id, 'accept')} >
                                                        Accept
                                                    </button>
                                                    <button
                                                        className='notif-btn decline'
                                                        onClick={(e) => handleConnectionAction(e, notif.id, 'decline')} >
                                                        Decline
                                                    </button>
                                                </>
                                            ) : (
                                                <span className={`connection-status-text ${notif.connectionStatus}`}>
                                                    You {notif.connectionStatus} {notif.senderName}'s connection
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {notif.isUnread && <div className='unread-dot' />}
                            </div>
                        ))
                    ): (
                        <p className="no-notifications">All caught up! No new notifications.</p>
                    )}
                </div>
            </div>
        </div>
    );
}