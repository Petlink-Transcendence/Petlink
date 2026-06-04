import { useEffect } from 'react';
import './Reviews.css';

export default function Reviews() {
  useEffect(() => {
    document.title = 'Reviews | PetLink';
  }, []);

  return (
    <div className="reviews-page">
      <main className="reviews-shell">
        <section className="reviews-hero">
          <div>
            <h2>My <span>Reviews</span></h2>
          </div>
        </section>
      </main>
    </div>
  );
}