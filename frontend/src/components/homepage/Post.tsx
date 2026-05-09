import './Post.css'

const tags = [
  {
    name: "Jane Doe",
    text: "Looking for a sitter...",
    location: "Porto, PT",
    time: "2h ago",
  },
];

type PostProps = {
  name: string;
  tag: string;
  text: string;
  location: string;
  time: string;
  tags?: string[];
};

export default function Post({ name, tag, text, location, time, tags }: PostProps) {
  return (
    <div className="post-container">
      <div className="post-author">
        <img src="/profile-pic.png" alt="profile picture" />

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

      <div className="post-buttons">
        <button className="btn like">❤️ Like</button>
        <button className="btn comment">💬 Comment</button>
        <button className="btn apply">🐾 Apply</button>
      </div>
    </div>
  );
}