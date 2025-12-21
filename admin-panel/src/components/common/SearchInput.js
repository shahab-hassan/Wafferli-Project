import React from 'react';
import { FaSearch } from 'react-icons/fa';
import Dropdown from './Dropdown';

function SearchInput({
    searchType,
    setSearchType,
    searchQuery,
    setSearchQuery,
    searchFilters,
    searchTypeMap,
    placeholder,
    onSearch
}) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch();
        }
    };

    const handleSearchClick = () => {
        if(!searchQuery || searchQuery.trim() === '') return;
        if (onSearch) {
            onSearch();
        }
    };

    return (
        /* Restored the old outer container class */
        <div className="searchBoxUtility">
            <div className="searchInputUtility">
                <input
                    type="text"
                    className="inputField" // Restored old class
                    placeholder={placeholder || 'Search...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                />

                {/* Restored Dropdown logic and position */}
                {searchFilters && searchFilters.length > 0 && (
                    <Dropdown
                        options={searchFilters}
                        selected={Object.keys(searchTypeMap).find((key) => searchTypeMap[key] === searchType)}
                        onSelect={(label) => setSearchType(searchTypeMap[label])}
                        isSimple={true}
                    />
                )}

            </div>

            <div 
            style={
                { 
                    padding: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: 'white',
                    cursor: searchQuery.trim() ? 'pointer' : 'default', 
                    background: "var(--primaryBlue)",
                    borderRadius: '8px'
                }
            } 
            onClick={handleSearchClick}>
                <FaSearch size={14} />
            </div>

        </div>
    );
}

export default SearchInput;