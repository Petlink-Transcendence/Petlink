import { useEffect, useMemo, useState } from 'react';
import BookingCard, { type Booking, type BookingStatus } from '../components/bookings/BookingCard';
import BookingsSidePanel from '../components/bookings/BookingsSidePanel';
import BookingsSummary from '../components/bookings/BookingsSummary';
import NewBookingPopup, { type NewBookingFormData } from '../components/bookings/NewBookingPopup';
import UpdateAvailabilityPopup from '../components/bookings/UpdateAvailabilityPopup';
import './Bookings.css';

type BookingLayout = 'owner' | 'sitter';
type BookingFilter = 'all' | BookingStatus;

const ownerBookings: Booking[] = [
  {
    id: 1,
    personName: 'Daniela Padilha',
    personRole: 'animal-sitter',
    petName: 'Jack',
    petType: 'Dog',
    service: 'Dog walking',
    date: '16 Jun 2026',
    time: '14:00 - 15:00',
    location: 'Porto, PT',
    status: 'confirmed',
    price: '14 EUR',
    note: 'Daniela is confirmed for Jack\'s afternoon walk. Open the existing chat for the latest details.',
    chatContactId: 1,
  },
  {
    id: 2,
    personName: 'Ana Costa',
    personRole: 'Cat sitter',
    petName: 'Luna',
    petType: 'Bengal Cat',
    service: 'Cat sitting',
    date: '18 Jun 2026',
    time: '09:00 - 18:00',
    location: 'Porto, PT',
    status: 'confirmed',
    price: '20 EUR',
    note: 'Ana will visit twice and send photo updates after each visit.',
  },
  {
    id: 3,
    personName: 'Miguel Ramos',
    personRole: 'Dog walker',
    petName: 'Buddy',
    petType: 'Golden Retriever',
    service: 'Dog walking',
    date: '22 Jun 2026',
    time: '17:30 - 18:30',
    location: 'Cedofeita, Porto',
    status: 'pending',
    price: '12 EUR',
    note: 'Waiting for Miguel to confirm the evening walk.',
  },
  {
    id: 4,
    personName: 'Sara Martins',
    personRole: 'Overnight sitter',
    petName: 'Luna and Buddy',
    petType: 'Cat and Dog',
    service: 'Overnight stay',
    date: '02 May 2026',
    time: '20:00 - 09:00',
    location: 'Home stay',
    status: 'completed',
    price: '45 EUR',
    note: 'Completed stay with feeding, walk, and bedtime updates.',
  },
  {
    id: 5,
    personName: 'Rodrigo Silva',
    personRole: 'cat owner',
    petName: 'Quiwi',
    petType: 'Cat',
    service: 'Home visits',
    date: '10 Jun 2026',
    time: '11:00 - 11:30',
    location: 'Porto, PT',
    status: 'cancelled',
    price: '10 EUR',
    note: 'Cancelled after Rodrigo changed travel plans. No further action is needed.',
    chatContactId: 3,
  },
];

const sitterBookings: Booking[] = [
  {
    id: 1,
    personName: 'Jane Doe',
    personRole: 'Pet owner',
    petName: 'Luna',
    petType: 'Bengal Cat',
    service: 'Cat sitting',
    date: '18 Jun 2026',
    time: '09:00 - 18:00',
    location: 'Porto, PT',
    status: 'confirmed',
    price: '20 EUR',
    note: 'Jane requested two visits, wet food at noon, and photo updates.',
  },
  {
    id: 2,
    personName: 'Filipe Rocha',
    personRole: 'Pet owner',
    petName: 'Nori',
    petType: 'Rabbit',
    service: 'Home visits',
    date: '24 Jun 2026',
    time: '12:00 - 12:45',
    location: 'Boavista, Porto',
    status: 'pending',
    price: '15 EUR',
    note: 'Filipe is waiting for confirmation before sharing key pickup details.',
  },
  {
    id: 3,
    personName: 'Sofia Pereira',
    personRole: 'Pet owner',
    petName: 'Milo',
    petType: 'British Shorthair',
    service: 'Grooming',
    date: '29 Apr 2026',
    time: '14:00 - 15:30',
    location: 'Client home',
    status: 'completed',
    price: '18 EUR',
    note: 'Completed grooming appointment and coat brushing.',
  },
];

