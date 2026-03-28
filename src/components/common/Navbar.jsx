import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  let location;
  try {
    location = useLocation();
  } catch {
    location = { pathname: window.location.pathname };
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Discover' },
    { to: '/favorites', label: 'Collection' },
  ];

  const isActive = (path) => {
    if (!location) return false;
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/60 bg-zinc-50/75 backdrop-blur-2xl dark:border-white/[0.06] dark:bg-zinc-950/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-[4.25rem]">
          <Link to="/" className="group flex flex-col gap-0">
            <span className="font-display text-2xl font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-amber-600 dark:text-zinc-50 dark:group-hover:text-amber-400 md:text-[1.65rem]">
              CineScope
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-500 sm:block">
              Curated Cinema
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex md:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive(link.to)
                    ? 'bg-zinc-900 text-white shadow-md shadow-zinc-900/20 dark:bg-amber-500/15 dark:text-amber-400 dark:shadow-none'
                    : 'text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/80 text-zinc-700 transition hover:border-zinc-300 dark:border-white/10 dark:text-zinc-300 dark:hover:border-white/20 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="animate-fade-in-up border-t border-zinc-200/60 py-4 dark:border-white/[0.06] md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-zinc-900 text-white dark:bg-amber-500/15 dark:text-amber-400'
                      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
