import { useState, type FormEvent } from 'react';
import './ProfileContent.css';
import CreatePost from '../homepage/CreatePostContainer.tsx'

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
  const [profileReviews, setProfileReviews] = useState(reviews);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const resetReviewForm = () => {
    setReviewerName('');
    setReviewRating(5);
    setReviewText('');
  };

  const closeReviewPopup = () => {
    setIsReviewPopupOpen(false);
    resetReviewForm();
  };

  const handleReviewSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedReviewerName = reviewerName.trim();
    const trimmedReviewText = reviewText.trim();

    if (!trimmedReviewerName || !trimmedReviewText) {
      return;
    }

    setProfileReviews(currentReviews => [
      {
        id: Date.now(),
        author: trimmedReviewerName,
        rating: reviewRating,
        text: trimmedReviewText,
        time: 'Just now',
      },
      ...currentReviews,
    ]);

    closeReviewPopup();
  };

  return (
    <div className="profile-right">
      <CreatePost></CreatePost>
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
          <div className="profile-reviews-toolbar">
            <div>
              <h3>Reviews</h3>
              <p>
                {profileReviews.length} {profileReviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
            <button
              type="button"
              className="profile-write-review-btn"
              onClick={() => setIsReviewPopupOpen(true)}
            >
              Write a Review
            </button>
          </div>

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

      {isReviewPopupOpen && (
        <div className="profile-review-popup-backdrop" onClick={closeReviewPopup}>
          <section
            className="profile-review-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-review-popup-title"
            onClick={event => event.stopPropagation()}
          >
            <header className="profile-review-popup-header">
              <div>
                <h2 id="profile-review-popup-title">Write a Review</h2>
                <p>Share feedback about your experience with {authorName}.</p>
              </div>
              <button
                type="button"
                className="profile-review-popup-close"
                aria-label="Close review popup"
                onClick={closeReviewPopup}
              >
                ×
              </button>
            </header>

            <form className="profile-review-popup-form" onSubmit={handleReviewSubmit}>
              <label className="profile-review-field">
                <span>Name</span>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={event => setReviewerName(event.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>

              <label className="profile-review-field">
                <span>Rating</span>
                <select
                  value={reviewRating}
                  onChange={event => setReviewRating(Number(event.target.value))}
                  required
                >
                  {[5, 4, 3, 2, 1].map(rating => (
                    <option key={rating} value={rating}>
                      {rating} stars
                    </option>
                  ))}
                </select>
              </label>

              <label className="profile-review-field">
                <span>Review</span>
                <textarea
                  value={reviewText}
                  onChange={event => setReviewText(event.target.value)}
                  placeholder="What made the experience good?"
                  rows={5}
                  required
                />
              </label>

              <div className="profile-review-popup-actions">
                <button type="button" className="profile-review-cancel-btn" onClick={closeReviewPopup}>
                  Cancel
                </button>
                <button type="submit" className="profile-review-submit-btn">
                  Publish Review
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
