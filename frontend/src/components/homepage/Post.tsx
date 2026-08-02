import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Post.css'
import '../Comments.css'

type BackendComment = {
  id: number;
  user_id: number;
  text: string;
  created_at: string;
};

type AuthorInfo = {
  name: string;
  avatar: string | null;
  user_type: string;
};

type PostProps = {
  postId: number;
  userId: number;
  purpose: string;
  text?: string | null;
  tags?: string[] | null;
  petType?: string | null;
  petSize?: string | null;
  image?: string | null;
  createdAt: string;
  likeCount: number;
  onDeleted?: () => void;
};

const PURPOSE_LABELS: Record<string, string> = {
  sitting: 'NEED SITTER',
  playdate: 'PLAYDATE',
  advice: 'ADVICE',
  social: 'SOCIAL',
  showcase: 'SOCIAL',
  adoption: 'ADOPTION',
  lost: 'LOST PET',
  found: 'FOUND PET',
  service_promo: 'SITTER',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Post({ postId, userId, purpose, text, tags, petType, petSize, image, createdAt, likeCount, onDeleted }: PostProps) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const [author, setAuthor] = useState<AuthorInfo | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: number; role: string } | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<BackendComment[]>([]);
  const [commentAuthors, setCommentAuthors] = useState<Record<number, AuthorInfo>>({});
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) return;
    fetch('/auth/me/', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(u => { if (u) setCurrentUser({ id: u.id, role: u.role }); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch(`/api/users/${userId}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : null)
      .then(u => { if (u) setAuthor({ name: u.name, avatar: u.avatar || null, user_type: u.user_type }); })
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    fetch(`/posts/${postId}/comments/`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setComments(data))
      .catch(() => {});
  }, [postId]);

  useEffect(() => {
    const token = localStorage.getItem('access');
    const uniqueIds = [...new Set(comments.map(c => c.user_id))];
    uniqueIds.forEach(uid => {
      if (commentAuthors[uid]) return;
      fetch(`/api/users/${uid}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(r => r.ok ? r.json() : null)
        .then(u => {
          if (u) setCommentAuthors(prev => ({ ...prev, [uid]: { name: u.name, avatar: u.avatar, user_type: u.user_type } }));
        })
        .catch(() => {});
    });
  }, [comments]);

  const authorName = author?.name || `User ${userId}`;
  const profilePath = author?.user_type === 'provider' ? `/sitterprofile/${userId}` : `/ownerprofile/${userId}`;
  const tag = PURPOSE_LABELS[purpose] || purpose.toUpperCase();
  const displayTags = Array.isArray(tags) ? tags : [];

  const handleLike = async () => {
    const token = localStorage.getItem('access');
    try {
      await fetch(`/posts/${postId}/like/`, {
        method: liked ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setLiked(!liked);
      setLikes(prev => liked ? prev - 1 : prev + 1);
    } catch {}
  };

  const handleAddComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const token = localStorage.getItem('access');
    try {
      const res = await fetch(`/posts/${postId}/comments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: newCommentText.trim() }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments(prev => [comment, ...prev]);
        setNewCommentText('');
      }
    } catch {}
  };

  const handleDeleteComment = async (commentId: number) => {
    const token = localStorage.getItem('access');
    try {
      const res = await fetch(`/posts/${postId}/comments/${commentId}/delete/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setComments(prev => prev.filter(c => c.id !== commentId));
    } catch {}
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem('access');
    try {
      await fetch(`/posts/${postId}/delete/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted?.();
    } catch {}
  };

  const canDeleteComment = (c: BackendComment) =>
    currentUser?.role === 'admin' || currentUser?.id === c.user_id;

  const canDeletePost = currentUser?.role === 'admin' || currentUser?.id === userId;

  return (
    <div className="post-container">
      <div className="post-author">
        <Link to={profilePath} className="post-avatar-link" aria-label={`Open profile`}>
          {author?.avatar ? (
            <img src={author.avatar} alt={authorName} />
          ) : (
            <div className="post-avatar-fallback">{getInitials(authorName)}</div>
          )}
        </Link>
        <div className="post-author-info">
          <p className="post-name">{authorName}</p>
          <div className="author-tags-container">
            <p className="post-tags">{tag}</p>
            {petType && <p className="post-location">{petType}</p>}
            <p className="post-time">{timeAgo(createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="post-content">
        {text && <p className="post-text">{text}</p>}
        {image && <img src={image} alt="Post" className="post-image" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '8px' }} />}
        <div className="post-tags-container">
          {displayTags.map((t, i) => (
            <p key={i} className="post-tags">{t}</p>
          ))}
          {petSize && <p className="post-tags">{petSize}</p>}
        </div>
      </div>

      <div className="post-separator" />

      <div className="post-buttons">
        <button className={`btn like ${liked ? 'liked' : ''}`} onClick={handleLike}>
          ❤️ {likes}
        </button>
        <button
          className={`btn comment ${showComments ? 'active' : ''}`}
          onClick={() => setShowComments(!showComments)}>
          📢 Comment
        </button>
        <button
          className="btn message"
          onClick={() => navigate('/chat', { state: { contact: { id: userId, name: authorName } } })}>
          💬 Message
        </button>
        {canDeletePost && (
          <button className="admin admin-btn-remove" title="Remove post" onClick={handleDeletePost}>🗑️</button>
        )}
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
            {comments.length > 0 ? comments.map(c => {
              const ca = commentAuthors[c.user_id];
              const caName = ca?.name || `User ${c.user_id}`;
              return (
                <div key={c.id} className="comment-row-item">
                  <div className="comment-row-avatar-fallback">{getInitials(caName)}</div>
                  <div className="comment-row-content">
                    <div className="comment-row-header">
                      <span className="comment-row-author">{caName}</span>
                      <span className="comment-row-time">{timeAgo(c.created_at)}</span>
                    </div>
                    <p className="comment-row-text">{c.text}</p>
                  </div>
                  {canDeleteComment(c) && (
                    <button
                      type="button"
                      className="admin-btn-remove comment-delete-btn"
                      title="Remove comment"
                      onClick={() => handleDeleteComment(c.id)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              );
            }) : (
              <p className="no-comments-placeholder">No comments yet. Write one above!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
