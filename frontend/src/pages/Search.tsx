import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Search.css';
import SearchSidebar from '../components/search/SearchSidebar';
import SearchResults from '../components/search/SearchResults';

type ApiProfile = {
  id: number;
  name: string;
  role?: string;
  user_type: 'owner' | 'provider';
  city?: string | null;
  country?: string | null;
  rating?: number | string | null;
  avatar?: string | null;
};

type Profile = {
  id: number;
  name: string;
  role: string;
  location: string;
  rating?: string;
  avatar?: string;
  profileType: 'owner' | 'sitter';
};

function toProfile(profile: ApiProfile): Profile {
  const isSitter = profile.user_type === 'provider';
  const location = [profile.city, profile.country].filter(Boolean).join(', ') || 'Location not provided';

  return {
    id: profile.id,
    name: profile.name,
    role: isSitter ? 'Pet Sitter' : 'Pet Owner',
    location,
    rating: profile.rating == null ? undefined : String(profile.rating),
    avatar: profile.avatar ?? undefined,
    profileType: isSitter ? 'sitter' : 'owner',
  };
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    document.title = 'Search | PetLink';
  }, []);

  const loadProfiles = useCallback(async (term: string, filter = 'All') => {
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('access') || localStorage.getItem('access_token');
    const params = new URLSearchParams();
    if (term.trim()) params.set('q', term.trim());
    if (filter === 'Sitters') params.set('user_type', 'provider');
    if (filter === 'Owners') params.set('user_type', 'owner');

    try {
      const response = await fetch(`/api/users/?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok) throw new Error('Please try again in a moment.');
      const data: ApiProfile[] = await response.json();
      if (currentRequest !== requestId.current) return;
      setProfiles(data.map(toProfile));
    } catch (requestError) {
      if (currentRequest !== requestId.current) return;
      setError(requestError instanceof Error ? requestError.message : 'Please try again in a moment.');
      setProfiles([]);
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfiles('');
  }, [loadProfiles]);

  const resetSearch = () => {
    setQuery('');
    setCommittedQuery('');
    setHasSearched(false);
    setActiveFilter('All');
    void loadProfiles('');
  };

  const handleQueryChange = (term: string) => {
    setQuery(term);
    if (term.trim() === '') resetSearch();
  };

  const commitSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) {
      resetSearch();
      return;
    }

    setQuery(trimmed);
    setCommittedQuery(trimmed);
    setHasSearched(true);
    setRecentSearches(prev => [trimmed, ...prev.filter(s => s !== trimmed)].slice(0, 5));
    void loadProfiles(trimmed, activeFilter);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    const hasQuery = committedQuery.trim() !== '';
    setHasSearched(hasQuery || filter !== 'All');
    void loadProfiles(committedQuery, filter);
  };

  const filteredResults = useMemo(() => {
    if (activeFilter === 'All') return profiles;
    return profiles.filter(profile => activeFilter === 'Sitters'
      ? profile.profileType === 'sitter'
      : profile.profileType === 'owner');
  }, [activeFilter, profiles]);

  const suggestions = useMemo(
    () => Array.from(new Set([
      'Pet Sitter',
      'Pet Owner',
      ...profiles.map(profile => profile.location).filter(location => location !== 'Location not provided'),
    ])).slice(0, 7),
    [profiles],
  );
  return (
    <div className="search-page">
      <div className="search-body">
        <SearchSidebar
          query={query}
          onQueryChange={handleQueryChange}
          onCommit={commitSearch}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          recentSearches={recentSearches}
          onSelectRecent={commitSearch}
          onRemoveRecent={s => setRecentSearches(prev => prev.filter(recent => recent !== s))}
          suggestions={suggestions}
          onSelectSuggestion={commitSearch}
        />
        <SearchResults
          results={filteredResults}
          committedQuery={committedQuery}
          activeFilter={activeFilter}
          hasSearched={hasSearched}
          featuredProfiles={profiles.slice(0, 4)}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
