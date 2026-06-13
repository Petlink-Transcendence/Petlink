import { useEffect } from 'react';
import ReviewsContent from '../components/reviews/ReviewsContent';
import { initialReviews } from '../components/reviews/reviewData';
import './Reviews.css';

export default function Reviews() {
  useEffect(() => {
    document.title = 'Reviews | PetLink';
  }, []);

  return (
    <div className="reviews-page">
      <ReviewsContent
        title={<>My <span>Reviews</span></>}
        initialReviews={initialReviews}
        showReviewForm={false}
      />
    </div>
  );
}
