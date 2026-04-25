import './Home.css'
import ProfileCard from '../components/homepage/ProfileCard'
import Post from '../components/homepage/Post'
import { useEffect } from 'react'

export default function Home() {

  useEffect(() => {
        document.title = "Home | PetLink";
    }, []);

  return (
    <div className="home-container">
      <ProfileCard />
      <Post />
    </div>
  )
}
