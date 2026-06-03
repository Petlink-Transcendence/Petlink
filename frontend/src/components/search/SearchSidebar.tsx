import './SearchSidebar.css';

type SearchSidebarProps = {
  query: string;
  onQueryChange: (q: string) => void;
  onCommit: (q: string) => void;
};

export default function SearchSidebar({
  query,
  onQueryChange,
  onCommit,
}: SearchSidebarProps) {
    return (
    <aside className="search-sidebar">
      <div className="search-card">
        <h3 className="search-card-title">Search</h3>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Name, role, location..."
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onCommit(query); }}
          />
          {query && (
            <button className="search-clear" onClick={() => onQueryChange('')}>✕</button>
          )}
        </div>
        <button className="search-btn" onClick={() => onCommit(query)}>Search</button>
      </div>
    </aside>
  );
}