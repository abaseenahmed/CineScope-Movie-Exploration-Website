import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { searchMovies, getMovieById, getTrendingMovies } from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';

// Create Context
const MovieContext = createContext();

// Initial State
const initialState = {
  movies: [],
  currentMovie: null,
  loading: false,
  error: null,
  searchQuery: '',
  searchResults: [],
  trendingMovies: [],
  favorites: [],
  filters: {
    year: '',
    type: '',
    page: 1
  },
  pagination: {
    currentPage: 1,
    totalResults: 0,
    totalPages: 0
  }
};

// Action Types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_MOVIES: 'SET_MOVIES',
  SET_CURRENT_MOVIE: 'SET_CURRENT_MOVIE',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_TRENDING_MOVIES: 'SET_TRENDING_MOVIES',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  SET_FAVORITES: 'SET_FAVORITES',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  CLEAR_SEARCH: 'CLEAR_SEARCH'
};

// Reducer Function
const movieReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTION_TYPES.SET_MOVIES:
      return { ...state, movies: action.payload, loading: false };
    
    case ACTION_TYPES.SET_CURRENT_MOVIE:
      return { ...state, currentMovie: action.payload, loading: false };
    
    case ACTION_TYPES.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case ACTION_TYPES.SET_SEARCH_RESULTS:
      return { 
        ...state, 
        searchResults: action.payload.results,
        pagination: {
          currentPage: action.payload.page,
          totalResults: action.payload.totalResults,
          totalPages: Math.ceil(action.payload.totalResults / 10)
        },
        loading: false,
        error: null
      };
    
    case ACTION_TYPES.SET_TRENDING_MOVIES:
      return { ...state, trendingMovies: action.payload, loading: false, error: null };
    
    case ACTION_TYPES.ADD_FAVORITE:
      return { ...state, favorites: [...state.favorites, action.payload] };
    
    case ACTION_TYPES.REMOVE_FAVORITE:
      return { 
        ...state, 
        favorites: state.favorites.filter(movie => movie.imdbID !== action.payload) 
      };
    
    case ACTION_TYPES.SET_FAVORITES:
      return { ...state, favorites: action.payload };
    
    case ACTION_TYPES.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case ACTION_TYPES.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    
    case ACTION_TYPES.CLEAR_SEARCH:
      return { ...state, searchQuery: '', searchResults: [], pagination: initialState.pagination, error: null };
    
    default:
      return state;
  }
};

// Provider Component
export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);
  const [storedFavorites, setStoredFavorites] = useLocalStorage('cineScopeFavorites', []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (storedFavorites.length > 0) {
      dispatch({ type: ACTION_TYPES.SET_FAVORITES, payload: storedFavorites });
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (state.favorites.length > 0 || storedFavorites.length > 0) {
      setStoredFavorites(state.favorites);
    }
  }, [state.favorites, setStoredFavorites]);

  // Load trending movies on mount
  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  // Fetch trending movies
  const fetchTrendingMovies = async () => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      const movies = await getTrendingMovies();
      dispatch({ type: ACTION_TYPES.SET_TRENDING_MOVIES, payload: movies });
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_TRENDING_MOVIES, payload: [] });
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  // Search movies with filters
  const searchMoviesHandler = async (query, filters = {}) => {
    if (!query.trim()) return;
    
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    dispatch({ type: ACTION_TYPES.SET_SEARCH_QUERY, payload: query });
    
    try {
      const searchParams = {
        s: query,
        page: filters.page || state.filters.page,
        type: filters.type || state.filters.type,
        year: filters.year || state.filters.year
      };
      
      const results = await searchMovies(searchParams);
      
      if (results.Search) {
        dispatch({ 
          type: ACTION_TYPES.SET_SEARCH_RESULTS, 
          payload: {
            results: results.Search,
            page: searchParams.page,
            totalResults: parseInt(results.totalResults)
          }
        });
      } else {
        dispatch({ 
          type: ACTION_TYPES.SET_SEARCH_RESULTS, 
          payload: { results: [], page: 1, totalResults: 0 }
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_SEARCH_RESULTS,
        payload: { results: [], page: 1, totalResults: 0 }
      });
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  // Get movie details by ID
  const getMovieDetails = async (id) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      const movie = await getMovieById(id);
      dispatch({ type: ACTION_TYPES.SET_CURRENT_MOVIE, payload: movie });
      return movie;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  };

  // Add to favorites
  const addToFavorites = (movie) => {
    const exists = state.favorites.some(fav => fav.imdbID === movie.imdbID);
    if (!exists) {
      dispatch({ type: ACTION_TYPES.ADD_FAVORITE, payload: movie });
      return true;
    }
    return false;
  };

  // Remove from favorites
  const removeFromFavorites = (movieId) => {
    dispatch({ type: ACTION_TYPES.REMOVE_FAVORITE, payload: movieId });
  };

  // Check if movie is in favorites
  const isFavorite = (movieId) => {
    return state.favorites.some(movie => movie.imdbID === movieId);
  };

  // Clear search results
  const clearSearch = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_SEARCH });
  };

  // Update filters
  const updateFilters = (filters) => {
    dispatch({ type: ACTION_TYPES.SET_FILTERS, payload: filters });
  };

  // Change page
  const changePage = (page) => {
    dispatch({ type: ACTION_TYPES.SET_PAGINATION, payload: { currentPage: page } });
    if (state.searchQuery) {
      searchMoviesHandler(state.searchQuery, { ...state.filters, page });
    }
  };

  // Context value
  const value = {
    // State
    movies: state.movies,
    currentMovie: state.currentMovie,
    loading: state.loading,
    error: state.error,
    searchQuery: state.searchQuery,
    searchResults: state.searchResults,
    trendingMovies: state.trendingMovies,
    favorites: state.favorites,
    filters: state.filters,
    pagination: state.pagination,
    
    // Actions
    searchMovies: searchMoviesHandler,
    getMovieDetails,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearSearch,
    updateFilters,
    changePage,
    fetchTrendingMovies
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};

// Custom Hook for using Movie Context
export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};

export default MovieContext;