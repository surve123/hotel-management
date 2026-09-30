import React from 'react';

/**
 * Pure Vector SVG Circular Spinner (Rule 11 & 12 - Zero Emojis)
 */
export const CircularSpinner = ({ size = 18, color = 'currentColor', strokeWidth = 2.5 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        animation: 'spin 0.75s linear infinite'
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity="0.25"
      />
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CircularSpinner;
