import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, StarHalf } from 'lucide-react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { id, title, price, rating, thumbnail, discountPercentage, stock, category, brand } = product;

  // Calculate original price based on current price and discountPercentage
  const originalPrice = discountPercentage 
    ? Math.round(price / (1 - discountPercentage / 100)) 
    : price;

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  // Helper to render rating stars
  const renderStars = (ratingVal) => {
    const stars = [];
    const fullStars = Math.floor(ratingVal);
    const hasHalf = ratingVal % 1 >= 0.4; // 0.4 or higher counts as half star
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={14} fill="currentColor" strokeWidth={0} />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
            <Star size={14} className="star-empty" style={{ color: 'var(--text-muted)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden', color: 'currentColor' }}>
              <Star size={14} fill="currentColor" strokeWidth={0} />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={14} className="star-empty" style={{ color: 'var(--text-muted)' }} />);
      }
    }
    return stars;
  };

  // Stock status text & style
  const getStockStatus = () => {
    if (stock === 0) return { text: 'Out of Stock', class: 'stock-out' };
    if (stock < 10) return { text: `Only ${stock} left`, class: 'stock-low' };
    return { text: 'In Stock', class: 'stock-ok' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="product-card" onClick={handleCardClick} role="button" tabIndex={0}>
      {/* Discount badge */}
      {discountPercentage > 0 && (
        <div className="discount-badge">
          {Math.round(discountPercentage)}% OFF
        </div>
      )}

      {/* Product Image */}
      <div className="product-card-image-wrapper">
        <img 
          src={thumbnail} 
          alt={title} 
          className="product-card-image"
          loading="lazy" 
        />
      </div>

      {/* Product Info */}
      <div className="product-card-info">
        <span className="product-card-category">{brand || category}</span>
        <h3 className="product-card-title" title={title}>{title}</h3>
        
        {/* Rating */}
        <div className="product-card-rating">
          <div className="stars-list">
            {renderStars(rating)}
          </div>
          <span className="rating-value">{rating.toFixed(1)}</span>
        </div>

        {/* Pricing & Stock */}
        <div className="product-card-price-row">
          <span className="product-card-price">${price.toFixed(2)}</span>
          {discountPercentage > 0 && originalPrice > price && (
            <span className="product-card-original-price">${originalPrice.toFixed(2)}</span>
          )}
        </div>
        
        <div className={`stock-status-badge ${stockStatus.class}`}>
          {stockStatus.text}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
