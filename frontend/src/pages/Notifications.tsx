import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

interface Notification {
    id: number;
    type: 'message' | 'review' | 'comment' | 'like' | 'application' | 'booking' | 'connection';
    text: string;
    senderId: number;
    time: string;
    isUnread: boolean;
}

export default function Notifications() {
    useEffect(() => {
        document.title = 'Notifications | Petlink';
    }, []);

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, type: 'message', text: 'Daniela sent you a message: "I will be there at 2pm..."', senderId: 1, time: '2m ago', isUnread: true },
        { id: 2, type: 'booking', text: 'Filipe requested a new dog walking booking for Jack.', senderId: 2, time: '1h ago', isUnread: true },
        { id: 3, type: 'review', text: 'Rodrigo left you a 5-star review: "Great cat sitter!"', senderId: 3, time: 'Yesterday', isUnread: false },
        { id: 4, type: 'connection', text: 'João wants to connect with you.', senderId: 4, time: '2 days ago', isUnread: false },
    ]);

    const handleNotificationClick = (notification: Notification) => {
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
        alert(`You ${action}ed the connection request.`);
        setNotifications(notifications.filter(n => n.id !== id));
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
                                            <button
                                                className='notif-btn accept'
                                                onClick={(e) => handleConnectionAction(e, notif.id, 'accept')}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className='notif-btn decline'
                                                onClick={(e) => handleConnectionAction(e, notif.id, 'decline')}
                                            >
                                                Decline
                                            </button>
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
