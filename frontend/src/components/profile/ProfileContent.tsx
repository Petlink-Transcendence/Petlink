import { useEffect, useState } from 'react';
import './ProfileContent.css';
<<<<<<< HEAD
import '../Comments.css';
import CreatePost from '../homepage/CreatePostContainer';
import Post from '../homepage/Post';

export type BackendPost = {
=======
import CreatePost from '../homepage/CreatePostContainer.tsx';
import Post from '../homepage/Post.tsx';

type BackendPost = {
>>>>>>> origin/fullstack
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

type BackendReview = {
  id: number;
  reviewer: number;
  reviewer_name?: string;
  rating: number;
  comment?: string | null;
  created_at: string;
};

type ProfileContentProps = {
<<<<<<< HEAD
  posts: BackendPost[];
  reviews: Review[];
=======
  profileUserId: number;
>>>>>>> origin/fullstack
  authorName: string;
  authorInitials: string;
  showCreatePost?: boolean;
  onPostCreated?: () => void;
  onPostDeleted?: () => void;
};

<<<<<<< HEAD
export default function ProfileContent({
  posts,
  reviews,
  authorName,
  authorInitials,
  showCreatePost = true,
  onPostCreated,
  onPostDeleted,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'reviews'>('posts');
  const profileReviews = reviews;
=======
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function reviewerInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
>>>>>>> origin/fullstack

export default function ProfileContent({ profileUserId, authorName, authorInitials, showCreatePost = true }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'reviews'>('posts');
  const [posts, setPosts] = useState<BackendPost[]>([]);
  const [reviews, setReviews] = useState<BackendReview[]>([]);

  const fetchPosts = async () => {
    const token = localStorage.getItem('access');
    try {
      const res = await fetch(`/posts/?user_id=${profileUserId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setPosts(await res.json());
    } catch {}
  };

  const fetchReviews = async () => {
    const token = localStorage.getItem('access');
    try {
      const res = await fetch(`/api/users/${profileUserId}/reviews/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setReviews(await res.json());
    } catch {}
  };

  useEffect(() => {
    fetchPosts();
    fetchReviews();
  }, [profileUserId]);

  return (
    <div className="profile-right">
<<<<<<< HEAD
      {showCreatePost && <CreatePost onPostCreated={onPostCreated} />}
=======
      {showCreatePost && <CreatePost onPostCreated={fetchPosts} />}
>>>>>>> origin/fullstack
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      {activeTab === 'posts' && (
        <div className="tab-content">
<<<<<<< HEAD
          {posts.length > 0 ? (
            posts.map(p => (
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
                onDeleted={onPostDeleted}
              />
            ))
          ) : (
            <p style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
              No posts yet.
            </p>
          )}
=======
          {posts.length === 0 ? (
            <p className="no-comments-placeholder">No posts yet.</p>
          ) : posts.map(p => (
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
>>>>>>> origin/fullstack
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="tab-content">
          {reviews.length === 0 ? (
            <p className="no-comments-placeholder">No reviews yet.</p>
          ) : reviews.map(r => (
            <div key={r.id} className="profile-review-card">
              <div className="profile-review-header">
                <div className="profile-review-avatar">
                  {reviewerInitials(r.reviewer_name || `User ${r.reviewer}`)}
                </div>
                <div className="profile-review-author-info">
                  <span className="profile-review-author">{r.reviewer_name || `User ${r.reviewer}`}</span>
                  <span className="profile-review-stars">{'⭐'.repeat(r.rating)}</span>
                </div>
                <span className="profile-review-time">{timeAgo(r.created_at)}</span>
              </div>
              <p className="profile-review-text">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
