// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Initial value if no value exists in localStorage
 * @returns {[any, function, function]} - [storedValue, setValue, removeValue]
 */
const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or return initialValue
      if (item) {
        return JSON.parse(item);
      }
      
      // If initialValue is a function, call it to get the value
      if (typeof initialValue === 'function') {
        return initialValue();
      }
      
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // Update localStorage whenever storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  // Function to update the stored value
  const setValue = (value) => {
    try {
      // Allow value to be a function for previous state pattern
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error updating localStorage key "${key}":`, error);
    }
  };
  
  // Function to remove the item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(null);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };
  
  // Function to check if the key exists
  const exists = () => {
    try {
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking localStorage key "${key}":`, error);
      return false;
    }
  };
  
  return [storedValue, setValue, removeValue, exists];
};

/**
 * Enhanced version with additional features
 */
export const useLocalStorageEnhanced = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Update localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue, isLoading]);
  
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error updating localStorage key "${key}":`, error);
    }
  };
  
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(null);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };
  
  const clear = () => {
    try {
      window.localStorage.clear();
      setStoredValue(null);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };
  
  const getAllKeys = () => {
    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  };
  
  return {
    value: storedValue,
    setValue,
    removeValue,
    clear,
    exists: () => window.localStorage.getItem(key) !== null,
    getAllKeys,
    isLoading
  };
};

/**
 * Hook for managing an array in localStorage
 */
export const useLocalStorageArray = (key, initialArray = []) => {
  const [items, setItems] = useLocalStorage(key, initialArray);
  
  const addItem = (item) => {
    setItems(prev => [...prev, item]);
  };
  
  const removeItem = (itemToRemove) => {
    setItems(prev => prev.filter(item => item !== itemToRemove));
  };
  
  const removeItemById = (id, idField = 'id') => {
    setItems(prev => prev.filter(item => item[idField] !== id));
  };
  
  const updateItem = (updatedItem, idField = 'id') => {
    setItems(prev => prev.map(item => 
      item[idField] === updatedItem[idField] ? updatedItem : item
    ));
  };
  
  const clearAll = () => {
    setItems([]);
  };
  
  const contains = (item) => {
    return items.includes(item);
  };
  
  const containsById = (id, idField = 'id') => {
    return items.some(item => item[idField] === id);
  };
  
  return {
    items,
    addItem,
    removeItem,
    removeItemById,
    updateItem,
    clearAll,
    contains,
    containsById,
    length: items.length
  };
};

/**
 * Hook for managing an object in localStorage
 */
export const useLocalStorageObject = (key, initialObject = {}) => {
  const [object, setObject] = useLocalStorage(key, initialObject);
  
  const setField = (field, value) => {
    setObject(prev => ({ ...prev, [field]: value }));
  };
  
  const getField = (field) => {
    return object[field];
  };
  
  const removeField = (field) => {
    const { [field]: _, ...rest } = object;
    setObject(rest);
  };
  
  const updateObject = (updates) => {
    setObject(prev => ({ ...prev, ...updates }));
  };
  
  const resetObject = () => {
    setObject(initialObject);
  };
  
  return {
    object,
    setField,
    getField,
    removeField,
    updateObject,
    resetObject
  };
};

/**
 * Hook with expiration time for localStorage items
 */
export const useLocalStorageWithExpiry = (key, initialValue, expiryTime = 24 * 60 * 60 * 1000) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      
      if (item) {
        const parsedItem = JSON.parse(item);
        const now = new Date().getTime();
        
        if (now < parsedItem.expiry) {
          return parsedItem.value;
        } else {
          // Item expired, remove it
          window.localStorage.removeItem(key);
          return initialValue;
        }
      }
      
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  useEffect(() => {
    try {
      const now = new Date().getTime();
      const item = {
        value: storedValue,
        expiry: now + expiryTime
      };
      window.localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, expiryTime]);
  
  return [storedValue, setStoredValue];
};

// Default export
export default useLocalStorage;