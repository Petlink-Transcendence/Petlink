import { useState, type FormEvent } from 'react';
import './UpdateAvailabilityPopup.css';

export type AvailabilityTimeSlot = {
  label: string;
  time: string;
};

export type AvailabilityFormData = {
  location: string;
  capacity: string;
  availableTimes: AvailabilityTimeSlot[];
};

type UpdateAvailabilityPopupProps = {
  onClose: () => void;
  initialLocation?: string;
  initialCapacity?: string;
  initialAvailableTimes?: AvailabilityTimeSlot[];
  onSaveAvailability?: (availability: AvailabilityFormData) => void | Promise<void>;
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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type DayState = { enabled: boolean; start: string; end: string };

function findDayIndex(name: string): number {
  const lower = name.trim().toLowerCase();
  return DAYS.findIndex((d, i) => d.toLowerCase() === lower || SHORT[i].toLowerCase() === lower);
}

function initDays(slots: AvailabilityTimeSlot[]): Record<string, DayState> {
  const state: Record<string, DayState> = {};
  for (const day of DAYS) state[day] = { enabled: false, start: '09:00', end: '18:00' };

  for (const slot of slots) {
    const timeMatch = slot.time.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
    const start = timeMatch ? timeMatch[1] : '09:00';
    const end = timeMatch ? timeMatch[2] : '18:00';

    const rangeMatch = slot.label.match(/^(\w+)\s*[-–]\s*(\w+)$/);
    if (rangeMatch) {
      const from = findDayIndex(rangeMatch[1]);
      const to = findDayIndex(rangeMatch[2]);
      if (from !== -1 && to !== -1) {
        for (let i = from; i <= to; i++) state[DAYS[i]] = { enabled: true, start, end };
      }
    } else {
      const idx = findDayIndex(slot.label);
      if (idx !== -1) state[DAYS[idx]] = { enabled: true, start, end };
    }
  }

  return state;
}

export default function UpdateAvailabilityPopup({
  onClose,
  initialLocation = '',
  initialCapacity = '',
  initialAvailableTimes = [],
  onSaveAvailability,
}: UpdateAvailabilityPopupProps) {
  const [location, setLocation] = useState(initialLocation);
  const [capacity, setCapacity] = useState(initialCapacity);
  const [days, setDays] = useState<Record<string, DayState>>(() => initDays(initialAvailableTimes));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const toggleDay = (day: string) =>
    setDays(prev => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));

  const updateTime = (day: string, field: 'start' | 'end', value: string) =>
    setDays(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const availableTimes: AvailabilityTimeSlot[] = DAYS
      .filter(day => days[day].enabled)
      .map(day => ({ label: day, time: `${days[day].start} - ${days[day].end}` }));

    if (!location.trim() || !capacity.trim()) return;

    setIsSaving(true);
    setSaveError('');
    try {
      await onSaveAvailability?.({ location: location.trim(), capacity: capacity.trim(), availableTimes });
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save availability.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="availability-overlay" onClick={onClose}>
      <section className="availability-container" onClick={event => event.stopPropagation()}>
        <header className="availability-header">
          <h2>Update Availability</h2>
          <button
            type="button"
            className="availability-close"
            onClick={onClose}
            aria-label="Close availability form"
          >
            &times;
          </button>
        </header>

        <form className="availability-form" onSubmit={handleSubmit}>
          <div className="availability-row">
            <label className="availability-field">
              <span className="required-label">Location</span>
              <input
                type="text"
                value={location}
                onChange={event => setLocation(event.target.value)}
                placeholder="Porto"
                required
              />
            </label>

            <label className="availability-field">
              <span className="required-label">Capacity</span>
              <input
                type="text"
                value={capacity}
                onChange={event => setCapacity(event.target.value)}
                placeholder="2 bookings/day"
                required
              />
            </label>
          </div>

          <div className="availability-schedule">
            <span className="required-label availability-schedule-label">Weekly schedule</span>
            <div className="availability-days">
              {DAYS.map(day => {
                const d = days[day];
                return (
                  <div key={day} className={`availability-day-row${d.enabled ? ' is-enabled' : ''}`}>
                    <label className="availability-day-toggle">
                      <input
                        type="checkbox"
                        checked={d.enabled}
                        onChange={() => toggleDay(day)}
                      />
                      <span className="availability-toggle-switch" />
                      <span className="availability-day-name">{day.slice(0, 3)}</span>
                    </label>

                    {d.enabled ? (
                      <div className="availability-day-times">
                        <select
                          value={d.start}
                          onChange={e => {
                            updateTime(day, 'start', e.target.value);
                            if (d.end <= e.target.value) {
                              const newEnd = toMins(e.target.value) >= toMins('23:00') ? '00:00' : fromMins(toMins(e.target.value) + 60);
                              updateTime(day, 'end', newEnd);
                            }
                          }}
                          aria-label={`${day} start time`}
                        >
                          {generateTimeOptions('00:00', '23:00').map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <span className="availability-time-sep">–</span>
                        <select
                          value={d.end}
                          onChange={e => updateTime(day, 'end', e.target.value)}
                          aria-label={`${day} end time`}
                        >
                          {(toMins(d.start) >= toMins('23:00')
                            ? ['00:00']
                            : generateTimeOptions(fromMins(toMins(d.start) + 60), '23:00')
                          ).map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className="availability-day-closed">Closed</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {saveError && <p role="alert" className="availability-error">{saveError}</p>}

          <button type="submit" className="availability-submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Availability'}
          </button>
        </form>
      </section>
    </div>
  );
}
