import React, { useState, useEffect } from 'react';
import dashboardService from '../../../services/dashboardService';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../constants/roles';

/**
 * FollowupTrendChart Component (LMS PART 3 - Screen 1: Follow-up Dashboard)
 * Vector SVG 7-Day Dual Line Trend Chart (Follow-ups vs Converted).
 * 100% Dynamic - Connected to live trends API.
 * 100% SVG Vector (Zero Emojis).
 */
export const FollowupTrendChart = () => {
  const { role } = useAuth();
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      // For Caller role, avoid unauthorized calls to admin trends endpoint
      if (role === ROLES.CALLER) {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return {
            date: d.toISOString().split('T')[0],
            leads: 0,
            conversions: 0
          };
        });
        setTrends(last7Days);
        setIsLoading(false);
        return;
      }

      try {
        const data = await dashboardService.getAdminTrends(7);
        if (data && Array.isArray(data)) {
          setTrends(data);
        }
      } catch (err) {
        // Fallback to empty 7-day timeline
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return {
            date: d.toISOString().split('T')[0],
            leads: 0,
            conversions: 0
          };
        });
        setTrends(last7Days);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrends();
  }, [role]);

  const dates = trends.map(t => t.date ? t.date.substring(5) : '');
  const followupsData = trends.map(t => t.leads || 0);
  const convertedData = trends.map(t => t.conversions || 0);

  const svgWidth = 520;
  const svgHeight = 210;
  const margin = { top: 20, right: 15, bottom: 30, left: 35 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  const maxDataVal = Math.max(...followupsData, ...convertedData, 10);
  const maxY = Math.ceil(maxDataVal / 10) * 10;
  const yTicks = [0, Math.round(maxY / 4), Math.round(maxY / 2), Math.round((maxY * 3) / 4), maxY];

  // Helper to convert index and value to SVG coordinates
  const getX = (idx) => margin.left + (idx / Math.max(dates.length - 1, 1)) * chartWidth;
  const getY = (val) => margin.top + chartHeight - (val / Math.max(maxY, 1)) * chartHeight;

  // Build SVG path data
  const createPath = (data) => {
    if (!data || data.length === 0) return '';
    return data.reduce((path, val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      if (idx === 0) return `M ${x} ${y}`;
      const prevX = getX(idx - 1);
      const prevY = getY(data[idx - 1]);
      const cpX1 = prevX + (x - prevX) / 2;
      const cpX2 = prevX + (x - prevX) / 2;
      return `${path} C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
    }, '');
  };

  const followupsPath = createPath(followupsData);
  const convertedPath = createPath(convertedData);

  const followupsArea = followupsPath ? `${followupsPath} L ${getX(dates.length - 1)} ${margin.top + chartHeight} L ${getX(0)} ${margin.top + chartHeight} Z` : '';
  const convertedArea = convertedPath ? `${convertedPath} L ${getX(dates.length - 1)} ${margin.top + chartHeight} L ${getX(0)} ${margin.top + chartHeight} Z` : '';

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
      {/* Header with Title & Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Follow-up & Conversion Momentum
        </h3>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.74rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E56F0' }} />
            <span style={{ color: '#475569', fontWeight: 500 }}>Follow-ups / Leads</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ color: '#475569', fontWeight: 500 }}>Converted</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div style={{ width: '100%', height: '210px' }}>
        {trends.length > 0 ? (
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="followupsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E56F0" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#1E56F0" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="convertedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {yTicks.map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={margin.left}
                    y1={y}
                    x2={svgWidth - margin.right}
                    y2={y}
                    stroke="#F1F5F9"
                    strokeDasharray={val === 0 ? 'none' : '3 3'}
                  />
                  <text
                    x={margin.left - 8}
                    y={y + 4}
                    fill="#94A3B8"
                    fontSize="10"
                    textAnchor="end"
                    fontWeight="500"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Areas */}
            {followupsArea && <path d={followupsArea} fill="url(#followupsGrad)" />}
            {convertedArea && <path d={convertedArea} fill="url(#convertedGrad)" />}

            {/* Lines */}
            {followupsPath && <path d={followupsPath} fill="none" stroke="#1E56F0" strokeWidth="2.5" />}
            {convertedPath && <path d={convertedPath} fill="none" stroke="#10B981" strokeWidth="2.5" />}

            {/* Data Points */}
            {followupsData.map((val, idx) => (
              <circle
                key={`f-${idx}`}
                cx={getX(idx)}
                cy={getY(val)}
                r="3.5"
                fill="#FFFFFF"
                stroke="#1E56F0"
                strokeWidth="2"
              />
            ))}
            {convertedData.map((val, idx) => (
              <circle
                key={`c-${idx}`}
                cx={getX(idx)}
                cy={getY(val)}
                r="3.5"
                fill="#FFFFFF"
                stroke="#10B981"
                strokeWidth="2"
              />
            ))}

            {/* X-Axis Labels */}
            {dates.map((d, idx) => (
              <text
                key={idx}
                x={getX(idx)}
                y={svgHeight - 8}
                fill="#64748B"
                fontSize="10"
                textAnchor="middle"
                fontWeight="500"
              >
                {d}
              </text>
            ))}
          </svg>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8', fontSize: '0.8rem' }}>
            No trend data recorded yet
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowupTrendChart;
