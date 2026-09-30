import React from 'react';
import CircularSpinner from '../Loading/CircularSpinner';
import { CLIENT_CONFIG } from '../../config/clientConfig';

/**
 * Reusable Button Component with Built-in Railway Latency Spinner
 * 100% SVG Icons (Zero Emojis).
 */
export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'outline', 'social'
  isLoading = false,
  disabled = false,
  icon = null,
  fullWidth = true,
  style = {},
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'social':
        return {
          backgroundColor: '#FFFFFF',
          color: '#1E293B',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
          fontSize: '0.875rem',
          fontWeight: 600
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: CLIENT_CONFIG.branding.primaryBlue,
          border: `1px solid ${CLIENT_CONFIG.branding.primaryBlue}`,
          fontSize: '0.875rem',
          fontWeight: 600
        };
      case 'primary':
      default:
        return {
          backgroundColor: CLIENT_CONFIG.branding.primaryBlue,
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 12px rgba(30, 86, 240, 0.25)',
          fontSize: '0.95rem',
          fontWeight: 600
        };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: variant === 'social' ? '10px 16px' : '12px 20px',
        borderRadius: '8px',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.7 : 1,
        transition: 'all 0.15s ease',
        width: fullWidth ? '100%' : 'auto',
        ...getVariantStyles(),
        ...style
      }}
    >
      {isLoading ? (
        <CircularSpinner size={18} color={variant === 'primary' ? '#FFFFFF' : CLIENT_CONFIG.branding.primaryBlue} />
      ) : (
        icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
