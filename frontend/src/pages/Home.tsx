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

        <Post
        name="Jane Doe"
        tag="NEED SITTER"
        text="Looking for a sitter for my cat Luna next week!"
        location="Porto, PT"
        time="2h ago"
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
        text="Dog needs walking every morning."
        location="Lisbon, PT"
        time="5h ago"
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
        tags={[
          "20€-25€/day",
          "Dog experience",
          ]}
        />
      </div>
    </div>
  )
}
