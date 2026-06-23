import React from 'react';

export const CategorySkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '0.2rem' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="shimmer" style={{ height: '2rem', borderRadius: '6px', width: '100%' }} />
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image shimmer" />
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-subtitle shimmer" />
        <div className="skeleton-line skeleton-title shimmer" />
        <div className="skeleton-line skeleton-subtitle shimmer" style={{ width: '60%' }} />
        <div className="skeleton-line skeleton-price shimmer" />
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 8 }) => {
  return (
    <div className="products-grid">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="detail-layout">
      {/* Back button skeleton */}
      <div className="shimmer" style={{ height: '1.5rem', width: '120px', borderRadius: '4px' }} />
      
      <div className="detail-card">
        {/* Gallery skeleton */}
        <div className="skeleton-detail-gallery shimmer" />
        
        {/* Info skeleton */}
        <div className="skeleton-detail-info">
          <div className="shimmer" style={{ height: '1rem', width: '25%', borderRadius: '4px' }} />
          <div className="skeleton-detail-title shimmer" />
          <div className="skeleton-detail-meta shimmer" />
          <div className="skeleton-detail-price shimmer" />
          <div className="skeleton-detail-desc shimmer" />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="shimmer" style={{ height: '3.5rem', borderRadius: '8px' }} />
            <div className="shimmer" style={{ height: '3.5rem', borderRadius: '8px' }} />
            <div className="shimmer" style={{ height: '3.5rem', borderRadius: '8px' }} />
            <div className="shimmer" style={{ height: '3.5rem', borderRadius: '8px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