const filterOptions: { label: string; value: BookingFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

function countUpcoming(bookings: Booking[]) {
  return bookings.filter(booking => booking.status === 'confirmed' || booking.status === 'pending').length;
}

function formatBookingDate(value: string) {
  const [year, month, day] = value.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (!year || !month || !day) {
    return value;
  }

  return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
}

export default function Bookings() {
  const [activeLayout, setActiveLayout] = useState<BookingLayout>('owner');
  const [activeFilter, setActiveFilter] = useState<BookingFilter>('all');
  const [ownerBookingList, setOwnerBookingList] = useState(ownerBookings);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  useEffect(() => {
    document.title = 'Bookings | PetLink';
  }, []);

  const bookings = activeLayout === 'owner' ? ownerBookingList : sitterBookings;

  const filteredBookings = useMemo(() => {
    if (activeFilter === 'all') {
      return bookings;
    }

    return bookings.filter(booking => booking.status === activeFilter);
  }, [activeFilter, bookings]);

  const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
  const upcomingBookings = countUpcoming(bookings);
  const listTitle = activeLayout === 'owner' ? 'Bookings You Booked' : 'Bookings With You';
  const listDescription = activeLayout === 'owner'
    ? 'pet care services you booked'
    : 'pet care services owners booked with you';

  const handleLayoutChange = (layout: BookingLayout) => {
    setActiveLayout(layout);
    setActiveFilter('all');
    setIsNewBookingOpen(false);
    setIsAvailabilityOpen(false);
  };

  const handleCreateBooking = (booking: NewBookingFormData) => {
    setOwnerBookingList(currentBookings => {
      const nextId = Math.max(0, ...currentBookings.map(currentBooking => currentBooking.id)) + 1;

      return [
        {
          id: nextId,
          personName: booking.sitter,
          personRole: 'Pet sitter',
          petName: booking.pet,
          petType: 'Pet',
          service: booking.service,
          date: formatBookingDate(booking.date),
          time: booking.time,
          location: booking.location,
          status: 'pending',
          price: 'Pending',
          note: booking.notes || 'No notes added.',
        },
        ...currentBookings,
      ];
    });

    setActiveLayout('owner');
    setActiveFilter('all');
  };

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
              className={activeLayout === 'owner' ? 'active' : ''}
              aria-pressed={activeLayout === 'owner'}
              onClick={() => handleLayoutChange('owner')}
            >
              Pet Owner
            </button>
            <button
              type="button"
              className={activeLayout === 'sitter' ? 'active' : ''}
              aria-pressed={activeLayout === 'sitter'}
              onClick={() => handleLayoutChange('sitter')}
            >
              Pet Sitter
            </button>
          </div>
        </section>

        <BookingsSummary
          totalBookings={bookings.length}
          upcomingBookings={upcomingBookings}
          pendingBookings={pendingBookings}
        />

        <div className="bookings-layout">
          <section className="bookings-list-panel">
            <div className="bookings-list-header">
              <div className="bookings-list-heading">
                <h2>{listTitle}</h2>
                <p>{filteredBookings.length} matching {listDescription}</p>
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

          <section className="bookings-side-panel">
            <BookingsSidePanel
              layout={activeLayout}
              nextBooking={bookings[0]}
              onNewBookingClick={() => setIsNewBookingOpen(true)}
              onUpdateAvailabilityClick={() => setIsAvailabilityOpen(true)}
            />
          </section>
        </div>

        {isNewBookingOpen && (
          <NewBookingPopup
            onClose={() => setIsNewBookingOpen(false)}
            onCreateBooking={handleCreateBooking}
          />
        )}

        {isAvailabilityOpen && (
          <UpdateAvailabilityPopup onClose={() => setIsAvailabilityOpen(false)} />
        )}
      </main>
    </div>
  );
}
