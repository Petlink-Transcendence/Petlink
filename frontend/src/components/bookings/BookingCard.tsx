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
  return (
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
        <button type="button">Message</button>
        <button type="button" className="secondary">View Details</button>
      </div>
    </article>
  );
}
