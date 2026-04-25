import './Home.css'
import { useEffect } from 'react'

export default function Home() {

  useEffect(() => {
        document.title = "Home | PetLink";
    }, []);

  return (
    <>
      <div className="profile-card-container">
        <div className="profile-card">
          <img className="profile-pic" alt="profile picture" src="https://4kwallpapers.com/images/wallpapers/cat-kitten-pet-domestic-animals-cute-cat-portrait-fur-baby-1280x1280-3528.jpg"></img>
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
    </>
  )
}
