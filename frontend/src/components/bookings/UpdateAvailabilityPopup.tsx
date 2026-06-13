import { useState, type FormEvent } from 'react';
import './UpdateAvailabilityPopup.css';

const MIN_AVAILABILITY_DATE = '2026-01-01';
const serviceOptions = ['Dog walking', 'Cat sitting', 'Home visits', 'Overnight stay', 'Grooming'];

export type AvailabilityFormData = {
  startDate: string;
  endDate: string;
  timeSlots: string;
  serviceTypes: string[];
  price: string;
  notes: string;
};

type UpdateAvailabilityPopupProps = {
  onClose: () => void;
  onSaveAvailability?: (availability: AvailabilityFormData) => void;
};

export default function UpdateAvailabilityPopup({ onClose, onSaveAvailability }: UpdateAvailabilityPopupProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

    if (
      !startDate ||
      startDate < MIN_AVAILABILITY_DATE ||
      !endDate ||
      endDate < startDate ||
      !timeSlots.trim() ||
      serviceTypes.length === 0 ||
      !price.trim()
    ) {
      return;
    }

    onSaveAvailability?.({
      startDate,
      endDate,
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
              <span className="required-label">Start date</span>
              <input
                type="date"
                value={startDate}
                onChange={event => setStartDate(event.target.value)}
                min={MIN_AVAILABILITY_DATE}
                required
              />
            </label>

            <label className="availability-field">
              <span className="required-label">End date</span>
              <input
                type="date"
                value={endDate}
                onChange={event => setEndDate(event.target.value)}
                min={startDate || MIN_AVAILABILITY_DATE}
                required
              />
            </label>
          </div>

          <label className="availability-field">
            <span className="required-label">Time slots</span>
            <textarea
              value={timeSlots}
              onChange={event => setTimeSlots(event.target.value)}
              placeholder="Weekdays 09:00 - 12:00, Saturdays 14:00 - 18:00"
              rows={3}
              required
            />
          </label>

          <fieldset className="availability-services">
            <legend className="required-label">Service types</legend>
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
            <span className="required-label">Price</span>
            <input
              type="text"
              value={price}
              onChange={event => setPrice(event.target.value)}
              placeholder="20 EUR per visit"
              required
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
