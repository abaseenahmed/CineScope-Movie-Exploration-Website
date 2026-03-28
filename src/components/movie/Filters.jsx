// components/movie/Filters.jsx
import React, { useState } from 'react';

const Filters = ({ filters, onFilterChange, showResults = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    year: filters.year || '',
    type: filters.type || '',
  });

  const years = [
    {value: '', label: 'Any year'},
    {value: '2024', label: '2024'},
    {value: '2023', label: '2023'},
    {value: '2022', label: '2022'},
    {value: '2021', label: '2021'},
    {value: '2020', label: '2020'},
    {value: '2019', label: '2019'},
    {value: '2018', label: '2018'},
    {value: '2010-2019', label: '2010s'},
    {value: '2000-2009', label: '2000s'},
    {value: '1990-1999', label: '1990s'},
    {value: '1980-1989', label: '1980s'},
    {value: '1970-1979', label: '1970s'},
    {value: '1960-1969', label: '1960s'},
  ];

  const types = [
    { value: '', label: 'All' },
    { value: 'movie', label: 'Film' },
    { value: 'series', label: 'Series' },
    { value: 'episode', label: 'Episode' },
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { year: '', type: '' };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = filters.year || filters.type;

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 shadow-xl shadow-zinc-900/5 dark:border-white/[0.08] dark:bg-zinc-900/60 dark:shadow-none">
      <div className="border-b border-zinc-100 px-5 py-4 dark:border-white/[0.06]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50">Refine</h3>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Year & format</p>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold uppercase tracking-wider text-amber-600 transition hover:text-amber-500 dark:text-amber-400"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Year
          </label>
          <select
            value={localFilters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm text-zinc-900 transition focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100"
          >
            {years.map((year) => (
              <option key={year.value || 'any'} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            {types.map((type) => (
              <button
                key={type.value || 'all'}
                type="button"
                onClick={() => handleFilterChange('type', type.value)}
                className={`rounded-xl px-2 py-2.5 text-center text-xs font-semibold transition ${
                  localFilters.type === type.value
                    ? 'bg-zinc-900 text-white shadow-md dark:bg-amber-500/20 dark:text-amber-300 dark:ring-1 dark:ring-amber-500/40'
                    : 'border border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="border-t border-zinc-100 pt-4 dark:border-white/[0.06]">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Active</p>
            <div className="flex flex-wrap gap-2">
              {localFilters.year && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-800 dark:text-amber-200">
                  {years.find((y) => y.value === localFilters.year)?.label || localFilters.year}
                  <button type="button" onClick={() => handleFilterChange('year', '')} className="ml-0.5 opacity-70 hover:opacity-100" aria-label="Clear year">
                    ×
                  </button>
                </span>
              )}
              {localFilters.type && (
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200/80 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  {types.find((t) => t.value === localFilters.type)?.label}
                  <button type="button" onClick={() => handleFilterChange('type', '')} className="ml-0.5 opacity-70 hover:opacity-100" aria-label="Clear type">
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {showResults && (
          <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-500">Filters apply to your current search.</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full border-t border-zinc-100 py-3 text-center text-xs font-medium text-zinc-500 transition hover:bg-zinc-50 dark:border-white/[0.06] dark:hover:bg-white/[0.03] lg:hidden"
      >
        {isExpanded ? 'Less' : 'More options'}
      </button>

      {isExpanded && (
        <div className="space-y-4 border-t border-zinc-100 px-5 py-4 dark:border-white/[0.06] lg:hidden">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Rating and language filters are visual only for now.</p>
        </div>
      )}

      <div className="border-t border-zinc-100 bg-zinc-50/80 px-5 py-3 text-center dark:border-white/[0.06] dark:bg-zinc-950/50">
        <p className="text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-500">OMDb returns one year per title; decade picks use range start.</p>
      </div>
    </div>
  );
};

export default Filters;
