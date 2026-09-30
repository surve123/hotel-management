import React from 'react';
import PropertyKpiCards from './components/PropertyKpiCards';
import LeadBookingFunnel from '../../components/Charts/LeadBookingFunnel';
import PropertyPerformanceTable from './components/PropertyPerformanceTable';
import SourcePerformanceBarChart from '../../components/Charts/SourcePerformanceBarChart';
import TelecallerLeaderboardTable from './components/TelecallerLeaderboardTable';

/**
 * Property Analytics Dashboard Page (LMS PART 1 - Screen 3)
 * Exact match to Design Sheet Screen 3:
 * - Property Performance Overview Header
 * - 4 Color-coded KPI Cards
 * - Lead to Booking Funnel & Property Performance Table
 * - Source Performance Grouped Bar Chart & Top Performing Telecallers
 * - 100% SVG Vector Icons (Zero Emojis).
 */
export const PropertyAnalyticsDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Header */}
      <div>
        <h1 style={{
          fontSize: '1.45rem',
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.2,
          margin: 0
        }}>
          Property Performance Overview
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: '#64748B',
          marginTop: '3px',
          margin: 0
        }}>
          Compare performance across all properties
        </p>
      </div>

      {/* Row 1: 4 KPI Cards */}
      <PropertyKpiCards />

      {/* Row 2: Funnel & Property Table (2 Columns) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.3fr',
        gap: '18px',
        alignItems: 'stretch'
      }}>
        <LeadBookingFunnel />
        <PropertyPerformanceTable />
      </div>

      {/* Row 3: Source Bar Chart & Telecallers Table (2 Columns) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '18px',
        alignItems: 'stretch'
      }}>
        <SourcePerformanceBarChart />
        <TelecallerLeaderboardTable />
      </div>
    </div>
  );
};

export default PropertyAnalyticsDashboard;
