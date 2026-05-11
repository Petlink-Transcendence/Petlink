import './Home.css'
import ProfileCard from '../components/homepage/ProfileCard'
import Post from '../components/homepage/Post'
import CreatePost from '../components/homepage/CreatePost'
import RightSidebar from '../components/homepage/RightSidebar'
import { useEffect } from 'react'

export default function Home() {

  useEffect(() => {
        document.title = "Home | PetLink";
    }, []);

  return (
    <div className="home-container">
      <div className="left-sidebar">
        <ProfileCard />
      </div>
      <div className="home-post-container">
        <CreatePost />

        <Post
        name="Jane Doe"
        tag="NEED SITTER"
        text="Looking for a sitter for my cat Luna next week!"
        location="Porto, PT"
        time="2h ago"
        likeCount={14}
        tags={[
         "May 1-5",
          "15€-20€/day",
          "Luna | Bengal Cat | 2yr",
          "Cat experience required",
          ]}
        />
        <Post
        name="John Smith"
        tag="NEED WALKER"
        text="My dog needs walking every morning."
        location="Lisbon, PT"
        time="5h ago"
        likeCount={7}
        tags={[
         "May 1-5",
          "15€-20€/day",
          "Energy required",
          "Dog experience required",
          ]}
        />
        <Post
        name="Junior Silva"
        tag="SITTER"
        text="I'm a sitter with a lot of experience with dogs!"
        location="Rio de Janeiro, BR"
        time="11min ago"
        likeCount={3}
        tags={[
          "20€-25€/day",
          "Dog experience",
          ]}
        />
      </div>
      <RightSidebar />
    </div>
  )
}
