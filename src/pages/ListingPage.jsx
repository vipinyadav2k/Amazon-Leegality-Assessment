import React, { useState, useEffect, useMemo } from 'react';
import { useFilters } from '../context/FilterContext';
import ProductCard from '../components/ProductCard';
import { GridSkeleton, CategorySkeleton } from '../components/Skeleton';
import { Filter, ChevronLeft, ChevronRight, RefreshCw, AlertTriangle } from 'lucide-react';

const ListingPage = () => {
  const {
    searchTerm,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    selectedBrands,
    toggleBrand,
    currentPage,
    setCurrentPage,
    limit,
    sortOption,
    setSortOption,
    resetFilters,
  } = useFilters();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await fetch('https://dummyjson.com/products/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        // Handle if dummyjson returns strings or objects
        const normalized = data.map((cat) =>
          typeof cat === 'object' ? cat : { slug: cat, name: cat }
        );
        setCategories(normalized);
      } catch (err) {
        console.error('Categories fetch error:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products depending on selectedCategory
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setError(null);
        
        let url = 'https://dummyjson.com/products?limit=200';
        if (selectedCategory) {
          url = `https://dummyjson.com/products/category/${selectedCategory}?limit=100`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Products fetch error:', err);
        setError(err.message || 'Something went wrong while fetching products.');
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  // Extract unique brands based on current category products
  const uniqueBrands = useMemo(() => {
    const brands = new Set();
    products.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [products]);

  // Handle local state for price inputs to make typing smooth
  const [minPriceInput, setMinPriceInput] = useState(priceRange.min);
  const [maxPriceInput, setMaxPriceInput] = useState(priceRange.max);

  // Sync inputs with global state (e.g. on reset or back button)
  useEffect(() => {
    setMinPriceInput(priceRange.min);
    setMaxPriceInput(priceRange.max);
  }, [priceRange]);

  const handlePriceBlurOrSubmit = () => {
    setPriceRange({ min: minPriceInput, max: maxPriceInput });
  };

  const handlePriceKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePriceBlurOrSubmit();
    }
  };

  // Perform combined client-side filtering, sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Text Search Filter (Title, Brand, Category, Description)
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          (p.brand && p.brand.toLowerCase().includes(term)) ||
          p.category.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    // 2. Price Filter
    if (priceRange.min !== '') {
      const minVal = parseFloat(priceRange.min);
      if (!isNaN(minVal)) {
        result = result.filter((p) => p.price >= minVal);
      }
    }
    if (priceRange.max !== '') {
      const maxVal = parseFloat(priceRange.max);
      if (!isNaN(maxVal)) {
        result = result.filter((p) => p.price <= maxVal);
      }
    }

    // 3. Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }

    // 4. Sorting
    if (sortOption === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'featured') {
      result.sort((a, b) => b.discountPercentage - a.discountPercentage);
    }

    return result;
  }, [products, searchTerm, priceRange, selectedBrands, sortOption]);

  // Pagination bounds
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  // Auto reset page if it goes out of bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage, setCurrentPage]);

  // Paginated items to render
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredProducts.slice(start, start + limit);
  }, [filteredProducts, currentPage, limit]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setSelectedCategory('');
    resetFilters();
  };

  return (
    <div className="listing-layout">
      {/* Sidebar Filters */}
      <aside className="filters-sidebar">
        <div className="filters-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <Filter size={18} /> Filters
          </h2>
          {(selectedCategory || selectedBrands.length > 0 || priceRange.min || priceRange.max || searchTerm) && (
            <button onClick={resetFilters} className="clear-all-btn">
              Clear All
            </button>
          )}
        </div>

        {/* Categories Section */}
        <div className="filter-section">
          <h3 className="filter-title">Category</h3>
          {categoriesLoading ? (
            <CategorySkeleton />
          ) : (
            <div className="category-filter-list">
              <button
                className={`category-item ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  className={`category-item ${selectedCategory === cat.slug ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Section */}
        <div className="filter-section">
          <h3 className="filter-title">Price Range ($)</h3>
          <div className="price-inputs-container">
            <input
              type="number"
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              onBlur={handlePriceBlurOrSubmit}
              onKeyDown={handlePriceKeyDown}
              className="price-input"
              min="0"
            />
            <span className="price-separator">to</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              onBlur={handlePriceBlurOrSubmit}
              onKeyDown={handlePriceKeyDown}
              className="price-input"
              min="0"
            />
          </div>
        </div>

        {/* Brands Section */}
        {uniqueBrands.length > 0 && (
          <div className="filter-section">
            <h3 className="filter-title">Brand</h3>
            <div className="brand-filter-list">
              {uniqueBrands.map((brand) => (
                <label key={brand} className="brand-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="brand-checkbox"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main product area */}
      <section className="products-section">
        {/* Results stats and Sorting */}
        <div className="products-results-bar">
          <div className="results-count">
            {productsLoading ? (
              <span>Loading products...</span>
            ) : (
              <span>
                Showing <strong>{Math.min(totalItems, (currentPage - 1) * limit + 1)}-{Math.min(totalItems, currentPage * limit)}</strong> of <strong>{totalItems}</strong> products
                {selectedCategory && ` in ${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}`}
              </span>
            )}
          </div>

          <div className="sort-select-wrapper">
            <span className="sort-select-label">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Grid and States */}
        {error ? (
          <div className="empty-state">
            <AlertTriangle className="empty-state-icon" style={{ color: '#ef4444' }} />
            <h3 className="empty-state-title">Loading Error</h3>
            <p className="empty-state-desc">{error}</p>
            <button className="btn-primary" onClick={handleRetry}>
              <RefreshCw size={16} /> Reset & Retry
            </button>
          </div>
        ) : productsLoading ? (
          <GridSkeleton count={limit} />
        ) : totalItems === 0 ? (
          <div className="empty-state">
            <AlertTriangle className="empty-state-icon" />
            <h3 className="empty-state-title">No Products Found</h3>
            <p className="empty-state-desc">
              Your active filters returned 0 results. Try clearing search filters or broadening your price search.
            </p>
            <button className="btn-primary" onClick={resetFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                  title="Previous Page"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="pagination-arrow" />
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Render all pages if totalPages is small, else we could truncate, but since 100 products has max 9 pages, rendering all is clean
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                  title="Next Page"
                  aria-label="Next Page"
                >
                  <ChevronRight className="pagination-arrow" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ListingPage;
