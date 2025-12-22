import React, { useState, useCallback } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import "./SearchFilter.css";

function SearchFilter({ 
  onSearch, 
  onFilter, 
  searchPlaceholder = "Search...",
  filterOptions = [],
  showAdvanced = true 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(
    filterOptions.reduce((acc, opt) => ({ ...acc, [opt.key]: "" }), {})
  );

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    onSearch?.(value);
  }, [onSearch]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    onFilter?.({ ...filters, [key]: value });
  }, [filters, onFilter]);

  const handleClearFilters = () => {
    const cleared = filterOptions.reduce((acc, opt) => ({ ...acc, [opt.key]: "" }), {});
    setFilters(cleared);
    onFilter?.(cleared);
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div className="search-filter-container">
      {/* Search Bar */}
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => handleSearch("")}
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Filter Toggle Button */}
      {showAdvanced && filterOptions.length > 0 && (
        <button
          className={`filter-toggle ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
          title="Toggle filters"
        >
          <FaFilter />
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
        </button>
      )}

      {/* Filter Panel */}
      {showAdvanced && showFilters && filterOptions.length > 0 && (
        <div className="filter-panel">
          <div className="filter-header">
            <h4>Filters</h4>
            {activeFilterCount > 0 && (
              <button className="clear-filters-btn" onClick={handleClearFilters}>
                Clear All
              </button>
            )}
          </div>

          <div className="filter-options">
            {filterOptions.map((option) => (
              <div key={option.key} className="filter-group">
                <label htmlFor={`filter-${option.key}`}>{option.label}</label>
                {option.type === "select" ? (
                  <select
                    id={`filter-${option.key}`}
                    value={filters[option.key] || ""}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All {option.label}</option>
                    {option.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : option.type === "range" ? (
                  <div className="filter-range">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters[option.key]?.min || ""}
                      onChange={(e) =>
                        handleFilterChange(option.key, {
                          ...filters[option.key],
                          min: e.target.value,
                        })
                      }
                      className="range-input"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters[option.key]?.max || ""}
                      onChange={(e) =>
                        handleFilterChange(option.key, {
                          ...filters[option.key],
                          max: e.target.value,
                        })
                      }
                      className="range-input"
                    />
                  </div>
                ) : (
                  <input
                    type={option.type || "text"}
                    placeholder={option.placeholder}
                    value={filters[option.key] || ""}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                    className="filter-input"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFilter;
