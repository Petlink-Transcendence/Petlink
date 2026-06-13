import { useEffect, useState } from 'react';
import './Search.css';
import SearchSidebar from '../components/search/SearchSidebar';
import SearchResults from '../components/search/SearchResults';
import { searchProfiles } from '../data/profileData';

const allProfiles = searchProfiles;

const featuredProfiles = allProfiles.slice(0, 4);

const suggestions = ['Cat Sitter', 'Dog Walker', 'Porto', 'Lisbon', 'Grooming', 'Overnight Stay', 'Rabbits'];

export default function Search() {
  const [query, setQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    document.title = 'Search | PetLink';
  }, []);

  const resetSearch = () => {
    setQuery('');
    setCommittedQuery('');
    setHasSearched(false);
    setActiveFilter('All');
  };

  const handleQueryChange = (term: string) => {
    setQuery(term);

    if (term.trim() === '') {
      setCommittedQuery('');
      setHasSearched(false);
      setActiveFilter('All');
    }
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
    setRecentSearches(prev =>
      [trimmed, ...prev.filter(s => s !== trimmed)].slice(0, 5)
    );
  };

  const handleRemoveRecent = (s: string) =>
    setRecentSearches(prev => prev.filter(r => r !== s));

  const filteredResults = allProfiles.filter(p => {
    const q = committedQuery.toLowerCase();
    const matchesQuery =
      p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q);

    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Sitters' && /sitter|walker/i.test(p.role)) ||
      (activeFilter === 'Owners'  && /owner/i.test(p.role));

    return matchesQuery && matchesFilter;
  });

  return (
    <div className="search-page">
      <div className="search-body">
        <SearchSidebar
          query={query}
          onQueryChange={handleQueryChange}
          onCommit={commitSearch}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          recentSearches={recentSearches}
          onSelectRecent={commitSearch}
          onRemoveRecent={handleRemoveRecent}
          suggestions={suggestions}
          onSelectSuggestion={commitSearch}
        />
        <SearchResults
          results={filteredResults}
          committedQuery={committedQuery}
          hasSearched={hasSearched}
          featuredProfiles={featuredProfiles}
        />
      </div>
    </div>
  );
}
