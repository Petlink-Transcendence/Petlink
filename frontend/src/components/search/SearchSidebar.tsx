import './SearchSidebar.css';

export default function SearchSidebar() {
    return (
    <aside className="search-sidebar">

      {/* Search input */}
      <div className="search-card">
        <h3 className="search-card-title">Search</h3>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
            <button className="search-clear">✕</button>
        </div>
        <button className="search-btn">Search</button>
      </div>
    </aside>
  );
}