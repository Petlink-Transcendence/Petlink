import { useState } from 'react';
import './ProfileContent.css';

type Post = {
  id: number;
  text: string;
  time: string;
  likes: number;
};

type ProfileContentProps = {
  posts: Post[];
};

export default function ProfileContent({ posts }: ProfileContentProps) {
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
        <div className="tab-content" />
      )}
    </div>
  );
}
