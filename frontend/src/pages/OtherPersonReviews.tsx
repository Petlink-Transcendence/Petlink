import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewsContent from '../components/reviews/ReviewsContent';
import ReviewsToggle from '../components/reviews/ReviewsToggle';
import { initialReviews } from '../components/reviews/reviewData';
import './Reviews.css';

const fallbackName = 'Xxxx';

function formatPersonName(personName?: string) {
  if (!personName) {
    return fallbackName;
  }

  const formattedName = personName
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(namePart => namePart.charAt(0).toUpperCase() + namePart.slice(1))
    .join(' ');

  return formattedName || fallbackName;
}

export default function OtherPersonReviews() {
  const { personName } = useParams<{ personName: string }>();
  const reviewedName = formatPersonName(personName);

  useEffect(() => {
    document.title = `${reviewedName}’s Reviews | PetLink`;
  }, [reviewedName]);

  return (
    <div className="reviews-page">
      <ReviewsToggle
        active="person"
        personName={reviewedName}
        personPath={`/reviews/${personName ?? 'xxxx'}`}
      />
      <ReviewsContent
        title={<>{reviewedName}’s <span>Reviews</span></>}
        initialReviews={initialReviews}
      />
    </div>
  );
}
