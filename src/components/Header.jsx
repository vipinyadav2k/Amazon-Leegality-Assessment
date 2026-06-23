import React, { useState, useEffect } from 'react';
import { useFilters } from '../context/FilterContext';
import { Search, Sun, Moon, ShoppingBag, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { searchTerm, setSearchTerm, resetFilters } = useFilters();
  const [theme, setTheme] = useState(() => {
    // Read from localStorage or system preference
    const saved = localStorage.getItem('app-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-mode');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark-mode');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogoClick = () => {
    resetFilters();
    navigate('/');
  };

  const handleSearchChange = (e) => {
    // If not on listing page, navigate back to listing page on search
    if (location.pathname !== '/') {
      navigate('/');
    }
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="header-logo" onClick={handleLogoClick}>
          <ShoppingBag className="logo-icon" />
          <span className="logo-text">
            amazon<span className="logo-accent">premium</span>
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="header-search">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={clearSearch} className="clear-search-btn" aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
