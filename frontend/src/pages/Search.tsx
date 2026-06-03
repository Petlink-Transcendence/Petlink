import { useEffect, useState } from 'react';
import './Search.css';

export default function Search() {

    useEffect(() => {
    document.title = 'Search | PetLink';
  }, []);

    return (
    <div className="search-page">
      <div className="search-body"></div>
    </div>
    );
}