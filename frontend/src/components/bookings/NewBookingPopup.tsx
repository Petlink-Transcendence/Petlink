import { useState, useEffect, type FormEvent } from 'react';
import { getLoggedInUserId } from '../../utils/auth';
import './NewBookingPopup.css';

const MIN_BOOKING_DATE = new Date().toISOString().slice(0, 10);

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type NewBookingPopupProps = {
  onClose: () => void;
  providerId: number;
  initialSitter?: string;
};

type Pet = { id: number; name: string; type: string };
type Service = { id: number; type: string; description: string | null; price: string; currency: string; price_unit: string };
type TimeSlot = { label: string; time: string };
type DaySchedule = Record<string, { start: string; end: string }>;

const SERVICE_LABELS: Record<string, string> = {
  dog_walking: 'Dog Walking',
  cat_sitting: 'Cat Sitting',
  home_visits: 'Home Visits',
  overnight_stay: 'Overnight Stay',
  grooming: 'Grooming',
};

function toMins(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function fromMins(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function generateTimeOptions(from = '00:00', to = '23:00'): string[] {
  const opts: string[] = [];
  for (let m = toMins(from); m <= toMins(to); m += 60) opts.push(fromMins(m));
  return opts;
}

function findDayIndex(name: string): number {
  const lower = name.trim().toLowerCase();
  return DAYS_OF_WEEK.findIndex((d, i) => d.toLowerCase() === lower || SHORT_DAYS[i].toLowerCase() === lower);
}

function getUpcomingDates(dayName: string, count = 5): string[] {
  const target = DAYS_OF_WEEK.indexOf(dayName);
  const today = new Date();
  const cur = new Date(today);
  const daysUntil = (target - cur.getDay() + 7) % 7;
  cur.setDate(cur.getDate() + (daysUntil === 0 ? 0 : daysUntil));
  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 7);
  }
  return dates;
}

function formatShortDate(iso: string): string {
  const [, month, day] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(day)} ${months[parseInt(month) - 1]}`;
}

function buildDaySchedule(slots: TimeSlot[]): DaySchedule {
  const map: DaySchedule = {};
  for (const slot of slots) {
    const timeMatch = slot.time.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
    if (!timeMatch) continue;
    const start = timeMatch[1];
    const end = timeMatch[2];

    const rangeMatch = slot.label.match(/^(\w+)\s*[-–]\s*(\w+)$/);
    if (rangeMatch) {
      const from = findDayIndex(rangeMatch[1]);
      const to = findDayIndex(rangeMatch[2]);
      if (from !== -1 && to !== -1) {
        for (let i = from; i <= to; i++) map[DAYS_OF_WEEK[i]] = { start, end };
      }
    } else {
      const idx = findDayIndex(slot.label);
      if (idx !== -1) map[DAYS_OF_WEEK[idx]] = { start, end };
    }
  }
  return map;
}

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
  const [selectedDayName, setSelectedDayName] = useState('');
  const [providerWindow, setProviderWindow] = useState<{ start: string; end: string } | null>(null);

  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [daySchedule, setDaySchedule] = useState<DaySchedule>({});

  const [provider, setProvider] = useState<any>(null);
  const [loadedProvider, setLoadedProvider] = useState(false);
  const [loadedServices, setLoadedServices] = useState(false);

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
      .then((data: Service[]) => {
        setServices(data.filter((s: any) => s.user === providerId));
        setLoadedServices(true);
      })
      .catch(() => setLoadedServices(true));

    fetch(`/api/users/${providerId}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setProvider(data);
        setLoadedProvider(true);
        if (data?.available_times && Array.isArray(data.available_times)) {
          setDaySchedule(buildDaySchedule(data.available_times));
        }
        if (data?.availability_location) {
          setLocation(data.availability_location.replace(/\s*\+\s*\d+\s*km\b/i, '').trim());
        }
      })
      .catch(() => setLoadedProvider(true));
  }, [providerId]);

  const isLoaded = loadedProvider && loadedServices;
  const isBookable = provider &&
    provider.availability_status === 'Accepting' &&
    provider.availability_location && provider.availability_location.trim() !== '' &&
    provider.available_times && provider.available_times.length > 0 &&
    services.length > 0;

  const handleDaySelect = (dayName: string) => {
    setSelectedDayName(dayName);
    setDate('');
    const schedule = daySchedule[dayName];
    if (schedule) {
      setProviderWindow(schedule);
      setStartTime(schedule.start);
      setEndTime(schedule.end);
    } else {
      setProviderWindow(null);
      setStartTime('');
      setEndTime('');
    }
  };

  const handleDateSelect = (dateStr: string) => {
    setDate(dateStr);
  };

  const availableDayNames = DAYS_OF_WEEK.filter(d => daySchedule[d]);
  const upcomingDates = selectedDayName ? getUpcomingDates(selectedDayName) : [];

  const startOptions = generateTimeOptions(
    providerWindow?.start ?? '00:00',
    providerWindow ? fromMins(toMins(providerWindow.end) - 60) : '23:00'
  );

  const endOptions = startTime
    ? (toMins(startTime) >= toMins('23:00')
        ? ['00:00']
        : generateTimeOptions(fromMins(toMins(startTime) + 60), providerWindow?.end ?? '23:00'))
    : [];

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    const newEnd = toMins(value) >= toMins('23:00') ? '00:00' : fromMins(toMins(value) + 60);
    if (!endTime || endTime <= value) setEndTime(newEnd);
  };

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

        {!isLoaded ? (
          <div className="new-booking-loading">
            <span>Loading sitter details...</span>
          </div>
        ) : !isBookable ? (
          <div className="new-booking-unavailable">
            <p>This sitter is currently not accepting bookings, or has not fully set up their profile.</p>
            <button type="button" className="new-booking-close-btn" onClick={onClose}>Close</button>
          </div>
        ) : (
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

            {availableDayNames.length > 0 ? (
              <>
                <div className="new-booking-field">
                  <span className="required-label">Day</span>
                  <div className="new-booking-day-picker">
                    {availableDayNames.map(day => (
                      <button
                        key={day}
                        type="button"
                        className={`new-booking-day-btn${selectedDayName === day ? ' is-selected' : ''}`}
                        onClick={() => handleDaySelect(day)}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {upcomingDates.length > 0 && (
                  <div className="new-booking-field">
                    <span className="required-label">Date</span>
                    <div className="new-booking-date-picker">
                      {upcomingDates.map(d => (
                        <button
                          key={d}
                          type="button"
                          className={`new-booking-date-btn${date === d ? ' is-selected' : ''}`}
                          onClick={() => handleDateSelect(d)}
                        >
                          {formatShortDate(d)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
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
            )}

            <div className="new-booking-row">
              <label className="new-booking-field">
                <span className="required-label">Start time</span>
                <select value={startTime} onChange={e => handleStartTimeChange(e.target.value)} required disabled={!date}>
                  <option value="">Select start</option>
                  {startOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label className="new-booking-field">
                <span className="required-label">End time</span>
                <select value={endTime} onChange={e => setEndTime(e.target.value)} required disabled={!date || !startTime}>
                  <option value="">Select end</option>
                  {endOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
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
                rows={3}
              />
            </label>

            <button type="submit" className="new-booking-submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Booking'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
