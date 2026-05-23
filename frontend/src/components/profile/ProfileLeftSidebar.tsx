import './ProfileLeftSidebar.css';

type Card =
  | { title: string; type: 'meta'; items: string[] }
  | { title: string; type: 'tags'; items: string[] };

type ProfileLeftSidebarProps = {
  cards: Card[];
};

export default function ProfileLeftSidebar({ cards }: ProfileLeftSidebarProps) {
  return (
    <aside className="profile-left">
      {cards.map(card => (
        <div key={card.title} className="profile-card">
          <h3 className="card-title">{card.title}</h3>
          {card.type === 'meta' && card.items.map((item, i) => (
            <p key={i} className="card-meta">{item}</p>
          ))}
          {card.type === 'tags' && (
            <div className="tag-list">
              {card.items.map((item, i) => (
                <span key={i} className="profile-tag">{item}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
