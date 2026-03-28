import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-zinc-200/80 bg-zinc-100/50 dark:border-white/[0.06] dark:bg-zinc-900/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-start">
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="font-display text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              CineScope
            </Link>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              A quiet space to search, save, and revisit the films that stay with you.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 md:justify-end">
            <Link
              to="/"
              className="text-sm font-medium text-zinc-600 transition hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="text-sm font-medium text-zinc-600 transition hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
            >
              Discover
            </Link>
            <Link
              to="/favorites"
              className="text-sm font-medium text-zinc-600 transition hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
            >
              Collection
            </Link>
            <a
              href="https://www.omdbapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-600 transition hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
            >
              OMDb
            </a>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200/60 pt-8 dark:border-white/[0.06] sm:flex-row">
          <p className="text-xs tracking-wide text-zinc-500 dark:text-zinc-500">
            © {currentYear} CineScope. Crafted for film lovers.
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600">Data provided by OMDb API</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
