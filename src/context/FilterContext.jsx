import React, { createContext, useContext, useState, useCallback } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12); // 12 products per page (fits 2, 3, or 4 column grids)
  const [sortOption, setSortOption] = useState('featured'); // 'price-low', 'price-high', 'rating', 'featured'

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSelectedBrands([]);
    setCurrentPage(1);
    setSortOption('featured');
  }, []);

  const handleSetCategory = useCallback((category) => {
    setSelectedCategory(category);
    setSelectedBrands([]); // Reset brand selections when category changes since brands might differ
    setCurrentPage(1); // Reset to first page
  }, []);

  const handleSetPriceRange = useCallback((range) => {
    setPriceRange(range);
    setCurrentPage(1);
  }, []);

  const toggleBrand = useCallback((brand) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((b) => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
    setCurrentPage(1);
  }, []);

  const handleSetSearchTerm = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  return (
    <FilterContext.Provider
      value={{
        searchTerm,
        setSearchTerm: handleSetSearchTerm,
        selectedCategory,
        setSelectedCategory: handleSetCategory,
        priceRange,
        setPriceRange: handleSetPriceRange,
        selectedBrands,
        setSelectedBrands,
        toggleBrand,
        currentPage,
        setCurrentPage,
        limit,
        sortOption,
        setSortOption,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
