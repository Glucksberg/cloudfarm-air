import React from 'react';

function Card({ children, className = '', title, subtitle, ...props }) {
  return (
    <div className={`cf-card ${className}`} {...props}>
      {title && (
        <div className="cf-mb-4">
          <h3 className="cf-text-large cf-bold cf-mb-2">{title}</h3>
          {subtitle && (
            <p className="cf-text-small text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;

