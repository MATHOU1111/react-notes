import React, { useState } from 'react';
import './SearchBar.css';
import searchBarIcon from '../../assets/searchIcon.svg';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form className="search-bar-container" onSubmit={handleSubmit}>
            <img src={searchBarIcon} alt="Search" className="search-bar-icon" style={{cursor: 'pointer'}}/>
            <input
                className="search-bar-input"
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Rechercher .."
            />
        </form>
    );
}

export default SearchBar;
