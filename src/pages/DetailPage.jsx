import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailSkeleton } from '../components/Skeleton';
import { ArrowLeft, Star, Heart, ShieldCheck, Truck, RotateCcw, AlertTriangle } from 'lucide-react';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  // Fetch product data on mount / ID change
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to fetch product details');
        }
        const data = await res.json();
        setProduct(data);
        // Default to first image or thumbnail
        setActiveImage(data.images && data.images.length > 0 ? data.images[0] : data.thumbnail);
      } catch (err) {
        console.error('Detail fetch error:', err);
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="empty-state" style={{ marginTop: '2rem' }}>
        <AlertTriangle className="empty-state-icon" style={{ color: '#ef4444' }} />
        <h3 className="empty-state-title">{error === 'Product not found' ? 'Product Not Found' : 'Error'}</h3>
        <p className="empty-state-desc">
          {error === 'Product not found'
            ? 'The product you are trying to view does not exist or has been removed.'
            : error}
        </p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Products
        </button>
      </div>
    );
  }

  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    images,
    thumbnail,
    sku,
    weight,
    dimensions,
    warrantyInformation,
    shippingInformation,
    availabilityStatus,
    returnPolicy,
    reviews,
  } = product;

  // Calculate original price
  const originalPrice = discountPercentage
    ? Math.round(price / (1 - discountPercentage / 100))
    : price;

  // Helper to render stars
  const renderStars = (ratingVal) => {
    const stars = [];
    const fullStars = Math.floor(ratingVal);
    const hasHalf = ratingVal % 1 >= 0.4;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={16} fill="currentColor" strokeWidth={0} />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
            <Star size={16} className="star-empty" style={{ color: 'var(--text-muted)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden', color: 'currentColor' }}>
              <Star size={16} fill="currentColor" strokeWidth={0} />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={16} className="star-empty" style={{ color: 'var(--text-muted)' }} />);
      }
    }
    return stars;
  };

  const getStockClass = () => {
    if (stock === 0) return 'stock-out';
    if (stock < 10) return 'stock-low';
    return 'stock-ok';
  };

  return (
    <div className="detail-layout">
      {/* Navigation and Breadcrumbs */}
      <div className="back-nav-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={18} /> Back to Products
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Home / {category} / {brand || 'Brand'} / {title}
        </span>
      </div>

      {/* Main product card */}
      <div className="detail-card">
        {/* Left Side: Gallery */}
        <div className="detail-gallery">
          <div className="main-image-wrapper">
            <img src={activeImage} alt={title} className="main-image" />
          </div>
          {images && images.length > 1 && (
            <div className="thumbnails-grid">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`thumbnail-btn ${activeImage === img ? 'active' : ''}`}
                >
                  <img src={img} alt={`${title} preview ${idx}`} className="thumbnail-image" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Info details */}
        <div className="detail-info">
          <div className="detail-category-brand">
            <span>{category}</span>
            {brand && (
              <>
                <div className="detail-divider" />
                <span>{brand}</span>
              </>
            )}
          </div>

          <h1 className="detail-title">{title}</h1>

          {/* Rating reviews count */}
          <div className="detail-rating-row">
            <div className="stars-list" style={{ color: 'var(--color-accent)' }}>
              {renderStars(rating)}
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{rating.toFixed(1)}</span>
            <div className="detail-divider" />
            <span className="detail-review-count">
              {reviews ? reviews.length : 0} reviews
            </span>
          </div>

          {/* Price Box */}
          <div className="detail-price-box">
            <span className="detail-price-main">${price.toFixed(2)}</span>
            {discountPercentage > 0 && originalPrice > price && (
              <div className="detail-original-price-box">
                <span className="detail-original-price">${originalPrice.toFixed(2)}</span>
                <span className="detail-discount-pill">-{Math.round(discountPercentage)}%</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="detail-description">{description}</p>

          {/* Specifications */}
          <div className="specs-section">
            <h3 className="specs-title">Product Details</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Availability</span>
                <span className={`spec-value ${getStockClass()}`}>
                  {availabilityStatus || (stock > 0 ? 'In Stock' : 'Out of Stock')} ({stock} available)
                </span>
              </div>
              <div className="spec-item">
                <span className="spec-label">SKU</span>
                <span className="spec-value">{sku || 'N/A'}</span>
              </div>
              {weight && (
                <div className="spec-item">
                  <span className="spec-label">Weight</span>
                  <span className="spec-value">{weight}g</span>
                </div>
              )}
              {dimensions && (
                <div className="spec-item">
                  <span className="spec-label">Dimensions</span>
                  <span className="spec-value">
                    {dimensions.width} x {dimensions.height} x {dimensions.depth} cm
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Service specs */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: 'auto', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={18} style={{ color: 'var(--color-primary-light)' }} />
              <span>{warrantyInformation || 'Standard warranty'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <Truck size={18} style={{ color: 'var(--color-primary-light)' }} />
              <span>{shippingInformation || 'Fast Delivery'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <RotateCcw size={18} style={{ color: 'var(--color-primary-light)' }} />
              <span>{returnPolicy || '30 days returns'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews && reviews.length > 0 && (
        <div className="reviews-section">
          <h3 className="reviews-header">Customer Reviews</h3>
          <div className="reviews-list">
            {reviews.map((rev, index) => (
              <div key={index} className="review-item">
                <div className="review-meta">
                  <span className="reviewer-name">{rev.reviewerName}</span>
                  <span className="review-date">
                    {new Date(rev.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="review-rating-row">
                  <div className="stars-list" style={{ color: 'var(--color-accent)' }}>
                    {renderStars(rev.rating)}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {rev.rating} out of 5
                  </span>
                </div>
                <p className="review-comment">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPage;
