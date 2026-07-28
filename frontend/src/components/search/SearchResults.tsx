import { Link } from 'react-router-dom';
import './SearchResults.css';

type Profile = {
  id: number | string;
  name: string;
  role: string;
  location: string;
  rating?: string;
  profileType: 'owner' | 'sitter';
};

type SearchResultsProps = {
  results: Profile[];
  committedQuery: string;
  hasSearched: boolean;
  featuredProfiles: Profile[];
};

function initials(name: string) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function ProfileCard({ profile }: { profile: Profile }) {
  const profilePath = profile.profileType === 'sitter' ? `/sitterprofile/${profile.id}` : `/profile/${profile.id}`;

  return (
    <Link to={profilePath} className="result-card" aria-label={`Open ${profile.name}'s profile`}>
      <div className="result-card-banner" />
      <div className="result-avatar">{initials(profile.name)}</div>
      <div className="result-info">
        <span className="result-name">{profile.name}</span>
        <span className="result-role">{profile.role}</span>
        <span className="result-location">📍 {profile.location}</span>
        {profile.rating && <span className="result-rating">⭐ {profile.rating}</span>}
      </div>
      <span className="result-btn">View profile</span>
    </Link>
  );
}

export default function SearchResults({ results, committedQuery, hasSearched, featuredProfiles }: SearchResultsProps) {
  const resultCount = results.length;

  if (!hasSearched) {
    return (
      <div className="search-results">
        <DiscoverCard />

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
        <DiscoverCard />
        <div className="empty-results-card">
          <span className="empty-results-icon">🔍</span>
          <h3 className="empty-results-title">No results for "{committedQuery}"</h3>
          <p className="empty-results-text">Try a different name, role, or location.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <DiscoverCard />
      <div className="results-section">
        <h3 className="section-title">
          {resultCount} result{resultCount !== 1 ? 's' : ''} for "{committedQuery}"
        </h3>
        <div className="results-grid">
          {results.map(p => <ProfileCard key={p.id} profile={p} />)}
        </div>
      </div>
    </div>
  );
}

function DiscoverCard() {
  return (
    <div className="discover-card">
      <span className="discover-icon">🐾</span>
      <h3 className="discover-title">Find your perfect match</h3>
      <p className="discover-text">Search for pet sitters, dog walkers, and pet owners near you.</p>
    </div>
  );
}
