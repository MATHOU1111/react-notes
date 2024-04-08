import React from 'react';
import './SearchBar.css';
import searchBarIcon from '../../assets/searchIcon.svg';

function SearchBar({ onSearch , onChange , searchTerm }) {


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
                onChange={onChange}
                placeholder="Rechercher .."
            />
            {searchTerm ? (
                    <span
                        className="search-bar-clear"
                        onClick={() => onChange({target: {value: ""}})}
                    >
                        X
                    </span>

            ) : null}
        </form>
    );
}

export default SearchBar;
