// components/movie/MovieDetails.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMovieContext } from '../../context/MovieContext';

const MovieDetails = ({ movie }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovieContext();
  const [isFav, setIsFav] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullPlot, setShowFullPlot] = useState(false);

  useEffect(() => {
    if (movie?.imdbID) {
      setIsFav(isFavorite(movie.imdbID));
    }
  }, [movie, isFavorite]);

  if (!movie) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No detail payload.</p>
      </div>
    );
  }

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFromFavorites(movie.imdbID);
      setIsFav(false);
    } else {
      addToFavorites(movie);
      setIsFav(true);
    }
  };

  const posterUrl =
    imageError || movie.Poster === 'N/A'
      ? 'https://via.placeholder.com/500x750/27272a/a1a1aa?text=Poster'
      : movie.Poster;

  const rating = parseFloat(movie.imdbRating);
  const ratingPercentage = Math.min(100, (rating / 10) * 100);
  const ratingTone =
    rating >= 8 ? 'from-emerald-500 to-emerald-400' : rating >= 6 ? 'from-amber-500 to-amber-400' : 'from-rose-500 to-rose-400';

  const genres = movie.Genre?.split(', ') || [];
  const directors = movie.Director?.split(', ') || [];
  const writers = movie.Writer?.split(', ') || [];
  const actors = movie.Actors?.split(', ') || [];

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950">
      <div className="relative h-[48vh] min-h-[320px] overflow-hidden md:h-[56vh] lg:h-[62vh]">
        {movie.Poster !== 'N/A' && (
          <div className="absolute inset-0">
            <img
              src={posterUrl}
              alt=""
              className="h-full w-full scale-110 object-cover blur-2xl opacity-40 dark:opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/70 to-zinc-50 dark:to-zinc-950" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/75 to-zinc-950/20" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(245,158,11,0.12),transparent_50%)]" />

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-10 sm:px-6 md:items-center md:pb-0 lg:px-8">
          <div className="max-w-3xl pb-4 text-white md:pb-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-400/90">Feature</p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight md:text-4xl lg:text-5xl">
              {movie.Title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {movie.Year && (
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur-md">
                  {movie.Year}
                </span>
              )}
              {movie.Runtime && movie.Runtime !== 'N/A' && (
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur-md">
                  {movie.Runtime}
                </span>
              )}
              {movie.Rated && movie.Rated !== 'N/A' && (
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur-md">
                  {movie.Rated}
                </span>
              )}
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-200">
                  <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {movie.imdbRating}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <div className="lg:w-[30%] xl:w-[26%]">
            <div className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-3xl ring-1 ring-zinc-200/90 shadow-2xl shadow-zinc-900/15 dark:ring-white/[0.08] dark:shadow-black/50">
                <img src={posterUrl} alt={movie.Title} className="w-full" onError={() => setImageError(true)} />
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handleFavoriteClick}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition ${
                    isFav
                      ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25 hover:bg-amber-400'
                      : 'border border-zinc-200 bg-white text-zinc-800 hover:border-amber-500/40 hover:bg-amber-500/[0.07] dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-amber-400/35'
                  }`}
                >
                  <svg
                    className="h-5 w-5"
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
                  {isFav ? 'Saved to collection' : 'Save to collection'}
                </button>

                <button
                  type="button"
                  onClick={() => window.open(`https://www.imdb.com/title/${movie.imdbID}`, '_blank')}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-900 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:border-white/10"
                >
                  Open on IMDb
                </button>
              </div>

              {movie.Ratings && movie.Ratings.length > 0 && (
                <div className="mt-8 rounded-3xl border border-zinc-200/80 bg-white/90 p-5 dark:border-white/[0.06] dark:bg-zinc-900/60">
                  <h3 className="font-display text-base font-semibold text-zinc-900 dark:text-zinc-50">Scores</h3>
                  <div className="mt-4 space-y-3">
                    {movie.Ratings.map((r, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-zinc-100 pb-3 text-sm last:border-0 last:pb-0 dark:border-white/[0.06]">
                        <span className="text-zinc-500 dark:text-zinc-400">{r.Source}</span>
                        <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{r.Value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-10">
            <section>
              <h2 className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Synopsis</h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                {showFullPlot ? movie.Plot : `${movie.Plot?.slice(0, 320)}${movie.Plot?.length > 320 ? '…' : ''}`}
                {movie.Plot?.length > 320 && (
                  <button
                    type="button"
                    onClick={() => setShowFullPlot(!showFullPlot)}
                    className="ml-2 font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400"
                  >
                    {showFullPlot ? 'Less' : 'More'}
                  </button>
                )}
              </p>
            </section>

            {genres.length > 0 && genres[0] !== 'N/A' && (
              <section>
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Genres</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Link
                      key={genre}
                      to={`/search?q=${encodeURIComponent(genre)}`}
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:border-amber-500/45 hover:text-amber-800 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-amber-400/35"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className="grid gap-8 md:grid-cols-2">
              {directors.length > 0 && directors[0] !== 'N/A' && (
                <section>
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    Director{directors.length > 1 ? 's' : ''}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
                    {directors.join(' · ')}
                  </p>
                </section>
              )}

              {writers.length > 0 && writers[0] !== 'N/A' && (
                <section>
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    Writer{writers.length > 1 ? 's' : ''}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">{writers.slice(0, 4).join(' · ')}</p>
                </section>
              )}
            </div>

            {actors.length > 0 && actors[0] !== 'N/A' && (
              <section>
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Principal cast</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {actors.map((actor) => (
                    <span
                      key={actor}
                      className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <div className="grid grid-cols-2 gap-4 rounded-3xl border border-zinc-200/80 bg-white/80 p-5 md:grid-cols-3 dark:border-white/[0.06] dark:bg-zinc-900/50">
              {movie.Country && movie.Country !== 'N/A' && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Country</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{movie.Country}</p>
                </div>
              )}
              {movie.Language && movie.Language !== 'N/A' && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Language</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{movie.Language}</p>
                </div>
              )}
              {movie.Awards && movie.Awards !== 'N/A' && (
                <div className="col-span-2 md:col-span-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Awards</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">{movie.Awards}</p>
                </div>
              )}
              {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Box office</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{movie.BoxOffice}</p>
                </div>
              )}
              {movie.Production && movie.Production !== 'N/A' && (
                <div className="col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Production</p>
                  <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">{movie.Production}</p>
                </div>
              )}
              {movie.Website && movie.Website !== 'N/A' && (
                <div className="col-span-2 md:col-span-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Site</p>
                  <a
                    href={movie.Website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400"
                  >
                    Visit
                  </a>
                </div>
              )}
            </div>

            {movie.imdbRating && movie.imdbRating !== 'N/A' && !isNaN(rating) && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    IMDb
                  </span>
                  <span className="font-display text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                    {movie.imdbRating}
                    <span className="text-sm font-normal text-zinc-500">/10</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${ratingTone} transition-all duration-700`}
                    style={{ width: `${ratingPercentage}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">{movie.imdbVotes || '—'} votes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
