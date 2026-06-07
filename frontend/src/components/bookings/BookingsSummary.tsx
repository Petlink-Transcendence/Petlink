import './BookingsSummary.css';

type BookingsSummaryProps = {
  totalBookings: number;
  upcomingBookings: number;
  pendingBookings: number;
};

export default function BookingsSummary({
  totalBookings,
  upcomingBookings,
  pendingBookings,
}: BookingsSummaryProps) {
  return (
    <section className="bookings-summary" aria-label="Bookings summary">
      <div className="bookings-summary-card featured">
        <span className="bookings-summary-value">{upcomingBookings}</span>
        <span className="bookings-summary-label">Upcoming</span>
      </div>
      <div className="bookings-summary-card">
        <span className="bookings-summary-value">{totalBookings}</span>
        <span className="bookings-summary-label">Total Bookings</span>
      </div>
      <div className="bookings-summary-card">
        <span className="bookings-summary-value">{pendingBookings}</span>
        <span className="bookings-summary-label">Pending</span>
      </div>
    </section>
  );
}
