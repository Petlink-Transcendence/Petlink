import { useEffect, useMemo, useState } from 'react';
import './Reviews.css';
import ReviewCard, { type Review } from '../components/reviews/ReviewCard';

type RatingFilter = 'all' | '5' | '4' | '3';

const initialReviews: Review[] = [
  {
    id: 1,
    reviewer: 'Rodrigo Silva',
    role: 'Cat owner',
    service: 'Cat sitting',
    rating: 5,
    text: 'Ana took excellent care of Luna and sent updates every evening. I felt completely comfortable while I was away.',
    time: '6 hours ago',
  },
  {
    id: 2,
    reviewer: 'Jane Doe',
    role: 'Pet owner',
    service: 'Dog walking',
    rating: 5,
    text: 'Very reliable and kind with Buddy. The walks were always on time and the communication was clear.',
    time: '2 weeks ago',
  },
  {
    id: 3,
    reviewer: 'Miguel Ramos',
    role: 'Dog owner',
    service: 'Home visits',
    rating: 4,
    text: 'Great experience overall. The visit notes were helpful and my dog was relaxed when I got home.',
    time: '1 month ago',
  },
  {
    id: 4,
    reviewer: 'Sofia Martins',
    role: 'Rabbit owner',
    service: 'Overnight stay',
    rating: 5,
    text: 'Careful, patient, and professional. I would book again for longer trips.',
    time: '2 months ago',
  },
];

const filterOptions: { label: string; value: RatingFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '5 Stars', value: '5' },
  { label: '4 Stars', value: '4' },
  { label: '3+ Stars', value: '3' },
];

export default function Reviews() {
  const [reviews] = useState(initialReviews);
  const [activeFilter, setActiveFilter] = useState<RatingFilter>('all');

  useEffect(() => {
    document.title = 'Reviews | PetLink';
  }, []);

  const filteredReviews = useMemo(() => {
    if (activeFilter === 'all') {
      return reviews;
    }

    const rating = Number(activeFilter);
    return activeFilter === '3'
      ? reviews.filter(review => review.rating >= rating)
      : reviews.filter(review => review.rating === rating);
  }, [activeFilter, reviews]);

  return (
    <div className="reviews-page">
      <main className="reviews-shell">
        <section className="reviews-hero">
          <div>
            <h2>My <span>Reviews</span></h2>
          </div>
        </section>

        <div className="reviews-layout">
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
              {filteredReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}