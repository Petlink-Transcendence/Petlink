import { useState, type FormEvent } from 'react';
import type { Review } from './ReviewCard';
import './ReviewForm.css';

type ReviewFormProps = {
  onAddReview: (review: Review) => void;
};

const ratingOptions = [5, 4, 3, 2, 1];

export default function ReviewForm({ onAddReview }: ReviewFormProps) {
  const [reviewer, setReviewer] = useState('');
  const [reviewedUsername, setReviewedUsername] = useState('');
  const [service, setService] = useState('Cat sitting');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!reviewer.trim() || !reviewedUsername.trim() || !text.trim()) {
      return;
    }

    onAddReview({
      id: Date.now(),
      reviewer: reviewer.trim(),
      role: 'PetLink member',
      service,
      rating,
      text: text.trim(),
      time: 'Just now',
    });

    setReviewer('');
    setReviewedUsername('');
    setService('Cat sitting');
    setRating(5);
    setText('');
  };

  return (
    <form className="reviews-form" onSubmit={handleSubmit}>
      <div className="reviews-form-heading">
        <h2>Write a Review</h2>
        <p>Share feedback after a completed pet care service.</p>
      </div>

      <label className="reviews-field">
        <span className="required-label">Name</span>
        <input
          type="text"
          value={reviewer}
          onChange={event => setReviewer(event.target.value)}
          placeholder="Your name"
          required
        />
      </label>

      <label className="reviews-field">
        <span className="required-label">Reviewed username</span>
        <input
          type="text"
          value={reviewedUsername}
          onChange={event => setReviewedUsername(event.target.value)}
          placeholder="@username"
          required
        />
      </label>

      <div className="reviews-form-row">
        <label className="reviews-field">
          <span className="required-label">Service</span>
          <select value={service} onChange={event => setService(event.target.value)} required>
            <option>Cat sitting</option>
            <option>Dog walking</option>
            <option>Home visits</option>
            <option>Overnight stay</option>
          </select>
        </label>

        <label className="reviews-field">
          <span className="required-label">Rating</span>
          <select value={rating} onChange={event => setRating(Number(event.target.value))} required>
            {ratingOptions.map(option => (
              <option key={option} value={option}>
                {option} stars
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="reviews-field">
        <span className="required-label">Review</span>
        <textarea
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder="What made the experience good?"
          rows={4}
          required
        />
      </label>

      <button className="reviews-submit" type="submit">
        Publish Review
      </button>
    </form>
  );
}
