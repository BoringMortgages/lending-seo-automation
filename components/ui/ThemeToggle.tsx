'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before checking theme
  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setDarkMode(shouldUseDark);
    
    // Apply theme to document
    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="w-14 h-8 bg-boring-light-gray rounded-full p-1 transition-colors duration-300"
        disabled
      >
        <div className="w-6 h-6 bg-white rounded-full transition-transform duration-300" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative w-14 h-8 rounded-full p-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-boring-purple focus:ring-offset-2',
        darkMode 
          ? 'bg-boring-purple shadow-inner' 
          : 'bg-boring-light-gray shadow-sm'
      )}
      aria-label="Toggle dark mode"
    >
      {/* Toggle Circle */}
      <div
        className={cn(
          'w-6 h-6 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center',
          darkMode 
            ? 'transform translate-x-6 bg-white' 
            : 'transform translate-x-0 bg-boring-teal'
        )}
      >
        {/* Icon */}
        {darkMode ? (
          <svg 
            className="w-3 h-3 text-boring-purple" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
              clipRule="evenodd" 
            />
          </svg>
        ) : (
          <svg 
            className="w-3 h-3 text-white" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" 
            />
          </svg>
        )}
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {darkMode && (
          <div className="absolute inset-0 bg-gradient-to-r from-boring-purple/20 to-boring-bright-green/10 rounded-full" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;