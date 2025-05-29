import React, { useState, useEffect } from 'react';

const DarkModeToggle = ({ isScrolled }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved preference in localStorage, default to false (light mode)
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Determine icon color based on dark mode and whether navbar is scrolled or over hero
  let iconColorClass = '';
  let moonOutlineColorClass = 'stroke-mygreen'; // For the green outline

  if (isDarkMode) {
    iconColorClass = isScrolled ? 'text-yellow-400' : 'text-yellow-400'; // Stays yellow in dark mode
  } else {
    iconColorClass = isScrolled ? 'text-gray-700' : 'text-mygreen-dark'; // Changed from text-white to text-mygreen-dark when not scrolled for better visibility on light hero
    // If not scrolled (on hero), the iconColorClass is now text-mygreen-dark.
    // The outline will be 'stroke-mygreen'. This should provide good contrast.
    // If scrolled, iconColorClass is text-gray-700, outline is stroke-mygreen.
  }

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 ${isScrolled ? 'hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-env-green-dark dark:focus:ring-env-green-light' : 'hover:bg-white/20 focus:ring-white/50'}`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${iconColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-15.66l-.707.707M4.04 19.96l-.707.707M21 12h-1M4 12H3m15.66 8.66l-.707-.707M4.04 4.04l-.707-.707" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6`} fill="none" viewBox="0 0 24 24">
          {/* Green Outline Path */}
          <path 
            className={moonOutlineColorClass}
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} // Slightly thicker for outline effect
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
          {/* Original Moon Path - will be drawn on top */}
          <path 
            className={iconColorClass} // Uses the determined color for the moon body
            stroke="currentColor" // Make sure this inherits the color from className
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} // Slightly thinner than original if outline is present, or keep at 2 if only one path.
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
  );
};

export default DarkModeToggle; 