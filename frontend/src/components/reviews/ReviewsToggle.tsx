import { Link } from 'react-router-dom';
import './ReviewsToggle.css';

type ReviewsToggleProps = {
  active: 'mine' | 'person';
  personName?: string;
  personPath?: string;
};

export default function ReviewsToggle({
  active,
  personName = 'Xxxx',
  personPath = '/reviews/xxxx',
}: ReviewsToggleProps) {
  return (
    <div className="reviews-toggle">
      <Link
        to="/reviews"
        className={`reviews-toggle-btn ${active === 'mine' ? 'active' : ''}`}
      >
        My Reviews
      </Link>
      <Link
        to={personPath}
        className={`reviews-toggle-btn ${active === 'person' ? 'active' : ''}`}
      >
        {personName}’s Reviews
      </Link>
    </div>
  );
}
