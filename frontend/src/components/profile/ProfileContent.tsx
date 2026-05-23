import { useState } from 'react';
import './ProfileContent.css';

type Post = {
  id: number;
  text: string;
  time: string;
  likes: number;
};

type Review = {
  id: number;
  author: string;
  rating: number;
  text: string;
  time: string;
};

type ProfileContentProps = {
  posts: Post[];
  reviews: Review[];
  authorName: string;
  authorInitials: string;
};

function reviewerInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfileContent({ posts, reviews, authorName, authorInitials }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'reviews'>('posts');

  return (
    <div className="profile-right">
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
          {posts.map(p => (
            <div key={p.id} className="profile-post-card">
              <div className="post-header">
                <div className="post-author-avatar">{authorInitials}</div>
                <span className="post-author-name">{authorName}</span>
              </div>
              <p className="profile-post-text">{p.text}</p>
              <div className="profile-post-footer">
                <span className="post-time">{p.time}</span>
                <span className="post-likes">❤️ {p.likes}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="tab-content">
          {reviews.map(r => (
            <div key={r.id} className="profile-review-card">
              <div className="review-header">
                <div className="review-avatar">{reviewerInitials(r.author)}</div>
                <div className="review-author-info">
                  <span className="review-author">{r.author}</span>
                  <span className="review-stars">{'⭐'.repeat(r.rating)}</span>
                </div>
                <span className="review-time">{r.time}</span>
              </div>
              <p className="review-text">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
