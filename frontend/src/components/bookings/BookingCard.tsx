import { useState } from 'react';
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
  chatContactId?: number;
};

type BookingCardProps = {
  booking: Booking;
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

export default function BookingCard({ booking }: BookingCardProps) {
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  return (
    <>
      <article className="bookings-card">
        <header className="bookings-card-header">
          <div className="bookings-avatar">{initials(booking.personName)}</div>
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
    </>
  );
}
