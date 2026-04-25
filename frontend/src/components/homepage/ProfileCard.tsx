import { Link } from 'react-router-dom';
import './ProfileCard.css'

export default function ProfileCard() {
	return (
		<div className="profile-card-container">
        <div className="profile-card">
          <img className="profile-pic" src="../public/profile-pic.png" alt="profile picture"></img>
          <h4 className="name">Jane Doe</h4>
          <p className="username">@janedoe123</p>
          <p className="bio">Dog and cat mom. Always looking for the best care for my fur babies</p>
          <hr className="divider" />
          <div className="stats">
            <div className="stats-nbrs">
              <p className="nbr">21</p>
              <p>Posts</p>
            </div>
            <div className="stats-nbrs">
              <p className="nbr">42</p>
              <p>Followers</p>
            </div>
            <div className="stats-nbrs">
              <p className="nbr">100</p>
              <p>Following</p>
            </div>
  
        </div>
        </div>
      </div>
	);
}