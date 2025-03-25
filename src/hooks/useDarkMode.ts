import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  // Check if we have a saved preference, otherwise use system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if running in browser environment
    if (typeof window === 'undefined') return false;
    
    const savedMode = localStorage.getItem('darkMode');
    
    // If user has a saved preference, use that
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    
    // Otherwise, use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to document when isDarkMode changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };
    
    // Add event listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Reset to system preference
  const resetToSystemPreference = () => {
    localStorage.removeItem('darkMode');
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  };

  return { 
    isDarkMode, 
    toggleDarkMode, 
    resetToSystemPreference,
    // Return whether the current setting is from the system or user preference
    isSystemPreference: localStorage.getItem('darkMode') === null
  };
};
