import { useEffect, useMemo, useState } from 'react';
import BookingCard, { type Booking, type BookingStatus } from '../components/bookings/BookingCard';
import BookingsSidePanel from '../components/bookings/BookingsSidePanel';
import './Bookings.css';

type BookingFilter = 'all' | BookingStatus;
type BookingLayout = 'owner' | 'sitter';

const initialBookings: Booking[] = [
  {
    id: 1,
    personName: 'Rodrigo Silva',
    personRole: 'Cat owner',
    petName: 'Luna',
    petType: 'Cat',
    service: 'Cat sitting',
    date: 'June 12, 2026',
    time: '6:00 PM',
    location: 'Lisbon, PT',
    status: 'confirmed',
    price: '€28',
    note: 'Evening visit with feeding, litter refresh, and a short photo update after the visit.',
  },
  {
    id: 2,
    personName: 'Jane Doe',
    personRole: 'Pet owner',
    petName: 'Buddy',
    petType: 'Dog',
    service: 'Dog walking',
    date: 'June 14, 2026',
    time: '9:30 AM',
    location: 'Oeiras, PT',
    status: 'pending',
    price: '€18',
    note: 'Morning walk near the park. Buddy should stay on leash and avoid crowded dog areas.',
  },
  {
    id: 3,
    personName: 'Miguel Ramos',
    personRole: 'Dog owner',
    petName: 'Max',
    petType: 'Dog',
    service: 'Home visits',
    date: 'June 18, 2026',
    time: '1:00 PM',
    location: 'Almada, PT',
    status: 'completed',
    price: '€22',
    note: 'Lunch visit completed with water refill, food, and a quick check-in message.',
  },
  {
    id: 4,
    personName: 'Sofia Martins',
    personRole: 'Rabbit owner',
    petName: 'Nina',
    petType: 'Rabbit',
    service: 'Overnight stay',
    date: 'June 22, 2026',
    time: '8:00 PM',
    location: 'Cascais, PT',
    status: 'confirmed',
    price: '€45',
    note: 'Overnight care with hay refill, enclosure cleaning, and medication before bedtime.',
  },
  {
    id: 5,
    personName: 'Beatriz Costa',
    personRole: 'Pet owner',
    petName: 'Milo',
    petType: 'Dog',
    service: 'Dog walking',
    date: 'June 24, 2026',
    time: '5:00 PM',
    location: 'Lisbon, PT',
    status: 'cancelled',
    price: '€16',
    note: 'Cancelled by the owner after a schedule change. No action is needed.',
  },
];

const filterOptions: { label: string; value: BookingFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function Bookings() {
  const [activeFilter, setActiveFilter] = useState<BookingFilter>('all');
  const [bookingLayout, setBookingLayout] = useState<BookingLayout>('sitter');

  useEffect(() => {
    document.title = 'Bookings | PetLink';
  }, []);

  const filteredBookings = useMemo(() => {
    if (activeFilter === 'all') {
      return initialBookings;
    }

    return initialBookings.filter(booking => booking.status === activeFilter);
  }, [activeFilter]);

  const nextBooking = useMemo(
    () => initialBookings.find(booking => booking.status === 'confirmed' || booking.status === 'pending'),
    []
  );

  return (
    <div className="bookings-page">
      <main className="bookings-shell">
        <section className="bookings-hero">
          <div>
            <h2>My <span>Bookings</span></h2>
          </div>

          <div className="bookings-view-toggle" aria-label="Choose booking view">
            <button
              type="button"
              className={bookingLayout === 'owner' ? 'active' : ''}
              aria-pressed={bookingLayout === 'owner'}
              onClick={() => setBookingLayout('owner')}
            >
              Pet Owner
            </button>
            <button
              type="button"
              className={bookingLayout === 'sitter' ? 'active' : ''}
              aria-pressed={bookingLayout === 'sitter'}
              onClick={() => setBookingLayout('sitter')}
            >
              Pet Sitter
            </button>
          </div>
        </section>

        <div className="bookings-layout">
          <section className="bookings-list-panel">
            <div className="bookings-list-header">
              <div>
                <h2>Recent Bookings</h2>
                <p>{filteredBookings.length} matching bookings</p>
              </div>

              <div className="bookings-filters" aria-label="Filter bookings by status">
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

            <div className="bookings-list">
              {filteredBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </section>

          <div className="bookings-side-panel">
            <BookingsSidePanel layout={bookingLayout} nextBooking={nextBooking} />
          </div>
        </div>
      </main>
    </div>
  );
}
