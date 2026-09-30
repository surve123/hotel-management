import React from 'react';
import { Target, MapPin, Calendar, TrendingUp } from 'lucide-react';
import BrandLogo from '../../../../components/Common/BrandLogo';
import villaPhoto from '../../../../assets/luxury_pool_villa.jpg';

/**
 * Left Hero Section for Login Page
 * - Big, prominent luxury villa photo filling width nicely
 * - Fresh light bespoke logo
 * - Guaranteed fit inside 1 screen (zero vertical overflow/scroll)
 * - 100% SVG vector icons (Zero Emojis).
 */
export const LoginHeroSection = () => {
  const features = [
    { label: "More Leads", icon: Target },
    { label: "Better Follow-ups", icon: MapPin },
    { label: "Higher Bookings", icon: Calendar },
    { label: "Greater Revenue", icon: TrendingUp },
  ];

  return (
    <div style={{
      flex: '1 1 50%',
      height: '100vh',
      maxHeight: '100vh',
      background: 'radial-gradient(circle at 20% 15%, rgba(59, 130, 246, 0.35) 0%, transparent 60%), linear-gradient(155deg, #1D4ED8 0%, #1E40AF 40%, #1E3A8A 80%, #172554 100%)',
      color: '#FFFFFF',
      padding: '20px 36px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Top: Fresh Bespoke Brand Logo */}
      <div style={{ flexShrink: 0 }}>
        <BrandLogo size="md" isLight={true} />
      </div>

      {/* Center Content: Headline, Subtitle & Prominent Big Villa Image */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        justifyContent: 'center',
        margin: '10px 0',
        minHeight: 0
      }}>
        {/* Headline & Subtitle */}
        <div style={{ flexShrink: 0, marginBottom: '10px' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.15,
            marginBottom: '4px'
          }}>
            Turn Leads into Memorable Stays
          </h2>
          <p style={{
            fontSize: '0.825rem',
            color: '#E0E7FF',
            lineHeight: 1.35,
            opacity: 0.9,
            margin: 0
          }}>
            Powering hospitality growth with smart lead management.
          </p>
        </div>

        {/* Big Prominent Poolside Villa Photo */}
        <div style={{
          flex: '1 1 auto',
          width: '100%',
          maxHeight: '280px',
          minHeight: '180px',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.45)',
          backgroundColor: '#1E3A8A'
        }}>
          <img
            src={villaPhoto}
            alt="Luxury Hospitality Villa"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>
      </div>

      {/* Bottom: 4 Circular Feature Badges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        width: '100%',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.18)',
        flexShrink: 0
      }}>
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '4px'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Icon size={15} strokeWidth={2} />
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#F1F5F9' }}>
                {feat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoginHeroSection;
