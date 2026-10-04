import React from 'react';

interface BrandStarProps {
  className?: string;
  size?: number;
  variant?: 'organic' | 'classic' | '5-point';
  color?: string;
}

/**
 * BrandStar accurately reproducing the organic 4-pointed golden stars
 * from the Tienda El Mago brand identity.
 */
export const BrandStar: React.FC<BrandStarProps> = ({
  className = '',
  size = 18,
  variant = 'organic',
  color = '#f59e0b', // Warm golden yellow as in the logo
}) => {
  if (variant === '5-point') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block transition-transform duration-300 drop-shadow-[0_1px_3px_rgba(245,158,11,0.3)] ${className}`}
        aria-hidden="true"
      >
        <path d="M12 2L14.9 8.26L21.8 9.27L16.8 14.14L18 21.02L12 17.77L6 21.02L7.2 14.14L2.2 9.27L9.1 8.26L12 2Z" />
      </svg>
    );
  }

  // Exact organic curved 4-point star with soft rounded tips from the logo image
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(245,158,11,0.35)] ${className}`}
      aria-hidden="true"
    >
      <path
        d="M12 2.5C12 7.8 7.8 12 2.5 12C7.8 12 12 16.2 12 21.5C12 16.2 16.2 12 21.5 12C16.2 12 12 7.8 12 2.5Z"
        fill={color}
        stroke="#d97706"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
      {/* Soft inner glow/highlight */}
      <circle cx="12" cy="12" r="3" fill="#fef3c7" fillOpacity="0.4" />
    </svg>
  );
};

/**
 * Cluster of 3 stars arranged exactly as seen on the right side of the Tienda El Mago logo
 */
export const LogoStarsCluster: React.FC<{ className?: string; scale?: number }> = ({
  className = '',
  scale = 1,
}) => (
  <div
    className={`relative inline-block ${className}`}
    style={{
      width: `${34 * scale}px`,
      height: `${38 * scale}px`,
    }}
    aria-hidden="true"
  >
    {/* Large Star (top) */}
    <div
      className="absolute"
      style={{
        top: 0,
        right: `${2 * scale}px`,
        transform: 'rotate(8deg)',
      }}
    >
      <BrandStar size={22 * scale} color="#fbbf24" />
    </div>

    {/* Medium Star (middle left) */}
    <div
      className="absolute"
      style={{
        bottom: `${10 * scale}px`,
        left: 0,
        transform: 'rotate(-12deg)',
      }}
    >
      <BrandStar size={13 * scale} color="#f59e0b" />
    </div>

    {/* Small Star (bottom right) */}
    <div
      className="absolute"
      style={{
        bottom: 0,
        right: `${6 * scale}px`,
        transform: 'rotate(15deg)',
      }}
    >
      <BrandStar size={9 * scale} color="#f59e0b" />
    </div>
  </div>
);

export const StarCluster: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center gap-1.5 opacity-90 ${className}`}>
    <BrandStar size={10} color="#c084fc" />
    <BrandStar size={15} color="#fbbf24" />
    <BrandStar size={8} color="#c084fc" />
  </div>
);
