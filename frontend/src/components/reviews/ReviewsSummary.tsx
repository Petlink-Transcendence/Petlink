import './ReviewsSummary.css';

type ReviewsSummaryProps = {
  averageRating: string;
  totalReviews: number;
  fiveStarReviews: number;
};

export default function ReviewsSummary({
  averageRating,
  totalReviews,
  fiveStarReviews,
}: ReviewsSummaryProps) {
  return (
    <section className="reviews-summary" aria-label="Reviews summary">
      <div className="reviews-summary-card featured">
        <span className="reviews-summary-value">{averageRating}</span>
        <span className="reviews-summary-label">Average Rating</span>
      </div>
      <div className="reviews-summary-card">
        <span className="reviews-summary-value">{totalReviews}</span>
        <span className="reviews-summary-label">Total Reviews</span>
      </div>
      <div className="reviews-summary-card">
        <span className="reviews-summary-value">{fiveStarReviews}</span>
        <span className="reviews-summary-label">5-Star Reviews</span>
      </div>
    </section>
  );
}
