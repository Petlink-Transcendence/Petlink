import { useState, type FormEvent } from 'react';
import './UpdateAvailabilityPopup.css';

export type AvailabilityTimeSlot = {
  label: string;
  time: string;
};

export type AvailabilityFormData = {
  location: string;
  capacity: string;
  timeSlots: string;
  availableTimes: AvailabilityTimeSlot[];
};

type UpdateAvailabilityPopupProps = {
  onClose: () => void;
  initialLocation?: string;
  initialCapacity?: string;
  initialAvailableTimes?: AvailabilityTimeSlot[];
  onSaveAvailability?: (availability: AvailabilityFormData) => void;
};

function formatAvailableTimesForInput(availableTimes: AvailabilityTimeSlot[]) {
  return availableTimes.map(({ label, time }) => `${label}: ${time}`).join('\n');
}

function parseAvailableTimes(value: string): AvailabilityTimeSlot[] {
  return value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const labeledTime = line.match(/^(.+?):\s+(.+)$/);

      if (labeledTime) {
        return {
          label: labeledTime[1].trim(),
          time: labeledTime[2].trim(),
        };
      }

      return {
        label: `Slot ${index + 1}`,
        time: line,
      };
    });
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
  const [timeSlots, setTimeSlots] = useState(formatAvailableTimesForInput(initialAvailableTimes));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!location.trim() || !capacity.trim() || !timeSlots.trim()) {
      return;
    }

    onSaveAvailability?.({
      location: location.trim(),
      capacity: capacity.trim(),
      timeSlots: timeSlots.trim(),
      availableTimes: parseAvailableTimes(timeSlots),
    });
    onClose();
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

          <label className="availability-field">
            <span className="required-label">Available times</span>
            <textarea
              value={timeSlots}
              onChange={event => setTimeSlots(event.target.value)}
              placeholder={'Mon - Fri: 09:00 - 12:00\nSaturday: 14:00 - 18:00'}
              rows={4}
              required
            />
          </label>

          <button type="submit" className="availability-submit">
            Save Availability
          </button>
        </form>
      </section>
    </div>
  );
}
