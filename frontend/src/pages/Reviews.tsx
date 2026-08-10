import { useEffect, useState } from 'react';
import ReviewsContent from '../components/reviews/ReviewsContent';
import type { Review } from '../components/reviews/ReviewCard';
import { initialReviews } from '../components/reviews/reviewData';
import './Reviews.css';

type CurrentUserResponse = {
  id: number;
};

type BackendReview = {
  id: number;
  reviewer: number;
  reviewer_name?: string | null;
  reviewer_username?: string | null;
  reviewer_user_type?: string | null;
  reviewer_avatar?: string | null;
  rating: number;
  comment?: string | null;
  created_at: string;
};

const DEV_BACKEND_PORT = '8080';

function resolveMediaUrl(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const url = value.trim();

  if (!url) {
    return undefined;
  }

  if (/^(https?:|data:|blob:)/i.test(url)) {
    return url;
  }

  if (url.startsWith('/media/') || url.startsWith('/static/')) {
    const origin = window.location.port === '5173'
      ? `${window.location.protocol}//${window.location.hostname}:${DEV_BACKEND_PORT}`
      : window.location.origin;

    return `${origin}${url}`;
  }

  return url;
}

function formatReviewTime(createdAt: string): string {
  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(createdDate);
}

function mapBackendReview(review: BackendReview): Review {
  const reviewerName = review.reviewer_name?.trim()
    || review.reviewer_username?.trim()
    || `Reviewer #${review.reviewer}`;

  return {
    id: review.id,
    reviewerId: review.reviewer,
    reviewerUserType: review.reviewer_user_type || undefined,
    reviewer: reviewerName,
    avatarUrl: resolveMediaUrl(review.reviewer_avatar),
    role: 'PetLink member',
    service: 'Pet care service',
    rating: review.rating,
    text: review.comment?.trim() || 'No written comment provided.',
    time: formatReviewTime(review.created_at),
  };
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [statusMessage, setStatusMessage] = useState('Loading reviews...');

  useEffect(() => {
    document.title = 'Reviews | PetLink';
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access') || localStorage.getItem('access_token');

    async function loadReviews() {
      try {
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const userResponse = await fetch('/auth/me/', { headers });

        if (!userResponse.ok) {
          throw new Error('Unable to load current user.');
        }

        const user = await userResponse.json() as CurrentUserResponse;
        const reviewsResponse = await fetch(`/api/users/${user.id}/reviews/`, { headers });

        if (!reviewsResponse.ok) {
          throw new Error('Unable to load reviews.');
        }

        const data = await reviewsResponse.json() as BackendReview[];
        setReviews(data.map(mapBackendReview));
        setStatusMessage(data.length === 0 ? 'No reviews yet.' : '');
      } catch (error) {
        console.error('Failed to load backend reviews:', error);
        setReviews(initialReviews);
        setStatusMessage('');
      }
    }

    loadReviews();
  }, []);

  return (
    <div className="reviews-page">
      <ReviewsContent
        title={<>My <span>Reviews</span></>}
        initialReviews={reviews}
        showReviewForm={false}
        statusMessage={statusMessage}
      />
    </div>
  );
}
