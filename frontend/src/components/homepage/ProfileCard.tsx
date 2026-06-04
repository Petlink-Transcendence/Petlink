import './ProfileCard.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import FollowsContainer from '../Follows.tsx'

export default function ProfileCard() {
  const [isFollowsOpen, setisFollowsOpen] = useState(false);
  const navigate = useNavigate();

	return (
		<div className="profile-card-container">
        <div className="profile-card">
          <img className="profile-pic" src="../public/profile-pic.png" alt="profile picture"></img>
          <h4 className="name">Jane Doe</h4>
          <p className="username">@janedoe123</p>
          <p className="bio">Dog and cat mom. Always looking for the best care for my fur babies</p>
          <hr className="divider" />
            <div className="stats">
              <div className='stats-group' onClick={() => navigate('/profile')}>
                <p className="nbr">21</p>
                <p className='stats-label'>Posts</p>
              </div>
              <div className='stats-group' onClick={() => setisFollowsOpen(true)}>
                <p className='nbr'>42</p>
                <p className='stats-label'>Followers</p>
              </div>              
              <div className='stats-group' onClick={() => setisFollowsOpen(true)}>
                <p className='nbr'>100</p>                  
                <p className='stats-label'>Following</p>
                </div>
              </div>
            </div>
      {isFollowsOpen && (
        <FollowsContainer onClose={() => setisFollowsOpen(false)} />
      )}
    </div>
	);
}