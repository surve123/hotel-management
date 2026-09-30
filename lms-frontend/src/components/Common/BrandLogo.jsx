import React from 'react';

/**
 * Fresh Bespoke Brand Logo for Arnavee Hospitality
 * A modern, elegant architectural crest combining a stylized luxury "A"
 * with a subtle diamond star/coronet apex.
 * 100% SVG Vector (Zero Emojis).
 */
export const BrandLogo = ({ size = 'md', isLight = true }) => {
  const iconSize = size === 'lg' ? 44 : size === 'sm' ? 28 : 36;
  const titleSize = size === 'lg' ? '1.35rem' : size === 'sm' ? '0.95rem' : '1.15rem';
  const subtitleSize = size === 'lg' ? '0.72rem' : size === 'sm' ? '0.55rem' : '0.62rem';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Fresh Bespoke Emblem */}
      <div style={{
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        borderRadius: '10px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="arnaveeFreshGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          
          {/* Top Diamond Star Crest */}
          <path
            d="M12 2L13.2 4.8L16 6L13.2 7.2L12 10L10.8 7.2L8 6L10.8 4.8L12 2Z"
            fill="url(#arnaveeFreshGold)"
          />

          {/* Architectural Stylized "A" Villa Arch */}
          <path
            d="M4.5 21L11 9.5C11.4 8.8 12.6 8.8 13 9.5L19.5 21"
            stroke="url(#arnaveeFreshGold)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Crossbeam with Floating Diamond Accent */}
          <path
            d="M7.5 16.5H16.5"
            stroke="url(#arnaveeFreshGold)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16.5" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Typography */}
      <div>
        <h1 style={{
          fontSize: titleSize,
          fontWeight: 800,
          letterSpacing: '1.8px',
          color: isLight ? '#FFFFFF' : '#0F172A',
          lineHeight: 1.05,
          margin: 0
        }}>
          ARNAVEE
        </h1>
        <span style={{
          fontSize: subtitleSize,
          fontWeight: 700,
          letterSpacing: '2.5px',
          color: isLight ? '#FDE68A' : '#1E56F0',
          textTransform: 'uppercase',
          display: 'block',
          marginTop: '2px'
        }}>
          HOSPITALITY
        </span>
      </div>
    </div>
  );
};

export default BrandLogo;
