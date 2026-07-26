import { useState } from 'react';
import './ProfileContent.css';
import '../Comments.css';
import CreatePost from '../homepage/CreatePostContainer.tsx';

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
  showCreatePost?: boolean;
};

type CommentItem = {
  id: number;
  author: string;
  text: string;
  time: string;
};

function ProfilePostCard({ p, authorInitials, authorName }: { p: Post, authorInitials: string, authorName: string }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(p.likes);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([
    { id: 1, author: "Daniela Padilha", text: "Great update! Thanks for sharing.", time: "2h ago" }
  ]);

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: Date.now(),
      author: "Jane Doe",
      text: newCommentText.trim(),
      time: "Just now"
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  const getCommentInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="profile-post-card">
      <div className="post-header">
        <div className="post-author-avatar">{authorInitials}</div>
        <div className="post-header-author-info">
          <span className="post-author-name">{authorName}</span>
        </div>
      </div>
      
      <p className="profile-post-text">{p.text}</p>
      
      <div className="profile-post-time-wrapper">
        <span className="post-time">{p.time}</span>
      </div>
      
      <div className="profile-post-footer">
        <div className="profile-post-actions-group">
          <button className={`btn like ${liked ? 'liked' : ''}`} onClick={handleLike}>
            ❤️ {likes}
          </button>
          <button 
            className={`btn comment ${showComments ? 'active' : ''}`} 
            onClick={() => setShowComments(!showComments)}
          >
            📢 Comment
          </button>
          <button className="admin admin-btn-remove" title="Remove post">🗑️</button>
        </div>
      </div>

      {showComments && (
        <div className="comments-section-dropdown">
          <div className="comments-section-separator" />
          
          <form className="comment-input-form" onSubmit={handleAddComment}>
            <input 
              type="text" 
              placeholder="Write a comment..." 
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="comment-text-field"
            />
            <button type="submit" className="comment-post-btn">Send</button>
          </form>

          <div className="comments-scroll-container">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id} className="comment-row-item">
                  <div className="comment-row-avatar-fallback">
                    {getCommentInitials(c.author)}
                  </div>
                  <div className="comment-row-content">
                    <div className="comment-row-header">
                      <span className="comment-row-author">{c.author}</span>
                      <span className="comment-row-time">{c.time}</span>
                    </div>
                    <p className="comment-row-text">{c.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-comments-placeholder">No comments yet. Write one above!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfileContent({ posts, reviews, authorName, authorInitials, showCreatePost = true }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'reviews'>('posts');
  const profileReviews = reviews;

  function reviewerInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  return (
    <div className="profile-right">
      {showCreatePost && <CreatePost />}
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
            <ProfilePostCard 
              key={p.id} 
              p={p} 
              authorInitials={authorInitials} 
              authorName={authorName} 
            />
          ))}
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
