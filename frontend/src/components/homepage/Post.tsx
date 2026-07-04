import { useState, type FormEvent } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import './Post.css'
import '../Comments.css'

type CommentItem = {
  id: number;
  author: string;
  text: string;
  time: string;
};

type PostProps = {
  authorId: string;
  authorType: 'owner' | 'sitter';
  name: string;
  tag: string;
  text: string;
  location: string;
  time: string;
  tags?: string[];
  likeCount?: number;
};

export default function Post({ authorId, authorType, name, tag, text, location, time, tags, likeCount = 0 }: PostProps) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const [imgError, setImgError] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([
    { id: 1, author: "Daniela Padilha", text: "I have extensive cat experience, feel free to send a DM!", time: "1h ago" },
    { id: 2, author: "Filipe Tootill", text: "Luna is beautiful! Hope you find an amazing sitter.", time: "45m ago" }
  ]);
  
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const profilePath = authorType === 'sitter' ? `/sitterprofile/${authorId}` : `/profile/${authorId}`;

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
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

  const getCommentInitials = (authorName: string) => {
    return authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

   const handleMessageClick = () => {
    const parsedAuthorId = Number(authorId);

    navigate('/chat', {
      state: {
        contact: {
          id: Number.isFinite(parsedAuthorId) ? parsedAuthorId : undefined,
          name,
          role: authorType,
        },
      },
    });
  };

  return (
    <div className="post-container">
      <div className="post-author">
        <Link
          to={profilePath}
          className="post-avatar-link"
          aria-label={`Open ${name}'s profile`}
        >
          {imgError ? (
            <div className="post-avatar-fallback">{initials}</div>
          ) : (
            <img
              src="/profile-pic.png"
              alt={`${name}'s profile`}
              onError={() => setImgError(true)}
            />
          )}
        </Link>

        <div className="post-author-info">
          <p className="post-name">{name}</p>

          <div className="author-tags-container">
            <p className="post-tags">{tag}</p>
            <p className="post-location">{location}</p>
            <p className="post-time">{time}</p>
          </div>
        </div>
      </div>

      <div className="post-content">
        <p className="post-text">{text}</p>

        <div className="post-tags-container">
          {tags?.map((tag, index) => (
            <p key={index} className="post-tags">
              {tag}
            </p>
          ))}
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
        <button className="btn apply" onClick={handleMessageClick}>
          💬 Message
        </button>
        <button className="btn-remove" title="Remove post">🗑️</button>
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