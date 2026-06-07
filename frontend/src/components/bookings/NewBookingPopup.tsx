import { useState, type FormEvent } from 'react';
import './NewBookingPopup.css';

export type NewBookingFormData = {
  service: string;
  pet: string;
  sitter: string;
  date: string;
  time: string;
  location: string;
  notes: string;
};

type NewBookingPopupProps = {
  onClose: () => void;
  onCreateBooking: (booking: NewBookingFormData) => void;
};

export default function NewBookingPopup({ onClose, onCreateBooking }: NewBookingPopupProps) {
  const [service, setService] = useState('');
  const [pet, setPet] = useState('');
  const [sitter, setSitter] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!service || !pet.trim() || !sitter.trim() || !date || !time.trim() || !location.trim()) {
      return;
    }

    onCreateBooking({
      service,
      pet: pet.trim(),
      sitter: sitter.trim(),
      date,
      time: time.trim(),
      location: location.trim(),
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="new-booking-overlay" onClick={onClose}>
      <section className="new-booking-container" onClick={event => event.stopPropagation()}>
        <header className="new-booking-header">
          <h2>New Booking</h2>
          <button type="button" className="new-booking-close" onClick={onClose} aria-label="Close new booking form">
            &times;
          </button>
        </header>

        <form className="new-booking-form" onSubmit={handleSubmit}>
          <label className="new-booking-field">
            <span className="required-label">Service</span>
            <select value={service} onChange={event => setService(event.target.value)} required>
              <option value="">Select a service</option>
              <option value="Dog walking">Dog walking</option>
              <option value="Cat sitting">Cat sitting</option>
              <option value="Home visits">Home visits</option>
              <option value="Overnight stay">Overnight stay</option>
              <option value="Grooming">Grooming</option>
            </select>
          </label>

          <div className="new-booking-row">
            <label className="new-booking-field">
              <span className="required-label">Pet</span>
              <input
                type="text"
                value={pet}
                onChange={event => setPet(event.target.value)}
                placeholder="Luna"
                required
              />
            </label>

            <label className="new-booking-field">
              <span className="required-label">Sitter</span>
              <input
                type="text"
                value={sitter}
                onChange={event => setSitter(event.target.value)}
                placeholder="Ana Costa"
                required
              />
            </label>
          </div>

          <div className="new-booking-row">
            <label className="new-booking-field">
              <span className="required-label">Date</span>
              <input
                type="date"
                value={date}
                onChange={event => setDate(event.target.value)}
                required
              />
            </label>

            <label className="new-booking-field">
              <span className="required-label">Time</span>
              <input
                type="text"
                value={time}
                onChange={event => setTime(event.target.value)}
                placeholder="09:00 - 10:00"
                required
              />
            </label>
          </div>

          <label className="new-booking-field">
            <span className="required-label">Location</span>
            <input
              type="text"
              value={location}
              onChange={event => setLocation(event.target.value)}
              placeholder="Porto, PT"
              required
            />
          </label>

          <label className="new-booking-field">
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={event => setNotes(event.target.value)}
              placeholder="Feeding instructions, access details, or anything the sitter should know."
              rows={4}
            />
          </label>

          <button type="submit" className="new-booking-submit">
            Create Booking
          </button>
        </form>
      </section>
    </div>
  );
}
