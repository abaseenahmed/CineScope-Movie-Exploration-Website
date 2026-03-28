// components/movie/MovieCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMovieContext } from '../../context/MovieContext';

const MovieCard = ({ movie }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovieContext();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isFav = isFavorite(movie.imdbID);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFromFavorites(movie.imdbID);
    } else {
      addToFavorites(movie);
    }
  };

  const posterUrl =
    imageError || movie.Poster === 'N/A'
      ? 'https://via.placeholder.com/300x450/27272a/a1a1aa?text=Poster'
      : movie.Poster;

  const rating = parseFloat(movie.imdbRating);
  const ratingColor =
    rating >= 8 ? 'text-emerald-400' : rating >= 6 ? 'text-amber-400' : 'text-rose-400';

  return (
    <Link
      to={`/movie/${movie.imdbID}`}
      className="group relative block overflow-hidden rounded-2xl ring-1 ring-zinc-200/90 transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-zinc-900/12 dark:ring-white/[0.08] dark:hover:shadow-black/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
        <img
          src={posterUrl}
          alt={movie.Title}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition duration-300 ${
            isFav
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/30'
              : 'bg-zinc-950/50 text-white backdrop-blur-md hover:bg-amber-500 hover:text-zinc-950'
          } ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className="h-4 w-4"
            fill={isFav ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-lg border border-white/10 bg-zinc-950/55 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <svg className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className={ratingColor}>{movie.imdbRating}</span>
          </div>
        )}

        {movie.Year && movie.Year !== 'N/A' && (
          <div className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-zinc-950/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
            {movie.Year}
          </div>
        )}
      </div>

      <div className="border-t border-zinc-100 bg-white px-3 py-3.5 dark:border-white/[0.06] dark:bg-zinc-900/80">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 transition group-hover:text-amber-700 dark:text-zinc-50 dark:group-hover:text-amber-400">
          {movie.Title}
        </h3>

        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{movie.Year || '—'}</span>
          {movie.Type && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 capitalize text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {movie.Type}
            </span>
          )}
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          {movie.Runtime && movie.Runtime !== 'N/A' && (
            <p className="mt-2 text-xs text-zinc-500 line-clamp-1 dark:text-zinc-400">{movie.Runtime}</p>
          )}
          {movie.Genre && movie.Genre !== 'N/A' && (
            <p className="text-xs text-zinc-500 line-clamp-1 dark:text-zinc-400">
              {movie.Genre.split(',').slice(0, 2).join(',')}
            </p>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
        <span className="rounded-full border border-white/25 bg-zinc-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
          Details
        </span>
      </div>
    </Link>
  );
};

export default MovieCard;
