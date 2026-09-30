import React, { useState, useEffect } from 'react';
import dashboardService from '../../services/dashboardService';

/**
 * Lead to Booking Funnel Component (LMS PART 1 - Screen 3)
 * Vector SVG 5-Stage Inverted Funnel Chart with metrics legend.
 * 100% Dynamic - Connected to live backend metrics.
 * 100% SVG Vector (Zero Emojis).
 */
export const LeadBookingFunnel = () => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await dashboardService.getAdminMetrics();
        if (data) setMetrics(data);
      } catch (err) {
        console.error('Failed to load funnel metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const totalLeads = metrics?.totalLeads ?? 0;
  const newLeads = metrics?.newLeads ?? 0;
  const followupsDue = metrics?.followupsDue ?? 0;
  const hotLeads = metrics?.hotLeads ?? 0;
  const totalBookings = metrics?.totalBookings ?? 0;

  const stages = [
    {
      label: 'Total Leads',
      count: totalLeads.toLocaleString('en-IN'),
      percentage: '100%',
      color: '#1E56F0'
    },
    {
      label: 'Follow-ups Active',
      count: followupsDue.toLocaleString('en-IN'),
      percentage: totalLeads > 0 ? `${Math.round((followupsDue / totalLeads) * 100)}%` : '0%',
      color: '#38BDF8'
    },
    {
      label: 'Hot Interested',
      count: hotLeads.toLocaleString('en-IN'),
      percentage: totalLeads > 0 ? `${Math.round((hotLeads / totalLeads) * 100)}%` : '0%',
      color: '#06B6D4'
    },
    {
      label: 'Bookings Created',
      count: totalBookings.toLocaleString('en-IN'),
      percentage: totalLeads > 0 ? `${Math.round((totalBookings / totalLeads) * 100)}%` : '0%',
      color: '#F59E0B'
    },
    {
      label: 'Converted',
      count: totalBookings.toLocaleString('en-IN'),
      percentage: totalLeads > 0 ? `${((totalBookings / totalLeads) * 100).toFixed(1)}%` : '0%',
      color: '#10B981'
    },
  ];

  const funnelTiers = [
    { points: "10,8 210,8 188,40 32,40", color: "#1E56F0" },
    { points: "34,44 186,44 166,76 54,76", color: "#38BDF8" },
    { points: "56,80 164,80 146,112 74,112", color: "#06B6D4" },
    { points: "76,116 144,116 128,148 92,148", color: "#F59E0B" },
    { points: "94,152 126,152 118,180 102,180", color: "#10B981" }
  ];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '18px 20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Lead to Booking Funnel
        </h3>
      </div>

      {/* Main Body: Funnel Diagram + Stage Stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '18px'
      }}>
        {/* SVG Funnel */}
        <div style={{ width: '180px', height: '180px', flexShrink: 0 }}>
          <svg viewBox="0 0 220 188" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <defs>
              <filter id="funnelShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.12" />
              </filter>
            </defs>
            {funnelTiers.map((tier, idx) => (
              <polygon
                key={idx}
                points={tier.points}
                fill={tier.color}
                filter="url(#funnelShadow)"
                style={{
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </svg>
        </div>

        {/* Legend / Metrics List */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          {stages.map((stage, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 6px',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #F1F5F9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: stage.color,
                  flexShrink: 0
                }} />
                <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
                  {stage.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A' }}>
                  {isLoading ? '...' : stage.count}
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748B', width: '32px', textAlign: 'right' }}>
                  {isLoading ? '' : stage.percentage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadBookingFunnel;
