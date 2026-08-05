import { useEffect, useState } from 'react'
import './Home.css'
import ProfileCard from '../components/homepage/ProfileCard'
import Post from '../components/homepage/Post'
import CreatePost from '../components/homepage/CreatePostContainer'
import RightSidebar from '../components/homepage/RightSidebar'

type BackendPost = {
  id: number;
  user_id: number;
  purpose: string;
  text?: string | null;
  pet_type?: string | null;
  image?: string | null;
  like_count: number;
  user_liked: boolean;
  created_at: string;
};

export default function Home() {
  const [posts, setPosts] = useState<BackendPost[]>([]);

  const fetchPosts = async () => {
    const token = localStorage.getItem('access');
    try {
      const res = await fetch('/posts/', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setPosts(await res.json());
    } catch {}
  };

  useEffect(() => {
    document.title = 'Home | PetLink';
    fetchPosts();

    const handlePostsUpdate = () => {
      fetchPosts();
    };
    window.addEventListener('postsUpdated', handlePostsUpdate);
    return () => window.removeEventListener('postsUpdated', handlePostsUpdate);
  }, []);

  return (
    <div className="home-container">
      <div className="left-sidebar">
        <ProfileCard />
      </div>
      <div className="home-post-container">
        <CreatePost onPostCreated={fetchPosts} />
        {posts.map(p => (
          <Post
            key={p.id}
            postId={p.id}
            userId={p.user_id}
            purpose={p.purpose}
            text={p.text}
            petType={p.pet_type}
            image={p.image}
            createdAt={p.created_at}
            likeCount={p.like_count}
            userLiked={p.user_liked}
            onDeleted={fetchPosts}
          />
        ))}
      </div>
      <RightSidebar />
    </div>
  );
}
