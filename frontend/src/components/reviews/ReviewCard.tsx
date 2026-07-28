import { useState } from 'react';
import './ReviewCard.css';

export type Review = {
  id: number;
  reviewer: string;
  avatarUrl?: string;
  role: string;
  service: string;
  rating: number;
  text: string;
  time: string;
};

type ReviewCardProps = {
  review: Review;
};

function initials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function ratingStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < rating ? 'reviews-star filled' : 'reviews-star'}>
      {index < rating ? '★' : '☆'}
    </span>
  ));
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const showAvatarImage = Boolean(review.avatarUrl) && !avatarFailed;

  return (
    <article className="reviews-card">
      <header className="reviews-card-header">
        <div className="reviews-avatar">
          {showAvatarImage ? (
            <img src={review.avatarUrl} alt="" onError={() => setAvatarFailed(true)} />
          ) : (
            initials(review.reviewer)
          )}
        </div>
        <div className="reviews-person">
          <h3>{review.reviewer}</h3>
          <p>{review.role}</p>
        </div>
        <span className="reviews-time">{review.time}</span>
      </header>

      <div className="reviews-card-meta">
        <div className="reviews-rating" aria-label={`${review.rating} out of 5 stars`}>
          {ratingStars(review.rating)}
        </div>
        <span className="reviews-service">{review.service}</span>
      </div>

      <p className="reviews-text">{review.text}</p>
    </article>
  );
}
