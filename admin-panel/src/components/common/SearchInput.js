import React from 'react'
import Dropdown from './Dropdown'

function SearchInput({searchType, setSearchType, searchQuery, setSearchQuery, placeholder, searchFilters, searchTypeMap}) {
    return (
        <div className="searchBoxUtility">
            <div className="searchInputUtility">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="inputField"
                />
                <Dropdown
                    options={searchFilters}
                    selected={Object.keys(searchTypeMap).find((key) => searchTypeMap[key] === searchType)}
                    onSelect={(label) => setSearchType(searchTypeMap[label])}
                    isSimple={true}
                />
            </div>
        </div>
    )
}

export default SearchInput