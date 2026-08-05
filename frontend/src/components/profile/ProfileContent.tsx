import { useState } from 'react';
import './ProfileContent.css';
import '../Comments.css';
import CreatePost from '../homepage/CreatePostContainer';
import Post from '../homepage/Post';

export type BackendPost = {
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

type Review = {
  id: number;
  author: string;
  rating: number;
  text: string;
  time: string;
};

type ProfileContentProps = {
  posts: BackendPost[];
  reviews: Review[];
  authorName: string;
  authorInitials: string;
  showCreatePost?: boolean;
  onPostCreated?: () => void;
  onPostDeleted?: () => void;
};

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

  function reviewerInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  return (
    <div className="profile-right">
      {showCreatePost && <CreatePost onPostCreated={onPostCreated} />}
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
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="tab-content">
          {profileReviews.map(r => (
            <div key={r.id} className="profile-review-card">
              <div className="profile-review-header">
                <div className="profile-review-avatar">{reviewerInitials(r.author)}</div>
                <div className="profile-review-author-info">
                  <span className="profile-review-author">{r.author}</span>
                  <span className="profile-review-stars">{'⭐'.repeat(r.rating)}</span>
                </div>
                <span className="profile-review-time">{r.time}</span>
              </div>
              <p className="profile-review-text">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
