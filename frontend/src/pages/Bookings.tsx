import { useEffect } from 'react';
import BookingCard, { type Booking } from '../components/bookings/BookingCard';
import './Bookings.css';

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
];

export default function Bookings() {
  useEffect(() => {
    document.title = 'Bookings | PetLink';
  }, []);

  return (
    <div className="bookings-page">
      <main className="bookings-shell">
        <section className="bookings-hero">
          <div>
            <h2>My <span>Bookings</span></h2>
          </div>
        </section>

        <section className="bookings-list-panel">
          <div className="bookings-list-header">
            <div>
              <h2>Recent Bookings</h2>
              <p>{initialBookings.length} bookings</p>
            </div>
          </div>

          <div className="bookings-list">
            {initialBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
