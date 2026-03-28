// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMovieContext } from '../context/MovieContext';
import { getRandomRecommendations } from '../services/api';
import MovieGrid from '../components/movie/MovieGrid';
import { MovieCardSkeleton } from '../components/common/Loader';

const Home = () => {
  const {
    trendingMovies,
    loading,
    searchMovies,
    error,
    favorites
  } = useMovieContext();

  const [recommendations, setRecommendations] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const recs = await getRandomRecommendations(6);
        setRecommendations(recs);

        if (trendingMovies && trendingMovies.length > 0) {
          setFeaturedMovie(trendingMovies[Math.floor(Math.random() * trendingMovies.length)]);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setRecommendationsLoading(false);
        setHeroLoading(false);
      }
    };

    fetchHomeData();
  }, [trendingMovies]);

  const HeroSection = () => {
    if (heroLoading) {
      return (
        <div className="relative h-[72vh] min-h-[520px] animate-pulse bg-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/50 to-zinc-800" />
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-5">
              <div className="h-6 w-32 rounded-full bg-white/10" />
              <div className="h-14 w-4/5 rounded-lg bg-white/10" />
              <div className="h-24 rounded-xl bg-white/5" />
              <div className="flex gap-3">
                <div className="h-12 w-36 rounded-full bg-white/10" />
                <div className="h-12 w-36 rounded-full bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-[72vh] min-h-[520px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={featuredMovie?.Poster !== 'N/A' ? featuredMovie?.Poster : 'https://via.placeholder.com/1920x1080/18181b/a1a1aa?text=CineScope'}
            alt={featuredMovie?.Title || ''}
            className="h-full w-full scale-105 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                Spotlight
              </span>
              <span className="h-px w-12 bg-gradient-to-r from-amber-500/50 to-transparent" />
            </div>
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {featuredMovie?.Title || 'Where every frame tells a story'}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-zinc-300">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {featuredMovie?.imdbRating || '—'}/10
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-500" />
              <span>{featuredMovie?.Year || '—'}</span>
              {featuredMovie?.Runtime && featuredMovie.Runtime !== 'N/A' && (
                <>
                  <span className="h-1 w-1 rounded-full bg-zinc-500" />
                  <span>{featuredMovie.Runtime}</span>
                </>
              )}
            </div>
            <p className="mt-6 line-clamp-3 text-base leading-relaxed text-zinc-400 sm:text-lg">
              {featuredMovie?.Plot ||
                'Search curated titles, trace the films you love, and keep a personal collection—minimal noise, maximum atmosphere.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {featuredMovie?.imdbID && (
                <Link
                  to={`/movie/${featuredMovie.imdbID}`}
                  className="inline-flex items-center justify-center rounded-full bg-amber-500 px-7 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 hover:shadow-amber-400/30"
                >
                  View title
                </Link>
              )}
              <Link
                to="/movies"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/35 hover:bg-white/10"
              >
                Open catalogue
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-zinc-500">
          <span className="text-[10px] font-medium uppercase tracking-[0.35em]">Scroll</span>
          <div className="h-8 w-5 rounded-full border border-white/20 p-1">
            <div className="mx-auto h-1.5 w-1 rounded-full bg-amber-400/80 animate-bounce" />
          </div>
        </div>
      </div>
    );
  };

  const CategorySection = ({ title, subtitle, viewAllLink, children, loading: sectionLoading }) => (
    <section className="mb-16 md:mb-20">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
          >
            View all
            <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      {sectionLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
          <MovieCardSkeleton count={5} />
        </div>
      ) : (
        children
      )}
    </section>
  );

  const StatsSection = () => {
    const stats = [
      { label: 'Titles indexed', value: '10,000+' },
      { label: 'Community ratings', value: '1M+' },
      { label: 'Active explorers', value: '100K+' },
      { label: 'Genres & moods', value: '25+' },
    ];

    return (
      <section className="relative my-16 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 px-6 py-14 shadow-xl shadow-zinc-900/5 dark:border-white/[0.08] dark:bg-zinc-900/50 dark:shadow-none md:px-10 md:py-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="relative grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <div className="font-display text-3xl font-semibold text-zinc-900 dark:text-zinc-50 md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const QuickSearchSection = () => {
    const genres = ['Action', 'Comedy', 'Drama', 'Thriller', 'Romance', 'Sci-Fi', 'Horror', 'Animation'];

    return (
      <section className="mb-16 md:mb-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
          Browse by mood
        </h2>
        <p className="mt-2 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
          Quick jumps into tone and genre—each opens a fresh search in the catalogue.
        </p>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => searchMovies(genre)}
              className="rounded-full border border-zinc-200/90 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-800 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-amber-400/35 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
            >
              {genre}
            </button>
          ))}
        </div>
      </section>
    );
  };

  const FavoritesPreview = () => {
    if (favorites.length === 0) return null;

    const favoritePreview = favorites.slice(0, 5);

    return (
      <section className="mb-16 md:mb-20">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
              Your collection
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Saved for another night.</p>
          </div>
          <Link
            to="/favorites"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400"
          >
            All saved ({favorites.length})
            <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-6">
          {favoritePreview.map((movie) => (
            <Link key={movie.imdbID} to={`/movie/${movie.imdbID}`} className="group">
              <div className="relative overflow-hidden rounded-2xl ring-1 ring-zinc-200/80 transition duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-zinc-900/15 dark:ring-white/[0.08] dark:group-hover:shadow-black/40">
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/27272a/a1a1aa?text=No+Poster'}
                  alt={movie.Title}
                  className="aspect-[2/3] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition group-hover:translate-y-0">
                  <h3 className="line-clamp-2 font-medium text-white drop-shadow-md">{movie.Title}</h3>
                  <p className="mt-1 text-xs text-zinc-300">{movie.Year}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen">
      <HeroSection />

      {error && (
        <div className="border-b border-amber-500/20 bg-amber-500/10 dark:bg-amber-950/30">
          <div className="mx-auto max-w-7xl px-5 py-4 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-amber-950 dark:text-amber-100">{error}</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <CategorySection
          title="Now trending"
          subtitle="A living strip of what audiences are opening right now."
          viewAllLink="/movies"
          loading={loading}
        >
          <MovieGrid movies={trendingMovies} />
        </CategorySection>

        <StatsSection />

        <QuickSearchSection />

        <FavoritesPreview />

        <CategorySection
          title="Handpicked for you"
          subtitle="A small rotation of titles across tone and era."
          viewAllLink="/movies"
          loading={recommendationsLoading}
        >
          <MovieGrid movies={recommendations} />
        </CategorySection>

        <section className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-900 px-8 py-14 text-center shadow-2xl dark:border-white/[0.08] dark:bg-zinc-950 md:px-14 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent" />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
              Ready when the lights go down
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-zinc-400">
              Step into the full catalogue—search, filter, and build a collection that feels like your own private festival.
            </p>
            <Link
              to="/movies"
              className="mt-8 inline-flex rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
            >
              Enter catalogue
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
