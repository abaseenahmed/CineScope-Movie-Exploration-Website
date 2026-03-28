// components/common/Loader.jsx
import React from 'react';

const Loader = ({ type = 'default', size = 'md', fullScreen = false, message = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={`${sizeClasses[size]} animate-spin`}>
            <svg className="h-full w-full text-amber-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        );

      case 'pulse':
        return (
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} animate-pulse rounded-full bg-gradient-to-r from-amber-500 to-amber-600`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );

      case 'bounce':
        return (
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} animate-bounce rounded-full bg-gradient-to-r from-amber-500 to-amber-600`}
                style={{ animationDelay: `${i * 0.1}s`, animationDuration: '0.8s' }}
              />
            ))}
          </div>
        );

      case 'ring':
        return (
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-zinc-200 border-t-amber-500 dark:border-zinc-700 dark:border-t-amber-400`} />
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`${sizeClasses[size].replace('w-', 'w-2').replace('h-', 'h-2')} animate-pulse rounded-full bg-amber-500`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );

      case 'wave':
        return (
          <div className="flex items-center space-x-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`${sizeClasses[size].replace('w-', 'w-1').replace('h-', 'h-8')} animate-wave rounded-full bg-gradient-to-t from-amber-600 to-amber-400`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case 'logo':
        return (
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-amber-500 to-amber-600 opacity-75 blur-lg" />
            <div className="relative rounded-full bg-gradient-to-r from-amber-500 to-amber-600 p-3">
              <svg className={`${sizeClasses[size]} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        );

      default:
        return (
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-zinc-200 border-t-amber-500 dark:border-zinc-700 dark:border-t-amber-400`} />
        );
    }
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {renderLoader()}
      {message && (
        <p className="animate-pulse text-sm text-zinc-500 dark:text-zinc-400">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50/85 backdrop-blur-md dark:bg-zinc-950/90">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

// Skeleton Loader for movie cards
export const MovieCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="group relative overflow-hidden rounded-2xl bg-zinc-200/90 ring-1 ring-zinc-200/80 animate-pulse dark:bg-zinc-800 dark:ring-white/[0.06]"
        >
          <div className="aspect-[2/3] w-full bg-zinc-300/80 dark:bg-zinc-700/80" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 rounded-lg bg-zinc-300/90 dark:bg-zinc-700/90" />
            <div className="h-3 w-1/2 rounded-lg bg-zinc-200 dark:bg-zinc-700/70" />
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700/80" />
              <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700/80" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

// Grid Skeleton for movie lists
export const MovieGridSkeleton = ({ count = 8, columns = 4 }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      <MovieCardSkeleton count={count} />
    </div>
  );
};

// Details Page Skeleton
export const MovieDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
        {/* Poster Skeleton */}
        <div className="lg:w-1/3">
          <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>

        {/* Details Skeleton */}
        <div className="lg:w-2/3 space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="flex gap-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-20" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-20" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-20" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Search Bar Skeleton
export const SearchBarSkeleton = () => {
  return (
    <div className="w-full max-w-md animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
    </div>
  );
};

// Navbar Skeleton
export const NavbarSkeleton = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-white/10 animate-pulse">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="hidden md:flex gap-4">
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Add wave animation CSS
const styles = `
  @keyframes wave {
    0%, 100% {
      transform: scaleY(0.5);
    }
    50% {
      transform: scaleY(1.5);
    }
  }
  .animate-wave {
    animation: wave 1s ease-in-out infinite;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Loader;