import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import BookingCard, { type Booking, type BookingStatus } from '../components/bookings/BookingCard';
import BookingsSidePanel from '../components/bookings/BookingsSidePanel';
import BookingsSummary from '../components/bookings/BookingsSummary';
import './Bookings.css';

type BookingLayout = 'owner' | 'sitter';
type BookingFilter = 'all' | BookingStatus;

const SERVICE_LABELS: Record<string, string> = {
  dog_walking: 'Dog Walking',
  cat_sitting: 'Cat Sitting',
  home_visits: 'Home Visits',
  overnight_stay: 'Overnight Stay',
  grooming: 'Grooming',
};

const filterOptions: { label: string; value: BookingFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${parseInt(day)} ${monthNames[parseInt(month) - 1]} ${year}`;
}

function formatTime(t: string): string {
  return t.slice(0, 5);
}

function countUpcoming(bookings: Booking[]) {
  return bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
}

function getBookingLayout(userType?: string): BookingLayout {
  return userType === 'provider' ? 'sitter' : 'owner';
}

function mapBooking(b: any, layout: BookingLayout): Booking {
  const isOwner = layout === 'owner';
  return {
    id: b.id,
    layout,
    personName: isOwner ? b.provider_name : b.requester_name,
    avatar: isOwner ? b.provider_avatar : b.requester_avatar,
    personRole: isOwner ? (SERVICE_LABELS[b.service_type] ?? b.service_type) : 'Pet Owner',
    petName: b.pet_name,
    petType: b.pet_type,
    service: SERVICE_LABELS[b.service_type] ?? b.service_type,
    date: formatDate(b.date),
    time: `${formatTime(b.start_time)} - ${formatTime(b.end_time)}`,
    location: b.location ?? '',
    status: b.status,
    price: `${parseFloat(b.service_price).toFixed(0)} ${b.service_currency}`,
    note: b.message ?? '',
    chatContactId: isOwner ? b.provider : b.requester,
  };
}

export default function Bookings() {
  const [activeLayout, setActiveLayout] = useState<BookingLayout | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<BookingFilter>('all');
  const [error, setError] = useState(false);

  const fetchBookings = async (layout: BookingLayout) => {
    const token = localStorage.getItem('access');
    try {
      const res = await fetch('/api/bookings/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setBookings(data.map((b: any) => mapBooking(b, layout)));
    } catch {}
  };

  useEffect(() => {
    document.title = 'Bookings | PetLink';
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch('/auth/me/', {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        const layout = getBookingLayout(data.user_type);
        setActiveLayout(layout);
        fetchBookings(layout);
      })
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    const handleNotification = (e: CustomEvent) => {
      const notif = e.detail;
      if (!notif) return;
      if (
        (typeof notif.type === 'string' && notif.type.startsWith('booking_')) ||
        notif.reference_type === 'booking'
      ) {
        if (activeLayout) {
          fetchBookings(activeLayout);
        }
      }
    };

    window.addEventListener('newNotification', handleNotification as EventListener);
    return () => {
      window.removeEventListener('newNotification', handleNotification as EventListener);
    };
  }, [activeLayout]);

  const handleAction = async (id: number, action: 'confirm' | 'cancel' | 'complete') => {
    const token = localStorage.getItem('access');
    try {
      await fetch(`/api/bookings/${id}/${action}/`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings(activeLayout!);
    } catch {}
  };

  const filteredBookings = useMemo(() => {
    if (activeFilter === 'all') return bookings;
    return bookings.filter(b => b.status === activeFilter);
  }, [activeFilter, bookings]);

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const upcomingBookings = countUpcoming(bookings);
  const listTitle = activeLayout === 'owner' ? 'Bookings You Booked' : 'Bookings With You';
  const listDescription = activeLayout === 'owner'
    ? 'pet care services you booked'
    : 'pet care services owners booked with you';

  if (error) return <Navigate to="/login" replace />;
  if (!activeLayout) return null;

  return (
    <div className="bookings-page">
      <main className="bookings-shell">
        <section className="bookings-hero">
          <div>
            <h2>My <span>Bookings</span></h2>
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
              {filteredBookings.length === 0 ? (
                <p className="bookings-empty">No bookings found.</p>
              ) : filteredBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} onAction={handleAction} />
              ))}
            </div>
          </section>

          <section className="bookings-side-panel">
            <BookingsSidePanel
              layout={activeLayout}
              nextBooking={bookings.find(b => b.status === 'confirmed')}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
