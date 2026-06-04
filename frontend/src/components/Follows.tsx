import './Follows.css'

interface  FollowsProps{
    onClose: () => void;
}

export default function FollowsContainer ({ onClose }: FollowsProps) {
    return (
        <div className='follows-overlay' onClick={onClose}>
            <div className='follows-container' onClick={(e) => e.stopPropagation()}>
                <div className='follows-header'>
                    <h2>My Followers</h2>
                    <button type="button" className='close-btn' onClick={onClose}>&times;</button>
                </div>
            </div>
        </div>
    );
}
