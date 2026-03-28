// pages/Favorites.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/movie/MovieCard';
import Loader from '../components/common/Loader';

const Favorites = () => {
  const { favorites, removeFromFavorites, loading } = useMovieContext();
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const availableGenres = [
    'all',
    ...new Set(favorites.flatMap((movie) => (movie.Genre ? movie.Genre.split(', ').map((g) => g.trim()) : []))),
  ];

  useEffect(() => {
    let result = [...favorites];

    if (searchTerm) {
      result = result.filter(
        (movie) =>
          movie.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.Year?.includes(searchTerm) ||
          movie.Actors?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== 'all') {
      result = result.filter((movie) => movie.Genre && movie.Genre.includes(selectedGenre));
    }

    switch (sortBy) {
      case 'recent':
        result = result.reverse();
        break;
      case 'title':
        result.sort((a, b) => a.Title?.localeCompare(b.Title));
        break;
      case 'year':
        result.sort((a, b) => (b.Year || 0) - (a.Year || 0));
        break;
      case 'rating':
        result.sort((a, b) => {
          const ratingA = parseFloat(a.imdbRating) || 0;
          const ratingB = parseFloat(b.imdbRating) || 0;
          return ratingB - ratingA;
        });
        break;
      default:
        break;
    }

    setFilteredFavorites(result);
  }, [favorites, searchTerm, sortBy, selectedGenre]);

  const handleClearAll = () => {
    if (window.confirm('Remove every title from your collection?')) {
      favorites.forEach((movie) => {
        removeFromFavorites(movie.imdbID);
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader size="lg" message="Opening your shelf…" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-white/[0.08] dark:bg-zinc-900">
              <svg className="h-8 w-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-semibold text-zinc-900 dark:text-zinc-50">Your shelf is empty</h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Save films as you browse—they’ll appear here for quiet revisits.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/movies"
                className="rounded-full bg-amber-500 px-8 py-3 text-center text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
              >
                Open catalogue
              </Link>
              <Link
                to="/"
                className="rounded-full border border-zinc-200 bg-white px-8 py-3 text-center text-sm font-semibold text-zinc-800 transition hover:border-amber-500/40 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="relative overflow-hidden border-b border-zinc-200/60 bg-zinc-900 py-12 md:py-16 dark:border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_20%,rgba(245,158,11,0.15),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 opacity-95" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-400/90">Collection</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl lg:text-5xl">Saved titles</h1>
            <p className="mt-3 text-sm text-zinc-400">
              {favorites.length} {favorites.length === 1 ? 'film' : 'films'} on your shelf
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearAll}
            className="shrink-0 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
          >
            Clear shelf
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by title, year, or actor…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-11 pr-4 text-sm text-zinc-900 shadow-sm transition focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                ×
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
              >
                <option value="recent">Recently saved</option>
                <option value="title">Title A–Z</option>
                <option value="year">Year (newest)</option>
                <option value="rating">Rating (high)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
              >
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All genres' : genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredFavorites.length !== favorites.length && (
          <div className="mb-8 rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-3 text-sm text-zinc-600 dark:border-white/[0.06] dark:bg-zinc-900/50 dark:text-zinc-400">
            Showing {filteredFavorites.length} of {favorites.length}
            {searchTerm && ` · “${searchTerm}”`}
            {selectedGenre !== 'all' && ` · ${selectedGenre}`}
          </div>
        )}

        {filteredFavorites.length === 0 && (
          <div className="rounded-3xl border border-dashed border-zinc-200 py-16 text-center dark:border-white/[0.08]">
            <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50">No matches</h3>
            <p className="mt-2 text-sm text-zinc-500">Relax filters to see your titles again.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('all');
              }}
              className="mt-6 text-sm font-semibold text-amber-600 dark:text-amber-400"
            >
              Reset filters
            </button>
          </div>
        )}

        {filteredFavorites.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
              {filteredFavorites.map((movie) => (
                <div key={movie.imdbID} className="group relative">
                  <MovieCard movie={movie} />
                  <button
                    type="button"
                    onClick={() => removeFromFavorites(movie.imdbID)}
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-zinc-950/70 text-white opacity-0 backdrop-blur-md transition hover:bg-rose-600/90 group-hover:opacity-100"
                    aria-label="Remove from collection"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-14 rounded-3xl border border-zinc-200/80 bg-white/90 p-8 dark:border-white/[0.06] dark:bg-zinc-900/50">
              <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50">Shelf snapshot</h3>
              <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
                <div>
                  <div className="font-display text-3xl font-semibold text-amber-600 dark:text-amber-400">{favorites.length}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Titles</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold text-amber-600 dark:text-amber-400">
                    {[...new Set(favorites.flatMap((m) => (m.Year ? [m.Year] : [])))].length}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Years</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold text-amber-600 dark:text-amber-400">{availableGenres.length - 1}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Genres</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold text-amber-600 dark:text-amber-400">
                    {(favorites.reduce((sum, m) => sum + (parseFloat(m.imdbRating) || 0), 0) / favorites.length || 0).toFixed(1)}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Avg IMDb</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const summary = `CineScope collection\n${favorites.length} titles\nAvg: ${(favorites.reduce((sum, m) => sum + (parseFloat(m.imdbRating) || 0), 0) / favorites.length || 0).toFixed(1)}/10\n\n${favorites.map((m) => m.Title).join(', ')}`;
                  navigator.clipboard.writeText(summary);
                  alert('Copied list to clipboard.');
                }}
                className="mt-8 w-full rounded-2xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400"
              >
                Copy list
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
