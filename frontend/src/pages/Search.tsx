import { useEffect, useState } from 'react';
import './Search.css';
import SearchSidebar from '../components/search/SearchSidebar';
import SearchResults from '../components/search/SearchResults';

const allProfiles = [
  { id: 1, name: 'Ana Costa',    role: 'Cat Sitter',  location: 'Porto, PT',   rating: '4.9' },
  { id: 2, name: 'Miguel Reis',  role: 'Dog Walker',  location: 'Lisbon, PT',  rating: '4.7' },
  { id: 3, name: 'Sara Mendes',  role: 'Pet Sitter',  location: 'Braga, PT',   rating: '5.0' },
  { id: 4, name: 'Jane Doe',     role: 'Pet Owner',   location: 'Porto, PT'                  },
  { id: 5, name: 'João Silva',   role: 'Cat Sitter',  location: 'Porto, PT',   rating: '4.8' },
  { id: 6, name: 'Rui Faria',    role: 'Dog Sitter',  location: 'Porto, PT',   rating: '4.6' },
  { id: 7, name: 'Inês Sousa',   role: 'Cat Walker',  location: 'Lisbon, PT',  rating: '4.5' },
  { id: 8, name: 'John Smith',   role: 'Pet Owner',   location: 'Lisbon, PT'                 },
];

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

  const commitSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
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
          onQueryChange={setQuery}
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
