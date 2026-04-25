import { Link } from 'react-router-dom';
import './Post.css'

/*needs to recieve profile id, location, time of post*/
export default function Post() {
  return (
    <div className="post-container">
      <div className="post-author">
        <img src="/profile-pic.png" alt="profile picture" />

        <div className="post-author-info">
        <p className="post-name">Jane Doe</p>

          <div className="author-tags-container">
            <p className="post-tags">NEED SITTER</p>
            <p className="post-location">Porto, PT</p>
            <p className="post-time">2h ago</p>
          </div>
        </div>
      </div>

      <div className="post-content">
        <p className="post-text">
          Looking for a sitter for my cat Luna next week!
          She loves attention and is very playful.
          Is a picky eater.
        </p>

        <div className="post-tags-container">
          <p className="post-tags">May 1-5</p>
          <p className="post-tags">15€-20€/day</p>
          <p className="post-tags">Luna | Bengal Cat | 2yr</p>
          <p className="post-tags">Cat experience required</p>
        </div>
      </div>

      <div className="post-buttons">
        <button className="btn like">❤️ Like</button>
        <button className="btn comment">💬 Comment</button>
        <button className="btn share">🔗 Share</button>
        <button className="btn apply">🐾 Apply</button>
      </div>
    </div>
  );
}