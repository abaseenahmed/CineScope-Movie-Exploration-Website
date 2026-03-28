// services/api.js - Complete version with all needed functions

const BASE_URL = 'https://www.omdbapi.com/';

const getApiKey = () => {
  const key = import.meta.env.VITE_OMDB_API_KEY?.trim();
  return key || '';
};

/** OMDb only accepts a single release year via `y`, not `year`. Decade options use the range start year. */
const normalizeYearForOmdb = (year) => {
  if (year == null || String(year).trim() === '') return '';
  const str = String(year);
  if (/^\d{4}-\d{4}$/.test(str)) return str.split('-')[0];
  if (/^\d{4}$/.test(str)) return str;
  return '';
};

// Helper function
const fetchAPI = async (params) => {
  const API_KEY = getApiKey();
  if (!API_KEY) {
    throw new Error(
      'Missing OMDb API key. Add VITE_OMDB_API_KEY to a .env file in the project root (free key at https://www.omdbapi.com/apikey.aspx), then restart the dev server.'
    );
  }

  const urlParams = new URLSearchParams({ apikey: API_KEY, ...params });
  const response = await fetch(`${BASE_URL}?${urlParams}`);
  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'OMDb request failed');
  }

  return data;
};

// Search movies
export const searchMovies = async ({ s, type = '', year = '', page = 1 }) => {
  const y = normalizeYearForOmdb(year);
  const params = { s, type, page, ...(y ? { y } : {}) };
  Object.keys(params).forEach((key) => {
    const v = params[key];
    if (v === '' || v == null || v === undefined) delete params[key];
  });
  return fetchAPI(params);
};

// Get movie by ID
export const getMovieById = async (id, plot = 'full') => {
  return fetchAPI({ i: id, plot });
};

// Get trending movies
export const getTrendingMovies = async () => {
  const results = await searchMovies({ s: 'movie', page: 1 });
  return results.Search || [];
};

// Get random recommendations
export const getRandomRecommendations = async (count = 6) => {
  const searchTerms = ['action', 'comedy', 'drama', 'thriller', 'romance', 'sci-fi'];
  const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
  
  try {
    const results = await searchMovies({ s: randomTerm, page: 1 });
    return results.Search?.slice(0, count) || [];
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

// Get search suggestions
export const getSearchSuggestions = async (query) => {
  if (!query || query.length < 2) return [];
  try {
    const results = await searchMovies({ s: query });
    return results.Search?.slice(0, 5) || [];
  } catch (error) {
    return [];
  }
};

export default {
  searchMovies,
  getMovieById,
  getTrendingMovies,
  getRandomRecommendations,
  getSearchSuggestions
};