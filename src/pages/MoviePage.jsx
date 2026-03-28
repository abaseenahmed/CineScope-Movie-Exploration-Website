// pages/MoviePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useMovieContext } from '../context/MovieContext';
import MovieDetails from '../components/movie/MovieDetails';
import MovieGrid from '../components/movie/MovieGrid';
import SearchBar from '../components/movie/SearchBar';
import Filters from '../components/movie/Filters';
import Loader from '../components/common/Loader';

const MoviePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentMovie,
    searchResults,
    loading,
    error,
    searchMovies,
    getMovieDetails,
    clearSearch,
    filters,
    updateFilters,
    pagination,
    changePage
  } = useMovieContext();

  const [activeTab, setActiveTab] = useState('details');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      searchMovies(query, filters);
      setActiveTab('search');
    }
  }, [location.search]);

  useEffect(() => {
    if (id) {
      getMovieDetails(id);
      setActiveTab('details');
    }
  }, [id]);

  const handleSearch = useCallback(
    (query) => {
      if (query.trim()) {
        setSearchQuery(query);
        searchMovies(query, filters);
        setActiveTab('search');
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    },
    [searchMovies, filters, navigate]
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      updateFilters(newFilters);
      if (searchQuery) {
        searchMovies(searchQuery, { ...filters, ...newFilters });
      }
    },
    [updateFilters, searchMovies, searchQuery, filters]
  );

  const handlePageChange = useCallback(
    (page) => {
      changePage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [changePage]
  );

  const handleClearSearch = useCallback(() => {
    clearSearch();
    setSearchQuery('');
    setActiveTab('details');
    navigate('/movies');
  }, [clearSearch, navigate]);

  if (id) {
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <Loader size="lg" message="Loading details…" />
        </div>
      );
    }

    if (!currentMovie) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-5 dark:bg-zinc-950">
          <div className="max-w-md text-center">
            <h2 className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Title not found</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              It may have been removed from the index or the link is outdated.
            </p>
            <button
              type="button"
              onClick={() => navigate('/movies')}
              className="mt-8 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400"
            >
              Back to catalogue
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <MovieDetails movie={currentMovie} />

        {currentMovie.Genre && (
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-50 md:text-3xl">
              More you may like
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Curated placeholders—search the catalogue for similar titles.</p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-2xl ring-1 ring-zinc-200/80 dark:ring-white/[0.06]">
                  <div className="aspect-[2/3] bg-zinc-200 dark:bg-zinc-800" />
                  <div className="space-y-2 border-t border-zinc-100 bg-white p-3 dark:border-white/[0.06] dark:bg-zinc-900">
                    <div className="h-3.5 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800/80" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="relative overflow-hidden border-b border-zinc-200/60 bg-zinc-900 py-12 md:py-16 dark:border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(245,158,11,0.22),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 opacity-90" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-400/90">Catalogue</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
            {activeTab === 'search' ? 'Search results' : 'Discover film'}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-400">
            {activeTab === 'search'
              ? `Matches for “${searchQuery}”`
              : 'Search by title, name, or keyword—then refine with year and format.'}
          </p>

          <div className="mt-8 max-w-2xl">
            <SearchBar
              onSearch={handleSearch}
              initialValue={searchQuery}
              placeholder="Title, actor, director…"
              variant="hero"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 dark:bg-amber-950/30">
            <p className="text-sm font-medium text-amber-950 dark:text-amber-100">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          <aside className="shrink-0 lg:w-72">
            <div className="lg:sticky lg:top-24">
              <Filters
                filters={filters}
                onFilterChange={handleFilterChange}
                showResults={activeTab === 'search' && searchResults.length > 0}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader size="lg" message="Searching the index…" />
              </div>
            ) : activeTab === 'search' && searchResults.length === 0 && searchQuery ? (
              <div className="rounded-3xl border border-dashed border-zinc-200 bg-white/60 px-6 py-16 text-center dark:border-white/[0.08] dark:bg-zinc-900/40">
                <h3 className="font-display text-xl font-semibold text-zinc-900 dark:text-zinc-50">No matches</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
                  Nothing turned up for “{searchQuery}”. Try a broader term or clear filters.
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-8 rounded-full border border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-amber-500/50 hover:text-amber-800 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-amber-400/40"
                >
                  Reset catalogue view
                </button>
              </div>
            ) : activeTab === 'search' && searchResults.length > 0 ? (
              <>
                <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">{pagination.totalResults}</span>{' '}
                    titles in this set
                  </p>
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-sm font-medium text-zinc-500 transition hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
                  >
                    Clear search
                  </button>
                </div>

                <MovieGrid movies={searchResults} />

                {pagination.totalPages > 1 && (
                  <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
                    >
                      Previous
                    </button>

                    <div className="flex flex-wrap justify-center gap-1">
                      {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`min-w-[2.5rem] rounded-full px-3 py-2 text-sm font-medium transition ${
                              pagination.currentPage === pageNum
                                ? 'bg-zinc-900 text-white shadow-md dark:bg-amber-500 dark:text-zinc-950'
                                : 'border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="space-y-12">
                <div>
                  <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-zinc-50 md:text-2xl">
                    Popular entry points
                  </h2>
                  <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                    {['Action', 'Comedy', 'Drama', 'Thriller', 'Romance', 'Sci-Fi', 'Horror', 'Animation'].map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleSearch(genre)}
                        className="rounded-2xl border border-zinc-200/90 bg-white py-3 text-center text-sm font-medium text-zinc-700 shadow-sm transition hover:border-amber-500/35 hover:bg-amber-500/[0.06] dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-amber-400/30"
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-zinc-50 md:text-2xl">
                    Often opened
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {['Inception', 'The Dark Knight', 'Interstellar', 'Avatar', 'Titanic', 'The Matrix'].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSearch(term)}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600 transition hover:border-amber-500/40 hover:text-amber-800 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-amber-300"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-200/80 bg-white/70 p-8 dark:border-white/[0.06] dark:bg-zinc-900/50">
                  <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50">Search notes</h3>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    <li>— Lead with the film title when you can.</li>
                    <li>— Year and type filters narrow noisy results.</li>
                    <li>— Cast and director names often work as queries.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
