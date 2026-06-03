import { useEffect, useState } from 'react';
import './Search.css';
import SearchSidebar from '../components/search/SearchSidebar';


export default function Search() {

    useEffect(() => {
    document.title = 'Search | PetLink';
  }, []);

    return (
    <div className="search-page">
      <div className="search-body">
        <SearchSidebar/>
      </div>
    </div>
    );
}