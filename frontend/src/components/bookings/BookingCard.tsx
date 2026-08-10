import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingCard.css';

export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export type Booking = {
  id: number;
  personName: string;
  personRole: string;
  petName: string;
  petType: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: BookingStatus;
  price: string;
  note: string;
  layout: 'owner' | 'sitter';
  avatar?: string;
  chatContactId?: number;
};

type BookingCardProps = {
  booking: Booking;
  onAction: (id: number, action: 'confirm' | 'cancel' | 'complete') => void;
};

const statusLabels: Record<BookingStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
};


function initials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}


export default function BookingCard({ booking, onAction }: BookingCardProps) {
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const canWriteReview = booking.status === 'completed' && !hasSubmittedReview;

  const handleMessageClick = () => {
    navigate('/chat', {
      state: {
        contact: {
          id: booking.chatContactId,
          name: booking.personName,
          role: booking.personRole,
        },
      },
    });
  };

  const resetReviewForm = () => {
    setReviewRating(5);
    setReviewText('');
  };

  const closeReviewModal = () => {
    setIsReviewOpen(false);
    resetReviewForm();
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reviewText.trim()) return;

    const token = localStorage.getItem('access');
    try {
      const res = await fetch(`/api/users/${booking.chatContactId}/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewText }),
      });
      if (res.ok) {
        setHasSubmittedReview(true);
        closeReviewModal();
      }
    } catch {}
  };

  return (
    <>
      <article className="bookings-card">
        <header className="bookings-card-header">
          {booking.avatar ? (
            <img src={booking.avatar.startsWith('http') ? booking.avatar : `http://localhost:8000${booking.avatar}`} alt="Avatar" className="bookings-avatar" />
          ) : (
            <div className="bookings-avatar">{initials(booking.personName)}</div>
          )}
          <div className="bookings-person">
            <h3>{booking.personName}</h3>
            <p>{booking.personRole}</p>
          </div>
          <span className={`bookings-status ${booking.status}`}>
            {statusLabels[booking.status]}
          </span>
        </header>

        <div className="bookings-card-meta">
          <span className="bookings-service">{booking.service}</span>
          <span className="bookings-price">{booking.price}</span>
        </div>

        <dl className="bookings-details">
          <div>
            <dt>Date</dt>
            <dd>{booking.date}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{booking.time}</dd>
          </div>
          <div>
            <dt>Pet</dt>
            <dd>{booking.petName} · {booking.petType}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{booking.location}</dd>
          </div>
        </dl>

        <p className="bookings-note">{booking.note}</p>

        <div className="bookings-actions" aria-label="Booking actions">
          <button type="button" onClick={handleMessageClick}>Message</button>
          <button type="button" className="secondary" onClick={() => setIsDetailsOpen(true)}>
            View Details
          </button>
          {canWriteReview && (
            <button type="button" onClick={() => setIsReviewOpen(true)}>
              Write a Review
            </button>
          )}
          {booking.layout === 'owner' && (booking.status === 'pending' || booking.status === 'confirmed') && (
            <button type="button" className="danger" onClick={() => onAction(booking.id, 'cancel')}>
              Cancel
            </button>
          )}
          {booking.layout === 'sitter' && booking.status === 'pending' && (
            <>
              <button type="button" onClick={() => onAction(booking.id, 'confirm')}>Accept</button>
              <button type="button" className="danger" onClick={() => onAction(booking.id, 'cancel')}>Reject</button>
            </>
          )}
          {booking.layout === 'sitter' && booking.status === 'confirmed' && (
            <>
              <button type="button" onClick={() => onAction(booking.id, 'complete')}>Mark as Complete</button>
              <button type="button" className="danger" onClick={() => onAction(booking.id, 'cancel')}>Cancel</button>
            </>
          )}
        </div>
      </article>

      {isDetailsOpen && (
        <div className="bookings-detail-overlay" onClick={() => setIsDetailsOpen(false)}>
          <section
            className="bookings-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`booking-detail-title-${booking.id}`}
            onClick={event => event.stopPropagation()}
          >
            <header className="bookings-detail-header">
              <div>
                <span className="bookings-detail-label">Booking Details</span>
                <div className="bookings-detail-title">
                  <h2 id={`booking-detail-title-${booking.id}`}>{booking.service}</h2>
                  <span className={`bookings-status ${booking.status}`}>
                    {statusLabels[booking.status]}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="bookings-detail-close"
                aria-label="Close booking details"
                onClick={() => setIsDetailsOpen(false)}
              >
                ×
              </button>
            </header>

            <dl className="bookings-detail-grid">
              <div>
                <dt>Person</dt>
                <dd>{booking.personName}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{booking.personRole}</dd>
              </div>
              <div>
                <dt>Pet</dt>
                <dd>{booking.petName} · {booking.petType}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{booking.date}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{booking.time}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{booking.location}</dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd>{booking.price}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{statusLabels[booking.status]}</dd>
              </div>
            </dl>

            <div className="bookings-detail-note">
              <h3>Notes</h3>
              <p>{booking.note}</p>
            </div>
          </section>
        </div>
      )}

      {isReviewOpen && (
        <div className="bookings-review-overlay" onClick={closeReviewModal}>
          <section
            className="bookings-review-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`booking-review-title-${booking.id}`}
            onClick={event => event.stopPropagation()}
          >
            <header className="bookings-review-header">
              <div>
                <span className="bookings-review-label">Booking Review</span>
                <h2 id={`booking-review-title-${booking.id}`}>Write a Review</h2>
                <p>Share feedback about {booking.personName} after {booking.service.toLowerCase()}.</p>
              </div>
              <button
                type="button"
                className="bookings-review-close"
                aria-label="Close review form"
                onClick={closeReviewModal}
              >
                ×
              </button>
            </header>

            <form className="bookings-review-form" onSubmit={handleReviewSubmit}>
              <label className="bookings-review-field">
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

              <label className="bookings-review-field">
                <span>Review</span>
                <textarea
                  value={reviewText}
                  onChange={event => setReviewText(event.target.value)}
                  placeholder="What made the experience good?"
                  rows={5}
                  required
                />
              </label>

              <div className="bookings-review-actions">
                <button type="button" className="secondary" onClick={closeReviewModal}>
                  Cancel
                </button>
                <button type="submit">
                  Publish Review
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
