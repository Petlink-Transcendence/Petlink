import './RightSidebar.css';

const suggestedSitters = [
  { id: 1, name: 'Ana Costa',    role: 'Cat Sitter',  location: 'Porto, PT',          rating: '4.9' },
  { id: 2, name: 'Miguel Reis',  role: 'Dog Walker',  location: 'Lisbon, PT',         rating: '4.7' },
  { id: 3, name: 'Sara Mendes',  role: 'Pet Sitter',  location: 'Braga, PT',          rating: '5.0' },
  { id: 4, name: 'Tiago Nunes',  role: 'Dog Sitter',  location: 'Coimbra, PT',        rating: '4.8' },
  { id: 5, name: 'Beatriz Lima', role: 'Pet Walker',  location: 'Aveiro, PT',         rating: '4.9' },
];

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function RightSidebar() {
  return (
    <aside className="right-sidebar">

      <div className="rs-card">
        <h3 className="rs-title">Suggested Sitters</h3>
        <ul className="rs-list">
          {suggestedSitters.map(s => (
            <li key={s.id} className="rs-item">
              <div className="rs-avatar">{initials(s.name)}</div>
              <div className="rs-info">
                <span className="rs-name">{s.name}</span>
                <span className="rs-info">{s.role} · {s.location}</span>
                <span className="rs-rating">⭐ {s.rating}</span>
              </div>
              <button className="rs-btn">Connect</button>
            </li>
          ))}
        </ul>
      </div>


    </aside>
  );
}
