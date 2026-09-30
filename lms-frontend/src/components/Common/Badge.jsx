import React from 'react';

/**
 * Reusable Status & Source Badge Component (LMS Design System)
 * Pure Vector SVGs (Rule 12 - Zero Emojis).
 */
export const Badge = ({ type = 'status', value = 'New' }) => {
  // Config for lead statuses
  const statusStyles = {
    'New': { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
    'Follow-up': { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
    'Interested': { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
    'Hot': { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
    'Hot Lead': { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
    'Converted': { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
  };

  // Config for lead marketing sources
  const sourceStyles = {
    'Instagram': { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8' },
    'WhatsApp': { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    'Website': { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    'Phone': { bg: '#F0FDFA', text: '#0D9488', border: '#99F6E4' },
    'Referral': { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
    'Other': { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
  };

  const styleMap = type === 'source' ? sourceStyles : statusStyles;
  const config = styleMap[value] || { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '9999px',
      fontSize: '0.72rem',
      fontWeight: 600,
      backgroundColor: config.bg,
      color: config.text,
      border: `1px solid ${config.border}`,
      whiteSpace: 'nowrap'
    }}>
      {value}
    </span>
  );
};

export default Badge;
