import React from 'react';
import { useAuth } from '../../context/AuthContext';
import CallerKpis from './components/CallerKpis';
import CallerSchedule from './components/CallerSchedule';
import CallerRecentLeads from './components/CallerRecentLeads';
import CallerQuickActions from './components/CallerQuickActions';

/**
 * CallerDashboardPage Component
 * Fully dynamic Telecaller Dashboard connected to live PostgreSQL backend.
 */
export const CallerDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Top Header */}
      <div>
        <h1 style={{
          fontSize: '1.45rem',
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.2,
          margin: 0
        }}>
          Welcome, {user?.fullName || user?.username || 'Telecaller'}
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: '#64748B',
          marginTop: '3px',
          margin: 0
        }}>
          Here's your performance and schedule for today.
        </p>
      </div>

      {/* Row 1: 8 Performance KPI Cards */}
      <CallerKpis />

      {/* Row 2: 3-Column Desk (Schedule, Recent Leads, Quick Actions) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.2fr 1fr',
        gap: '16px',
        alignItems: 'stretch'
      }}>
        {/* Left: Today's Follow-ups */}
        <CallerSchedule />

        {/* Center: Recent Leads */}
        <CallerRecentLeads />

        {/* Right: Quick Actions */}
        <CallerQuickActions />
      </div>
    </div>
  );
};

export default CallerDashboardPage;
