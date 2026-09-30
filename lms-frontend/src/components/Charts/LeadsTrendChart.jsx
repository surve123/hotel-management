import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import dashboardService from '../../services/dashboardService';

/**
 * Dual-Line Chart: Leads Trend (Last 30 Days)
 * Pure Vector SVG dynamically mapped to PostgreSQL trend records.
 * Renders Total Leads curve and Converted Leads curve over dates.
 */
export const LeadsTrendChart = () => {
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTrends = async () => {
      try {
        const data = await dashboardService.getAdminTrends(30);
        if (isMounted) {
          setTrends(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.warn('Could not load leads trends:', err.message);
        if (isMounted) setTrends([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchTrends();
    return () => { isMounted = false; };
  }, []);

  // Format dates and points
  const pointsCount = Math.max(trends.length, 1);
  const maxVal = Math.max(
    ...trends.map(t => Math.max(t.totalLeads || 0, t.convertedLeads || 0)),
    10
  );

  const stepY = 140 / maxVal;
  const stepX = 430 / Math.max(pointsCount - 1, 1);

  const totalPoints = trends.map((t, i) => ({
    x: 40 + i * stepX,
    y: 170 - (t.totalLeads || 0) * stepY
  }));

  const convertedPoints = trends.map((t, i) => ({
    x: 40 + i * stepX,
    y: 170 - (t.convertedLeads || 0) * stepY
  }));

  const makePath = (pts) => {
    if (pts.length === 0) return 'M 40,170';
    if (pts.length === 1) return `M 40,${pts[0].y} L 470,${pts[0].y}`;
    return pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`), '');
  };

  const totalLeadsPath = makePath(totalPoints);
  const convertedLeadsPath = makePath(convertedPoints);

  const yLabels = [
    Math.round(maxVal),
    Math.round(maxVal * 0.8),
    Math.round(maxVal * 0.6),
    Math.round(maxVal * 0.4),
    Math.round(maxVal * 0.2),
    0
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
      {/* Header & Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        flexWrap: 'nowrap',
        gap: '8px'
      }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', margin: 0, whiteSpace: 'nowrap' }}>
          Leads Trend (Last 30 Days)
        </h3>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E56F0', display: 'inline-block' }} />
            <span>Total Leads</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06B6D4', display: 'inline-block' }} />
            <span>Converted Leads</span>
          </div>
        </div>
      </div>

      {/* SVG Line Graph */}
      <div style={{ width: '100%', height: '170px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Loader2 size={24} className="animate-spin" color="#1E56F0" />
          </div>
        ) : (
          <svg viewBox="0 0 500 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Horizontal Grid lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const y = 30 + i * 28;
              return (
                <g key={i}>
                  <line x1="35" y1={y} x2="480" y2={y} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="25" y={y + 4} textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="inherit">
                    {yLabels[i]}
                  </text>
                </g>
              );
            })}

            {/* Area fill for Total Leads */}
            <path
              d={`${totalLeadsPath} L 470,170 L 40,170 Z`}
              fill="rgba(30, 86, 240, 0.05)"
            />

            {/* Converted Leads Curve */}
            <path
              d={convertedLeadsPath}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {convertedPoints.map((pt, idx) => (
              <circle key={`c-${idx}`} cx={pt.x} cy={pt.y} r="3.5" fill="#FFFFFF" stroke="#06B6D4" strokeWidth="2" />
            ))}

            {/* Total Leads Curve */}
            <path
              d={totalLeadsPath}
              fill="none"
              stroke="#1E56F0"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {totalPoints.map((pt, idx) => (
              <circle key={`t-${idx}`} cx={pt.x} cy={pt.y} r="3.5" fill="#FFFFFF" stroke="#1E56F0" strokeWidth="2" />
            ))}

            {/* X Axis labels */}
            {trends.map((t, idx) => {
              // Show label for first, middle, and last points or evenly spaced
              if (trends.length > 7 && idx % Math.ceil(trends.length / 6) !== 0 && idx !== trends.length - 1) return null;
              const x = 40 + idx * stepX;
              const dateStr = t.date ? new Date(t.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : `D${idx+1}`;
              return (
                <text key={idx} x={x} y="192" textAnchor="middle" fontSize="10" fill="#94A3B8" fontFamily="inherit">
                  {dateStr}
                </text>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
};

export default LeadsTrendChart;
