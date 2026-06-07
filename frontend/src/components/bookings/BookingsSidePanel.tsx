import type { Booking } from './BookingCard';
import './BookingsSidePanel.css';

type BookingsSidePanelProps = {
  layout: 'owner' | 'sitter';
  nextBooking?: Booking;
  onNewBookingClick?: () => void;
};

export default function BookingsSidePanel({
  layout,
  nextBooking,
  onNewBookingClick,
}: BookingsSidePanelProps) {
  const isOwner = layout === 'owner';

  return (
    <aside className="bookings-side-card">
      <div className="bookings-side-heading">
        <h2>{isOwner ? 'Booking Overview' : 'Sitter Schedule'}</h2>
        <p>
          {isOwner
            ? 'Keep track of care you have booked for your pets.'
            : 'Review the pet care appointments booked with you.'}
        </p>
      </div>

      {nextBooking && (
        <div className="bookings-next">
          <span className="bookings-next-label">Next booking</span>
          <h3>{nextBooking.service}</h3>
          <p>{nextBooking.date} at {nextBooking.time}</p>
          <p>{nextBooking.petName} with {nextBooking.personName}</p>
        </div>
      )}

      <div className="bookings-checklist">
        <h3>{isOwner ? 'Before the service' : 'Before accepting'}</h3>
        <ul>
          <li>{isOwner ? 'Confirm drop-off details' : 'Review pet care notes'}</li>
          <li>{isOwner ? 'Share feeding instructions' : 'Confirm your availability'}</li>
          <li>{isOwner ? 'Message the sitter if anything changes' : 'Message the owner if anything changes'}</li>
        </ul>
      </div>

      <button
        className="bookings-panel-action"
        type="button"
        onClick={isOwner ? onNewBookingClick : undefined}
      >
        {isOwner ? 'New Booking' : 'Update Availability'}
      </button>
    </aside>
  );
}
