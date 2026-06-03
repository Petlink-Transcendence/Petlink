import './SearchSidebar.css';

type SearchSidebarProps = {
  query: string;
  onQueryChange: (q: string) => void;
  onCommit: (q: string) => void;
  activeFilter: string;
  onFilterChange: (f: string) => void;
  recentSearches: string[];
  onSelectRecent: (s: string) => void;
  onRemoveRecent: (s: string) => void;
  suggestions: string[];
  onSelectSuggestion: (s: string) => void;
};

const filters = ['All', 'Sitters', 'Owners'];

export default function SearchSidebar({
  query,
  onQueryChange,
  onCommit,
  activeFilter,
  onFilterChange,
  recentSearches,
  onSelectRecent,
  onRemoveRecent,
  suggestions,
  onSelectSuggestion,
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

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="search-card">
          <h3 className="search-card-title">Recent Searches</h3>
          <ul className="recent-list">
            {recentSearches.map((s, i) => (
              <li key={i} className="recent-item">
                <button className="recent-text" onClick={() => onSelectRecent(s)}>
                  🕐 {s}
                </button>
                <button className="recent-remove" onClick={() => onRemoveRecent(s)} title="Remove">✕</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {query === '' && (
        <div className="search-card">
          <h3 className="search-card-title">Try searching for</h3>
          <div className="suggestion-list">
            {suggestions.map((s, i) => (
              <button key={i} className="suggestion-chip" onClick={() => onSelectSuggestion(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

    </aside>
  );
}
