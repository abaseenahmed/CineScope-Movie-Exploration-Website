// components/movie/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getSearchSuggestions } from '../../services/api';

const SearchBar = ({ onSearch, initialValue = '', placeholder = 'Search movies...', variant = 'default' }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  const isHero = variant === 'hero';

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 2) {
        setIsLoading(true);
        try {
          const results = await getSearchSuggestions(query);
          setSuggestions(results);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.Title);
    onSearch(suggestion.Title);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch('');
    }
  };

  const inputShell =
    'w-full rounded-2xl border py-3.5 pl-11 pr-24 text-[15px] transition duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50';

  const inputTheme = isHero
    ? 'border-white/20 bg-white/10 text-white placeholder:text-white/50 backdrop-blur-xl dark:border-white/15 dark:bg-zinc-950/40'
    : 'border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 dark:border-white/[0.08] dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-500';

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 ${isHero ? 'text-white/60' : 'text-zinc-400'}`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className={`${inputShell} ${inputTheme}`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute inset-y-0 right-[3.25rem] flex items-center pr-1 ${isHero ? 'text-white/50 hover:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <button
          type="submit"
          className={`absolute inset-y-1.5 right-1.5 inline-flex items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
            isHero
              ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
              : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400'
          }`}
        >
          Search
        </button>
      </form>

      {showSuggestions && query.trim().length > 0 && (
        <div className="animate-fade-in-up absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/95 shadow-2xl shadow-zinc-900/10 backdrop-blur-xl dark:border-white/[0.08] dark:bg-zinc-900/95 dark:shadow-black/40">
          {isLoading ? (
            <div className="px-4 py-4 text-center">
              <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-amber-500 dark:border-zinc-700 dark:border-t-amber-400" />
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              <div className="border-b border-zinc-100 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:border-white/[0.06] dark:text-zinc-500">
                Suggestions
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.imdbID}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
                >
                  {suggestion.Poster && suggestion.Poster !== 'N/A' && (
                    <img
                      src={suggestion.Poster}
                      alt=""
                      className="h-14 w-10 shrink-0 rounded-md object-cover ring-1 ring-zinc-200/80 dark:ring-white/10"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-zinc-900 dark:text-zinc-100">{suggestion.Title}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {suggestion.Year} · <span className="capitalize">{suggestion.Type}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim().length > 2 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">No matches for "{query}"</p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">Try a shorter or alternate title.</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
