import { useState, type FormEvent } from 'react';
import './UpdateAvailabilityPopup.css';

const MIN_AVAILABILITY_DATE = '2026-01-01';
const serviceOptions = ['Dog walking', 'Cat sitting', 'Home visits', 'Overnight stay', 'Grooming'];

export type AvailabilityFormData = {
  startDate: string;
  endDate: string;
  location: string;
  capacity: string;
  timeSlots: string;
  serviceTypes: string[];
  price: string;
  notes: string;
};

type UpdateAvailabilityPopupProps = {
  onClose: () => void;
  initialLocation?: string;
  initialCapacity?: string;
  onSaveAvailability?: (availability: AvailabilityFormData) => void;
};

export default function UpdateAvailabilityPopup({
  onClose,
  initialLocation = '',
  initialCapacity = '',
  onSaveAvailability,
}: UpdateAvailabilityPopupProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState(initialLocation);
  const [capacity, setCapacity] = useState(initialCapacity);
  const [timeSlots, setTimeSlots] = useState('');
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  const handleServiceToggle = (service: string) => {
    setServiceTypes(currentServices =>
      currentServices.includes(service)
        ? currentServices.filter(currentService => currentService !== service)
        : [...currentServices, service]
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasServiceUpdate = Boolean(
      startDate ||
      endDate ||
      timeSlots.trim() ||
      serviceTypes.length > 0 ||
      price.trim()
    );

    if (!location.trim() || !capacity.trim()) {
      return;
    }

    if (
      hasServiceUpdate &&
      (
        !startDate ||
        startDate < MIN_AVAILABILITY_DATE ||
        !endDate ||
        endDate < startDate ||
        !timeSlots.trim() ||
        serviceTypes.length === 0 ||
        !price.trim()
      )
    ) {
      return;
    }

    onSaveAvailability?.({
      startDate,
      endDate,
      location: location.trim(),
      capacity: capacity.trim(),
      timeSlots: timeSlots.trim(),
      serviceTypes,
      price: price.trim(),
      notes: notes.trim(),
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
              <span>Start date</span>
              <input
                type="date"
                value={startDate}
                onChange={event => setStartDate(event.target.value)}
                min={MIN_AVAILABILITY_DATE}
              />
            </label>

            <label className="availability-field">
              <span>End date</span>
              <input
                type="date"
                value={endDate}
                onChange={event => setEndDate(event.target.value)}
                min={startDate || MIN_AVAILABILITY_DATE}
              />
            </label>
          </div>

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
            <span>Time slots</span>
            <textarea
              value={timeSlots}
              onChange={event => setTimeSlots(event.target.value)}
              placeholder="Weekdays 09:00 - 12:00, Saturdays 14:00 - 18:00"
              rows={3}
            />
          </label>

          <fieldset className="availability-services">
            <legend>Service types</legend>
            <div className="availability-service-grid">
              {serviceOptions.map(service => (
                <label key={service} className="availability-service-option">
                  <input
                    type="checkbox"
                    checked={serviceTypes.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="availability-field">
            <span>Price</span>
            <input
              type="text"
              value={price}
              onChange={event => setPrice(event.target.value)}
              placeholder="20 EUR per visit"
            />
          </label>

          <label className="availability-field">
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={event => setNotes(event.target.value)}
              placeholder="Travel limits, preferred pets, cancellation rules, or extra details."
              rows={4}
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
