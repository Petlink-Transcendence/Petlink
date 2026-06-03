import './SearchSidebar.css';

type SearchSidebarProps = {
  query: string;
  onQueryChange: (q: string) => void;
  onCommit: (q: string) => void;
  activeFilter: string;
  onFilterChange: (f: string) => void;
};

const filters = ['All', 'Sitters', 'Owners'];

export default function SearchSidebar({
  query,
  onQueryChange,
  onCommit,
  activeFilter,
  onFilterChange,
}: SearchSidebarProps) {
  return (
    <aside className="search-sidebar">

      {/* Search input */}
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

      {/* Filters */}
      <div className="search-card">
        <h3 className="search-card-title">Filter by</h3>
        <div className="filter-pills">
          {filters.map(f => (
            <button
              key={f}
              className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
              onClick={() => onFilterChange(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}