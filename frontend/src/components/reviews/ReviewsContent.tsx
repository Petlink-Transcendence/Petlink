import { useEffect, useMemo, useState, type ReactNode } from 'react';
import ReviewCard, { type Review } from './ReviewCard';
import ReviewForm from './ReviewForm';
import ReviewsSummary from './ReviewsSummary';

type RatingFilter = 'all' | '5' | '4' | '3';

type ReviewsContentProps = {
  title: ReactNode;
  initialReviews: Review[];
  showReviewForm?: boolean;
  statusMessage?: string;
};

const filterOptions: { label: string; value: RatingFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '5 Stars', value: '5' },
  { label: '4 Stars', value: '4' },
  { label: '3+ Stars', value: '3' },
];

export default function ReviewsContent({
  title,
  initialReviews,
  showReviewForm = true,
  statusMessage,
}: ReviewsContentProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [activeFilter, setActiveFilter] = useState<RatingFilter>('all');

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const filteredReviews = useMemo(() => {
    if (activeFilter === 'all') {
      return reviews;
    }

    const rating = Number(activeFilter);
    return activeFilter === '3'
      ? reviews.filter(review => review.rating >= rating)
      : reviews.filter(review => review.rating === rating);
  }, [activeFilter, reviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return '0.0';
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const fiveStarReviews = reviews.filter(review => review.rating === 5).length;

  return (
    <main className="reviews-shell">
      <section className="reviews-hero">
        <div>
          <h2>{title}</h2>
        </div>
      </section>

      <ReviewsSummary
        averageRating={averageRating}
        totalReviews={reviews.length}
        fiveStarReviews={fiveStarReviews}
      />

      <div className={`reviews-layout ${showReviewForm ? '' : 'reviews-layout-full'}`}>
        <section className="reviews-list-panel">
          <div className="reviews-list-header">
            <div>
              <h2>Recent Reviews</h2>
              <p>{filteredReviews.length} matching reviews</p>
            </div>

            <div className="reviews-filters" aria-label="Filter reviews by rating">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={activeFilter === option.value ? 'active' : ''}
                  onClick={() => setActiveFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="reviews-list">
            {statusMessage ? (
              <p className="reviews-status">{statusMessage}</p>
            ) : (
              filteredReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        </section>

        {showReviewForm && (
          <aside className="reviews-side-panel">
            <ReviewForm onAddReview={review => setReviews(currentReviews => [review, ...currentReviews])} />
          </aside>
        )}
      </div>
    </main>
  );
}
