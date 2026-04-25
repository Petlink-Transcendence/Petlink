import './Home.css'
import ProfileCard from '../components/homepage/ProfileCard'
import Post from '../components/homepage/Post'
import CreatePost from '../components/homepage/CreatePost'
import { useEffect } from 'react'

export default function Home() {

  useEffect(() => {
        document.title = "Home | PetLink";
    }, []);

  return (
    <div className="home-container">
      <ProfileCard />
      <div className="home-post-container">
        <CreatePost />

        <Post />
        <Post />
        <Post />
      </div>
    </div>
  )
}
