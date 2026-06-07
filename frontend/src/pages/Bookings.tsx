import { useEffect } from 'react';
import './Bookings.css';

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
      </main>
    </div>
  );
}
