// pages/NotFound.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 px-5 py-20 dark:bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.08),transparent_55%)]" />
      <div className="relative w-full max-w-xl text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-amber-600/80 dark:text-amber-400/90">404</p>
        <h1 className="mt-4 font-display text-7xl font-semibold leading-none text-zinc-900 dark:text-zinc-50 sm:text-8xl">Lost reel</h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          This URL isn’t in the programme. Try home, the catalogue, or a quick title below.
        </p>

        <div className="mt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">Try a title</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['Inception', 'The Dark Knight', 'Interstellar', 'Avatar', 'Titanic'].map((movie) => (
              <button
                key={movie}
                type="button"
                onClick={() => navigate(`/search?q=${encodeURIComponent(movie)}`)}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 shadow-sm transition hover:border-amber-500/40 hover:text-amber-800 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-amber-400/35"
              >
                {movie}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/"
            className="rounded-full bg-amber-500 px-8 py-3 text-center text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
          >
            Home
          </Link>
          <Link
            to="/movies"
            className="rounded-full border border-zinc-200 bg-white px-8 py-3 text-center text-sm font-semibold text-zinc-800 transition hover:border-amber-500/40 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
          >
            Catalogue
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-transparent px-8 py-3 text-sm font-semibold text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Back
          </button>
        </div>

        <div className="mt-14 rounded-3xl border border-zinc-200/80 bg-white/70 px-6 py-5 dark:border-white/[0.06] dark:bg-zinc-900/40">
          <p className="font-display text-sm italic text-zinc-600 dark:text-zinc-400">“Not all those who wander are lost—but this URL is.”</p>
          <p className="mt-2 text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600">CineScope</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
