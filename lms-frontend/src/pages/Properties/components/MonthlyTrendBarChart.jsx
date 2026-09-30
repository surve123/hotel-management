import React, { useState, useEffect } from 'react';
import dashboardService from '../../../services/dashboardService';

/**
 * MonthlyTrendBarChart Component (LMS PART 5 - Screen 4: Property Performance Analytics)
 * Grouped SVG Bar Chart comparing live Leads (Blue) vs Bookings/Conversions (Teal).
 * 100% Dynamic - Connected to live trends API.
 * 100% SVG Vector (Zero Emojis).
 */
export const MonthlyTrendBarChart = () => {
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await dashboardService.getAdminTrends(30);
        if (data && Array.isArray(data)) {
          setTrends(data);
        }
      } catch (err) {
        console.error('Failed to load monthly trends:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrends();
  }, []);

  // Group trends into up to 5-6 date buckets or display recent periods
  const sampledData = trends.length > 0
    ? trends.filter((_, idx) => idx % Math.max(1, Math.floor(trends.length / 5)) === 0).slice(0, 5).map(t => ({
        label: t.date ? t.date.substring(5) : 'Day',
        leads: t.leads || 0,
        bookings: t.conversions || 0
      }))
    : [
        { label: 'W1', leads: 0, bookings: 0 },
        { label: 'W2', leads: 0, bookings: 0 },
        { label: 'W3', leads: 0, bookings: 0 },
        { label: 'W4', leads: 0, bookings: 0 },
        { label: 'W5', leads: 0, bookings: 0 }
      ];

  const maxVal = Math.max(...sampledData.map(m => Math.max(m.leads, m.bookings, 1)), 10);
  const chartHeight = 120;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '16px 18px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header & Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Recent Activity Trend
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.68rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#1E56F0' }} />
            <span style={{ color: '#475569', fontWeight: 600 }}>Leads</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#0D9488' }} />
            <span style={{ color: '#475569', fontWeight: 600 }}>Conversions</span>
          </div>
        </div>
      </div>

      {/* SVG Grouped Bar Chart */}
      <div style={{ width: '100%', height: `${chartHeight}px`, position: 'relative' }}>
        <svg width="100%" height={chartHeight} viewBox="0 0 260 120" preserveAspectRatio="none">
          {/* Horizontal Grid lines */}
          <line x1="28" y1="20" x2="250" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="28" y1="55" x2="250" y2="55" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="28" y1="90" x2="250" y2="90" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="28" y1="105" x2="250" y2="105" stroke="#E2E8F0" />

          {/* Y Axis Labels */}
          <text x="5" y="24" fontSize="7" fill="#94A3B8" fontWeight="600">{maxVal}</text>
          <text x="5" y="59" fontSize="7" fill="#94A3B8" fontWeight="600">{Math.round(maxVal / 2)}</text>
          <text x="5" y="94" fontSize="7" fill="#94A3B8" fontWeight="600">{Math.round(maxVal / 4)}</text>
          <text x="14" y="107" fontSize="7" fill="#94A3B8" fontWeight="600">0</text>

          {/* Bars */}
          {sampledData.map((m, idx) => {
            const groupX = 42 + idx * 44;
            const leadsH = Math.max(2, (m.leads / maxVal) * 85);
            const bookingsH = Math.max(2, (m.bookings / maxVal) * 85);

            return (
              <g key={m.label + idx}>
                {/* Leads Bar (Blue) */}
                <rect
                  x={groupX}
                  y={105 - leadsH}
                  width="11"
                  height={leadsH}
                  rx="3"
                  fill="#1E56F0"
                />

                {/* Bookings Bar (Teal) */}
                <rect
                  x={groupX + 13}
                  y={105 - bookingsH}
                  width="11"
                  height={bookingsH}
                  rx="3"
                  fill="#0D9488"
                />

                {/* X Axis Date Label */}
                <text
                  x={groupX + 12}
                  y="117"
                  fontSize="7.5"
                  fill="#64748B"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default MonthlyTrendBarChart;
