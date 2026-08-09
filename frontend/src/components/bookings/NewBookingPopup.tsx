import { useState, useEffect, type FormEvent } from 'react';
import { getLoggedInUserId } from '../../utils/auth';
import './NewBookingPopup.css';

const MIN_BOOKING_DATE = new Date().toISOString().slice(0, 10);

type NewBookingPopupProps = {
  onClose: () => void;
  providerId: number;
  initialSitter?: string;
};

type Pet = { id: number; name: string; type: string };
type Service = { id: number; type: string; description: string | null; price: string; currency: string; price_unit: string };

const SERVICE_LABELS: Record<string, string> = {
  dog_walking: 'Dog Walking',
  cat_sitting: 'Cat Sitting',
  home_visits: 'Home Visits',
  overnight_stay: 'Overnight Stay',
  grooming: 'Grooming',
};

export default function NewBookingPopup({ onClose, providerId, initialSitter = '' }: NewBookingPopupProps) {
  const [serviceId, setServiceId] = useState('');
  const [petId, setPetId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const userId = getLoggedInUserId();
    const token = localStorage.getItem('access');

    if (userId) {
      fetch(`/api/users/${userId}/pets/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => setUserPets(data))
        .catch(() => {});
    }

    fetch('/api/services/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.ok ? res.json() : [])
      .then((data: Service[]) => setServices(data.filter(s => (s as any).user === providerId)))
      .catch(() => {});
  }, [providerId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!serviceId || !petId || !date || !startTime || !endTime || !location.trim()) return;

    setSubmitting(true);
    setError('');

    const token = localStorage.getItem('access');
    try {
      const res = await fetch('/api/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          provider: providerId,
          service: Number(serviceId),
          pet: Number(petId),
          date,
          start_time: startTime,
          end_time: endTime,
          location: location.trim(),
          message: notes.trim(),
        }),
      });

      if (res.ok) {
        onClose();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(Object.values(data).flat().join(' ') || 'Failed to create booking.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="new-booking-overlay" onClick={onClose}>
      <section className="new-booking-container" onClick={event => event.stopPropagation()}>
        <header className="new-booking-header">
          <h2>Book {initialSitter || 'Sitter'}</h2>
          <button type="button" className="new-booking-close" onClick={onClose} aria-label="Close new booking form">
            &times;
          </button>
        </header>

        <form className="new-booking-form" onSubmit={handleSubmit}>
          {error && <div className="new-booking-warning">⚠️ {error}</div>}

          <label className="new-booking-field">
            <span className="required-label">Service</span>
            <select value={serviceId} onChange={e => setServiceId(e.target.value)} required>
              <option value="">Select a service</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {SERVICE_LABELS[s.type] ?? s.type} — {s.price} {s.currency}
                </option>
              ))}
            </select>
          </label>

          <div className="new-booking-row">
            <label className="new-booking-field">
              <span className="required-label">Pet</span>
              {userPets.length > 0 ? (
                <select value={petId} onChange={e => setPetId(e.target.value)} required>
                  <option value="">Select a pet</option>
                  {userPets.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              ) : (
                <input type="text" placeholder="Add a pet in your profile first" disabled />
              )}
            </label>

            <label className="new-booking-field">
              <span className="required-label">Date</span>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={MIN_BOOKING_DATE}
                required
              />
            </label>
          </div>

          <div className="new-booking-row">
            <label className="new-booking-field">
              <span className="required-label">Start time</span>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
              />
            </label>

            <label className="new-booking-field">
              <span className="required-label">End time</span>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="new-booking-field">
            <span className="required-label">Location</span>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Porto, PT"
              required
            />
          </label>

          <label className="new-booking-field">
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Feeding instructions, access details, or anything the sitter should know."
              rows={4}
            />
          </label>

          <button type="submit" className="new-booking-submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Booking'}
          </button>
        </form>
      </section>
    </div>
  );
}
