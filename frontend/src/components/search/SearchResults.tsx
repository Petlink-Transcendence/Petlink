import './SearchResults.css';

type Profile = {
  id: number;
  name: string;
  role: string;
  location: string;
  rating?: string;
};

type SearchResultsProps = {
  results: Profile[];
  committedQuery: string;
  hasSearched: boolean;
  featuredProfiles: Profile[];
};

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="result-card">
      <div className="result-card-banner" />
      <div className="result-avatar">{initials(profile.name)}</div>
      <div className="result-info">
        <span className="result-name">{profile.name}</span>
        <span className="result-role">{profile.role}</span>
        <span className="result-location">📍 {profile.location}</span>
        {profile.rating && <span className="result-rating">⭐ {profile.rating}</span>}
      </div>
      <button className="result-btn">Connect</button>
    </div>
  );
}

export default function SearchResults({ results, committedQuery, hasSearched, featuredProfiles }: SearchResultsProps) {

  if (!hasSearched) {
    return (
      <div className="search-results">
        <div className="discover-card">
          <span className="discover-icon">🐾</span>
          <h3 className="discover-title">Find your perfect match</h3>
          <p className="discover-text">Search for pet sitters, dog walkers, and pet owners near you.</p>
        </div>

        <div className="results-section">
          <h3 className="section-title">People you might know</h3>
          <div className="results-grid">
            {featuredProfiles.map(p => <ProfileCard key={p.id} profile={p} />)}
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="search-results">
        <div className="discover-card">
          <span className="discover-icon">🔍</span>
          <h3 className="discover-title">No results for "{committedQuery}"</h3>
          <p className="discover-text">Try a different name, role, or location.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-section">
        <h3 className="section-title">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{committedQuery}"
        </h3>
        <div className="results-grid">
          {results.map(p => <ProfileCard key={p.id} profile={p} />)}
        </div>
      </div>
    </div>
  );
}
