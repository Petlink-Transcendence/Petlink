import { useState } from 'react'
import './Post.css'

type PostProps = {
  name: string;
  tag: string;
  text: string;
  location: string;
  time: string;
  tags?: string[];
  likeCount?: number;
};

export default function Post({ name, tag, text, location, time, tags, likeCount = 0 }: PostProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const [imgError, setImgError] = useState(false);

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  return (
    <div className="post-container">
      <div className="post-author">
        {imgError ? (
          <div className="post-avatar-fallback">{initials}</div>
        ) : (
          <img
            src="/profile-pic.png"
            alt="profile picture"
            onError={() => setImgError(true)}
          />
        )}

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
        <button className="btn comment">💬 Comment</button>
        <button className="btn apply">🐾 Apply</button>
        <button className="btn-remove" title="Remove post">🗑️</button>
      </div>
    </div>
  );
}
